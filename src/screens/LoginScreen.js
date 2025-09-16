import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title, useTheme } from 'react-native-paper';
import { signInEmail } from '../services/auth';
import I18nContext from '../context/I18nContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { i18n } = useContext(I18nContext);
  const theme = useTheme(); // <- pega cores do tema

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Title style={[styles.title, { color: theme.colors.onBackground }]}>
        {i18n.t('login_title')}
      </Title>

      <TextInput
        style={styles.input}
        label={i18n.t('email_placeholder')}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        mode="outlined"
        theme={{ colors: { primary: theme.colors.primary } }}
      />
      <TextInput
        style={styles.input}
        label={i18n.t('password_placeholder')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        theme={{ colors: { primary: theme.colors.primary } }}
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
        onPress={() => navigation.navigate('Register')} // <- navegação corrigida
        style={styles.signUpButton}
      >
        Não tem uma conta? Cadastre-se
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
});