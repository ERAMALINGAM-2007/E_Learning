// Theme configuration for CognitionAI Learning mobile app
import { Theme, ThemeColors } from '../types';

export const lightColors: ThemeColors = {
    background: '#f8fafc',      // slate-50
    surface: '#ffffff',
    surfaceVariant: '#f1f5f9',  // slate-100
    primary: '#2563eb',         // brand-600
    primaryLight: '#dbeafe',    // blue-100
    secondary: '#6366f1',       // indigo-500
    text: '#1e293b',            // slate-800
    textSecondary: '#64748b',   // slate-500
    textInverse: '#ffffff',
    border: '#e2e8f0',          // slate-200
    error: '#ef4444',           // red-500
    success: '#22c55e',         // green-500
    warning: '#f59e0b',         // amber-500
};

export const darkColors: ThemeColors = {
    background: '#020617',      // slate-950
    surface: '#0f172a',         // slate-900
    surfaceVariant: '#1e293b',  // slate-800
    primary: '#60a5fa',         // blue-400
    primaryLight: '#1e3a5f',    // custom dark blue
    secondary: '#818cf8',       // indigo-400
    text: '#f1f5f9',            // slate-100
    textSecondary: '#94a3b8',   // slate-400
    textInverse: '#0f172a',
    border: '#334155',          // slate-700
    error: '#f87171',           // red-400
    success: '#4ade80',         // green-400
    warning: '#fbbf24',         // amber-400
};

export const lightTheme: Theme = {
    dark: false,
    colors: lightColors,
};

export const darkTheme: Theme = {
    dark: true,
    colors: darkColors,
};

// Spacing constants
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// Border radius constants
export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

// Typography
export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '800' as const,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 32,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
    },
    button: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
    },
};

// Shadows for elevation
export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 5,
    },
};
