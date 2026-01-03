import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PasswordChangedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
         <View style={styles.iconContainer}>
            <Ionicons name="checkmark" size={50} color="#6c5ce7" />
         </View>
         <Text style={styles.title}>Password Changed</Text>
         <Text style={styles.subtitle}>Congratulations!! You ve successfully changed your password.</Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => router.push('/login' as any)}
        >
          <Text style={styles.primaryButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f2f6', alignItems: 'center', justifyContent: 'center', padding: 30 },
  headerContainer: { alignItems: 'center', marginBottom: 50 },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6c5ce7', marginBottom: 10 },
  subtitle: { textAlign: 'center', color: '#666', lineHeight: 22 },
  bottomContainer: { width: '100%' },
  primaryButton: { backgroundColor: '#6c5ce7', borderRadius: 10, height: 55, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  primaryButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});