import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { fetchSignInMethodsForEmail, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
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
import { Colors } from '../constants/Colors';
import { globalStyles } from '../constants/Styles';
import { auth } from '../firebase/firebaseConfig';

// Configuration Google (Assurez-vous qu'elle est faite une seule fois, par ex ici ou dans _layout)
// REMPLACEZ PAR VOTRE VRAI WEB_CLIENT_ID (disponible dans la console Firebase ou google-services.json)
GoogleSignin.configure({
  webClientId: "VOTRE_WEB_CLIENT_ID_FIREBASE", 
});

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Login classique Email/Password
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)' as any);
    } catch (error: any) {
      Alert.alert("Erreur de connexion", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login avec Google (Vérification stricte)
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // 1. Récupérer les infos Google de l'utilisateur
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // Assurer que idToken est présent
      if (!userInfo.data?.idToken) throw new Error("Google ID Token manquant");
      
      const email = userInfo.data.user.email;

      // 2. Vérifier si cet email existe déjà dans Firebase
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        // L'utilisateur EXISTE -> On le connecte
        const credential = GoogleAuthProvider.credential(userInfo.data.idToken);
        await signInWithCredential(auth, credential);
        router.replace('/(tabs)' as any);
      } else {
        // L'utilisateur N'EXISTE PAS -> On le redirige vers Signup
        await GoogleSignin.signOut(); // On déconnecte la session Google locale
        Alert.alert(
          "Compte introuvable",
          "Aucun compte n'existe avec cet email Google. Veuillez d'abord vous inscrire.",
          [{ text: "Aller à l'inscription", onPress: () => router.push('/signup' as any) }]
        );
      }
    } catch (error: any) {
      if (error.code !== 'SIGN_IN_CANCELLED') { // Ignorer si l'utilisateur annule
          console.error(error);
          Alert.alert("Erreur Google", error.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header (Logo) */}
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Ionicons name="cart" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.appName}>OSSAMA SHOP</Text>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Please login to your account.</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input} 
                    placeholder="example@gmail.com" 
                    value={email} 
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input} 
                    placeholder="********" 
                    value={password} 
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <TouchableOpacity style={styles.forgotPass} onPress={() => router.push('/forgot-password' as any)}>
                <Text style={styles.forgotPassText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.primaryButton} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={globalStyles.primaryButtonText}>Sign In</Text>}
            </TouchableOpacity>
        </View>

        {/* Séparateur */}
        <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={styles.socialContainer}>
             <TouchableOpacity 
                style={styles.socialButton} 
                onPress={handleGoogleLogin}
                disabled={googleLoading}
             >
                {googleLoading ? (
                    <ActivityIndicator size="small" color="#333" />
                ) : (
                     /* Utilisez Ionicons si l'image n'est pas dispo, sinon gardez votre Image */
                    <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.socialIcon} />
                )}
                <Text style={styles.socialText}>Google</Text>
             </TouchableOpacity>
        </View>

        <View style={styles.footer}>
            <Text style={styles.footerText}>Don t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { padding: 24, paddingBottom: 50 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 40 },
  logoContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#FDECEF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  appName: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, letterSpacing: 1, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#888' },
  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', borderRadius: 15, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#eee' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  forgotPass: { alignSelf: 'flex-end', marginTop: 10, marginBottom: 20 },
  forgotPassText: { color: Colors.primary, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#eee' },
  dividerText: { marginHorizontal: 10, color: '#999' },
  socialContainer: { alignItems: 'center', marginBottom: 30 },
  socialButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 30, elevation: 2 },
  socialIcon: { marginRight: 10 },
  socialText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: '#666', fontSize: 16 },
  signupText: { color: Colors.primary, fontWeight: 'bold', fontSize: 16 },
});