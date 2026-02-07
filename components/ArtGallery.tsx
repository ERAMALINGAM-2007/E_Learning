import React from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ArrowLeft } from 'lucide-react';

const images = [
    { src: "/art/gallery1.jpg" },
    { src: "/art/gallery2.jpg" },
    { src: "/art/gallery3.jpg" },
    { src: "/art/gallery4.jpg" },
    { src: "/art/gallery5.jpg" },
    { src: "/art/gallery6.jpg" },
    { src: "/art/gallery7.jpg" },
    { src: "/art/gallery8.jpg" },
    { src: "/art/gallery9.jpg" },
    { src: "/art/gallery10.jpg" },
];

const ArtGallery = ({ onBack }: { onBack: () => void }) => {
    const audioContextRef = React.useRef<AudioContext | null>(null);
    const audioBufferRef = React.useRef<AudioBuffer | null>(null);

    React.useEffect(() => {
        const initAudio = async () => {
            try {
                // Initialize AudioContext
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                const context = new AudioContext();
                audioContextRef.current = context;

                // Fetch and decode audio
                const response = await fetch("/sounds/pageturn.mp3");
                const arrayBuffer = await response.arrayBuffer();
                const decodedAudio = await context.decodeAudioData(arrayBuffer);
                audioBufferRef.current = decodedAudio;
            } catch (error) {
                console.error("Failed to initialize audio:", error);
            }
        };

        initAudio();

        return () => {
            audioContextRef.current?.close();
        };
    }, []);

    const playFlipSound = () => {
        if (audioContextRef.current && audioBufferRef.current) {
            // Ensure context is running (needed for some browsers)
            if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBufferRef.current;
            source.connect(audioContextRef.current.destination);
            source.start(0);
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1721] text-white overflow-hidden flex flex-col items-center justify-center">
            <div className="fixed top-0 left-0 w-full z-50 p-6 bg-gradient-to-b from-[#1a1721] to-transparent">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>

            <div className="mt-20 flex items-center justify-center h-full w-full">
                {/* @ts-ignore */}
                <HTMLFlipBook width={400} height={550} showCover={true} className="shadow-2xl" onFlip={playFlipSound}>
                    {/* Front Cover */}
                    <div className="demoPage bg-brand-900 text-white flex items-center justify-center shadow-xl h-full border border-slate-700 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img src="/art/cover.jpg" alt="Cover" className="w-full h-[90%] object-contain mt-4 rounded-md shadow-lg" />
                        </div>
                    </div>

                    {/* Inner Cover / Title Page */}
                    <div className="demoPage bg-white dark:bg-slate-800 flex items-center justify-center border-r border-slate-200 dark:border-slate-700">
                        <div className="text-center p-8">
                            <h1 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">Art Book</h1>
                            <p className="text-slate-500 dark:text-slate-400 italic">A collection of visions</p>
                            <div className="w-16 h-1 bg-brand-500 mx-auto my-6 rounded-full"></div>
                            <p className="text-xs text-slate-400">© 2025 NeuroLearn</p>
                        </div>
                    </div>

                    {/* Gallery Pages */}
                    {images.map((img, index) => (
                        <div key={index} className="demoPage bg-white dark:bg-slate-900 p-2 border-r border-slate-200 dark:border-slate-800 h-full">
                            <div className="w-full h-full flex items-center justify-center overflow-hidden bg-black rounded-sm">
                                <img src={img.src} alt={`Page ${index + 1}`} className="max-w-full max-h-full object-contain" />
                            </div>
                            <span className="absolute bottom-4 right-4 text-xs text-slate-500">{index + 1}</span>
                        </div>
                    ))}
                </HTMLFlipBook>
            </div>
        </div>
    );
};

export default ArtGallery;
