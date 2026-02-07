
import React, { useState } from 'react';
import { Search, Flame, Award, BookOpen, Gamepad2, ArrowRight } from 'lucide-react';
import { User, Course } from '../types';
import CourseCard from './CourseCard';

interface StudentDashboardProps {
  user: User;
  courses: Course[];
  onCourseClick: (id: string) => void;
  onResumeCourse: (id: string) => void;
  onOpenGames: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, courses, onCourseClick, onResumeCourse, onOpenGames }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const enrolledCourses = courses?.filter(c => user.enrolledCourseIds?.includes(c.id)) || [];
  const availableCourses = courses?.filter(c => !user.enrolledCourseIds?.includes(c.id) && c.isPublished) || [];
  
  const filteredAvailable = availableCourses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Stats */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Hello, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 dark:text-slate-400">Ready to learn something new today?</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-orange-500 font-bold">
            <Flame size={20} className="fill-current animate-pulse-slow" />
            <span>{user.streak} Day Streak</span>
          </div>
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold">
            <Award size={20} />
            <span>{user.xp} XP</span>
          </div>
        </div>
      </header>

      {/* Game Arcade Banner */}
      <section>
        <div 
          onClick={onOpenGames}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-8 cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors"></div>
          <div className="relative z-10 flex justify-between items-center">
             <div>
               <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3 backdrop-blur-sm border border-white/20">
                  <Gamepad2 size={14} /> Brain Break
               </div>
               <h2 className="text-3xl font-black mb-2">Play & Recharge</h2>
               <p className="text-violet-100 max-w-md">Take a break from studying with our collection of 15+ mini-games. Play 3D Snake, Car Racing, and more!</p>
             </div>
             <div className="hidden md:flex bg-white/20 p-4 rounded-full backdrop-blur-md group-hover:bg-white text-white group-hover:text-violet-600 transition-all duration-300">
                <ArrowRight size={24} />
             </div>
          </div>
        </div>
      </section>

      {/* Continue Learning Section */}
      {enrolledCourses.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
            <BookOpen size={24} className="text-brand-500" /> Continue Learning
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => {
              // Calculate mock progress
              const progress = Math.floor(Math.random() * 80) + 10; 
              return (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  progress={progress}
                  onClick={() => onResumeCourse(course.id)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Browse Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Explore Courses</h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {filteredAvailable.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <p className="text-slate-500">No new courses found matching "{searchQuery}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredAvailable?.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  progress={0} 
                  onClick={() => onCourseClick(course.id)}
                />
             ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
