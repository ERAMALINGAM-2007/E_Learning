// Profile Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    Switch,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { spacing, borderRadius, shadows } from '../../src/theme';

interface SettingItem {
    id: string;
    icon: string;
    label: string;
    type: 'navigate' | 'toggle' | 'action';
    value?: boolean;
    danger?: boolean;
}

export default function ProfileScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(true);

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/');
                    }
                },
            ]
        );
    };

    const stats = [
        { label: 'XP Earned', value: user?.xp?.toLocaleString() || '0', icon: 'star', color: '#f59e0b' },
        { label: 'Day Streak', value: user?.streak?.toString() || '0', icon: 'flame', color: '#ef4444' },
        { label: 'Courses', value: user?.enrolledCourseIds?.length?.toString() || '0', icon: 'book', color: '#2563eb' },
        { label: 'Completed', value: user?.completedLessonIds?.length?.toString() || '0', icon: 'checkmark-circle', color: '#22c55e' },
    ];

    const achievements = [
        { id: '1', title: 'First Step', icon: '🎯', unlocked: true },
        { id: '2', title: 'Quick Learner', icon: '⚡', unlocked: true },
        { id: '3', title: 'Streak Master', icon: '🔥', unlocked: user?.streak ? user.streak >= 7 : false },
        { id: '4', title: 'Course Champion', icon: '🏆', unlocked: false },
        { id: '5', title: 'Community Star', icon: '⭐', unlocked: false },
        { id: '6', title: 'Knowledge Guru', icon: '🧠', unlocked: false },
    ];

    const settingsItems: SettingItem[] = [
        { id: 'notifications', icon: 'notifications', label: 'Push Notifications', type: 'toggle', value: notifications },
        { id: 'email', icon: 'mail', label: 'Email Updates', type: 'toggle', value: emailUpdates },
        { id: 'theme', icon: isDark ? 'sunny' : 'moon', label: isDark ? 'Light Mode' : 'Dark Mode', type: 'action' },
        { id: 'privacy', icon: 'shield', label: 'Privacy Settings', type: 'navigate' },
        { id: 'help', icon: 'help-circle', label: 'Help & Support', type: 'navigate' },
        { id: 'about', icon: 'information-circle', label: 'About', type: 'navigate' },
        { id: 'logout', icon: 'log-out', label: 'Sign Out', type: 'action', danger: true },
    ];

    const handleSettingPress = (item: SettingItem) => {
        switch (item.id) {
            case 'notifications':
                setNotifications(!notifications);
                break;
            case 'email':
                setEmailUpdates(!emailUpdates);
                break;
            case 'theme':
                toggleTheme();
                break;
            case 'logout':
                handleLogout();
                break;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <LinearGradient
                    colors={['#2563eb', '#4f46e5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.profileHeader}
                >
                    <View style={styles.headerContent}>
                        <Image
                            source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=ffffff&color=2563eb&size=200' }}
                            style={styles.avatar}
                        />
                        <Text style={styles.userName}>{user?.name || 'Learner'}</Text>
                        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                        <View style={styles.roleBadge}>
                            <Ionicons name={user?.role === 'instructor' ? 'school' : 'person'} size={14} color="#ffffff" />
                            <Text style={styles.roleText}>
                                {user?.role === 'instructor' ? 'Instructor' : 'Student'}
                            </Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Stats Grid */}
                <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <View key={index} style={[styles.statCard, { backgroundColor: colors.surface }]}>
                            <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                            <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* Achievements */}
                <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
                    <View style={styles.achievementsGrid}>
                        {achievements.map((achievement, index) => (
                            <View
                                key={achievement.id}
                                style={[
                                    styles.achievementCard,
                                    {
                                        backgroundColor: achievement.unlocked ? colors.surface : colors.surfaceVariant,
                                        opacity: achievement.unlocked ? 1 : 0.5,
                                    }
                                ]}
                            >
                                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                                <Text style={[styles.achievementTitle, { color: colors.text }]} numberOfLines={1}>
                                    {achievement.title}
                                </Text>
                                {achievement.unlocked && (
                                    <Ionicons name="checkmark-circle" size={16} color="#22c55e" style={styles.unlockedIcon} />
                                )}
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* Settings */}
                <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings</Text>
                    <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
                        {settingsItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.settingsItem,
                                    index < settingsItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                                ]}
                                onPress={() => handleSettingPress(item)}
                            >
                                <View style={styles.settingsLeft}>
                                    <Ionicons
                                        name={item.icon as any}
                                        size={22}
                                        color={item.danger ? '#ef4444' : colors.textSecondary}
                                    />
                                    <Text style={[styles.settingsLabel, { color: item.danger ? '#ef4444' : colors.text }]}>
                                        {item.label}
                                    </Text>
                                </View>
                                {item.type === 'toggle' && (
                                    <Switch
                                        value={item.value}
                                        onValueChange={() => handleSettingPress(item)}
                                        trackColor={{ false: colors.border, true: colors.primaryLight }}
                                        thumbColor={item.value ? colors.primary : '#f4f3f4'}
                                    />
                                )}
                                {item.type === 'navigate' && (
                                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </Animated.View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
                        CognitionAI Learning v1.0.0
                    </Text>
                    <Text style={[styles.copyright, { color: colors.textSecondary }]}>
                        © 2024 CognitionAI. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    profileHeader: {
        paddingTop: 80,
        paddingBottom: spacing.xl,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerContent: {
        alignItems: 'center',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.3)',
        marginBottom: spacing.md,
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: spacing.sm,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
    },
    roleText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#ffffff',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: spacing.lg,
        gap: spacing.md,
        marginTop: -spacing.xl,
    },
    statCard: {
        width: '47%',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        ...shadows.md,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: spacing.sm,
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    achievementCard: {
        width: '31%',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        position: 'relative',
    },
    achievementIcon: {
        fontSize: 28,
        marginBottom: spacing.xs,
    },
    achievementTitle: {
        fontSize: 11,
        fontWeight: '600',
        textAlign: 'center',
    },
    unlockedIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    settingsCard: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.sm,
    },
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
    },
    settingsLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    settingsLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    appInfo: {
        alignItems: 'center',
        padding: spacing.xl,
    },
    appVersion: {
        fontSize: 13,
    },
    copyright: {
        fontSize: 12,
        marginTop: 4,
    },
});
