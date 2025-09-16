import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import TasksScreen from '../screens/TasksScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Cadastro" }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  const paperTheme = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          title: 'TarefasPlus',
          headerStyle: { backgroundColor: paperTheme.colors.primary },
          headerTintColor: paperTheme.colors.onPrimary,
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigation() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});