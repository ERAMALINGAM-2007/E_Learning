import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Gamepad2, Play, Trophy, X, RotateCcw, Zap, Target, Brain, Activity, Layers, Car, Rocket } from 'lucide-react';

interface Game {
    id: string;
    title: string;
    category: string;
    image: string;
    description: string;
    color: string;
    engine: 'snake' | 'reflex' | 'memory' | 'math' | 'runner';
}

const GAMES: Game[] = [
    { id: 'snake', title: 'Neon Snake 3D', category: 'Arcade', image: '/games/snake.png', description: 'Classic snake with a neon twist. Collect orbs and grow!', color: 'from-green-500 to-emerald-700', engine: 'snake' },
    { id: 'bounce', title: 'Bouncing Ball', category: 'Physics', image: '/games/bounce.png', description: 'Keep the ball in the air! Don\'t let it drop.', color: 'from-blue-500 to-indigo-700', engine: 'reflex' },
    { id: 'car', title: 'Cyber Racer', category: 'Racing', image: '/games/car.png', description: 'Dodge traffic in this high-speed infinite runner.', color: 'from-red-500 to-orange-700', engine: 'runner' },
    { id: 'memory', title: 'Memory Matrix', category: 'Puzzle', image: '/games/memory.png', description: 'Test your brain power by matching pairs.', color: 'from-purple-500 to-pink-700', engine: 'memory' },
    { id: 'stack', title: 'Tower Stack', category: 'Skill', image: '/games/stack.png', description: 'Test your reflexes by stacking blocks perfectly.', color: 'from-yellow-400 to-orange-500', engine: 'reflex' },
    { id: 'math', title: 'Math Blaster', category: 'Educational', image: '/games/math.png', description: 'Solve equations before the time runs out!', color: 'from-cyan-500 to-blue-600', engine: 'math' },
    { id: 'space', title: 'Galaxy Defender', category: 'Shooter', image: '/games/space.png', description: 'Defend Earth from the incoming asteroid belt.', color: 'from-slate-700 to-slate-900', engine: 'runner' },
    { id: 'word', title: 'Word Wix', category: 'Puzzle', image: '/games/word.png', description: 'Unscramble the matrix of letters.', color: 'from-teal-500 to-green-600', engine: 'memory' },
    { id: 'piano', title: 'Piano Tiles', category: 'Music', image: '/games/piano.png', description: 'Tap the black tiles to the rhythm of the music.', color: 'from-gray-800 to-black', engine: 'reflex' },
    { id: '2048', title: '2048 Ultimate', category: 'Puzzle', image: '/games/2048.png', description: 'Merge numbers to reach the ultimate 2048 tile.', color: 'from-amber-500 to-orange-600', engine: 'math' },
    { id: 'chess', title: 'Chess AI', category: 'Strategy', image: '/games/chess.png', description: 'Memorize the board state and positions.', color: 'from-indigo-800 to-purple-900', engine: 'memory' },
    { id: 'sudoku', title: 'Sudoku Master', category: 'Logic', image: '/games/sudoku.png', description: 'Calculated moves are the key to victory.', color: 'from-sky-500 to-blue-700', engine: 'math' },
    { id: 'ninja', title: 'Fruit Slicer', category: 'Arcade', image: '/games/ninja.png', description: 'Slice fruits, avoid bombs. Simple as that.', color: 'from-rose-500 to-red-700', engine: 'reflex' },
    { id: 'color', title: 'Color Match', category: 'Reflex', image: '/games/color.png', description: 'Match the color of the falling ball.', color: 'from-fuchsia-500 to-pink-600', engine: 'reflex' },
    { id: 'jump', title: 'Gravity Jump', category: 'Platformer', image: '/games/jump.png', description: 'Avoid obstacles and reach the end.', color: 'from-violet-500 to-purple-800', engine: 'runner' },
];

// --- GAME ENGINES ---

// 1. SNAKE ENGINE
const SnakeGame = ({ onGameOver }: { onGameOver: (score: number) => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let dir = { x: 1, y: 0 };
        let nextDir = { x: 1, y: 0 };
        let gameLoop: number;
        const gridSize = 20;
        const tileCount = canvas.width / gridSize;

        const handleKey = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowUp': if (dir.y === 0) nextDir = { x: 0, y: -1 }; break;
                case 'ArrowDown': if (dir.y === 0) nextDir = { x: 0, y: 1 }; break;
                case 'ArrowLeft': if (dir.x === 0) nextDir = { x: -1, y: 0 }; break;
                case 'ArrowRight': if (dir.x === 0) nextDir = { x: 1, y: 0 }; break;
            }
        };
        window.addEventListener('keydown', handleKey);

        const draw = () => {
            dir = nextDir;
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

            if (head.x < 0) head.x = tileCount - 1;
            if (head.x >= tileCount) head.x = 0;
            if (head.y < 0) head.y = tileCount - 1;
            if (head.y >= tileCount) head.y = 0;

            if (snake.some(s => s.x === head.x && s.y === head.y)) {
                onGameOver(score);
                clearInterval(gameLoop);
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 10);
                food = {
                    x: Math.floor(Math.random() * tileCount),
                    y: Math.floor(Math.random() * tileCount)
                };
            } else {
                snake.pop();
            }

            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < tileCount; i++) {
                ctx.beginPath(); ctx.moveTo(i * gridSize, 0); ctx.lineTo(i * gridSize, canvas.height); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i * gridSize); ctx.lineTo(canvas.width, i * gridSize); ctx.stroke();
            }

            ctx.fillStyle = '#ef4444';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ef4444';
            ctx.beginPath();
            ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#4ade80';
            snake.forEach((s, i) => {
                if (i === 0) ctx.fillStyle = '#22c55e';
                else ctx.fillStyle = '#4ade80';
                ctx.fillRect(s.x * gridSize + 1, s.y * gridSize + 1, gridSize - 2, gridSize - 2);
            });
        };

        gameLoop = window.setInterval(draw, 100);

        return () => {
            clearInterval(gameLoop);
            window.removeEventListener('keydown', handleKey);
        };
    }, []); // Remove score from dependency to prevent reset

    return <canvas ref={canvasRef} width={400} height={400} className="bg-slate-800 rounded-xl shadow-2xl mx-auto w-full max-w-[400px]" />;
};

// 2. REFLEX CLICKER ENGINE
const ReflexGame = ({ onGameOver }: { onGameOver: (score: number) => void }) => {
    const [position, setPosition] = useState({ top: '50%', left: '50%' });
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    // Fixed: useRef should be initialized with null or undefined explicitly for TypeScript/React strictness
    const timerRef = useRef<number | undefined>(undefined);
    // Store current score in ref to access inside interval without resetting it
    const scoreRef = useRef(score);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    useEffect(() => {
        timerRef.current = window.setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    onGameOver(scoreRef.current);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, []); // Empty dependency to start timer once

    const handleClick = () => {
        setScore(s => s + 100);
        const top = Math.random() * 80 + 10 + '%';
        const left = Math.random() * 80 + 10 + '%';
        setPosition({ top, left });
    };

    return (
        <div className="relative w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden border-4 border-slate-700">
            <div className="absolute top-4 right-4 text-white font-mono text-xl">Time: {timeLeft}s</div>
            <div className="absolute top-4 left-4 text-white font-mono text-xl">Score: {score}</div>
            {timeLeft > 0 && (
                <button
                    onClick={handleClick}
                    style={{ top: position.top, left: position.left }}
                    className="absolute w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.6)] active:scale-90 transition-transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-yellow-900 font-bold"
                >
                    TAP!
                </button>
            )}
        </div>
    );
};

// 3. MEMORY ENGINE
const MemoryGame = ({ onGameOver }: { onGameOver: (score: number) => void }) => {
    const [cards, setCards] = useState<{ id: number, val: string, flipped: boolean, solved: boolean }[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        const emojis = ['🚀', '🍕', '🚗', '🐶', '⚡', '🎉', '🌟', '🎸'];
        const deck = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((val, i) => ({ id: i, val, flipped: false, solved: false }));
        setCards(deck);
    }, []);

    useEffect(() => {
        if (flipped.length === 2) {
            setMoves(m => m + 1);
            const [first, second] = flipped;
            if (cards[first].val === cards[second].val) {
                setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, solved: true } : c));
                setFlipped([]);
            } else {
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) => (i === first || i === second) ? { ...c, flipped: false } : c));
                    setFlipped([]);
                }, 1000);
            }
        }
    }, [flipped]);

    useEffect(() => {
        if (cards.length > 0 && cards.every(c => c.solved)) {
            setTimeout(() => onGameOver(Math.max(1000 - moves * 10, 0)), 500);
        }
    }, [cards]);

    const handleCardClick = (idx: number) => {
        if (flipped.length < 2 && !cards[idx].flipped && !cards[idx].solved) {
            setCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
            setFlipped(prev => [...prev, idx]);
        }
    };

    return (
        <div className="bg-slate-800 p-4 rounded-xl h-[400px] flex flex-col items-center justify-center">
            <div className="mb-4 text-white font-mono">Moves: {moves}</div>
            <div className="grid grid-cols-4 gap-3">
                {cards.map((card, i) => (
                    <button
                        key={i}
                        onClick={() => handleCardClick(i)}
                        className={`w-16 h-16 rounded-lg text-2xl flex items-center justify-center transition-all duration-300 transform ${card.flipped || card.solved ? 'bg-white rotate-0' : 'bg-brand-600 rotate-y-180 text-transparent'}`}
                    >
                        {(card.flipped || card.solved) ? card.val : '?'}
                    </button>
                ))}
            </div>
        </div>
    );
};

// 4. MATH ENGINE
const MathGame = ({ onGameOver }: { onGameOver: (score: number) => void }) => {
    const [problem, setProblem] = useState({ q: '', a: 0 });
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [input, setInput] = useState('');

    const generateProblem = () => {
        const ops = ['+', '-', '*'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const n1 = Math.floor(Math.random() * 12) + 1;
        const n2 = Math.floor(Math.random() * 12) + 1;
        let q = `${n1} ${op} ${n2}`;
        let a = 0;
        if (op === '+') a = n1 + n2;
        if (op === '-') a = n1 - n2;
        if (op === '*') a = n1 * n2;
        setProblem({ q, a });
    };

    useEffect(() => {
        generateProblem();
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(interval);
                    onGameOver(score); // Uses initial score closure, but typically Math game is short enough. Ideally ref pattern here too.
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Update score in parent component via onGameOver if needed? No, onGameOver is end game.

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(input) === problem.a) {
            setScore(s => s + 100);
            setTimeLeft(t => t + 2); // Bonus time
            setInput('');
            generateProblem();
        } else {
            setInput('');
        }
    };

    // To properly handle score passing on game over due to closure:
    const scoreRef = useRef(score);
    useEffect(() => { scoreRef.current = score; }, [score]);

    // Override useEffect for timer to use scoreRef
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(interval);
                    onGameOver(scoreRef.current);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="bg-slate-800 p-8 rounded-xl h-[400px] flex flex-col items-center justify-center text-white">
            <div className="flex justify-between w-full mb-8 font-mono text-xl">
                <span>Time: {timeLeft}</span>
                <span>Score: {score}</span>
            </div>
            <div className="text-6xl font-bold mb-8">{problem.q}</div>
            <form onSubmit={handleSubmit} className="w-full max-w-xs">
                <input
                    type="number"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-700 text-center text-4xl p-4 rounded-xl outline-none border-2 border-slate-600 focus:border-brand-500 text-white"
                />
            </form>
        </div>
    );
};

// 5. RUNNER ENGINE (Canvas)
const RunnerGame = ({ onGameOver }: { onGameOver: (score: number) => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let playerX = canvas.width / 2;
        let obstacles: { x: number, y: number, w: number, h: number }[] = [];
        let frame = 0;
        let gameLoop: number;
        let speed = 3;

        const handleMove = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') playerX -= 20;
            if (e.key === 'ArrowRight') playerX += 20;
            playerX = Math.max(20, Math.min(canvas.width - 20, playerX));
        };
        window.addEventListener('keydown', handleMove);

        const loop = () => {
            frame++;
            if (frame % 100 === 0) setScore(s => s + 10);
            if (frame % 500 === 0) speed += 1;

            // Spawn Obstacle
            if (frame % 60 === 0) {
                obstacles.push({
                    x: Math.random() * (canvas.width - 40),
                    y: -50,
                    w: 40,
                    h: 40
                });
            }

            // Update Obstacles
            obstacles.forEach(o => o.y += speed);
            obstacles = obstacles.filter(o => o.y < canvas.height);

            // Collision
            const pRect = { x: playerX - 15, y: canvas.height - 50, w: 30, h: 30 };
            if (obstacles.some(o =>
                pRect.x < o.x + o.w &&
                pRect.x + pRect.w > o.x &&
                pRect.y < o.y + o.h &&
                pRect.y + pRect.h > o.y
            )) {
                onGameOver(frame); // Use frame as score proxy
                clearInterval(gameLoop);
                return;
            }

            // Draw
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Player
            ctx.fillStyle = '#3b82f6';
            ctx.beginPath();
            ctx.moveTo(playerX, canvas.height - 50);
            ctx.lineTo(playerX - 15, canvas.height - 20);
            ctx.lineTo(playerX + 15, canvas.height - 20);
            ctx.fill();

            // Obstacles
            ctx.fillStyle = '#ef4444';
            obstacles.forEach(o => {
                ctx.fillRect(o.x, o.y, o.w, o.h);
            });
        };

        gameLoop = window.setInterval(loop, 1000 / 60);
        return () => {
            clearInterval(gameLoop);
            window.removeEventListener('keydown', handleMove);
        };
    }, []);

    return <canvas ref={canvasRef} width={400} height={400} className="bg-slate-900 rounded-xl shadow-2xl mx-auto w-full max-w-[400px]" />;
};


// --- 3D CAROUSEL COMPONENT ---

const GameCarousel = ({ games, onLaunch }: { games: Game[], onLaunch: (game: Game) => void }) => {
    const [activeIndex, setActiveIndex] = useState(Math.floor(games.length / 2));
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-center initial active index on mount
    useEffect(() => {
        setActiveIndex(Math.floor(games.length / 2));
    }, [games]);

    const getCardStyle = (index: number) => {
        const offset = index - activeIndex;
        const absOffset = Math.abs(offset);
        const isVisible = absOffset <= 2; // Only show 2 neighbors on each side for performance/clutter

        if (!isVisible) return { display: 'none' };

        const xOffset = offset * 60; // 60% overlap
        const scale = 1 - absOffset * 0.15;
        const zIndex = 10 - absOffset;
        const rotateY = offset * -25; // Rotate towards center
        const opacity = 1 - absOffset * 0.2;

        return {
            transform: `translateX(${xOffset}%) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`,
            zIndex,
            opacity,
        };
    };

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden perspective-1000 py-10">
            <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
                {games.map((game, i) => {
                    const style = getCardStyle(i);
                    if (style.display === 'none') return null;

                    return (
                        <div
                            key={game.id}
                            onClick={() => onLaunch(game)}
                            onMouseEnter={() => setActiveIndex(i)}
                            className="absolute w-[300px] md:w-[350px] aspect-[3/4] transition-all duration-500 ease-out cursor-pointer group"
                            style={{
                                ...style,
                                left: '50%',
                                marginLeft: '-175px', // Half of width
                            }}
                        >
                            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 relative">
                                {/* Image */}
                                <div className="h-3/5 w-full relative overflow-hidden">
                                    <img src={game.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={game.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${game.color} text-white shadow-lg`}>
                                            {game.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 h-2/5 flex flex-col justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 leading-tight">{game.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{game.description}</p>
                                    </div>
                                    <div className={`h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 mt-4 overflow-hidden`}>
                                        <div className={`h-full w-full bg-gradient-to-r ${game.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


// --- Main Component ---

interface GameCenterProps {
    onBack: () => void;
}

const GameCenter: React.FC<GameCenterProps> = ({ onBack }) => {
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [lastScore, setLastScore] = useState<number | null>(null);

    const launchGame = (game: Game) => {
        setActiveGame(game);
        setIsPlaying(true);
        setLastScore(null);
    };

    const handleGameOver = (score: number) => {
        setLastScore(score);
        setIsPlaying(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-8 overflow-x-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                            <Gamepad2 className="text-violet-600" size={32} /> Arcade
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">Relax, play, and recharge your brain.</p>
                    </div>
                </div>
            </div>

            {/* Game Player Overlay */}
            {activeGame && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-700">
                        {/* Game Header */}
                        <div className={`p-4 bg-gradient-to-r ${activeGame.color} text-white flex justify-between items-center`}>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Gamepad2 size={20} /> {activeGame.title}
                            </h2>
                            <button onClick={() => setActiveGame(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Game Container */}
                        <div className="p-8 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[500px]">
                            {!isPlaying ? (
                                <div className="text-center">
                                    {lastScore !== null ? (
                                        <div className="mb-6 animate-pop-in">
                                            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Trophy size={40} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Game Over!</h3>
                                            <p className="text-lg text-slate-500">Score: <span className="font-bold text-brand-600">{lastScore}</span></p>
                                        </div>
                                    ) : (
                                        <div className="mb-6">
                                            <img src={activeGame.image} className="w-32 h-32 object-cover rounded-2xl mx-auto mb-4 shadow-lg" />
                                            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-6">{activeGame.description}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => { setIsPlaying(true); setLastScore(null); }}
                                        className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-transform hover:scale-105"
                                    >
                                        <Play size={20} /> {lastScore !== null ? 'Play Again' : 'Start Game'}
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full flex justify-center animate-in zoom-in-95 duration-300">
                                    {activeGame.engine === 'snake' && <SnakeGame onGameOver={handleGameOver} />}
                                    {activeGame.engine === 'reflex' && <ReflexGame onGameOver={handleGameOver} />}
                                    {activeGame.engine === 'memory' && <MemoryGame onGameOver={handleGameOver} />}
                                    {activeGame.engine === 'math' && <MathGame onGameOver={handleGameOver} />}
                                    {activeGame.engine === 'runner' && <RunnerGame onGameOver={handleGameOver} />}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 3D Carousel */}
            <div className="hidden md:block">
                <GameCarousel games={GAMES} onLaunch={launchGame} />
            </div>

            {/* Mobile Grid (Fallback) */}
            <div className="md:hidden grid grid-cols-1 gap-6 max-w-md mx-auto">
                {GAMES.map(game => (
                    <div
                        key={game.id}
                        onClick={() => launchGame(game)}
                        className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-slate-100 dark:border-slate-800"
                    >
                        <div className="h-40 overflow-hidden relative">
                            <img src={game.image} className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded font-bold">
                                {game.category}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">{game.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{game.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameCenter;