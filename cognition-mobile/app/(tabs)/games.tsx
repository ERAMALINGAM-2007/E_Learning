// Games Screen - Game Center
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { spacing, borderRadius } from '../../src/theme';

const { width } = Dimensions.get('window');

interface Game {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    gradient: [string, string];
}

const games: Game[] = [
    {
        id: 'memory',
        title: 'Memory Match',
        description: 'Test your memory by matching pairs of cards',
        icon: 'grid',
        color: '#8b5cf6',
        gradient: ['#8b5cf6', '#6366f1'],
    },
    {
        id: 'quiz',
        title: 'Quick Quiz',
        description: 'Answer rapid-fire questions to earn XP',
        icon: 'help-circle',
        color: '#ec4899',
        gradient: ['#ec4899', '#f43f5e'],
    },
    {
        id: 'word',
        title: 'Word Scramble',
        description: 'Unscramble words related to your courses',
        icon: 'text',
        color: '#06b6d4',
        gradient: ['#06b6d4', '#0ea5e9'],
    },
    {
        id: 'typing',
        title: 'Speed Type',
        description: 'Improve your typing speed and accuracy',
        icon: 'keypad',
        color: '#f59e0b',
        gradient: ['#f59e0b', '#f97316'],
    },
    {
        id: 'puzzle',
        title: 'Code Puzzle',
        description: 'Solve coding puzzles to sharpen your skills',
        icon: 'code-slash',
        color: '#22c55e',
        gradient: ['#22c55e', '#10b981'],
    },
    {
        id: 'trivia',
        title: 'Tech Trivia',
        description: 'Test your knowledge of tech and programming',
        icon: 'bulb',
        color: '#3b82f6',
        gradient: ['#3b82f6', '#2563eb'],
    },
];

// Simple Memory Game Component
function MemoryGame({ onClose }: { onClose: () => void }) {
    const { colors } = useTheme();
    const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    React.useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        const emojis = ['🎓', '📚', '💻', '🎨', '🎵', '🎮', '🔬', '🚀'];
        const shuffledCards = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                flipped: false,
                matched: false,
            }));
        setCards(shuffledCards);
        setSelectedCards([]);
        setMoves(0);
        setGameComplete(false);
    };

    const handleCardPress = (index: number) => {
        if (selectedCards.length === 2) return;
        if (cards[index].flipped || cards[index].matched) return;

        const newCards = [...cards];
        newCards[index].flipped = true;
        setCards(newCards);

        const newSelected = [...selectedCards, index];
        setSelectedCards(newSelected);

        if (newSelected.length === 2) {
            setMoves(m => m + 1);

            if (newCards[newSelected[0]].emoji === newCards[newSelected[1]].emoji) {
                // Match found
                setTimeout(() => {
                    const matchedCards = [...newCards];
                    matchedCards[newSelected[0]].matched = true;
                    matchedCards[newSelected[1]].matched = true;
                    setCards(matchedCards);
                    setSelectedCards([]);

                    if (matchedCards.every(c => c.matched)) {
                        setGameComplete(true);
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    const resetCards = [...newCards];
                    resetCards[newSelected[0]].flipped = false;
                    resetCards[newSelected[1]].flipped = false;
                    setCards(resetCards);
                    setSelectedCards([]);
                }, 1000);
            }
        }
    };

    return (
        <View style={[styles.gameContainer, { backgroundColor: colors.background }]}>
            <View style={styles.gameHeader}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.gameTitle, { color: colors.text }]}>Memory Match</Text>
                <TouchableOpacity onPress={initGame} style={styles.restartButton}>
                    <Ionicons name="refresh" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
                <View style={[styles.statBadge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.statText, { color: colors.primary }]}>Moves: {moves}</Text>
                </View>
            </View>

            <View style={styles.cardGrid}>
                {cards.map((card, index) => (
                    <TouchableOpacity
                        key={card.id}
                        style={[
                            styles.memoryCard,
                            { backgroundColor: card.flipped || card.matched ? colors.primary : colors.surface },
                        ]}
                        onPress={() => handleCardPress(index)}
                        activeOpacity={0.8}
                    >
                        {(card.flipped || card.matched) ? (
                            <Text style={styles.cardEmoji}>{card.emoji}</Text>
                        ) : (
                            <Ionicons name="help" size={32} color={colors.textSecondary} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {gameComplete && (
                <Animated.View entering={ZoomIn} style={styles.completeOverlay}>
                    <View style={[styles.completeCard, { backgroundColor: colors.surface }]}>
                        <Text style={styles.celebrationEmoji}>🎉</Text>
                        <Text style={[styles.completeTitle, { color: colors.text }]}>Congratulations!</Text>
                        <Text style={[styles.completeSubtitle, { color: colors.textSecondary }]}>
                            Completed in {moves} moves
                        </Text>
                        <TouchableOpacity onPress={initGame} style={styles.playAgainButton}>
                            <LinearGradient
                                colors={['#2563eb', '#4f46e5']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.playAgainGradient}
                            >
                                <Text style={styles.playAgainText}>Play Again</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
}

export default function GamesScreen() {
    const { colors, isDark, toggleTheme } = useTheme();
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    const renderGameModal = () => {
        if (selectedGame === 'memory') {
            return (
                <Modal visible={true} animationType="slide" presentationStyle="fullScreen">
                    <MemoryGame onClose={() => setSelectedGame(null)} />
                </Modal>
            );
        }
        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Game Center 🎮</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                        Learn while having fun!
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

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.gamesGrid}>
                    {games.map((game, index) => (
                        <Animated.View
                            key={game.id}
                            entering={FadeInDown.delay(index * 100).duration(400)}
                            style={styles.gameCardWrapper}
                        >
                            <TouchableOpacity
                                style={styles.gameCard}
                                onPress={() => setSelectedGame(game.id)}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={game.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.gameCardGradient}
                                >
                                    <View style={styles.gameIconContainer}>
                                        <Ionicons name={game.icon as any} size={32} color="#ffffff" />
                                    </View>
                                    <Text style={styles.gameCardTitle}>{game.title}</Text>
                                    <Text style={styles.gameCardDescription} numberOfLines={2}>
                                        {game.description}
                                    </Text>
                                    <View style={styles.playButton}>
                                        <Text style={styles.playButtonText}>Play Now</Text>
                                        <Ionicons name="play" size={16} color="#ffffff" />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

                {/* Coming Soon */}
                <View style={styles.comingSoonSection}>
                    <Text style={[styles.comingSoonTitle, { color: colors.textSecondary }]}>
                        More games coming soon! 🚀
                    </Text>
                </View>
            </ScrollView>

            {renderGameModal()}
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: 100,
    },
    gamesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    gameCardWrapper: {
        width: (width - spacing.lg * 2 - spacing.md) / 2,
    },
    gameCard: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    gameCardGradient: {
        padding: spacing.md,
        minHeight: 180,
    },
    gameIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    gameCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: spacing.xs,
    },
    gameCardDescription: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: spacing.md,
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 'auto',
    },
    playButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
    comingSoonSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    comingSoonTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    // Memory Game styles
    gameContainer: {
        flex: 1,
    },
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    closeButton: {
        padding: spacing.sm,
    },
    gameTitle: {
        fontSize: 24,
        fontWeight: '700',
    },
    restartButton: {
        padding: spacing.sm,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: spacing.md,
    },
    statBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
    },
    statText: {
        fontSize: 16,
        fontWeight: '600',
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: spacing.md,
        gap: spacing.sm,
        justifyContent: 'center',
    },
    memoryCard: {
        width: (width - spacing.md * 2 - spacing.sm * 3) / 4,
        aspectRatio: 1,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardEmoji: {
        fontSize: 32,
    },
    completeOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    completeCard: {
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        margin: spacing.lg,
    },
    celebrationEmoji: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    completeTitle: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: spacing.sm,
    },
    completeSubtitle: {
        fontSize: 16,
        marginBottom: spacing.lg,
    },
    playAgainButton: {
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    playAgainGradient: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
    },
    playAgainText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});
