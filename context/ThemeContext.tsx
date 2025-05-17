import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    error: string;
    highPriority: string;
    mediumPriority: string;
    lowPriority: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');
  
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme', error);
      }
    };
    
    loadTheme();
  }, []);
  
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };
  
  const isDarkMode = theme === 'system' 
    ? systemColorScheme === 'dark' 
    : theme === 'dark';
  
  const lightColors = {
    background: '#F9FAFB',
    card: '#FFFFFF',
    text: '#111827',
    subtext: '#6B7280',
    border: '#E5E7EB',
    primary: '#06B6D4',
    secondary: '#8B5CF6',
    accent: '#F97316',
    success: '#10B981',
    error: '#EF4444',
    highPriority: '#EF4444',
    mediumPriority: '#F97316',
    lowPriority: '#10B981',
  };
  
  const darkColors = {
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    subtext: '#9CA3AF',
    border: '#374151',
    primary: '#22D3EE',
    secondary: '#A78BFA',
    accent: '#FB923C',
    success: '#34D399',
    error: '#F87171',
    highPriority: '#F87171',
    mediumPriority: '#FB923C',
    lowPriority: '#34D399',
  };
  
  const colors = isDarkMode ? darkColors : lightColors;
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        isDark: isDarkMode, 
        setTheme, 
        colors 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};