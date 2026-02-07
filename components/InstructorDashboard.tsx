
import React from 'react';
import { Plus, Users, DollarSign, BookOpen } from 'lucide-react';
import { Course, User } from '../types';
import CourseCard from './CourseCard';
import { generatePreviewVideo } from '../services/geminiService';
import { db } from '../services/db';

interface InstructorDashboardProps {
  user: User;
  courses: Course[];
  onCreateCourse: () => void;
  onEditCourse: (courseId: string) => void;
}

const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ user, courses, onCreateCourse, onEditCourse }) => {
  const myCourses = courses?.filter(c => c.instructorId === user.id) || [];
  const totalStudents = myCourses.reduce((acc, c) => acc + (Math.floor(Math.random() * 50) + 10), 0); // Mock data

  const handleGenerateVideo = async (courseId: string) => {
    // API Key Check for Veo
    // @ts-ignore
    if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
        try {
            // @ts-ignore
            await window.aistudio.openSelectKey();
        } catch(e) {
            console.error("Key selection cancelled", e);
            return;
        }
    }

    const course = myCourses.find(c => c.id === courseId);
    if (!course) return;

    try {
        const videoUrl = await generatePreviewVideo(course.title);
        if (videoUrl) {
            const updatedCourse = { ...course, previewVideoUrl: videoUrl };
            db.updateCourse(updatedCourse);
        }
    } catch (e) {
        console.error("Failed to generate video", e);
        alert("Failed to generate preview video. Please ensure you have a valid paid API key selected.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Instructor Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your content and view analytics</p>
        </div>
        <button 
          onClick={onCreateCourse}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus size={20} /> Create New Course
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active Courses</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{myCourses.length}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{totalStudents}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Revenue (Mo.)</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">$12,450</h3>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">My Courses</h2>
        <div className="text-sm text-slate-500 dark:text-slate-400">
            <span className="hidden md:inline">Tip: Hover over a course card to generate an AI Trailer if missing.</span>
        </div>
      </div>

      {myCourses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 mb-4">You haven't created any courses yet.</p>
          <button onClick={onCreateCourse} className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Get Started</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCourses?.map(course => (
            <CourseCard 
              key={course.id} 
              course={course}
              progress={0} // Instructors see generic progress
              onClick={() => onEditCourse(course.id)}
              onGenerateVideo={handleGenerateVideo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
