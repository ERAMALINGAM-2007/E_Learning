import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share2, TrendingUp, Award, BookOpen, Star, Zap } from 'lucide-react';

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    category: string;
    author: string;
    date: string;
    imageUrl: string;
    likes: number;
    comments: number;
    tags: string[];
}

const NEWS_FEED: NewsItem[] = [
    {
        id: '1',
        title: 'The Future of AI in Education: Personalized Learning Paths',
        summary: 'Discover how artificial intelligence is reshaping the classroom by creating tailored learning experiences for every student.',
        category: 'EdTech',
        author: 'Dr. Sarah Chen',
        date: '2 hours ago',
        imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
        likes: 124,
        comments: 45,
        tags: ['AI', 'Education', 'Future']
    },
    {
        id: '2',
        title: 'Top 10 Study Techniques for Retaining Complex Information',
        summary: 'Master the art of learning with these scientifically proven methods, including Spaced Repetition and the Feynman Technique.',
        category: 'Study Tips',
        author: 'Mark Johnson',
        date: '5 hours ago',
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
        likes: 89,
        comments: 23,
        tags: ['Productivity', 'Learning', 'Tips']
    },
    {
        id: '3',
        title: 'New Python Course Released: Data Science for Beginners',
        summary: 'Start your journey into data science with our comprehensive new course covering Pandas, NumPy, and Matplotlib.',
        category: 'New Course',
        author: 'NeuroLearn Team',
        date: '1 day ago',
        imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800',
        likes: 256,
        comments: 78,
        tags: ['Python', 'Data Science', 'Coding']
    },
    {
        id: '4',
        title: 'Understanding Quantum Computing: A Visual Guide',
        summary: 'Break down the complexities of qubits and superposition with our interactive visual guide to quantum mechanics.',
        category: 'Science',
        author: 'Alice Wong',
        date: '2 days ago',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
        likes: 150,
        comments: 34,
        tags: ['Quantum', 'Physics', 'Visuals']
    },
    {
        id: '5',
        title: 'The Rise of Gamification in Corporate Training',
        summary: 'How major companies are using game mechanics to boost employee engagement and retention rates during training.',
        category: 'Industry Trends',
        author: 'David Miller',
        date: '3 days ago',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
        likes: 92,
        comments: 18,
        tags: ['Gamification', 'Business', 'Training']
    }
];

const CommunityHighlight = ({ onBack }: { onBack: () => void }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Smooth Scroll Effect on Mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.opacity = '0';
            scrollContainerRef.current.style.transform = 'translateY(20px)';

            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                    scrollContainerRef.current.style.opacity = '1';
                    scrollContainerRef.current.style.transform = 'translateY(0)';
                }
            }, 100);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors mb-4 group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <Zap className="text-yellow-500 fill-yellow-500" /> Community Highlight
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            Stay updated with the latest educational trends, tips, and course releases.
                        </p>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg text-brand-600 dark:text-brand-400">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Trending</p>
                                <p className="font-bold text-slate-800 dark:text-white">#AI_Revolution</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                <Award size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Top Learner</p>
                                <p className="font-bold text-slate-800 dark:text-white">Alex_Dev</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" ref={scrollContainerRef}>
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        {NEWS_FEED.map((news, index) => (
                            <div
                                key={news.id}
                                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-all duration-300 group hover:-translate-y-1"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="md:flex">
                                    <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                                        <img
                                            src={news.imageUrl}
                                            alt={news.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {news.category}
                                        </div>
                                    </div>
                                    <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                                <span className="font-bold text-brand-600 dark:text-brand-400">{news.author}</span>
                                                <span>•</span>
                                                <span>{news.date}</span>
                                            </div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                {news.title}
                                            </h2>
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                                                {news.summary}
                                            </p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {news.tags.map(tag => (
                                                    <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md font-medium">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                            <div className="flex items-center gap-4">
                                                <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-medium">
                                                    <Heart size={18} /> {news.likes}
                                                </button>
                                                <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors text-sm font-medium">
                                                    <MessageCircle size={18} /> {news.comments}
                                                </button>
                                            </div>
                                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Weekly Leaderboard */}
                        <div className="bg-gradient-to-br from-brand-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                                <Award className="text-yellow-300" /> Weekly Top Learners
                            </h3>
                            <div className="space-y-4 relative z-10">
                                {[1, 2, 3].map((rank) => (
                                    <div key={rank} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                        <div className="font-bold text-2xl w-8 text-center opacity-80">#{rank}</div>
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                                            {String.fromCharCode(64 + rank)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">User_{rank * 123}</p>
                                            <p className="text-xs opacity-70">{1500 - rank * 100} XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-2 bg-white text-brand-700 rounded-lg font-bold text-sm hover:bg-brand-50 transition-colors">
                                View Full Leaderboard
                            </button>
                        </div>

                        {/* Recommended Topics */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <BookOpen size={20} className="text-brand-500" /> Recommended Topics
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['Machine Learning', 'Web Development', 'UX Design', 'Blockchain', 'Cybersecurity', 'Cloud Computing', 'Soft Skills'].map((topic) => (
                                    <button
                                        key={topic}
                                        className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700 hover:bg-brand-50 dark:hover:bg-brand-900/30 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg text-sm transition-colors border border-slate-200 dark:border-slate-600 hover:border-brand-200 dark:hover:border-brand-700"
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityHighlight;
