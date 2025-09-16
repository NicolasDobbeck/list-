import React, { createContext, useState, useEffect } from 'react';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { translations } from '../config/i18n';

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');
  const i18n = new I18n(translations);
  i18n.locale = locale;
  i18n.enableFallback = true;

  useEffect(() => {
    const loadLocale = async () => {
      const savedLocale = await AsyncStorage.getItem('locale');
      if (savedLocale) {
        setLocale(savedLocale);
      }
    };
    loadLocale();
  }, []);

  const setAppLocale = async (newLocale) => {
    setLocale(newLocale);
    await AsyncStorage.setItem('locale', newLocale);
  };

  return (
    <I18nContext.Provider value={{ i18n, locale, setAppLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export default I18nContext;