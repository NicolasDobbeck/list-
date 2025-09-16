import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { signInEmail, signUpEmail, useGoogleSignIn } from '../services/auth';
import I18nContext from '../context/I18nContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { i18n } = useContext(I18nContext);

  const { handleGoogleSignIn } = useGoogleSignIn();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInEmail(email, password);
    } catch (error) {
      Alert.alert('Erro de Login', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUpEmail(email, password);
      Alert.alert('Sucesso!', 'Conta criada com sucesso. Você já está logado.');
    } catch (error) {
      Alert.alert('Erro no Cadastro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{i18n.t('login_title')}</Title>
      <TextInput
        style={styles.input}
        label={i18n.t('email_placeholder')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        label={i18n.t('password_placeholder')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button 
        mode="contained" 
        onPress={handleSignIn} 
        loading={loading}
        style={styles.button}
      >
        {i18n.t('login_button')}
      </Button>
      <Button 
        mode="text" 
        onPress={handleSignUp}
        loading={loading}
        style={styles.signUpButton}
      >
        Não tem uma conta? Cadastre-se
      </Button>
      <Button 
        mode="outlined" 
        onPress={handleGoogleSignIn} 
        style={styles.googleButton}
      >
        {i18n.t('login_google')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 5,
  },
  signUpButton: {
    marginTop: 5,
    marginBottom: 10,
  },
  googleButton: {
    marginTop: 10,
  },
});