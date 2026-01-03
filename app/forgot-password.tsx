import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>Find your account</Text>
         <Text style={styles.headerSubtitle}>Please enter your email address or phone number to search for your account.</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email or Phone</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Email or Phone" 
                  value={email} 
                  onChangeText={setEmail} 
                />
            </View>
        </View>

        {/* Bouton Search qui mène vers l'OTP pour l'instant */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/otp' as any)}
        >
          <Text style={styles.primaryButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6c5ce7' },
  headerContainer: { height: 200, padding: 30, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: 'white', marginTop: 20 },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', marginTop: 10 },
  formContainer: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30 },
  inputWrapper: { marginBottom: 30 },
  label: { marginBottom: 8, color: '#333', fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: 10, paddingHorizontal: 15, height: 50 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%' },
  primaryButton: { backgroundColor: '#6c5ce7', borderRadius: 10, height: 55, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  primaryButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});