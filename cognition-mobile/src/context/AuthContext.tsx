// Auth context for managing user authentication state
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { db } from '../services/db';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (name: string, email: string, password: string, role: Role) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const savedUser = await db.getCurrentUser();
                setUser(savedUser);
            } catch (e) {
                console.error('Failed to load user:', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();

        // Subscribe to db changes
        const unsubscribe = db.subscribe(async () => {
            const currentUser = await db.getCurrentUser();
            setUser(currentUser);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        try {
            const loggedInUser = await db.loginUser(email, password);
            if (loggedInUser) {
                setUser(loggedInUser);
                return { success: true };
            }
            return { success: false, error: 'Invalid email or password' };
        } catch (e) {
            return { success: false, error: 'An error occurred during login' };
        }
    };

    const register = async (
        name: string,
        email: string,
        password: string,
        role: Role
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const newUser = await db.registerUser(name, email, password, role);
            if (newUser) {
                setUser(newUser);
                return { success: true };
            }
            return { success: false, error: 'Email already registered' };
        } catch (e) {
            return { success: false, error: 'An error occurred during registration' };
        }
    };

    const logout = async () => {
        await db.logout();
        setUser(null);
    };

    const updateUser = async (updates: Partial<User>) => {
        if (user) {
            await db.updateUser(user.id, updates);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
