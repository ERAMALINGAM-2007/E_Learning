import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HorizontalTextRevealProps {
    children: string;
    className?: string;
}

const HorizontalTextReveal: React.FC<HorizontalTextRevealProps> = ({ children, className = '' }) => {
    const targetRef = useRef<HTMLDivElement>(null);

    // Track scroll progress of this element
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start 0.9", "start 0.25"]
    });

    const words = children.split(" ");

    return (
        <div
            ref={targetRef}
            className={`relative w-full min-h-screen flex items-center justify-center ${className}`}
        >
            <p className="flex flex-wrap gap-x-2 gap-y-1 max-w-4xl px-8 text-4xl font-bold md:text-5xl lg:text-6xl">
                {words.map((word, i) => {
                    const start = i / words.length;
                    const end = start + 1 / words.length;

                    return (
                        <Word key={i} progress={scrollYProgress} range={[start, end]}>
                            {word}
                        </Word>
                    );
                })}
            </p>
        </div>
    );
};

interface WordProps {
    children: string;
    progress: any;
    range: [number, number];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0, 1]);
    const x = useTransform(progress, range, [200, 0]);
    const skewX = useTransform(progress, range, [10, 0]);

    return (
        <span className="relative inline-block">
            <span className="absolute opacity-10">{children}</span>
            <motion.span
                style={{ opacity, x, skewX }}
                className="inline-block"
            >
                {children}
            </motion.span>
        </span>
    );
};

export default HorizontalTextReveal;
