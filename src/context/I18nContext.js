import React, { createContext, useState, useEffect, useContext } from 'react';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../config/i18n';

// Cria o contexto
const I18nContext = createContext();

// Provider
export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState(null);
  const [i18n, setI18n] = useState(null);

  useEffect(() => {
    const initializeI18n = async () => {
      const savedLocale = await AsyncStorage.getItem('locale');
      const newLocale = savedLocale || 'en';

      const newI18n = new I18n(translations);
      newI18n.locale = newLocale;
      newI18n.enableFallback = true;

      setLocale(newLocale);
      setI18n(newI18n);
    };

    initializeI18n();
  }, []);

  const setAppLocale = async (newLocale) => {
    setLocale(newLocale);
    await AsyncStorage.setItem('locale', newLocale);
    if (i18n) {
      i18n.locale = newLocale;
    }
  };

  if (!i18n) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ i18n, locale, setAppLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook para consumir o contexto
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n deve ser usado dentro de um I18nProvider');
  }
  return context;
};

export default I18nContext;