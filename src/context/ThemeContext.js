// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themeName, setThemeName] = useState(systemTheme || 'light');

  useEffect(() => {
    const getSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeName(savedTheme);
        }
      } catch (error) {
        console.log("Failed to load saved theme:", error);
      }
    };
    getSavedTheme();
  }, []);

  const paperTheme = themeName === 'dark' ? MD3DarkTheme : MD3LightTheme;

  const toggleTheme = async () => {
    const newThemeName = themeName === 'light' ? 'dark' : 'light';
    setThemeName(newThemeName);
    await AsyncStorage.setItem('theme', newThemeName);
  };

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme, paperTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);