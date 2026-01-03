import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';

// Données factices de conversations
const CONVERSATIONS = [
  {
    id: '1',
    name: 'Ossama Shop Support',
    message: 'Hello! How can we help you today?',
    time: '10:30 AM',
    unread: 2,
    avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png', // Icone support
    isVerified: true,
  },
  {
    id: '2',
    name: 'Jenny Doe (Seller)',
    message: 'Your order has been shipped!',
    time: 'Yesterday',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    isVerified: false,
  },
  {
    id: '3',
    name: 'Mike Shoes Store',
    message: 'Do you have size 42 available?',
    time: 'Jan 20',
    unread: 0,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    isVerified: false,
  },
];

export default function ChatListScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  // Filtrer les chats
  const filteredChats = CONVERSATIONS.filter(chat => 
    chat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => {
  router.push({ pathname: '/conversation', params: { name: item.name } } as any);
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
             <Text style={styles.time}>{item.time}</Text>
         </View>
         <View style={styles.bottomRow}>
             <Text style={[styles.message, item.unread > 0 && styles.unreadMessage]} numberOfLines={1}>
                {item.message}
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

      {/* Barre de recherche */}
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
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  iconButton: { padding: 5 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 45,
    borderRadius: 15,
  },
  input: { flex: 1, height: '100%', color: '#333' },

  listContent: { paddingHorizontal: 20 },
  
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  avatarContainer: { position: 'relative', marginRight: 15 },
  avatar: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#eee' },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },

  chatContent: { flex: 1, justifyContent: 'center' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  time: { fontSize: 12, color: '#999' },
  
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  message: { fontSize: 14, color: '#888', flex: 1, marginRight: 10 },
  unreadMessage: { color: '#333', fontWeight: '600' },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
});