import React, { useState, useEffect } from 'react';

interface TypingTextProps {
    text: string | string[];
    speed?: number;
    className?: string;
    cursorClassName?: string;
    loop?: boolean;
    start?: boolean;
    hideCursorOnComplete?: boolean;
    onComplete?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({
    text,
    speed = 100,
    className = "",
    cursorClassName = "",
    loop = true,
    start = true,
    hideCursorOnComplete = false,
    onComplete
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(speed);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (!start || isFinished) return;

        const handleTyping = () => {
            const i = loopNum % (Array.isArray(text) ? text.length : 1);
            const fullText = Array.isArray(text) ? text[i] : text;

            setDisplayedText(
                isDeleting
                    ? fullText.substring(0, displayedText.length - 1)
                    : fullText.substring(0, displayedText.length + 1)
            );

            setTypingSpeed(isDeleting ? speed / 2 : speed);

            if (!isDeleting && displayedText === fullText) {
                if (loop) {
                    setTimeout(() => setIsDeleting(true), 2000); // Pause at end
                } else {
                    setIsFinished(true);
                    if (onComplete) onComplete();
                }
            } else if (isDeleting && displayedText === "") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, loopNum, text, speed, typingSpeed, loop, start, isFinished, onComplete]);

    const showCursor = !isFinished || !hideCursorOnComplete;

    return (
        <span className={className}>
            {displayedText}
            {showCursor && <span className={`animate-blink ml-1 ${cursorClassName}`}>|</span>}
        </span>
    );
};

export default TypingText;
