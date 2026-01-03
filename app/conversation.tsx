import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { auth, db } from '../firebase/firebaseConfig';

/* =======================
   TYPES
======================= */
type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  createdAt: string; // On utilise createdAt pour le tri Firebase
};

export default function ConversationScreen() {
  const router = useRouter();

  /* =======================
     PARAMS
  ======================= */
  // On récupère aussi le chatId passé par l'écran précédent
  const params = useLocalSearchParams<{ name?: string; chatId?: string }>();
  
  const contactName = params.name || 'Chat';
  const chatId = params.chatId; // L'ID de la conversation dans Firebase

  /* =======================
     STATE
  ======================= */
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  /* =======================
     FIREBASE LISTENER
  ======================= */
  useEffect(() => {
    if (!auth.currentUser || !chatId) return;

    const userId = auth.currentUser.uid;
    // Référence vers les messages de cette conversation spécifique
    const messagesRef = collection(db, `users/${userId}/chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    // Écoute en temps réel
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text,
                sender: data.sender,
                createdAt: data.createdAt
            } as Message;
        });
        setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  /* =======================
     ACTIONS
  ======================= */
  const sendMessage = async () => {
    if (!inputText.trim() || !chatId) return;

    const textToSend = inputText;
    setInputText(''); // Vider le champ immédiatement pour l'UX

    try {
        const userId = auth.currentUser!.uid;
        const now = new Date().toISOString();

        // 1. Ajouter le message dans la sous-collection 'messages'
        await addDoc(collection(db, `users/${userId}/chats/${chatId}/messages`), {
            text: textToSend,
            sender: 'me',
            createdAt: now
        });

        // 2. Mettre à jour le dernier message dans la liste des conversations (pour l'aperçu)
        const chatDocRef = doc(db, `users/${userId}/chats/${chatId}`);
        await updateDoc(chatDocRef, {
            lastMessage: textToSend,
            time: now,
            unread: 0
        });

    } catch (error) {
        console.error("Erreur envoi message:", error);
    }
  };

  /* =======================
     RENDER MESSAGE
  ======================= */
  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';
    // Formatage de l'heure
    const timeString = new Date(item.createdAt).toLocaleTimeString([], {
        hour: '2-digit', 
        minute: '2-digit'
    });

    return (
      <View
        style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isMe ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {item.text}
        </Text>
        <Text
          style={[
            styles.timeText,
            { color: isMe ? 'rgba(255,255,255,0.7)' : '#999' },
          ]}
        >
          {timeString}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {contactName.toString().charAt(0).toUpperCase()}
            </Text>
          </View>

          <View>
            <Text style={styles.headerTitle}>{contactName}</Text>
            <Text style={styles.status}>Online</Text>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons name="call-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ================= MESSAGES ================= */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ================= INPUT ================= */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add" size={24} color="#666" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* =======================
   STYLES (Inchangés)
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { marginRight: 15 },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 12,
    color: Colors.primary,
  },
  listContent: {
    padding: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 5,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: { fontSize: 15 },
  myMessageText: { color: 'white' },
  otherMessageText: { color: '#333' },
  timeText: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: 30,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachButton: { padding: 10 },
  input: {
    flex: 1,
    backgroundColor: '#f1f2f6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});