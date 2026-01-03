import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
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
  View
} from 'react-native';
import { globalStyles } from '../constants/Styles';
import { auth } from '../firebase/firebaseConfig';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Erreur", "Veuillez entrer votre adresse email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Email Envoyé",
        "Un lien de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception (et vos spams).",
        [
          { text: "OK", onPress: () => router.back() } // Retour à l'écran de connexion
        ]
      );
    } catch (error: any) {
      let msg = error.message;
      if (error.code === 'auth/user-not-found') msg = "Aucun utilisateur trouvé avec cet email.";
      if (error.code === 'auth/invalid-email') msg = "L'adresse email est invalide.";
      Alert.alert("Erreur", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
           <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
           </TouchableOpacity>
           <Text style={styles.headerTitle}>Forgot Password</Text>
           <Text style={styles.headerSubtitle}>
              Enter your email address and we will send you a link to reset your password.
           </Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                <TextInput 
                    style={styles.input} 
                    placeholder="example@gmail.com" 
                    value={email} 
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <TouchableOpacity 
                style={[globalStyles.primaryButton, { marginTop: 30 }]}
                onPress={handleResetPassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={globalStyles.primaryButtonText}>Send Reset Link</Text>
                )}
            </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  
  header: { marginBottom: 40, marginTop: 20 },
  backButton: { 
    width: 40, height: 40, borderRadius: 20, 
    backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center', 
    marginBottom: 20 
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  headerSubtitle: { fontSize: 16, color: '#666', lineHeight: 24 },

  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#eee',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
});