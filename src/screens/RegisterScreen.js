import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar, useTheme } from 'react-native-paper';
import { signUpEmail } from '../services/auth';
import I18nContext from '../context/I18nContext';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { i18n } = useContext(I18nContext);
  const theme = useTheme(); // <- pega cores do tema

  const handleRegister = async () => {
    try {
      await signUpEmail(email, password);
      setSuccessMessage('Cadastro realizado com sucesso!');
      setTimeout(() => navigation.replace('Login'), 1500);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Criar Conta
      </Text>

      <TextInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        mode="outlined"
        theme={{ colors: { primary: theme.colors.primary } }}
      />
      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: theme.colors.primary } }}
      />

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Cadastrar
      </Button>

      <Button onPress={() => navigation.navigate('Login')} style={styles.signUpButton}>
        Já tenho uma conta
      </Button>

      <Snackbar
        visible={!!errorMessage}
        onDismiss={() => setErrorMessage('')}
        duration={3000}
      >
        {errorMessage}
      </Snackbar>

      <Snackbar
        visible={!!successMessage}
        onDismiss={() => setSuccessMessage('')}
        duration={3000}
      >
        {successMessage}
      </Snackbar>
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
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 28,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
  signUpButton: {
    marginTop: 10,
  },
});