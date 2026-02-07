import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
}

const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "The Future of AI in Education",
        excerpt: "How artificial intelligence is reshaping the way we learn and teach, making education more personalized and accessible than ever before. We explore the ethical implications, the potential for personalized curriculums, and the role of AI tutors in bridging the gap between students and teachers.",
        author: "Dr. Sarah Chen",
        date: "Nov 24, 2025",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "Mastering React Server Components",
        excerpt: "A deep dive into the architecture of React Server Components and how they improve performance and user experience in modern web apps. Learn about streaming, suspense boundaries, and how to effectively mix server and client components for optimal results.",
        author: "Alex Rivera",
        date: "Nov 22, 2025",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "The Psychology of Gamified Learning",
        excerpt: "Understanding the behavioral science behind gamification and why it's so effective at keeping students engaged and motivated. We analyze reward systems, progress tracking, and the impact of healthy competition on learning outcomes.",
        author: "Prof. James Wilson",
        date: "Nov 20, 2025",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Building Scalable Systems",
        excerpt: "Key principles for designing distributed systems that can handle millions of users. From database sharding to caching strategies and microservices architecture, we cover the essential patterns for high-scale engineering.",
        author: "David Kim",
        date: "Nov 18, 2025",
        readTime: "10 min read"
    },
    {
        id: 5,
        title: "UI/UX Trends for 2026",
        excerpt: "A look ahead at the emerging design trends that will define the next generation of digital products. Glassmorphism, neomorphism, and the return of skeuomorphism in VR/AR interfaces.",
        author: "Emily Zhang",
        date: "Nov 15, 2025",
        readTime: "4 min read"
    },
    {
        id: 6,
        title: "The State of WebAssembly",
        excerpt: "How Wasm is enabling high-performance applications in the browser, from video editing to 3D rendering and beyond. We verify the current ecosystem and future proposals.",
        author: "Michael Brown",
        date: "Nov 12, 2025",
        readTime: "7 min read"
    }
];

interface BlogCardProps {
    post: BlogPost;
    variant: 'dimmed' | 'visible';
    isHovered: boolean;
    onHover: (id: number | null) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, variant, isHovered, onHover }) => {
    const isVisible = variant === 'visible';

    return (
        <div
            onMouseEnter={() => onHover(post.id)}
            onMouseLeave={() => onHover(null)}
            className={`relative rounded-2xl overflow-hidden h-[300px] p-8 flex flex-col transition-all duration-300 transform ${isHovered ? 'scale-105' : 'scale-100'
                } ${isVisible
                    ? 'bg-white dark:bg-slate-900 shadow-2xl border border-brand-200 dark:border-brand-800'
                    : 'bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800'
                }`}
        >
            {/* Highlight Effect for Visible Variant */}
            {isVisible && (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-900/10 dark:to-transparent pointer-events-none" />
            )}

            <div className={`relative z-10 flex flex-col h-full ${isVisible ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                <div className={`flex items-center gap-4 text-xs mb-6 ${isVisible ? 'text-brand-600 dark:text-brand-400 font-bold' : 'text-slate-500'}`}>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                </div>

                <h3 className={`text-2xl font-bold mb-4 leading-tight ${isVisible ? 'text-slate-900 dark:text-white' : 'text-slate-700'}`}>
                    {post.title}
                </h3>

                <p className={`leading-relaxed text-sm flex-1 ${isVisible ? 'text-slate-800 dark:text-slate-300' : 'text-slate-600'}`}>
                    {post.excerpt}
                </p>

                <div className={`mt-6 pt-6 border-t flex items-center gap-3 ${isVisible ? 'border-brand-100 dark:border-brand-900/30' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isVisible ? 'bg-brand-100 dark:bg-brand-900/50' : 'bg-slate-200 dark:bg-slate-800'}`}>
                        <User size={14} className={isVisible ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'} />
                    </div>
                    <span className={`text-xs font-medium ${isVisible ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                        {post.author}
                    </span>
                </div>
            </div>
        </div>
    );
};

const Blog = ({ onBack }: { onBack: () => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        };

        container.addEventListener('mousemove', handleMouseMove);
        return () => container.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                        Latest Insights
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Explore our latest articles with the magic spotlight.
                    </p>
                </div>

                <div
                    ref={containerRef}
                    className="relative"
                >
                    {/* Layer 1: Dimmed / Hidden Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {BLOG_POSTS.map((post) => (
                            <BlogCard
                                key={post.id}
                                post={post}
                                variant="dimmed"
                                isHovered={hoveredId === post.id}
                                onHover={setHoveredId}
                            />
                        ))}
                    </div>

                    {/* Layer 2: Visible / Highlighted Content (Masked) */}
                    <div
                        className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pointer-events-none"
                        style={{
                            maskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
                            WebkitMaskImage: `radial-gradient(circle 250px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
                        }}
                    >
                        {BLOG_POSTS.map((post) => (
                            <BlogCard
                                key={post.id}
                                post={post}
                                variant="visible"
                                isHovered={hoveredId === post.id}
                                onHover={setHoveredId}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};



export default Blog;
