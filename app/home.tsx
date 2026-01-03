import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { auth } from '../firebase/firebaseConfig'; // On l'utilisera plus tard pour logout

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // Plus tard : await signOut(auth);
    router.replace('/' as any); // Retour à l'écran de bienvenue
  };

  return (
    <View style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>Ossama Shop User</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
           <Ionicons name="person-circle" size={40} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        <View style={styles.card}>
          <Ionicons name="cart-outline" size={50} color="#6c5ce7" />
          <Text style={styles.cardText}>Shop is ready!</Text>
        </View>

        <Text style={styles.infoText}>
          Ceci est l écran d accueil (Dashboard). 
          L interface utilisateur est maintenant complète.
        </Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
          <Ionicons name="log-out-outline" size={20} color="white" style={{marginLeft: 10}}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 2,
  },
  greeting: { fontSize: 16, color: '#888' },
  username: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  profileButton: { padding: 5 },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  card: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginBottom: 30,
  },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: 'bold', color: '#6c5ce7' },
  infoText: { textAlign: 'center', color: '#666', marginBottom: 40, paddingHorizontal: 20 },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});