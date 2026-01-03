import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { globalStyles } from '../constants/Styles';
import { auth } from '../firebase/firebaseConfig';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- VOTRE LOGIQUE BACKEND PRÉCIEUSE ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // VÉRIFICATION EMAIL (Votre code)
      if (user && !user.emailVerified) {
        Alert.alert(
            "Vérification requise", 
            "Votre email n'est pas encore vérifié. Veuillez vérifier votre boîte mail.",
            [
                { text: "OK", onPress: () => router.replace('/verify-email' as any) }
            ]
        );
        return; // On bloque l'accès
      }

      // Si tout est bon, on va vers les Tabs (Nouvelle structure)
      router.replace('/(tabs)' as any);

    } catch (error: any) {
      let msg = error.message;
      if (error.code === 'auth/invalid-credential') msg = "Email ou mot de passe incorrect.";
      if (error.code === 'auth/user-not-found') msg = "Utilisateur introuvable.";
      if (error.code === 'auth/wrong-password') msg = "Mot de passe incorrect.";
      Alert.alert('Erreur', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* En-tête Design */}
        <View style={styles.header}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>Hi! Welcome back, you ve been missed</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
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

          <TouchableOpacity 
            style={styles.forgotPassword} 
            onPress={() => router.push('/forgot-password' as any)}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={globalStyles.primaryButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={globalStyles.primaryButtonText}>Sign In</Text>}
          </TouchableOpacity>
        </View>

        {/* Séparateur Social */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or sign in with</Text>
          <View style={styles.line} />
        </View>

        {/* Boutons Sociaux (Visuel seulement ici, la logique Google est dans le Signup ou à ajouter ici si besoin) */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-apple" size={24} color="black" />
          </TouchableOpacity>
          {/* Si vous voulez le login Google ici aussi, ajoutez votre fonction handleGoogleLogin ici */}
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={24} color="#1877F2" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup' as any)}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 24, justifyContent: 'center', minHeight: '100%' },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: Colors.black, marginBottom: 10 },
  subtitle: { fontSize: 16, color: Colors.textGray, textAlign: 'center', maxWidth: '70%' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.black, marginBottom: 8, marginTop: 15 },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
  },
  passwordInput: { flex: 1, height: '100%' },
  forgotPassword: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 30 },
  forgotPasswordText: { color: Colors.primary, fontWeight: '600', textDecorationLine: 'underline' },
  
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  orText: { marginHorizontal: 10, color: Colors.textGray, fontSize: 14 },
  
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 30 },
  socialButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: Colors.black },
  linkText: { color: Colors.primary, fontWeight: 'bold', textDecorationLine: 'underline' },
});