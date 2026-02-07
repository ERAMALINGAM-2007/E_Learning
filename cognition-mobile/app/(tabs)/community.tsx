// Community Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/context/AuthContext';
import { spacing, borderRadius, shadows } from '../../src/theme';

interface CommunityPost {
    id: string;
    author: {
        name: string;
        avatar: string;
        badge: string;
    };
    content: string;
    likes: number;
    comments: number;
    timeAgo: string;
    liked: boolean;
}

const mockPosts: CommunityPost[] = [
    {
        id: '1',
        author: {
            name: 'Sarah Chen',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=8b5cf6&color=fff',
            badge: 'Top Contributor',
        },
        content: 'Just completed my first ML course! The AI tutor feature is amazing for explaining complex concepts. Highly recommend the "Introduction to Machine Learning" course! 🚀',
        likes: 42,
        comments: 8,
        timeAgo: '2h ago',
        liked: false,
    },
    {
        id: '2',
        author: {
            name: 'Alex Rivera',
            avatar: 'https://ui-avatars.com/api/?name=Alex+Rivera&background=22c55e&color=fff',
            badge: 'Course Creator',
        },
        content: 'Pro tip: Use the flashcard feature after each lesson to reinforce your learning. It helped me retain 80% more information! 📚',
        likes: 128,
        comments: 23,
        timeAgo: '5h ago',
        liked: true,
    },
    {
        id: '3',
        author: {
            name: 'Jordan Park',
            avatar: 'https://ui-avatars.com/api/?name=Jordan+Park&background=f59e0b&color=fff',
            badge: 'Rising Star',
        },
        content: 'Day 30 of my coding journey! The gamification really keeps me motivated. Who else is on a learning streak? 🔥',
        likes: 89,
        comments: 31,
        timeAgo: '1d ago',
        liked: false,
    },
    {
        id: '4',
        author: {
            name: 'Emma Wilson',
            avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=ec4899&color=fff',
            badge: 'Community Leader',
        },
        content: 'Looking for study buddies for the Advanced React course! Drop a comment if you want to join our Discord group 💪',
        likes: 56,
        comments: 47,
        timeAgo: '2d ago',
        liked: false,
    },
];

const featuredMembers = [
    { name: 'Sarah C.', avatar: 'https://ui-avatars.com/api/?name=Sarah+C&background=8b5cf6&color=fff', xp: 15420 },
    { name: 'Mike T.', avatar: 'https://ui-avatars.com/api/?name=Mike+T&background=22c55e&color=fff', xp: 12890 },
    { name: 'Lisa K.', avatar: 'https://ui-avatars.com/api/?name=Lisa+K&background=ec4899&color=fff', xp: 11250 },
    { name: 'James D.', avatar: 'https://ui-avatars.com/api/?name=James+D&background=f59e0b&color=fff', xp: 10800 },
];

export default function CommunityScreen() {
    const { colors, isDark, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [posts, setPosts] = useState(mockPosts);
    const [newPost, setNewPost] = useState('');

    const handleLike = (postId: string) => {
        setPosts(prev => prev.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    liked: !post.liked,
                    likes: post.liked ? post.likes - 1 : post.likes + 1,
                };
            }
            return post;
        }));
    };

    const getBadgeColor = (badge: string) => {
        switch (badge) {
            case 'Top Contributor': return '#8b5cf6';
            case 'Course Creator': return '#22c55e';
            case 'Rising Star': return '#f59e0b';
            case 'Community Leader': return '#ec4899';
            default: return colors.primary;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Community 👥</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                        Connect with fellow learners
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
                {/* Featured Members */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Learners</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.membersScroll}
                    >
                        {featuredMembers.map((member, index) => (
                            <View key={index} style={[styles.memberCard, { backgroundColor: colors.surface }]}>
                                <View style={styles.memberRank}>
                                    <Text style={[styles.rankText, { color: colors.primary }]}>#{index + 1}</Text>
                                </View>
                                <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                                <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                                <View style={styles.xpContainer}>
                                    <Ionicons name="star" size={12} color="#f59e0b" />
                                    <Text style={[styles.xpText, { color: colors.textSecondary }]}>
                                        {member.xp.toLocaleString()} XP
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* New Post Input */}
                <View style={[styles.newPostContainer, { backgroundColor: colors.surface }]}>
                    <Image
                        source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff' }}
                        style={styles.userAvatar}
                    />
                    <TextInput
                        style={[styles.newPostInput, { color: colors.text }]}
                        placeholder="Share something with the community..."
                        placeholderTextColor={colors.textSecondary}
                        value={newPost}
                        onChangeText={setNewPost}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.postButton, { opacity: newPost.trim() ? 1 : 0.5 }]}
                        disabled={!newPost.trim()}
                    >
                        <Ionicons name="send" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Posts Feed */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Posts</Text>
                    {posts.map((post, index) => (
                        <Animated.View key={post.id} entering={FadeInDown.delay(index * 100).duration(400)}>
                            <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
                                <View style={styles.postHeader}>
                                    <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
                                    <View style={styles.authorInfo}>
                                        <Text style={[styles.authorName, { color: colors.text }]}>{post.author.name}</Text>
                                        <View style={styles.authorMeta}>
                                            <View style={[styles.badge, { backgroundColor: getBadgeColor(post.author.badge) + '20' }]}>
                                                <Text style={[styles.badgeText, { color: getBadgeColor(post.author.badge) }]}>
                                                    {post.author.badge}
                                                </Text>
                                            </View>
                                            <Text style={[styles.timeAgo, { color: colors.textSecondary }]}>{post.timeAgo}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>

                                <View style={styles.postActions}>
                                    <TouchableOpacity
                                        style={styles.actionButton}
                                        onPress={() => handleLike(post.id)}
                                    >
                                        <Ionicons
                                            name={post.liked ? 'heart' : 'heart-outline'}
                                            size={20}
                                            color={post.liked ? '#ef4444' : colors.textSecondary}
                                        />
                                        <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                                            {post.likes}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
                                        <Text style={[styles.actionText, { color: colors.textSecondary }]}>
                                            {post.comments}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    ))}
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
        paddingBottom: 100,
    },
    section: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    membersScroll: {
        gap: spacing.md,
        paddingRight: spacing.lg,
    },
    memberCard: {
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        width: 100,
        ...shadows.sm,
    },
    memberRank: {
        position: 'absolute',
        top: spacing.xs,
        left: spacing.xs,
    },
    rankText: {
        fontSize: 12,
        fontWeight: '700',
    },
    memberAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: spacing.sm,
    },
    memberName: {
        fontSize: 13,
        fontWeight: '600',
    },
    xpContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    xpText: {
        fontSize: 11,
    },
    newPostContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        gap: spacing.md,
        ...shadows.sm,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    newPostInput: {
        flex: 1,
        fontSize: 15,
        minHeight: 40,
        maxHeight: 100,
    },
    postButton: {
        padding: spacing.sm,
    },
    postCard: {
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    postHeader: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    authorAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: spacing.md,
    },
    authorInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    authorName: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    authorMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    timeAgo: {
        fontSize: 12,
    },
    postContent: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: spacing.md,
    },
    postActions: {
        flexDirection: 'row',
        gap: spacing.lg,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
