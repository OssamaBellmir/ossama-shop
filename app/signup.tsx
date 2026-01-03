import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithCredential,
  updateProfile
} from 'firebase/auth';
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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Inscription Email/Password (Classique)
  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le nom
      await updateProfile(userCredential.user, { displayName: name });
      
      // Envoyer l'email de vérification
      await sendEmailVerification(userCredential.user);
      
      Alert.alert(
        "Succès", 
        "Compte créé ! Un email de vérification a été envoyé.",
        [{ text: "OK", onPress: () => router.replace('/(tabs)' as any) }]
      );
    } catch (error: any) {
      Alert.alert("Erreur d'inscription", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Inscription avec Google (Intelligente)
  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      // 1. Authentification Google
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.data?.idToken) throw new Error("Google ID Token manquant");
      
      const email = userInfo.data.user.email;
      const credential = GoogleAuthProvider.credential(userInfo.data.idToken);

      // 2. Vérifier si l'utilisateur existe déjà
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        // Le compte existe déjà -> On le connecte simplement (UX fluide)
        await signInWithCredential(auth, credential);
        Alert.alert("Info", "Vous aviez déjà un compte, nous vous avons connecté !");
        router.replace('/(tabs)' as any);
      } else {
        // C'est un NOUVEL utilisateur -> On crée le compte
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;

        // 3. Vérification de l'email (Spécifique Google Signup)
        // Les comptes Google sont souvent déjà vérifiés par défaut.
        if (!user.emailVerified) {
             await sendEmailVerification(user);
             Alert.alert(
                "Vérification requise",
                "Bienvenue ! Un email de vérification a été envoyé à votre adresse Google pour confirmer votre identité."
             );
        }
        
        // Redirection vers l'app
        router.replace('/(tabs)' as any);
      }
    } catch (error: any) {
      if (error.code !== 'SIGN_IN_CANCELLED') {
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
        
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Ionicons name="cart" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.appName}>OSSAMA SHOP</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started!</Text>
        </View>

        <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input} 
                    placeholder="John Doe" 
                    value={name} 
                    onChangeText={setName}
                />
            </View>

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

            <TouchableOpacity style={[globalStyles.primaryButton, {marginTop: 30}]} onPress={handleSignup} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={globalStyles.primaryButtonText}>Sign Up</Text>}
            </TouchableOpacity>
        </View>

        <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or sign up with</Text>
            <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialContainer}>
             <TouchableOpacity 
                style={styles.socialButton} 
                onPress={handleGoogleSignup}
                disabled={googleLoading}
             >
                {googleLoading ? (
                    <ActivityIndicator size="small" color="#333" />
                ) : (
                    <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.socialIcon} />
                )}
                <Text style={styles.socialText}>Google</Text>
             </TouchableOpacity>
        </View>

        <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={styles.signupText}>Sign In</Text>
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