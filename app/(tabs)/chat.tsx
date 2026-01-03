import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { auth, db } from '../../firebase/firebaseConfig';

export default function ChatListScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const chatsRef = collection(db, `users/${userId}/chats`);

    // 1. Créer automatiquement le Chat Support si inexistant
    const createSupportChat = async () => {
        const supportId = 'support_chat';
        const docRef = doc(db, `users/${userId}/chats`, supportId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                name: 'Ossama Shop Support',
                lastMessage: 'Welcome to our support!',
                time: new Date().toISOString(),
                unread: 1,
                avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
                isVerified: true
            });
        }
    };
    createSupportChat();

    // 2. Écouter les conversations en temps réel
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Tri par date (plus récent en haut)
        items.sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setChats(items);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => {
        // On passe l'ID et le nom pour charger la bonne discussion
        router.push({ pathname: '/conversation', params: { chatId: item.id, name: item.name } } as any);
      }}
    >
      <View style={styles.avatarContainer}>
         <Image source={{ uri: item.avatar }} style={styles.avatar} />
         {item.isVerified && (
             <View style={styles.verifiedBadge}>
                 <Ionicons name="checkmark" size={8} color="white" />
             </View>
         )}
      </View>
      
      <View style={styles.chatContent}>
         <View style={styles.topRow}>
             <Text style={styles.name}>{item.name}</Text>
             <Text style={styles.time}>
                {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
             </Text>
         </View>
         <View style={styles.bottomRow}>
             <Text style={[styles.message, item.unread > 0 && styles.unreadMessage]} numberOfLines={1}>
                {item.lastMessage}
             </Text>
             {item.unread > 0 && (
                 <View style={styles.unreadBadge}>
                     <Text style={styles.unreadText}>{item.unread}</Text>
                 </View>
             )}
         </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.iconButton}>
           <Ionicons name="create-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Recherche */}
      <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={{marginRight: 10}}/>
          <TextInput 
             style={styles.input} 
             placeholder="Search contacts..." 
             value={searchText}
             onChangeText={setSearchText}
          />
      </View>

      {/* Liste */}
      {loading ? (
          <ActivityIndicator color={Colors.primary} style={{marginTop: 50}} />
      ) : (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 50, paddingHorizontal: 20, paddingBottom: 15, backgroundColor: 'white',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  iconButton: { padding: 5 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa',
    marginHorizontal: 20, marginBottom: 20, paddingHorizontal: 15, height: 45, borderRadius: 15,
  },
  input: { flex: 1, height: '100%', color: '#333' },
  listContent: { paddingHorizontal: 20 },
  chatItem: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20, backgroundColor: 'white',
  },
  avatarContainer: { position: 'relative', marginRight: 15 },
  avatar: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#eee' },
  verifiedBadge: {
    position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primary,
    width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'white',
  },
  chatContent: { flex: 1, justifyContent: 'center' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  time: { fontSize: 12, color: '#999' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  message: { fontSize: 14, color: '#888', flex: 1, marginRight: 10 },
  unreadMessage: { color: '#333', fontWeight: '600' },
  unreadBadge: {
    backgroundColor: Colors.primary, width: 20, height: 20, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  unreadText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
});