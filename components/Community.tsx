import React from 'react';
import { ArrowLeft, Users, MessageSquare, Heart, Share2, TrendingUp, BookOpen, Award } from 'lucide-react';

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    category: string;
    author: string;
    date: string;
    image: string;
    likes: number;
    comments: number;
}

const NEWS_FEED: NewsItem[] = [
    {
        id: 'n1',
        title: 'The Future of AI in Education',
        summary: 'How artificial intelligence is personalizing learning paths for students worldwide. New studies show a 40% increase in retention rates.',
        category: 'Technology',
        author: 'Dr. Sarah Chen',
        date: '2 hours ago',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
        likes: 1240,
        comments: 85
    },
    {
        id: 'n2',
        title: 'Student Success Story: From Novice to Pro',
        summary: 'Meet James, a former chef who switched careers to Full Stack Development in just 6 months using our platform.',
        category: 'Inspiration',
        author: 'Community Team',
        date: '5 hours ago',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
        likes: 892,
        comments: 42
    },
    {
        id: 'n3',
        title: 'Top 10 Study Techniques for 2025',
        summary: 'Experts share the most effective methods for deep work and memory retention in the digital age.',
        category: 'Tips & Tricks',
        author: 'Learning Lab',
        date: '1 day ago',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
        likes: 2100,
        comments: 156
    },
    {
        id: 'n4',
        title: 'New Course Launch: Quantum Computing',
        summary: 'Dive into the world of qubits and superposition. Our new advanced module is now live for all Pro members.',
        category: 'Announcement',
        author: 'Curriculum Team',
        date: '2 days ago',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
        likes: 3400,
        comments: 230
    }
];

const Community = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Community Hub</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Latest news, success stories, and educational updates.
                        </p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30">
                        <MessageSquare size={20} />
                        Start Discussion
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        {NEWS_FEED.map((news) => (
                            <div key={news.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors group">
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={news.image}
                                        alt={news.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                        {news.category}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-4 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="font-medium text-brand-600 dark:text-brand-400">{news.author}</span>
                                        <span>•</span>
                                        <span>{news.date}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-brand-600 transition-colors">
                                        {news.title}
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                        {news.summary}
                                    </p>
                                    <div className="flex items-center gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                                        <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors">
                                            <Heart size={20} />
                                            <span className="font-medium">{news.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors">
                                            <MessageSquare size={20} />
                                            <span className="font-medium">{news.comments}</span>
                                        </button>
                                        <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors ml-auto">
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="text-brand-600" size={20} />
                                Trending Topics
                            </h3>
                            <div className="space-y-4">
                                {['#MachineLearning', '#WebDev', '#StudyTips', '#CareerGrowth', '#Python'].map((tag) => (
                                    <div key={tag} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-slate-600 dark:text-slate-400 group-hover:text-brand-600 transition-colors">{tag}</span>
                                        <span className="text-xs text-slate-400">2.4k posts</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <Award className="mb-4" size={32} />
                                <h3 className="font-bold text-xl mb-2">Weekly Leaderboard</h3>
                                <p className="text-brand-100 text-sm mb-6">Compete with others and earn your spot at the top!</p>
                                <button className="w-full py-2 bg-white text-brand-600 rounded-lg font-bold hover:bg-brand-50 transition-colors">
                                    View Rankings
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-12 -mb-12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Community;
