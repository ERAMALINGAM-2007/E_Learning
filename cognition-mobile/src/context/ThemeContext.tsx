// Theme context for managing dark/light mode across the app
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { Theme, ThemeColors } from '../types';
import { lightTheme, darkTheme } from '../theme';

interface ThemeContextType {
    theme: Theme;
    colors: ThemeColors;
    isDark: boolean;
    toggleTheme: () => void;
    setTheme: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'cognition_theme_preference';

export function ThemeProvider({ children }: { children: ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved theme preference
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (saved !== null) {
                    setIsDark(saved === 'dark');
                }
            } catch (e) {
                console.error('Failed to load theme:', e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadTheme();
    }, []);

    // Save theme preference when it changes
    const saveTheme = async (dark: boolean) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
        } catch (e) {
            console.error('Failed to save theme:', e);
        }
    };

    const toggleTheme = () => {
        const newValue = !isDark;
        setIsDark(newValue);
        saveTheme(newValue);
    };

    const setTheme = (dark: boolean) => {
        setIsDark(dark);
        saveTheme(dark);
    };

    const theme = isDark ? darkTheme : lightTheme;
    const colors = theme.colors;

    // Don't render until theme is loaded to prevent flash
    if (!isLoaded) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, colors, isDark, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
