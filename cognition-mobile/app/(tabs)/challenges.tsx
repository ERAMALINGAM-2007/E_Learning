// Daily Challenges Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Animated, {
    FadeInDown,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius } from '../../src/theme';

const { width } = Dimensions.get('window');

interface Challenge {
    id: string;
    title: string;
    description: string;
    xp: number;
    icon: string;
    color: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    timeLimit: string;
    completed: boolean;
}

const dailyChallenges: Challenge[] = [
    {
        id: '1',
        title: 'Complete a Lesson',
        description: 'Finish any lesson from your enrolled courses',
        xp: 50,
        icon: 'book',
        color: '#22c55e',
        difficulty: 'Easy',
        timeLimit: '24h',
        completed: false,
    },
    {
        id: '2',
        title: 'Win a Memory Game',
        description: 'Complete the Memory Match game with under 20 moves',
        xp: 100,
        icon: 'grid',
        color: '#8b5cf6',
        difficulty: 'Medium',
        timeLimit: '24h',
        completed: false,
    },
    {
        id: '3',
        title: 'Study Streak',
        description: 'Maintain your learning streak for 3 consecutive days',
        xp: 150,
        icon: 'flame',
        color: '#f59e0b',
        difficulty: 'Medium',
        timeLimit: '72h',
        completed: true,
    },
    {
        id: '4',
        title: 'Course Master',
        description: 'Complete all lessons in a single course',
        xp: 500,
        icon: 'trophy',
        color: '#ec4899',
        difficulty: 'Hard',
        timeLimit: '7d',
        completed: false,
    },
    {
        id: '5',
        title: 'Quiz Champion',
        description: 'Score 100% on any course quiz',
        xp: 200,
        icon: 'checkmark-circle',
        color: '#06b6d4',
        difficulty: 'Hard',
        timeLimit: '24h',
        completed: false,
    },
    {
        id: '6',
        title: 'Community Helper',
        description: 'Share a helpful tip in the community',
        xp: 75,
        icon: 'people',
        color: '#3b82f6',
        difficulty: 'Easy',
        timeLimit: '24h',
        completed: false,
    },
];

function ChallengeCard({ challenge, index, isFlipped, onFlip }: {
    challenge: Challenge;
    index: number;
    isFlipped: boolean;
    onFlip: () => void;
}) {
    const { colors } = useTheme();
    const flipProgress = useSharedValue(isFlipped ? 1 : 0);

    React.useEffect(() => {
        flipProgress.value = withSpring(isFlipped ? 1 : 0, { damping: 15 });
    }, [isFlipped]);

    const frontCardStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 1000 },
            { rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg` },
            { scale: interpolate(flipProgress.value, [0, 0.5, 1], [1, 1.05, 1]) },
        ],
        opacity: interpolate(flipProgress.value, [0, 0.5, 1], [1, 0, 0]),
    }));

    const backCardStyle = useAnimatedStyle(() => ({
        transform: [
            { perspective: 1000 },
            { rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg` },
            { scale: interpolate(flipProgress.value, [0, 0.5, 1], [1, 1.05, 1]) },
        ],
        opacity: interpolate(flipProgress.value, [0, 0.5, 1], [0, 0, 1]),
    }));

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return '#22c55e';
            case 'Medium': return '#f59e0b';
            case 'Hard': return '#ef4444';
            default: return colors.primary;
        }
    };

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
            <TouchableOpacity
                style={styles.challengeCardContainer}
                onPress={onFlip}
                activeOpacity={0.9}
            >
                {/* Front of card */}
                <Animated.View style={[styles.challengeCard, frontCardStyle, { backgroundColor: colors.surface }]}>
                    <View style={[styles.challengeIcon, { backgroundColor: challenge.color + '20' }]}>
                        <Ionicons name={challenge.icon as any} size={28} color={challenge.color} />
                    </View>

                    <View style={styles.challengeContent}>
                        <View style={styles.challengeHeader}>
                            <Text style={[styles.challengeTitle, { color: colors.text }]} numberOfLines={1}>
                                {challenge.title}
                            </Text>
                            {challenge.completed && (
                                <View style={[styles.completedBadge, { backgroundColor: '#22c55e' }]}>
                                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                                </View>
                            )}
                        </View>

                        <View style={styles.challengeMeta}>
                            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) + '20' }]}>
                                <Text style={[styles.difficultyText, { color: getDifficultyColor(challenge.difficulty) }]}>
                                    {challenge.difficulty}
                                </Text>
                            </View>
                            <View style={styles.xpBadge}>
                                <Ionicons name="star" size={12} color="#f59e0b" />
                                <Text style={[styles.xpText, { color: colors.textSecondary }]}>{challenge.xp} XP</Text>
                            </View>
                        </View>
                    </View>

                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Animated.View>

                {/* Back of card */}
                <Animated.View style={[styles.challengeCard, styles.challengeCardBack, backCardStyle, { backgroundColor: colors.surface }]}>
                    <Text style={[styles.backTitle, { color: colors.text }]}>{challenge.title}</Text>
                    <Text style={[styles.backDescription, { color: colors.textSecondary }]}>
                        {challenge.description}
                    </Text>

                    <View style={styles.backMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="time" size={16} color={colors.textSecondary} />
                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{challenge.timeLimit}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="star" size={16} color="#f59e0b" />
                            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{challenge.xp} XP</Text>
                        </View>
                    </View>

                    {!challenge.completed ? (
                        <TouchableOpacity style={styles.startButton}>
                            <LinearGradient
                                colors={[challenge.color, challenge.color + 'cc']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.startButtonGradient}
                            >
                                <Text style={styles.startButtonText}>Start Challenge</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <View style={[styles.completedBanner, { backgroundColor: '#22c55e20' }]}>
                            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                            <Text style={{ color: '#22c55e', fontWeight: '600' }}>Completed!</Text>
                        </View>
                    )}
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function ChallengesScreen() {
    const { colors, isDark, toggleTheme } = useTheme();
    const [flippedCard, setFlippedCard] = useState<string | null>(null);

    const completedCount = dailyChallenges.filter(c => c.completed).length;
    const totalXP = dailyChallenges.filter(c => c.completed).reduce((sum, c) => sum + c.xp, 0);

    const handleFlip = (id: string) => {
        setFlippedCard(flippedCard === id ? null : id);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Daily Challenges 🏆</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                        Complete challenges to earn XP
                    </Text>
                </View>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                    <Ionicons
                        name={isDark ? 'sunny' : 'moon'}
                        size={22}
                        color={isDark ? '#fbbf24' : '#6366f1'}
                    />
                </TouchableOpacity>
            </View>

            {/* Progress Summary */}
            <View style={[styles.progressSummary, { backgroundColor: colors.surface }]}>
                <View style={styles.progressItem}>
                    <Text style={[styles.progressValue, { color: colors.primary }]}>
                        {completedCount}/{dailyChallenges.length}
                    </Text>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Completed</Text>
                </View>
                <View style={[styles.progressDivider, { backgroundColor: colors.border }]} />
                <View style={styles.progressItem}>
                    <Text style={[styles.progressValue, { color: '#f59e0b' }]}>{totalXP}</Text>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>XP Earned</Text>
                </View>
                <View style={[styles.progressDivider, { backgroundColor: colors.border }]} />
                <View style={styles.progressItem}>
                    <Text style={[styles.progressValue, { color: '#22c55e' }]}>23:45:12</Text>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Time Left</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Challenges</Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                    Tap a challenge to view details
                </Text>

                {dailyChallenges.map((challenge, index) => (
                    <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        index={index}
                        isFlipped={flippedCard === challenge.id}
                        onFlip={() => handleFlip(challenge.id)}
                    />
                ))}
            </ScrollView>
        </View>
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
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
    },
    headerSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    themeButton: {
        padding: spacing.sm,
    },
    progressSummary: {
        flexDirection: 'row',
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        justifyContent: 'space-around',
    },
    progressItem: {
        alignItems: 'center',
    },
    progressValue: {
        fontSize: 24,
        fontWeight: '800',
    },
    progressLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    progressDivider: {
        width: 1,
        height: '100%',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: spacing.md,
    },
    challengeCardContainer: {
        marginBottom: spacing.md,
        height: 80,
    },
    challengeCard: {
        position: 'absolute',
        width: '100%',
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        backfaceVisibility: 'hidden',
    },
    challengeCardBack: {
        flexDirection: 'column',
        alignItems: 'stretch',
        height: 'auto',
        minHeight: 160,
    },
    challengeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    challengeContent: {
        flex: 1,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    challengeTitle: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    completedBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    challengeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginTop: spacing.xs,
    },
    difficultyBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: '600',
    },
    xpBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    xpText: {
        fontSize: 12,
        fontWeight: '500',
    },
    backTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.sm,
    },
    backDescription: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    backMeta: {
        flexDirection: 'row',
        gap: spacing.lg,
        marginBottom: spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 14,
    },
    startButton: {
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    startButtonGradient: {
        paddingVertical: spacing.sm,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    completedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
});
