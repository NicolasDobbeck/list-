import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyATvy5SX6yMvG9g8ktjNd8YCnX4fsjMr5o",
  authDomain: "listadetarefasplus.firebaseapp.com",
  projectId: "listadetarefasplus",
  storageBucket: "listadetarefasplus.firebasestorage.app",
  messagingSenderId: "1047476361681",
  appId: "1:1047476361681:web:317a43422b9f112f29a8f0"
};

const app = initializeApp(firebaseConfig);

let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  console.log("Firebase Auth já foi inicializado.");
  authInstance = getAuth(app); 
}

export const auth = authInstance;

export const db = getFirestore(app);