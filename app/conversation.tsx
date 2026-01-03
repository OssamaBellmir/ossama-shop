import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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

/* =======================
   TYPES
======================= */
type Message = {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
};

/* =======================
   MOCK DATA (TYPÉ)
======================= */
const MOCK_MESSAGES: Message[] = [
  { id: '1', text: 'Hello! Is this item still available?', sender: 'me', time: '10:00 AM' },
  { id: '2', text: 'Yes, it is! Are you interested?', sender: 'other', time: '10:05 AM' },
  { id: '3', text: 'Can you deliver to Casablanca?', sender: 'me', time: '10:10 AM' },
  { id: '4', text: 'Sure, delivery takes 2-3 days.', sender: 'other', time: '10:11 AM' },
  { id: '5', text: 'Perfect, I will place the order now.', sender: 'me', time: '10:12 AM' },
];

export default function ConversationScreen() {
  const router = useRouter();

  /* =======================
     PARAMS (SÉCURISÉS)
  ======================= */
  const params = useLocalSearchParams<{ name?: string | string[] }>();

  const contactName =
    typeof params.name === 'string'
      ? params.name
      : Array.isArray(params.name)
      ? params.name[0]
      : 'Chat';

  /* =======================
     STATE
  ======================= */
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');

  /* =======================
     ACTIONS
  ======================= */
  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  /* =======================
     RENDER MESSAGE
  ======================= */
  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === 'me';

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
          {item.time}
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
              {contactName.charAt(0).toUpperCase()}
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
   STYLES
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

  backButton: {
    marginRight: 15,
  },

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

  messageText: {
    fontSize: 15,
  },

  myMessageText: {
    color: 'white',
  },

  otherMessageText: {
    color: '#333',
  },

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

  attachButton: {
    padding: 10,
  },

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
