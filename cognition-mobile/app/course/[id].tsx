// Course Viewer Screen
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { db } from '../../src/services/db';
import { Course, Lesson, Module } from '../../src/types';
import { spacing, borderRadius, shadows } from '../../src/theme';

const { width, height } = Dimensions.get('window');

export default function CourseViewerScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const scrollViewRef = useRef<ScrollView>(null);

    const [course, setCourse] = useState<Course | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        const courses = await db.getCourses();
        const foundCourse = courses.find(c => c.id === id);
        if (foundCourse) {
            setCourse(foundCourse);
            if (foundCourse.modules.length > 0 && foundCourse.modules[0].lessons.length > 0) {
                setCurrentLesson(foundCourse.modules[0].lessons[0]);
            }

            // Auto-enroll if not enrolled
            if (user && !user.enrolledCourseIds.includes(foundCourse.id)) {
                await db.enrollUser(user.id, foundCourse.id);
            }
        }
        setIsLoading(false);
    };

    const selectLesson = (moduleIndex: number, lessonIndex: number) => {
        if (course) {
            const lesson = course.modules[moduleIndex].lessons[lessonIndex];
            setCurrentLesson(lesson);
            setCurrentModuleIndex(moduleIndex);
            setCurrentLessonIndex(lessonIndex);
            setShowSidebar(false);
        }
    };

    const goToNextLesson = () => {
        if (!course) return;

        const currentModule = course.modules[currentModuleIndex];
        if (currentLessonIndex < currentModule.lessons.length - 1) {
            selectLesson(currentModuleIndex, currentLessonIndex + 1);
        } else if (currentModuleIndex < course.modules.length - 1) {
            selectLesson(currentModuleIndex + 1, 0);
        }
    };

    const goToPrevLesson = () => {
        if (!course) return;

        if (currentLessonIndex > 0) {
            selectLesson(currentModuleIndex, currentLessonIndex - 1);
        } else if (currentModuleIndex > 0) {
            const prevModule = course.modules[currentModuleIndex - 1];
            selectLesson(currentModuleIndex - 1, prevModule.lessons.length - 1);
        }
    };

    const markComplete = async () => {
        if (user && currentLesson) {
            await db.completeLesson(user.id, currentLesson.id);
            goToNextLesson();
        }
    };

    const isLessonComplete = (lessonId: string) => {
        return user?.completedLessonIds.includes(lessonId) || false;
    };

    const sendChatMessage = () => {
        if (!chatMessage.trim()) return;

        setChatHistory(prev => [...prev, { role: 'user', text: chatMessage }]);
        setChatMessage('');

        // Simulate AI response
        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                role: 'ai',
                text: `That's a great question about "${currentLesson?.title}"! Here's an explanation: The key concepts in this lesson involve understanding the fundamentals and applying them step by step. Would you like me to elaborate on any specific point?`
            }]);
        }, 1000);
    };

    const getProgress = () => {
        if (!course || !user) return 0;
        const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
        const completedLessons = course.modules.reduce((sum, m) =>
            sum + m.lessons.filter(l => user.completedLessonIds.includes(l.id)).length, 0
        );
        return totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    };

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!course) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
                <Ionicons name="alert-circle" size={64} color={colors.textSecondary} />
                <Text style={[styles.errorText, { color: colors.text }]}>Course not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={[styles.backButtonText, { color: colors.primary }]}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: course.title,
                    headerStyle: { backgroundColor: colors.surface },
                    headerTintColor: colors.text,
                    headerRight: () => (
                        <TouchableOpacity onPress={() => setShowSidebar(!showSidebar)} style={{ marginRight: spacing.sm }}>
                            <Ionicons name="list" size={24} color={colors.text} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Progress Bar */}
                <View style={[styles.progressContainer, { backgroundColor: colors.surface }]}>
                    <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressFill, { width: `${getProgress()}%`, backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                        {Math.round(getProgress())}% Complete
                    </Text>
                </View>

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Current Lesson Card */}
                    <Animated.View entering={FadeIn.duration(400)} style={[styles.lessonCard, { backgroundColor: colors.surface }]}>
                        <View style={styles.lessonHeader}>
                            <View style={[styles.lessonNumber, { backgroundColor: colors.primaryLight }]}>
                                <Text style={[styles.lessonNumberText, { color: colors.primary }]}>
                                    {currentModuleIndex + 1}.{currentLessonIndex + 1}
                                </Text>
                            </View>
                            <View style={styles.lessonMeta}>
                                <Text style={[styles.moduleName, { color: colors.textSecondary }]}>
                                    {course.modules[currentModuleIndex]?.title}
                                </Text>
                                <Text style={[styles.lessonTitle, { color: colors.text }]}>
                                    {currentLesson?.title}
                                </Text>
                            </View>
                            <View style={styles.durationBadge}>
                                <Ionicons name="time" size={14} color={colors.textSecondary} />
                                <Text style={[styles.durationText, { color: colors.textSecondary }]}>
                                    {currentLesson?.duration}
                                </Text>
                            </View>
                        </View>

                        {/* Lesson Content */}
                        <View style={styles.lessonContent}>
                            <Text style={[styles.contentText, { color: colors.text }]}>
                                {currentLesson?.content.replace(/^#+\s*/gm, '').replace(/\n/g, '\n\n')}
                            </Text>
                        </View>

                        {/* Key Points */}
                        <View style={[styles.keyPointsCard, { backgroundColor: colors.primaryLight }]}>
                            <View style={styles.keyPointsHeader}>
                                <Ionicons name="bulb" size={20} color={colors.primary} />
                                <Text style={[styles.keyPointsTitle, { color: colors.primary }]}>Key Takeaways</Text>
                            </View>
                            <View style={styles.keyPointsList}>
                                <View style={styles.keyPoint}>
                                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                                    <Text style={[styles.keyPointText, { color: colors.text }]}>
                                        Understand the core concepts
                                    </Text>
                                </View>
                                <View style={styles.keyPoint}>
                                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                                    <Text style={[styles.keyPointText, { color: colors.text }]}>
                                        Apply knowledge to real scenarios
                                    </Text>
                                </View>
                                <View style={styles.keyPoint}>
                                    <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                                    <Text style={[styles.keyPointText, { color: colors.text }]}>
                                        Practice with exercises
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Navigation Buttons */}
                    <View style={styles.navButtons}>
                        <TouchableOpacity
                            style={[styles.navButton, { backgroundColor: colors.surface, opacity: currentModuleIndex === 0 && currentLessonIndex === 0 ? 0.5 : 1 }]}
                            onPress={goToPrevLesson}
                            disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                        >
                            <Ionicons name="chevron-back" size={20} color={colors.text} />
                            <Text style={[styles.navButtonText, { color: colors.text }]}>Previous</Text>
                        </TouchableOpacity>

                        {isLessonComplete(currentLesson?.id || '') ? (
                            <TouchableOpacity
                                style={styles.completeButton}
                                onPress={goToNextLesson}
                            >
                                <LinearGradient
                                    colors={['#22c55e', '#16a34a']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.completeGradient}
                                >
                                    <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                                    <Text style={styles.completeButtonText}>Completed</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.markCompleteButton}
                                onPress={markComplete}
                            >
                                <LinearGradient
                                    colors={['#2563eb', '#4f46e5']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.completeGradient}
                                >
                                    <Text style={styles.completeButtonText}>Mark Complete</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#ffffff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.navButton, { backgroundColor: colors.surface }]}
                            onPress={goToNextLesson}
                        >
                            <Text style={[styles.navButtonText, { color: colors.text }]}>Next</Text>
                            <Ionicons name="chevron-forward" size={20} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* AI Tutor FAB */}
                <TouchableOpacity
                    style={[styles.aiFab, { backgroundColor: colors.primary }]}
                    onPress={() => setShowChat(!showChat)}
                >
                    <Ionicons name={showChat ? 'close' : 'chatbubbles'} size={24} color="#ffffff" />
                </TouchableOpacity>

                {/* AI Chat Modal */}
                {showChat && (
                    <Animated.View entering={FadeInDown.duration(300)} style={[styles.chatModal, { backgroundColor: colors.surface }]}>
                        <View style={styles.chatHeader}>
                            <View style={styles.chatHeaderLeft}>
                                <View style={[styles.aiAvatar, { backgroundColor: colors.primaryLight }]}>
                                    <Ionicons name="sparkles" size={20} color={colors.primary} />
                                </View>
                                <Text style={[styles.chatTitle, { color: colors.text }]}>AI Tutor</Text>
                            </View>
                            <TouchableOpacity onPress={() => setShowChat(false)}>
                                <Ionicons name="close" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.chatMessages} contentContainerStyle={styles.chatMessagesContent}>
                            {chatHistory.length === 0 && (
                                <View style={styles.chatEmpty}>
                                    <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
                                    <Text style={[styles.chatEmptyText, { color: colors.textSecondary }]}>
                                        Ask me anything about this lesson!
                                    </Text>
                                </View>
                            )}
                            {chatHistory.map((msg, index) => (
                                <View key={index} style={[styles.chatBubble, msg.role === 'user' ? styles.userBubble : styles.aiBubble]}>
                                    <Text style={[styles.chatBubbleText, { color: msg.role === 'user' ? '#ffffff' : colors.text }]}>
                                        {msg.text}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>

                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <View style={[styles.chatInputContainer, { borderTopColor: colors.border }]}>
                                <TextInput
                                    style={[styles.chatInput, { color: colors.text, backgroundColor: colors.surfaceVariant }]}
                                    placeholder="Ask a question..."
                                    placeholderTextColor={colors.textSecondary}
                                    value={chatMessage}
                                    onChangeText={setChatMessage}
                                    multiline
                                />
                                <TouchableOpacity onPress={sendChatMessage} style={[styles.sendButton, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="send" size={20} color="#ffffff" />
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </Animated.View>
                )}

                {/* Lesson Sidebar */}
                {showSidebar && (
                    <TouchableOpacity
                        style={styles.sidebarOverlay}
                        activeOpacity={1}
                        onPress={() => setShowSidebar(false)}
                    >
                        <Animated.View
                            entering={FadeInDown.duration(300)}
                            style={[styles.sidebar, { backgroundColor: colors.surface }]}
                            onStartShouldSetResponder={() => true}
                        >
                            <Text style={[styles.sidebarTitle, { color: colors.text }]}>Course Content</Text>
                            <ScrollView style={styles.sidebarScroll}>
                                {course.modules.map((module, mIndex) => (
                                    <View key={module.id} style={styles.moduleSection}>
                                        <Text style={[styles.moduleTitle, { color: colors.text }]}>
                                            {mIndex + 1}. {module.title}
                                        </Text>
                                        {module.lessons.map((lesson, lIndex) => (
                                            <TouchableOpacity
                                                key={lesson.id}
                                                style={[
                                                    styles.lessonItem,
                                                    currentLesson?.id === lesson.id && { backgroundColor: colors.primaryLight },
                                                ]}
                                                onPress={() => selectLesson(mIndex, lIndex)}
                                            >
                                                {isLessonComplete(lesson.id) ? (
                                                    <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                                                ) : (
                                                    <Ionicons name="play-circle" size={18} color={colors.textSecondary} />
                                                )}
                                                <Text
                                                    style={[
                                                        styles.lessonItemText,
                                                        { color: currentLesson?.id === lesson.id ? colors.primary : colors.text }
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {lesson.title}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ))}
                            </ScrollView>
                        </Animated.View>
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: spacing.md,
    },
    backButton: {
        marginTop: spacing.lg,
        padding: spacing.md,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.md,
    },
    progressBar: {
        flex: 1,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    lessonCard: {
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.md,
    },
    lessonHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    lessonNumber: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    lessonNumberText: {
        fontSize: 14,
        fontWeight: '700',
    },
    lessonMeta: {
        flex: 1,
    },
    moduleName: {
        fontSize: 12,
        marginBottom: 4,
    },
    lessonTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    durationText: {
        fontSize: 12,
    },
    lessonContent: {
        marginBottom: spacing.lg,
    },
    contentText: {
        fontSize: 16,
        lineHeight: 26,
    },
    keyPointsCard: {
        borderRadius: borderRadius.md,
        padding: spacing.md,
    },
    keyPointsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    keyPointsTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    keyPointsList: {
        gap: spacing.sm,
    },
    keyPoint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    keyPointText: {
        fontSize: 14,
        flex: 1,
    },
    navButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.lg,
        gap: spacing.sm,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        gap: spacing.xs,
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    markCompleteButton: {
        flex: 1,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    completeButton: {
        flex: 1,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    completeGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        gap: spacing.sm,
    },
    completeButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    aiFab: {
        position: 'absolute',
        bottom: 100,
        right: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.lg,
    },
    chatModal: {
        position: 'absolute',
        bottom: 170,
        left: spacing.md,
        right: spacing.md,
        height: height * 0.45,
        borderRadius: borderRadius.lg,
        ...shadows.lg,
    },
    chatHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderBottomWidth: 1,
    },
    chatHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    aiAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    chatMessages: {
        flex: 1,
    },
    chatMessagesContent: {
        padding: spacing.md,
    },
    chatEmpty: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    chatEmptyText: {
        fontSize: 14,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    chatBubble: {
        maxWidth: '80%',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    userBubble: {
        backgroundColor: '#2563eb',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: '#f1f5f9',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    chatBubbleText: {
        fontSize: 14,
        lineHeight: 20,
    },
    chatInputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: spacing.md,
        borderTopWidth: 1,
        gap: spacing.sm,
    },
    chatInput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: 14,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sidebarOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sidebar: {
        height: height * 0.6,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
    },
    sidebarTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: spacing.lg,
    },
    sidebarScroll: {
        flex: 1,
    },
    moduleSection: {
        marginBottom: spacing.lg,
    },
    moduleTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: spacing.sm,
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
        gap: spacing.sm,
        marginBottom: 4,
    },
    lessonItemText: {
        fontSize: 14,
        flex: 1,
    },
});
