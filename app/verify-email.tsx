import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sendEmailVerification, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase/firebaseConfig';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Vérifier automatiquement au montage si l'email est déjà validé
  useEffect(() => {
    const checkStatus = async () => {
        const user = auth.currentUser;
        if (user) {
            await user.reload();
            if (user.emailVerified) {
                router.replace('/home' as any);
            }
        }
    };
    checkStatus();
  }, []);

  const handleCheckVerification = async () => {
    const user = auth.currentUser;
    if (user) {
      setLoading(true);
      try {
        // Recharger l'utilisateur pour récupérer le statut "emailVerified" le plus récent
        await user.reload();
        
        if (user.emailVerified) {
          Alert.alert("Succès", "Votre email a été vérifié !");
          router.replace('/home' as any);
        } else {
          Alert.alert("En attente", "L'email n'est pas encore validé. Veuillez vérifier vos spams ou cliquer sur Renvoyer.");
        }
      } catch (error: any) {
        Alert.alert("Erreur", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await sendEmailVerification(user);
        Alert.alert("Envoyé", "Un nouveau lien de vérification a été envoyé à " + user.email);
      } catch (error: any) {
        Alert.alert("Erreur", "Veuillez attendre quelques instants avant de renvoyer un email.");
      }
    }
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        router.replace('/login' as any);
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
            <Ionicons name="mail-unread-outline" size={60} color="#6c5ce7" />
        </View>
        
        <Text style={styles.title}>Vérifiez votre email</Text>
        <Text style={styles.subtitle}>
          Un lien de validation a été envoyé à :{"\n"}
          <Text style={{fontWeight: 'bold', color: '#333'}}>{auth.currentUser?.email}</Text>
        </Text>
        <Text style={styles.description}>
          Activez votre compte via le lien reçu, puis appuyez sur le bouton ci-dessous pour accéder à l application.
        </Text>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={handleCheckVerification}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.primaryButtonText}>J ai validé mon email</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResendEmail} style={styles.linkContainer}>
             <Text style={styles.linkText}>Je n ai rien reçu ? <Text style={styles.linkBold}>Renvoyer le lien</Text></Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
         <TouchableOpacity onPress={handleLogout}>
             <Text style={styles.logoutText}>Se déconnecter</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 30, justifyContent: 'center' },
  content: { alignItems: 'center', backgroundColor: 'white', padding: 30, borderRadius: 20, elevation: 5 },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f1f2f6', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6c5ce7', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: 10 },
  description: { textAlign: 'center', color: '#888', marginBottom: 30, fontSize: 14, lineHeight: 20 },
  primaryButton: { backgroundColor: '#6c5ce7', borderRadius: 10, height: 50, width: '100%', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  linkContainer: { marginTop: 20 },
  linkText: { color: '#666' },
  linkBold: { color: '#6c5ce7', fontWeight: 'bold' },
  footer: { marginTop: 40, alignItems: 'center' },
  logoutText: { color: '#ff6b6b', fontWeight: 'bold', fontSize: 16 }
});