import { initializeApp } from 'firebase/app';
// On importe initializeAuth et la persistance React Native au lieu de getAuth simple
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCHQhAV8cuhTs-pYgsspKQTnWXNviocyNs",
  authDomain: "ecomerce-2e14e.firebaseapp.com",
  projectId: "ecomerce-2e14e",
  storageBucket: "ecomerce-2e14e.firebasestorage.app",
  messagingSenderId: "1030871308790",
  appId: "1:1030871308790:web:4ba6c127595fba621ecfd7",
  measurementId: "G-WJCPDD31CM"
};

// Init app
const app = initializeApp(firebaseConfig);

// ✅ AUTH AVEC PERSISTANCE (L'utilisateur reste connecté)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
