// Reset Password Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius } from '../../src/theme';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useTheme();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsLoading(false);
        setSent(true);
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

            <View style={styles.content}>
                <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.iconContainer}>
                    <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                        <Ionicons name={sent ? 'checkmark-circle' : 'key'} size={48} color={colors.primary} />
                    </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {sent ? 'Check Your Email' : 'Reset Password'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {sent
                            ? `We've sent a password reset link to ${email}`
                            : 'Enter your email address and we\'ll send you a link to reset your password.'}
                    </Text>
                </Animated.View>

                {!sent ? (
                    <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.form}>
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
                                    <Text style={styles.submitButtonText}>Send Reset Link</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInDown.delay(300).duration(600)}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => router.replace('/(auth)/login')}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#2563eb', '#4f46e5']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.submitButtonText}>Back to Login</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                )}

                {!sent && (
                    <TouchableOpacity
                        style={styles.backToLogin}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.backToLoginText, { color: colors.textSecondary }]}>
                            Remember your password? <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    backButton: {
        padding: spacing.sm,
    },
    themeButton: {
        padding: spacing.sm,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    form: {
        marginTop: spacing.lg,
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
    backToLogin: {
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    backToLoginText: {
        fontSize: 14,
    },
});
