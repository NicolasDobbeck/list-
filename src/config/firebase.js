import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATvy5SX6yMvG9g8ktjNd8YCnX4fsjMr5o",
  authDomain: "listadetarefasplus.firebaseapp.com",
  projectId: "listadetarefasplus",
  storageBucket: "listadetarefasplus.firebasestorage.app",
  messagingSenderId: "1047476361681",
  appId: "1:1047476361681:web:317a43422b9f112f29a8f0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);