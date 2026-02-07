import React, { useState } from 'react';
import { PlayCircle, Clock, BookOpen, Video, Loader2, Sparkles } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  progress: number;
  onClick: (courseId: string) => void;
  onGenerateVideo?: (courseId: string) => Promise<void>;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, progress, onClick, onGenerateVideo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGenerateVideo) {
      setIsGenerating(true);
      try {
        await onGenerateVideo(course.id);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <div 
      onClick={() => onClick(course.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group h-full cursor-pointer rounded-xl"
    >
      {/* 360 Rotating Vibrant Light Effect */}
      {/* Using a very large square (500%) ensures the gradient never clips at the corners during rotation */}
      <div className="absolute -inset-[3px] rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500%] h-[500%] bg-[conic-gradient(from_0deg,#ff4545,#b336eb,#3b82f6,#4ade80,#ff4545)] animate-spin-slow blur-lg opacity-80"></div>
      </div>
      
      {/* Main Card Content */}
      <div className="relative z-10 h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-none transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
          {/* Main Image */}
          <img 
            src={course.thumbnail} 
            alt={course.title} 
            className={`w-full h-full object-cover transform transition-transform duration-500 ${isHovered && !course.previewVideoUrl ? 'scale-105' : 'scale-100'}`}
          />
          
          {/* Video Preview Overlay */}
          {course.previewVideoUrl && (
            <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <video 
                src={course.previewVideoUrl}
                className="w-full h-full object-cover"
                autoPlay={isHovered}
                muted
                loop
                playsInline
              />
            </div>
          )}

          {/* Overlays */}
          <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
             {/* Default Student View: Play Icon */}
             {!course.previewVideoUrl && !isGenerating && !onGenerateVideo && (
               <PlayCircle className="w-12 h-12 text-white opacity-90" />
             )}

             {/* Instructor View: Generate Button */}
             {!course.previewVideoUrl && !isGenerating && onGenerateVideo && (
                <button 
                  onClick={handleGenerateClick}
                  className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-4 py-2 rounded-full font-bold hover:bg-white hover:text-brand-600 transition-all flex items-center gap-2 transform hover:scale-105 shadow-lg"
                >
                  <Video size={18} /> Generate AI Trailer
                </button>
             )}

             {/* Loading State */}
             {isGenerating && (
               <div className="flex flex-col items-center text-white">
                 <Loader2 className="w-8 h-8 animate-spin mb-2" />
                 <span className="text-xs font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm">Generating Veo Video...</span>
               </div>
             )}
          </div>
          
          {/* Badges */}
          <div className="absolute bottom-2 right-2 flex gap-1">
             <div className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
               {course.totalLessons} Lessons
             </div>
             {course.previewVideoUrl && (
               <div className="bg-brand-600/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1 shadow-sm border border-brand-500/50">
                 <Sparkles size={10} /> Veo Preview
               </div>
             )}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-1">
          <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 line-clamp-1">{course.title}</h3>
                  {course.isPublished ? (
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" title="Published"></span>
                  ) : (
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mt-2 shrink-0" title="Draft"></span>
                  )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{course.instructorName}</p>
          </div>
          
          {/* Progress Bar (Hidden for instructor generation view if 0, or just show generic styling) */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-3">
            <div 
              className="bg-brand-600 dark:bg-brand-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {progress}% Complete
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> {progress === 0 ? 'Start' : 'Continue'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;