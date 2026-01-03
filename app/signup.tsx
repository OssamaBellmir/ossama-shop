import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithCredential,
  updateProfile
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { globalStyles } from '../constants/Styles';
import { auth } from '../firebase/firebaseConfig';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // Checkbox UI
  const [loading, setLoading] = useState(false);

  // --- VOTRE CONFIGURATION GOOGLE (CRUCIALE) ---
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '1030871308790-elmle743gjosb0lq114q33ogspqfrsm0.apps.googleusercontent.com', // Votre ID
    });
  }, []);

  // --- VOTRE LOGIQUE INSCRIPTION EMAIL ---
  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    if (!isChecked) {
      Alert.alert('Erreur', 'Veuillez accepter les conditions (Terms & Condition)');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        // Mise à jour du nom
        await updateProfile(user, { displayName: name });
        // Envoi email vérification
        await sendEmailVerification(user);
        // Redirection
        router.replace('/verify-email' as any);
      }
    } catch (error: any) {
      let msg = error.message;
      if (error.code === 'auth/email-already-in-use') msg = "Cet email est déjà utilisé.";
      if (error.code === 'auth/weak-password') msg = "Mot de passe trop court.";
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  // --- VOTRE LOGIQUE GOOGLE SIGN-IN ---
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      const result = await GoogleSignin.signIn();
      const idToken = result.data?.idToken;

      if (!idToken) throw new Error('Google ID Token introuvable');

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);

      // Google valide automatiquement l'email -> Vers les Tabs
      router.replace('/(tabs)' as any);

    } catch (error: any) {
      if (error.code !== 'EQ_SIGN_IN_CANCELED') {
        Alert.alert("Erreur Google", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Fill your information below or register with your social account.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="*************"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color={Colors.textGray} />
            </TouchableOpacity>
          </View>

          {/* Checkbox (Nouveau Design) */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={[styles.checkbox, isChecked && { backgroundColor: Colors.primary, borderColor: Colors.primary }]}>
               {isChecked && <Ionicons name="checkmark" size={16} color="white" />}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>Agree with <Text style={styles.linkText}>Terms & Condition</Text></Text>
          </View>

          <TouchableOpacity style={globalStyles.primaryButton} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={globalStyles.primaryButtonText}>Sign Up</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or sign up with</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={24} color="black" />
          </TouchableOpacity>
          
          {/* BOUTON GOOGLE CONNECTÉ À VOTRE FONCTION */}
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp}>
            <Ionicons name="logo-google" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login' as any)}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Les styles sont identiques à ceux de Login, je les remets par sécurité
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  title: { fontSize: 30, fontWeight: 'bold', color: Colors.black, marginBottom: 10 },
  subtitle: { fontSize: 16, color: Colors.textGray, textAlign: 'center', maxWidth: '80%' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: Colors.inputBackground, borderRadius: 30, paddingHorizontal: 20, height: 55, fontSize: 14 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBackground, borderRadius: 30, paddingHorizontal: 20, height: 55 },
  passwordInput: { flex: 1, height: '100%' },
  
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: Colors.textGray, marginRight: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  checkboxText: { color: Colors.black },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  orText: { marginHorizontal: 10, color: Colors.textGray, fontSize: 14 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 30 },
  socialButton: { width: 55, height: 55, borderRadius: 27.5, borderWidth: 1, borderColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 20 },
  footerText: { color: Colors.black },
  linkText: { color: Colors.primary, fontWeight: 'bold', textDecorationLine: 'underline' },
});