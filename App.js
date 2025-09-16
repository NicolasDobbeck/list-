// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { I18nProvider } from './src/context/I18nContext';
import AppNavigation from './src/navigation/AppNavigation';

const queryClient = new QueryClient();

function MainApp() {
  const { paperTheme } = useTheme();

  return (
    <PaperProvider theme={paperTheme}>
      <AppNavigation />
      <StatusBar />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <I18nProvider>
              <MainApp />
            </I18nProvider>
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}