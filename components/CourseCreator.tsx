
import React, { useState } from 'react';
import { Wand2, Save, ArrowLeft, Book, Image as ImageIcon, Loader2, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';
import { User, Course, Module } from '../types';
import { generateCourseOutline, generateLessonContent, generateImage } from '../services/geminiService';
import { db } from '../services/db';

interface CourseCreatorProps {
   currentUser: User;
   initialCourse?: Course;
   onBack: () => void;
   onCreated: () => void;
}

const CourseCreator: React.FC<CourseCreatorProps> = ({ currentUser, initialCourse, onBack, onCreated }) => {
   const [step, setStep] = useState(initialCourse ? 2 : 1);
   const [loading, setLoading] = useState(false);
   const [statusMsg, setStatusMsg] = useState('');
   const [errorMsg, setErrorMsg] = useState('');

   // Form State
   const [topic, setTopic] = useState('');
   const [level, setLevel] = useState('Beginner');
   const [coverImagePrompt, setCoverImagePrompt] = useState('');

   const [courseData, setCourseData] = useState<Partial<Course>>(initialCourse || {
      title: '',
      description: '',
      modules: [],
      thumbnail: '',
      category: 'General',
      difficulty: 'Beginner'
   });

   const handleGenerateOutline = async () => {
      if (!topic) return;
      setLoading(true);
      setErrorMsg('');
      setStatusMsg('Consulting Gemini 2.5 Flash...');
      try {
         const outline = await generateCourseOutline(topic, level);

         if (!outline || !outline.modules) {
            throw new Error("Invalid response from AI. Please try a different topic.");
         }

         setCourseData(prev => ({
            ...prev,
            title: outline.title,
            description: outline.description,
            modules: outline.modules.map((m: any, i: number) => ({
               id: `m-${Date.now()}-${i}`,
               title: m.title,
               lessons: m.lessons?.map((l: any, j: number) => ({
                  id: `l-${Date.now()}-${i}-${j}`,
                  title: l.title,
                  duration: l.duration,
                  content: '' // Content empty initially
               })) || []
            }))
         }));
         setStep(2);
      } catch (err: any) {
         console.error(err);
         setErrorMsg(err.message || 'Failed to generate outline.');
         setTimeout(() => setErrorMsg(''), 5000);
      } finally {
         setLoading(false);
      }
   };

   const handleGenerateLessonContent = async (moduleIndex: number, lessonIndex: number) => {
      if (!courseData.modules) return;
      const lesson = courseData.modules[moduleIndex].lessons[lessonIndex];

      setLoading(true);
      setErrorMsg('');
      setStatusMsg(`Writing content for: ${lesson.title}...`);
      try {
         const content = await generateLessonContent(courseData.title || 'Course', lesson.title);

         const newModules = [...courseData.modules];
         newModules[moduleIndex].lessons[lessonIndex].content = content;
         setCourseData(prev => ({ ...prev, modules: newModules }));
      } catch (err: any) {
         console.error(err);
         setErrorMsg('Failed to generate content. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleGenerateThumbnail = async () => {
      setLoading(true);
      setErrorMsg('');
      setStatusMsg('Generating thumbnail with Gemini Flash Image...');
      try {
         // Use custom prompt if provided, otherwise use default
         const prompt = coverImagePrompt || `Educational 3D illustration for a course titled ${courseData.title}. High quality, minimal, colorful.`;
         const img = await generateImage(prompt);
         setCourseData(prev => ({ ...prev, thumbnail: img }));
      } catch (err: any) {
         console.error(err);
         setErrorMsg('Thumbnail generation failed.');
      } finally {
         setLoading(false);
      }
   };

   const handleSave = () => {
      if (!courseData.title || !courseData.modules) return;

      const finalCourse: Course = {
         id: initialCourse?.id || `c-${Date.now()}`,
         instructorId: currentUser.id,
         instructorName: currentUser.name,
         isPublished: true,
         createdAt: new Date().toISOString(),
         totalLessons: courseData.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0),
         title: courseData.title,
         description: courseData.description || '',
         thumbnail: courseData.thumbnail || 'https://picsum.photos/800/450',
         category: courseData.category || 'General',
         difficulty: (courseData.difficulty as any) || 'Beginner',
         modules: courseData.modules as Module[],
         previewVideoUrl: initialCourse?.previewVideoUrl // preserve if existing
      };

      if (initialCourse) {
         db.updateCourse(finalCourse);
      } else {
         db.saveCourse(finalCourse);
      }
      onCreated();
   };

   return (
      <div className="p-6 max-w-5xl mx-auto min-h-screen">
         <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
         </button>

         {errorMsg && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative animate-pop-in" role="alert">
               <div className="flex items-center gap-2">
                  <AlertTriangle size={18} />
                  <span className="block sm:inline">{errorMsg}</span>
               </div>
            </div>
         )}

         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Progress Steps */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
               {[1, 2, 3].map(s => (
                  <div key={s} className={`flex-1 py-4 text-center text-sm font-medium ${step >= s ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                     Step {s}: {s === 1 ? 'Topic' : s === 2 ? 'Content' : 'Review'}
                  </div>
               ))}
            </div>

            <div className="p-8">
               {/* Step 1: Topic */}
               {step === 1 && (
                  <div className="max-w-xl mx-auto text-center py-12">
                     <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-600 dark:text-brand-400">
                        <Wand2 size={32} />
                     </div>
                     <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">What do you want to teach?</h2>
                     <p className="text-slate-500 mb-8">Gemini will generate a structured outline for you.</p>

                     <div className="space-y-4 text-left">
                        <div>
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Topic</label>
                           <input
                              type="text"
                              value={topic}
                              onChange={e => setTopic(e.target.value)}
                              placeholder="e.g. Advanced Pottery, Quantum Physics for Kids"
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty Level</label>
                           <select
                              value={level}
                              onChange={e => setLevel(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none"
                           >
                              <option>Beginner</option>
                              <option>Intermediate</option>
                              <option>Advanced</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cover Image Prompt (Optional)</label>
                           <textarea
                              value={coverImagePrompt}
                              onChange={e => setCoverImagePrompt(e.target.value)}
                              placeholder="e.g. A vibrant 3D illustration of pottery tools and clay. Or leave empty for auto-generated prompt."
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none resize-none"
                           />
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Describe the image you want for your course cover. AI will generate it for you.</p>
                        </div>
                        <button
                           onClick={handleGenerateOutline}
                           disabled={!topic || loading}
                           className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
                        >
                           {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                           {loading ? statusMsg : 'Generate Course Outline'}
                        </button>
                     </div>
                  </div>
               )}

               {/* Step 2: Content Editing */}
               {step === 2 && (
                  <div className="space-y-6">
                     <div className="flex gap-6">
                        {/* Sidebar: Modules */}
                        <div className="w-1/3 space-y-4">
                           <div>
                              <label className="text-xs font-bold uppercase text-slate-500">Course Title</label>
                              <input
                                 value={courseData.title}
                                 onChange={e => setCourseData({ ...courseData, title: e.target.value })}
                                 className="w-full bg-transparent text-xl font-bold border-b border-slate-200 dark:border-slate-700 focus:border-brand-500 outline-none py-1 text-slate-800 dark:text-white"
                              />
                           </div>

                           <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                              {courseData.modules?.map((mod, mIdx) => (
                                 <div key={mod.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                    <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">{mod.title}</h4>
                                    <div className="space-y-2">
                                       {mod.lessons?.map((lesson, lIdx) => (
                                          <div key={lesson.id} className="flex items-center justify-between bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
                                             <span className="truncate flex-1 mr-2 text-slate-600 dark:text-slate-400">{lesson.title}</span>
                                             <button
                                                onClick={() => handleGenerateLessonContent(mIdx, lIdx)}
                                                disabled={loading || !!lesson.content}
                                                className={`p-1.5 rounded-md transition-colors ${lesson.content ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20'}`}
                                                title={lesson.content ? "Content Generated" : "Generate Content"}
                                             >
                                                {lesson.content ? <CheckCircle size={16} /> : <Wand2 size={16} />}
                                             </button>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Main: Thumbnail & Preview */}
                        <div className="flex-1 space-y-6">
                           <div className="bg-slate-100 dark:bg-slate-800 aspect-video rounded-xl overflow-hidden relative group">
                              {courseData.thumbnail ? (
                                 <img src={courseData.thumbnail} className="w-full h-full object-cover" />
                              ) : (
                                 <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <ImageIcon size={48} />
                                 </div>
                              )}
                              <button
                                 onClick={handleGenerateThumbnail}
                                 disabled={loading}
                                 className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white px-4 py-2 rounded-lg backdrop-blur-sm text-sm font-medium flex items-center gap-2 transition-all"
                              >
                                 <Wand2 size={16} /> {courseData.thumbnail ? 'Regenerate Cover' : 'Generate Cover'}
                              </button>
                           </div>

                           <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-200">
                              <p>Tip: Click the wand icon next to each lesson to generate its content using AI. Once you're happy with the structure and content, click Next to review.</p>
                           </div>

                           <div className="flex justify-end pt-4">
                              <button
                                 onClick={() => setStep(3)}
                                 className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all"
                              >
                                 Next: Review <ChevronRight size={20} />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Step 3: Review & Publish */}
               {step === 3 && (
                  <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                     <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Review & Publish</h2>
                        <p className="text-slate-500">Double check everything before your course goes live.</p>
                     </div>

                     {/* Course Card Preview */}
                     <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="aspect-video w-full relative">
                           {courseData.thumbnail ? (
                              <img src={courseData.thumbnail} className="w-full h-full object-cover" />
                           ) : (
                              <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                 <ImageIcon size={48} className="text-slate-400" />
                              </div>
                           )}
                           <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                              {courseData.category}
                           </div>
                        </div>
                        <div className="p-8">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{courseData.title}</h1>
                                 <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{courseData.description}</p>
                              </div>
                              <div className="text-right">
                                 <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${courseData.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                       courseData.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                    {courseData.difficulty}
                                 </span>
                              </div>
                           </div>

                           <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
                              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4">Curriculum</h3>
                              <div className="space-y-4">
                                 {courseData.modules?.map((mod, i) => (
                                    <div key={i}>
                                       <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{i + 1}. {mod.title}</h4>
                                       <ul className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-2">
                                          {mod.lessons?.map((lesson, j) => (
                                             <li key={j} className="text-sm text-slate-600 dark:text-slate-400 flex justify-between">
                                                <span>{lesson.title}</span>
                                                <span className="text-xs opacity-70">{lesson.duration}</span>
                                             </li>
                                          ))}
                                       </ul>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex justify-between pt-4">
                        <button
                           onClick={() => setStep(2)}
                           className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold px-6 py-3 transition-colors"
                        >
                           Back to Edit
                        </button>
                        <button
                           onClick={handleSave}
                           disabled={loading}
                           className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 flex items-center gap-2 transition-all transform hover:scale-105"
                        >
                           {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                           Publish Now
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {loading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
               <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-pop-in">
                  <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
                  <p className="text-lg font-medium text-slate-800 dark:text-white">{statusMsg}</p>
               </div>
            </div>
         )}
      </div>
   );
};

export default CourseCreator;
