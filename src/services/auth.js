import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getApp } from 'firebase/app';
import * as Google from 'expo-auth-session/providers/google';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';

const auth = getAuth(getApp());

// Login com e-mail e senha
export const signInEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Cadastro com e-mail e senha
export const signUpEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Logout
export const logout = () => {
  return signOut(auth);
};

// Login com Google
export const useGoogleSignIn = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '367144616308-rd8de4tktun20mmtol64r1iombaviges.apps.googleusercontent.com', 
    webClientId: '367144616308-gqn16oslloibherrjrr213rm9bic66n5.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer login com o Google.");
    }
  };

  return { request, handleGoogleSignIn };
};