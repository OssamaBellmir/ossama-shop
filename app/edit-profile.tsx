import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
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

export default function EditProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  // États locaux avec les valeurs actuelles de l'utilisateur
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(''); // Firebase Auth ne stocke pas le tel facilement sans config, on le simule ici
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name) {
      Alert.alert("Erreur", "Le nom ne peut pas être vide.");
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        // Mise à jour réelle dans Firebase
        await updateProfile(auth.currentUser, {
          displayName: name,
          // photoURL: 'nouvelle_url' // Pour la photo, il faudrait gérer l'upload (étape avancée)
        });
        
        Alert.alert("Succès", "Profil mis à jour !", [
            { text: "OK", onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
           <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{width: 40}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Photo de profil */}
        <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.cameraIcon} onPress={() => Alert.alert("Info", "L'upload de photo nécessite une configuration de stockage (Firebase Storage).")}>
                <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input} 
                    value={name} 
                    onChangeText={setName} 
                    placeholder="Your Name"
                />
            </View>

            <Text style={styles.label}>Email (Non modifiable)</Text>
            <View style={[styles.inputContainer, {backgroundColor: '#f0f0f0'}]}>
                <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                <TextInput 
                    style={[styles.input, {color: '#999'}]} 
                    value={user?.email || ''} 
                    editable={false} 
                />
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input} 
                    value={phone} 
                    onChangeText={setPhone} 
                    placeholder="+212 6..."
                    keyboardType="phone-pad"
                />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput 
                    style={styles.input} 
                    value="********" 
                    editable={false} 
                    secureTextEntry
                />
                <TouchableOpacity onPress={() => router.push('/forgot-password' as any)}>
                    <Text style={styles.changePassText}>Change</Text>
                </TouchableOpacity>
            </View>
        </View>

      </ScrollView>

      {/* Bouton Sauvegarder */}
      <View style={styles.footer}>
         <TouchableOpacity style={globalStyles.primaryButton} onPress={handleUpdate} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={globalStyles.primaryButtonText}>Update Profile</Text>}
         </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backButton: { padding: 5 },
  scrollContent: { padding: 20 },

  avatarContainer: { alignSelf: 'center', marginBottom: 30, position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f1f2f6' },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },

  form: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 15 },
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
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  changePassText: { color: Colors.primary, fontWeight: 'bold' },

  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
});