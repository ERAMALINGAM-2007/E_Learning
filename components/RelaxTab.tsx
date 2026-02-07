import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music2, Sparkles, ArrowLeft } from 'lucide-react';

interface RelaxTabProps {
    onBack: () => void;
}

const RelaxTab: React.FC<RelaxTabProps> = ({ onBack }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Initialize Web Audio API
    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        audio.volume = volume;

        // Create audio context and analyser
        const setupAudioContext = () => {
            if (audioContextRef.current) return;

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audio);

            analyser.fftSize = 256;
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            // Start visualization
            visualize();
        };

        // Setup on first play
        const handlePlay = () => {
            setupAudioContext();
            setIsPlaying(true);
        };

        audio.addEventListener('play', handlePlay);

        return () => {
            audio.removeEventListener('play', handlePlay);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Visualize audio with animated waveform
    const visualize = () => {
        const canvas = canvasRef.current;
        const analyser = analyserRef.current;

        if (!canvas || !analyser) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            // Clear canvas with gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(1, '#1e293b');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            // Draw frequency bars
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

                // Create vibrant gradient for each bar
                const barGradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);

                // Color based on frequency (bass = purple/blue, mid = cyan, treble = pink/orange)
                if (i < bufferLength * 0.3) {
                    // Bass - Purple to Blue
                    barGradient.addColorStop(0, '#a855f7');
                    barGradient.addColorStop(1, '#3b82f6');
                } else if (i < bufferLength * 0.6) {
                    // Mid - Cyan to Blue
                    barGradient.addColorStop(0, '#06b6d4');
                    barGradient.addColorStop(1, '#3b82f6');
                } else {
                    // Treble - Pink to Orange
                    barGradient.addColorStop(0, '#ec4899');
                    barGradient.addColorStop(1, '#f97316');
                }

                ctx.fillStyle = barGradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                // Add reflection effect
                ctx.globalAlpha = 0.2;
                ctx.fillRect(x, canvas.height, barWidth, -barHeight * 0.3);
                ctx.globalAlpha = 1;

                x += barWidth + 2;
            }
        };

        draw();
    };

    // Audio controls
    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
            setIsMuted(newVolume === 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setProgress(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = (newTime / 100) * duration;
        }
    };

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const dur = audioRef.current.duration;
        setCurrentTime(current);
        setDuration(dur);
        setProgress((current / dur) * 100);
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
            <button
                onClick={onBack}
                className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
            </button>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Sparkles className="text-purple-400 animate-pulse" size={32} />
                        <h1 className="text-4xl font-bold text-white">Relax & Focus</h1>
                        <Sparkles className="text-pink-400 animate-pulse" size={32} />
                    </div>
                    <p className="text-slate-400 text-lg">
                        Take a break with calming 432 Hz music
                    </p>
                </div>

                {/* Main Player Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                    {/* Waveform Visualization */}
                    <div className="relative overflow-hidden">
                        <canvas
                            ref={canvasRef}
                            width={1200}
                            height={300}
                            className="w-full h-[300px] object-cover"
                        />

                        {/* Overlay gradient for aesthetics */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />

                        {/* Play button overlay when not playing */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer transform hover:scale-110" onClick={togglePlay}>
                                    <Play size={32} className="text-white ml-1" fill="white" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Track Info */}
                    <div className="p-6 border-t border-slate-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <Music2 size={32} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white mb-1">Sanctuary</h2>
                                <p className="text-slate-400">Relaxing Music 432 Hz • Liborio Conti</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progress || 0}
                                onChange={handleSeek}
                                className="w-full h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                                style={{
                                    background: `linear-gradient(to right, #a855f7 ${progress}%, #334155 ${progress}%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Play/Pause Button */}
                                <button
                                    onClick={togglePlay}
                                    className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50"
                                >
                                    {isPlaying ? (
                                        <Pause size={24} className="text-white" fill="white" />
                                    ) : (
                                        <Play size={24} className="text-white ml-1" fill="white" />
                                    )}
                                </button>

                                {/* Volume Control */}
                                <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full">
                                    <button onClick={toggleMute} className="text-slate-300 hover:text-white transition-colors">
                                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="w-24 h-1 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Info Badge */}
                            <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full">
                                <span className="text-purple-400 text-sm font-medium">432 Hz Healing Frequency</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { icon: '🧘', title: 'Reduce Stress', desc: 'Calm your mind and body' },
                        { icon: '🎯', title: 'Improve Focus', desc: 'Enhanced concentration' },
                        { icon: '😌', title: 'Better Sleep', desc: 'Deep relaxation' }
                    ].map((benefit, i) => (
                        <div
                            key={i}
                            className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-900/50 transition-all"
                        >
                            <div className="text-4xl mb-3">{benefit.icon}</div>
                            <h3 className="text-white font-bold mb-2">{benefit.title}</h3>
                            <p className="text-slate-400 text-sm">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src="/relaxing-music.mp3"
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={handleTimeUpdate}
            />
        </div>
    );
};

export default RelaxTab;
