// Login/Signup Screen - Mobile optimized
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { Role } from '../../src/types';
import { spacing, borderRadius } from '../../src/theme';

type AuthMode = 'login' | 'signup';

export default function LoginScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useTheme();
    const { login, register } = useAuth();

    const [mode, setMode] = useState<AuthMode>('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<Role>('student');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async () => {
        if (mode === 'signup') {
            if (!name.trim()) {
                Alert.alert('Error', 'Please enter your name');
                return;
            }
            if (password !== confirmPassword) {
                Alert.alert('Error', 'Passwords do not match');
                return;
            }
            if (password.length < 6) {
                Alert.alert('Error', 'Password must be at least 6 characters');
                return;
            }
        }

        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            if (mode === 'login') {
                const result = await login(email, password);
                if (result.success) {
                    router.replace('/(tabs)/dashboard');
                } else {
                    Alert.alert('Login Failed', result.error || 'Invalid credentials');
                }
            } else {
                const result = await register(name, email, password, role);
                if (result.success) {
                    router.replace('/(tabs)/dashboard');
                } else {
                    Alert.alert('Registration Failed', result.error || 'Could not create account');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                        <Ionicons
                            name={isDark ? 'sunny' : 'moon'}
                            size={24}
                            color={isDark ? '#fbbf24' : '#6366f1'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Logo & Title */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.titleSection}>
                    <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                        <Ionicons name="book" size={32} color="#ffffff" />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {mode === 'login'
                            ? 'Sign in to continue your learning journey'
                            : 'Start your personalized learning experience'}
                    </Text>
                </Animated.View>

                {/* Form */}
                <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.form}>
                    {mode === 'signup' && (
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Enter your name"
                                    placeholderTextColor={colors.textSecondary}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
                        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Enter your password"
                                placeholderTextColor={colors.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {mode === 'signup' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm Password</Text>
                                <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                                    <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} />
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="Confirm your password"
                                        placeholderTextColor={colors.textSecondary}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>I am a...</Text>
                                <View style={styles.roleSelector}>
                                    <TouchableOpacity
                                        style={[
                                            styles.roleOption,
                                            { backgroundColor: colors.surface, borderColor: colors.border },
                                            role === 'student' && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
                                        ]}
                                        onPress={() => setRole('student')}
                                    >
                                        <Ionicons
                                            name="school"
                                            size={24}
                                            color={role === 'student' ? colors.primary : colors.textSecondary}
                                        />
                                        <Text style={[
                                            styles.roleText,
                                            { color: role === 'student' ? colors.primary : colors.text }
                                        ]}>
                                            Student
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.roleOption,
                                            { backgroundColor: colors.surface, borderColor: colors.border },
                                            role === 'instructor' && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
                                        ]}
                                        onPress={() => setRole('instructor')}
                                    >
                                        <Ionicons
                                            name="person"
                                            size={24}
                                            color={role === 'instructor' ? colors.primary : colors.textSecondary}
                                        />
                                        <Text style={[
                                            styles.roleText,
                                            { color: role === 'instructor' ? colors.primary : colors.text }
                                        ]}>
                                            Instructor
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}

                    {mode === 'login' && (
                        <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={() => router.push('/(auth)/reset-password')}
                        >
                            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#2563eb', '#4f46e5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Toggle Mode */}
                    <View style={styles.toggleContainer}>
                        <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
                            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        </Text>
                        <TouchableOpacity onPress={toggleMode}>
                            <Text style={[styles.toggleLink, { color: colors.primary }]}>
                                {mode === 'login' ? 'Sign Up' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: spacing.md,
    },
    backButton: {
        padding: spacing.sm,
    },
    themeButton: {
        padding: spacing.sm,
    },
    titleSection: {
        alignItems: 'center',
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
    },
    logoIcon: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: spacing.sm,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        height: 56,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    roleSelector: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    roleOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 2,
    },
    roleText: {
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: spacing.lg,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '600',
    },
    submitButton: {
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 14,
    },
    toggleLink: {
        fontSize: 14,
        fontWeight: '700',
    },
});
