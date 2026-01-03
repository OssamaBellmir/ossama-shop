import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { auth } from '../../firebase/firebaseConfig';

export default function ProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser; // Récupère l'utilisateur connecté

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Logout", 
          style: 'destructive',
          onPress: async () => {
            await signOut(auth);
            router.replace('/login' as any);
          }
        }
      ]
    );
  };

  // Composant pour une ligne de menu
  const MenuItem = ({ icon, label, onPress, isDestructive = false }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={22} color={isDestructive ? '#FF6B6B' : '#333'} />
      </View>
      <Text style={[styles.menuLabel, isDestructive && { color: '#FF6B6B' }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Profil */}
      <View style={styles.header}>
         <Text style={styles.headerTitle}>Profile</Text>
         <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: user?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                  style={styles.avatar} 
                />
                <TouchableOpacity style={styles.editIcon}>
                    <Ionicons name="pencil" size={12} color="white" />
                </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.displayName || 'Ossama User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
         </View>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer} showsVerticalScrollIndicator={false}>
        
        {/* Section Générale */}
        <MenuItem 
            icon="person-outline" 
            label="Your profile" 
            onPress={() => alert('Aller vers Edit Profile')} 
        />
        <MenuItem 
            icon="card-outline" 
            label="Payment Methods" 
            onPress={() => alert('Aller vers Paiements')} 
        />
        <MenuItem 
            icon="receipt-outline" 
            label="My Orders" 
            onPress={() => alert('Aller vers Commandes')} 
        />
        <MenuItem 
            icon="settings-outline" 
            label="Settings" 
            onPress={() => alert('Aller vers Settings')} 
        />
        <MenuItem 
            icon="help-circle-outline" 
            label="Help Center" 
            onPress={() => alert('Aller vers Aide')} 
        />
        <MenuItem 
            icon="lock-closed-outline" 
            label="Privacy Policy" 
            onPress={() => alert('Aller vers Privacy')} 
        />
        
        {/* Déconnexion */}
        <View style={styles.divider} />
        <MenuItem 
            icon="log-out-outline" 
            label="Log Out" 
            isDestructive 
            onPress={handleLogout} 
        />

        <Text style={styles.versionText}>Version 1.0.0</Text>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  
  // Header
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  profileInfo: { alignItems: 'center' },
  avatarContainer: { marginBottom: 15, position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#f1f2f6' },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  userEmail: { fontSize: 14, color: '#888' },

  // Menu
  menuContainer: { paddingHorizontal: 20, paddingBottom: 50 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuLabel: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  versionText: { textAlign: 'center', color: '#ccc', marginTop: 30, fontSize: 12 },
});