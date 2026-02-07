import React from 'react';

const TECH_STACK = [
    // Row 1
    'OpenAI', 'Gemini', 'TensorFlow', 'PyTorch', 'Python',
    'React', 'Next.js', 'TypeScript', 'Node.js', 'AWS',
    'Docker', 'Kubernetes', 'Rust', 'Go', 'NVIDIA',
    // Row 2
    'Vercel', 'Figma', 'Git', 'GitHub', 'MongoDB',
    'PostgreSQL', 'Redis', 'GraphQL', 'Flutter', 'Swift',
    'Android', 'iOS', 'Linux', 'Stripe', 'Supabase'
];

const ROW_1 = TECH_STACK.slice(0, 15);
const ROW_2 = TECH_STACK.slice(15);

const TechItem: React.FC<{ name: string }> = ({ name }) => (
    <div className="flex items-center justify-center px-8 py-4 mx-6 bg-white/10 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-xl hover:bg-white/20 dark:hover:bg-slate-700/50 transition-all duration-300 group cursor-default min-w-[140px]">
        <span className="text-slate-700 dark:text-slate-200 font-bold text-lg whitespace-nowrap group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {name}
        </span>
    </div>
);

const MarqueeRow = ({ items, reverse = false }: { items: string[], reverse?: boolean }) => (
    <div className="flex relative overflow-hidden w-full group/marquee">
        <div className={`flex shrink-0 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} group-hover/marquee:[animation-play-state:paused] py-4`}>
            {items.map((tech, i) => <TechItem key={`orig-${i}`} name={tech} />)}
        </div>
        <div className={`flex shrink-0 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} group-hover/marquee:[animation-play-state:paused] py-4`}>
            {items.map((tech, i) => <TechItem key={`dup-${i}`} name={tech} />)}
        </div>
    </div>
);

const TechStackMarquee = () => {
    return (
        <div className="w-full py-16 overflow-hidden relative z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-slate-50 dark:from-slate-950 dark:via-transparent dark:to-slate-950 z-10 pointer-events-none" />

            {/* Row 1 - Scroll Left */}
            <div className="mb-12">
                <MarqueeRow items={ROW_1} />
            </div>

            {/* Row 2 - Scroll Right */}
            <div>
                <MarqueeRow items={ROW_2} reverse />
            </div>
        </div>
    );
};

export default TechStackMarquee;
