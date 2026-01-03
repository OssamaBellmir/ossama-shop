/* functions/index.js
   Version modifiée : envoie OTP avec fallback DEV (log), rate-limit, verify.
*/

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

const SENDGRID_KEY = functions.config().sendgrid?.key || process.env.SENDGRID_KEY;
const FROM_EMAIL = functions.config().sendgrid?.from_email || process.env.SENDGRID_FROM || "no-reply@yourdomain.com";

if (!SENDGRID_KEY) {
  console.warn("No SendGrid key found — running in DEV mode (OTP will be logged, not sent).");
} else {
  sgMail.setApiKey(SENDGRID_KEY);
  console.log("SendGrid configured.");
}

const OTP_COLLECTION = "otp_codes";
const VERIFIED_COLLECTION = "verified_emails";
const RATE_LIMIT_SECONDS = 60; // protection: 1 request / minute per email
const OTP_TTL_MS = 2 * 60 * 1000; // 2 minutes

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

// Callable: send OTP email (or log in dev)
exports.sendOtpEmail = functions.https.onCall(async (data, context) => {
  const email = normalizeEmail(data?.email);
  if (!email) {
    throw new functions.https.HttpsError("invalid-argument", "Email manquant");
  }

  try {
    const docRef = admin.firestore().collection(OTP_COLLECTION).doc(email);
    const doc = await docRef.get();
    const now = Date.now();

    // rate limiting (simple) — prevent resend if last request < RATE_LIMIT_SECONDS
    if (doc.exists) {
      const d = doc.data();
      if (d?.lastSentAt && now - d.lastSentAt.toMillis ? now - d.lastSentAt.toMillis() < RATE_LIMIT_SECONDS * 1000 : now - d.lastSentAt < RATE_LIMIT_SECONDS * 1000) {
        throw new functions.https.HttpsError("resource-exhausted", `Veuillez attendre ${RATE_LIMIT_SECONDS} secondes avant de renvoyer un code.`);
      }
    }

    const otp = generateOtp();
    const expiresAt = now + OTP_TTL_MS;

    await docRef.set({
      otp,
      expiresAt,
      lastSentAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // If we have a SendGrid key, send the email; otherwise log for dev
    if (SENDGRID_KEY) {
      const msg = {
        to: email,
        from: FROM_EMAIL,
        subject: "Votre code de vérification",
        text: `Votre code de vérification est : ${otp}. Il expire dans 2 minutes.`,
        html: `<p>Votre code de vérification est : <strong>${otp}</strong></p><p>Il expire dans 2 minutes.</p>`
      };

      await sgMail.send(msg);
      console.log(`SendGrid: OTP email sent to ${email}`);
    } else {
      // DEV mode: log OTP so you can copy it from emulator logs
      console.log(`DEV MODE: OTP for ${email} => ${otp} (expires in 2 minutes)`);
    }

    return { success: true };
  } catch (err) {
    if (err instanceof functions.https.HttpsError) throw err;
    console.error("sendOtpEmail error:", err);
    throw new functions.https.HttpsError("internal", "Erreur lors de l'envoi de l'OTP");
  }
});

// Callable: verify OTP
exports.verifyOtp = functions.https.onCall(async (data, context) => {
  const email = normalizeEmail(data?.email);
  const otp = String(data?.otp || "").trim();
  if (!email || !otp) {
    throw new functions.https.HttpsError("invalid-argument", "Email et OTP requis");
  }

  try {
    const docRef = admin.firestore().collection(OTP_COLLECTION).doc(email);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      throw new functions.https.HttpsError("not-found", "OTP introuvable");
    }
    const doc = docSnap.data();
    const now = Date.now();

    // doc.expiresAt stored as number (ms) or as Timestamp depending on writes — handle both
    const expiresAtMs = doc.expiresAt && doc.expiresAt.toMillis ? doc.expiresAt.toMillis() : doc.expiresAt;

    if (!expiresAtMs || now > expiresAtMs) {
      await docRef.delete().catch(() => {});
      throw new functions.https.HttpsError("deadline-exceeded", "OTP expiré");
    }

    if (doc.otp !== otp) {
      throw new functions.https.HttpsError("permission-denied", "OTP incorrect");
    }

    // valid -> remove otp doc and mark verified
    await docRef.delete();
    await admin.firestore().collection(VERIFIED_COLLECTION).doc(email).set({
      verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (err) {
    if (err instanceof functions.https.HttpsError) throw err;
    console.error("verifyOtp error:", err);
    throw new functions.https.HttpsError("internal", "Erreur lors de la vérification de l'OTP");
  }
});

// Optional: HTTP endpoint to test send (useful during local emulator testing)
exports.testSend = functions.https.onRequest(async (req, res) => {
  const email = normalizeEmail(req.query.email || req.body?.email || "");
  if (!email) return res.status(400).send("Query param 'email' required for test.");
  try {
    const otp = generateOtp();
    const now = Date.now();
    await admin.firestore().collection(OTP_COLLECTION).doc(email).set({
      otp,
      expiresAt: now + OTP_TTL_MS,
      lastSentAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    if (SENDGRID_KEY) {
      await sgMail.send({
        to: email,
        from: FROM_EMAIL,
        subject: "Test OTP (emulator)",
        text: `Test OTP: ${otp}`
      });
      console.log(`testSend: email sent to ${email}`);
      return res.status(200).send("Email sent (SendGrid).");
    } else {
      console.log(`testSend DEV MODE: OTP for ${email} => ${otp}`);
      return res.status(200).send(`DEV MODE - OTP logged to functions logs: ${otp}`);
    }
  } catch (err) {
    console.error("testSend error:", err);
    return res.status(500).send("Erreur testSend: " + err.message);
  }
});
