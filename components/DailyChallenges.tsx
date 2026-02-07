import React, { useState } from 'react';
import { ArrowLeft, Trophy, Zap, Brain, Code, Lightbulb, Target } from 'lucide-react';

interface Challenge {
    id: string;
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    xp: number;
    icon: any;
    color: string;
}

const CHALLENGES: Challenge[] = [
    {
        id: 'c1',
        title: 'Fibonacci Sequence',
        description: 'Write a function to generate the first n numbers of the Fibonacci sequence using recursion.',
        difficulty: 'Medium',
        xp: 150,
        icon: Code,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'c2',
        title: 'React Component Debug',
        description: 'Identify and fix the performance bottleneck in the provided "HeavyList" component.',
        difficulty: 'Hard',
        xp: 300,
        icon: Zap,
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'c3',
        title: 'CSS Grid Layout',
        description: 'Create a responsive masonry layout using only CSS Grid and no JavaScript.',
        difficulty: 'Easy',
        xp: 100,
        icon: Target,
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'c4',
        title: 'Algorithm Optimization',
        description: 'Optimize a bubble sort algorithm to O(n) for best-case scenarios.',
        difficulty: 'Medium',
        xp: 200,
        icon: Brain,
        color: 'from-orange-500 to-red-500'
    },
    {
        id: 'c5',
        title: 'API Integration',
        description: 'Fetch data from a public API and display it with error handling and loading states.',
        difficulty: 'Easy',
        xp: 120,
        icon: Lightbulb,
        color: 'from-yellow-400 to-orange-500'
    }
];

const DailyChallenges = ({ onBack }: { onBack: () => void }) => {
    const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

    const handleCardClick = (id: string) => {
        setFlippedCardId(prev => prev === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-brand-100 dark:bg-brand-900/30 rounded-2xl mb-4 text-brand-600 dark:text-brand-400">
                        <Trophy size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Daily Challenges</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Sharpen your skills with these AI-generated tasks. Complete them to earn XP and maintain your streak!
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {CHALLENGES.map((challenge) => (
                        <div
                            key={challenge.id}
                            className={`relative h-80 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.34rem)] cursor-pointer group perspective-1000 transition-all duration-500 ${flippedCardId === challenge.id ? 'z-20 scale-110' : 'z-0 hover:scale-105'}`}
                            onClick={() => handleCardClick(challenge.id)}
                        >
                            <div
                                className={`relative w-full h-full transition-all duration-700 transform-style-3d ${flippedCardId === challenge.id ? 'rotate-y-180' : ''
                                    }`}
                            >
                                {/* Front of Card */}
                                <div className="absolute inset-0 w-full h-full backface-hidden">
                                    <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center hover:border-brand-500 dark:hover:border-brand-500 transition-colors">
                                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${challenge.color} flex items-center justify-center text-white mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                            <Trophy size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Mystery Challenge</h3>
                                        <p className="text-slate-500 dark:text-slate-400">Click to reveal</p>
                                        <div className="mt-6 px-4 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300">
                                            {challenge.difficulty} • {challenge.xp} XP
                                        </div>
                                    </div>
                                </div>

                                {/* Back of Card */}
                                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                                    <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-brand-500 p-8 flex flex-col relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${challenge.color}`} />

                                        <div className="flex items-center justify-between mb-6">
                                            <div className={`p-2 rounded-lg bg-gradient-to-br ${challenge.color} text-white`}>
                                                <challenge.icon size={24} />
                                            </div>
                                            <span className="px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {challenge.difficulty}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{challenge.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-auto">
                                            {challenge.description}
                                        </p>

                                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                +{challenge.xp} XP
                                            </div>
                                            <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                                                Start
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
            `}</style>
        </div>
    );
};

export default DailyChallenges;
