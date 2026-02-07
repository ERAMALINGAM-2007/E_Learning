// Dashboard Screen - Student/Instructor dashboard
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    RefreshControl,
    Dimensions,
    TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { db } from '../../src/services/db';
import { Course } from '../../src/types';
import { spacing, borderRadius, shadows } from '../../src/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.lg * 2;

export default function DashboardScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    const [courses, setCourses] = useState<Course[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const isInstructor = user?.role === 'instructor';

    useEffect(() => {
        loadCourses();

        const unsubscribe = db.subscribe(loadCourses);
        return unsubscribe;
    }, []);

    const loadCourses = async () => {
        const allCourses = await db.getCourses();
        if (isInstructor) {
            setCourses(allCourses.filter(c => c.instructorId === user?.id));
        } else {
            setCourses(allCourses.filter(c => c.isPublished));
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadCourses();
        setRefreshing(false);
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const enrolledCourses = filteredCourses.filter(c =>
        user?.enrolledCourseIds.includes(c.id)
    );
    const exploreCourses = filteredCourses.filter(c =>
        !user?.enrolledCourseIds.includes(c.id)
    );

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return '#22c55e';
            case 'Intermediate': return '#f59e0b';
            case 'Advanced': return '#ef4444';
            default: return colors.primary;
        }
    };

    const CourseCard = ({ course, index }: { course: Course; index: number }) => {
        const isEnrolled = user?.enrolledCourseIds.includes(course.id);
        const completedLessons = user?.completedLessonIds.filter(id =>
            course.modules.some(m => m.lessons.some(l => l.id === id))
        ).length || 0;
        const progress = course.totalLessons > 0
            ? (completedLessons / course.totalLessons) * 100
            : 0;

        return (
            <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
                <TouchableOpacity
                    style={[styles.courseCard, { backgroundColor: colors.surface }]}
                    onPress={() => router.push(`/course/${course.id}`)}
                    activeOpacity={0.7}
                >
                    <Image
                        source={{ uri: course.thumbnail }}
                        style={styles.courseImage}
                        resizeMode="cover"
                    />
                    <View style={styles.courseContent}>
                        <View style={styles.courseHeader}>
                            <View style={[styles.categoryBadge, { backgroundColor: colors.primaryLight }]}>
                                <Text style={[styles.categoryText, { color: colors.primary }]}>
                                    {course.category}
                                </Text>
                            </View>
                            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(course.difficulty) + '20' }]}>
                                <Text style={[styles.difficultyText, { color: getDifficultyColor(course.difficulty) }]}>
                                    {course.difficulty}
                                </Text>
                            </View>
                        </View>

                        <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={2}>
                            {course.title}
                        </Text>

                        <Text style={[styles.courseDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                            {course.description}
                        </Text>

                        <View style={styles.courseFooter}>
                            <View style={styles.instructorInfo}>
                                <Image
                                    source={{ uri: `https://ui-avatars.com/api/?name=${course.instructorName}&background=2563eb&color=fff` }}
                                    style={styles.instructorAvatar}
                                />
                                <Text style={[styles.instructorName, { color: colors.textSecondary }]}>
                                    {course.instructorName}
                                </Text>
                            </View>

                            <View style={styles.lessonCount}>
                                <Ionicons name="play-circle" size={16} color={colors.textSecondary} />
                                <Text style={[styles.lessonCountText, { color: colors.textSecondary }]}>
                                    {course.totalLessons} lessons
                                </Text>
                            </View>
                        </View>

                        {isEnrolled && (
                            <View style={styles.progressContainer}>
                                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${progress}%`, backgroundColor: colors.primary }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                                    {Math.round(progress)}% complete
                                </Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                            Welcome back,
                        </Text>
                        <Text style={[styles.userName, { color: colors.text }]}>
                            {user?.name || 'Learner'} 👋
                        </Text>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
                            <Ionicons
                                name={isDark ? 'sunny' : 'moon'}
                                size={22}
                                color={isDark ? '#fbbf24' : '#6366f1'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: colors.surfaceVariant }]}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search courses..."
                        placeholderTextColor={colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: colors.primaryLight }]}>
                        <Ionicons name="flame" size={20} color={colors.primary} />
                        <Text style={[styles.statValue, { color: colors.primary }]}>{user?.streak || 0}</Text>
                        <Text style={[styles.statLabel, { color: colors.primary }]}>Day Streak</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#dcfce7' }]}>
                        <Ionicons name="star" size={20} color="#22c55e" />
                        <Text style={[styles.statValue, { color: '#22c55e' }]}>{user?.xp || 0}</Text>
                        <Text style={[styles.statLabel, { color: '#22c55e' }]}>XP Earned</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#fef3c7' }]}>
                        <Ionicons name="book" size={20} color="#f59e0b" />
                        <Text style={[styles.statValue, { color: '#f59e0b' }]}>{enrolledCourses.length}</Text>
                        <Text style={[styles.statLabel, { color: '#f59e0b' }]}>Courses</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {/* Continue Learning Section */}
                {enrolledCourses.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Continue Learning
                        </Text>
                        {enrolledCourses.map((course, index) => (
                            <CourseCard key={course.id} course={course} index={index} />
                        ))}
                    </View>
                )}

                {/* Explore Courses Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                        {isInstructor ? 'Your Courses' : 'Explore Courses'}
                    </Text>
                    {isInstructor && (
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={() => {/* Navigate to course creator */ }}
                        >
                            <LinearGradient
                                colors={['#2563eb', '#4f46e5']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.createButtonGradient}
                            >
                                <Ionicons name="add" size={24} color="#ffffff" />
                                <Text style={styles.createButtonText}>Create New Course</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                    {(isInstructor ? filteredCourses : exploreCourses).map((course, index) => (
                        <CourseCard key={course.id} course={course} index={index} />
                    ))}
                    {filteredCourses.length === 0 && (
                        <View style={styles.emptyState}>
                            <Ionicons name="search" size={48} color={colors.textSecondary} />
                            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                                No courses found
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    greeting: {
        fontSize: 14,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
    },
    headerActions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    iconButton: {
        padding: spacing.sm,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        height: 48,
        borderRadius: borderRadius.md,
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    statCard: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        gap: 2,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    courseCard: {
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        overflow: 'hidden',
        ...shadows.md,
    },
    courseImage: {
        width: '100%',
        height: 160,
    },
    courseContent: {
        padding: spacing.md,
    },
    courseHeader: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    categoryBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
    },
    difficultyBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.xs,
    },
    courseDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    courseFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    instructorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    instructorAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    instructorName: {
        fontSize: 13,
        fontWeight: '500',
    },
    lessonCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    lessonCountText: {
        fontSize: 13,
    },
    progressContainer: {
        marginTop: spacing.md,
        gap: spacing.xs,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '500',
    },
    createButton: {
        marginBottom: spacing.md,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    createButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        gap: spacing.sm,
    },
    createButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        padding: spacing.xxl,
    },
    emptyStateText: {
        fontSize: 16,
        marginTop: spacing.md,
    },
});
