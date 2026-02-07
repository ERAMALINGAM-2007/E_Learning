import React from 'react';

interface AudioWaveformProps {
    isPlaying: boolean;
    color?: string;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ isPlaying, color = 'bg-white' }) => {
    return (
        <div className="flex items-center justify-center gap-1 h-16">
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className={`w-2 rounded-full ${color} transition-all duration-300`}
                    style={{
                        height: isPlaying ? '100%' : '20%',
                        animation: isPlaying ? `wave 1s ease-in-out infinite ${i * 0.1}s` : 'none',
                    }}
                />
            ))}
            <style>{`
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
        </div>
    );
};

export default AudioWaveform;
