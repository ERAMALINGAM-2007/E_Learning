import React from 'react';
import { Course } from '../types';
import { BookOpen, Star, Users } from 'lucide-react';

interface CourseVerticalMarqueeProps {
    courses: Course[];
    reverse?: boolean;
}

const CourseVerticalMarquee: React.FC<CourseVerticalMarqueeProps> = ({ courses, reverse = false }) => {
    // Duplicate courses to ensure seamless loop
    const marqueeCourses = [...courses, ...courses, ...courses];

    return (
        <div className="h-full overflow-hidden relative w-full max-w-sm mx-auto py-6">
            {/* Gradient Masks */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

            <div
                className="flex flex-col will-change-transform"
                style={{
                    animation: `${reverse ? 'marqueeScrollReverse' : 'marqueeScroll'} 40s linear infinite`
                }}
            >
                {marqueeCourses.map((course, index) => (
                    <div
                        key={`${course.id}-${index}`}
                        className="mx-4 mb-6 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border border-white/30 dark:border-slate-700/50 rounded-2xl p-4 shadow-xl hover:scale-105 transition-transform duration-300 group"
                    >
                        <div className="relative h-32 rounded-xl overflow-hidden mb-3 shadow-sm">
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/10">
                                {course.category}
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-800 dark:text-white mb-1 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{course.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">{course.description}</p>

                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-1">
                                <Users size={12} />
                                <span>1.2k</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={12} fill="currentColor" />
                                <span>4.8</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <BookOpen size={12} />
                                <span>{course.totalLessons} Lessons</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.333%); }
        }
        @keyframes marqueeScrollReverse {
          0% { transform: translateY(-33.333%); }
          100% { transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default CourseVerticalMarquee;
