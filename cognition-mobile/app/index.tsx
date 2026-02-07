// Landing/Home screen - redirects based on auth state
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../src/context/ThemeContext';
import { useAuth } from '../src/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { spacing, borderRadius, typography } from '../src/theme';

const { width } = Dimensions.get('window');

export default function LandingScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, isLoading } = useAuth();

    // Animated glow effect
    const glowOpacity = useSharedValue(0.3);

    useEffect(() => {
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 2000 }),
                withTiming(0.3, { duration: 2000 })
            ),
            -1,
            true
        );
    }, []);

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    // Redirect if already logged in
    useEffect(() => {
        if (!isLoading && user) {
            router.replace('/(tabs)/dashboard');
        }
    }, [user, isLoading]);

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <Ionicons name="book" size={48} color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={[styles.logoIcon, { backgroundColor: colors.primary }]}>
                        <Ionicons name="book" size={24} color="#ffffff" />
                    </View>
                    <Text style={[styles.logoText, { color: colors.text }]}>
                        Cognition<Text style={{ color: colors.primary }}>AI</Text>
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                    <Ionicons
                        name={isDark ? 'sunny' : 'moon'}
                        size={24}
                        color={isDark ? '#fbbf24' : '#6366f1'}
                    />
                </TouchableOpacity>
            </View>

            {/* Hero Section */}
            <View style={styles.heroSection}>
                {/* Animated background glow */}
                <Animated.View style={[styles.glowCircle, glowStyle, { backgroundColor: colors.primary }]} />
                <Animated.View style={[styles.glowCircle2, glowStyle, { backgroundColor: colors.secondary }]} />

                <Animated.Text
                    entering={FadeInDown.delay(200).duration(800)}
                    style={[styles.heroTitle, { color: colors.text }]}
                >
                    Master any skill with your{'\n'}
                    <Text style={styles.heroGradientText}>Personal AI Tutor</Text>
                </Animated.Text>

                <Animated.Text
                    entering={FadeInDown.delay(400).duration(800)}
                    style={[styles.heroSubtitle, { color: colors.textSecondary }]}
                >
                    Experience the future of learning. Generate courses instantly, track real progress, and master topics with AI assistance.
                </Animated.Text>

                {/* CTA Buttons */}
                <Animated.View
                    entering={FadeInUp.delay(600).duration(800)}
                    style={styles.ctaContainer}
                >
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push('/(auth)/login')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#2563eb', '#4f46e5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.primaryButtonText}>Start Learning Now</Text>
                            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { borderColor: colors.border }]}
                        onPress={() => router.push('/(auth)/login')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                            Log In
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Features Section */}
            <Animated.View
                entering={FadeInUp.delay(800).duration(800)}
                style={styles.featuresSection}
            >
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                    POWERED BY MODERN TECH
                </Text>

                <View style={styles.featuresGrid}>
                    {[
                        { icon: 'sparkles', label: 'AI-Powered', color: '#8b5cf6' },
                        { icon: 'game-controller', label: 'Gamified', color: '#ec4899' },
                        { icon: 'people', label: 'Community', color: '#06b6d4' },
                        { icon: 'trophy', label: 'Achievements', color: '#f59e0b' },
                    ].map((feature, index) => (
                        <View
                            key={index}
                            style={[styles.featureCard, { backgroundColor: colors.surface }]}
                        >
                            <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                                <Ionicons name={feature.icon as any} size={24} color={feature.color} />
                            </View>
                            <Text style={[styles.featureLabel, { color: colors.text }]}>
                                {feature.label}
                            </Text>
                        </View>
                    ))}
                </View>
            </Animated.View>

            {/* Stats Section */}
            <View style={[styles.statsSection, { backgroundColor: colors.surface }]}>
                {[
                    { value: '10K+', label: 'Students' },
                    { value: '500+', label: 'Courses' },
                    { value: '98%', label: 'Satisfaction' },
                ].map((stat, index) => (
                    <View key={index} style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{stat.value}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                    </View>
                ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                    © 2024 CognitionAI Learning. All rights reserved.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: 60,
        paddingBottom: spacing.md,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: '700',
    },
    themeButton: {
        padding: spacing.sm,
    },
    heroSection: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xl,
        position: 'relative',
        overflow: 'hidden',
    },
    glowCircle: {
        position: 'absolute',
        top: -100,
        left: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.3,
    },
    glowCircle2: {
        position: 'absolute',
        bottom: -50,
        right: -100,
        width: 250,
        height: 250,
        borderRadius: 125,
        opacity: 0.2,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: '800',
        lineHeight: 44,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    heroGradientText: {
        color: '#2563eb',
    },
    heroSubtitle: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    ctaContainer: {
        gap: spacing.md,
        alignItems: 'center',
    },
    primaryButton: {
        width: '100%',
        maxWidth: 300,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        gap: spacing.sm,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    secondaryButton: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: borderRadius.full,
        borderWidth: 2,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    featuresSection: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'center',
    },
    featureCard: {
        width: (width - spacing.lg * 2 - spacing.md) / 2 - spacing.md,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        gap: spacing.sm,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    statsSection: {
        flexDirection: 'row',
        marginHorizontal: spacing.lg,
        marginVertical: spacing.xl,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
    },
    footerText: {
        fontSize: 12,
        textAlign: 'center',
    },
});
