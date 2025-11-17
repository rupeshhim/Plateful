import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// --- Imports for React Native ---
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNMmifgvMRJi-vQZ65_ujnMgLuAQag9dM",
  authDomain: "plateful-36581.firebaseapp.com",
  projectId: "plateful-36581",
  storageBucket: "plateful-36581.firebasestorage.app",
  messagingSenderId: "809826050910",
  appId: "1:809826050910:web:cc9deb673af0464761a5cf",
  measurementId: "G-JPKZRTYXF6"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// --- DO NOT use getAnalytics(app) - It is for web only ---

// --- CORRECTED Auth Initialization for React Native ---
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Export Firestore
export const db = getFirestore(app);