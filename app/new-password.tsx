import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NewPasswordScreen() {
  const router = useRouter();
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
         <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
         </TouchableOpacity>
         <Text style={styles.headerTitle}>Create new password</Text>
         <Text style={styles.headerSubtitle}>Create a new password and please never share it with anyone for safe use.</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput style={styles.input} placeholder="New Password" secureTextEntry value={pass} onChangeText={setPass} />
            </View>
        </View>

        <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput style={styles.input} placeholder="Confirm New Password" secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />
            </View>
        </View>

        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/password-changed' as any)}
        >
          <Text style={styles.primaryButtonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... Les styles sont identiques aux précédents (je peux les abréger pour la réponse si vous voulez, mais copiez les styles de ForgotPassword, c'est la même structure)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6c5ce7' },
  headerContainer: { height: 200, padding: 30, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginTop: 20 }, // Font légèrement plus petite car titre long
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', marginTop: 10 },
  formContainer: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30 },
  inputWrapper: { marginBottom: 20 },
  label: { marginBottom: 8, color: '#333', fontWeight: 'bold' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f2f6', borderRadius: 10, paddingHorizontal: 15, height: 50 },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%' },
  primaryButton: { backgroundColor: '#6c5ce7', borderRadius: 10, height: 55, justifyContent: 'center', alignItems: 'center', elevation: 5, marginTop: 10 },
  primaryButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});