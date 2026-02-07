
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, FileText, ChevronRight, Sparkles, Volume2, VolumeX, Maximize, Minimize, Settings, SkipBack, SkipForward, Menu, Headphones, Download, WifiOff, PenTool, CheckCircle, FileDown, Award, X } from 'lucide-react';
import { Course, User, Lesson, UserNote } from '../types';
import AITutorPanel from './AITutorPanel';
import { db } from '../services/db';
import AudioWaveform from './AudioWaveform';

interface CourseViewerProps {
  course: Course;
  currentUser: User;
  onBack: () => void;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer: React.FC<{
  src: string;
  poster?: string;
  isCommuterMode: boolean;
  onNoteClick: (time: number) => void;
}> = ({ src, poster, isCommuterMode, onNoteClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (videoRef.current) {
      const newTime = (newProgress / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const handleSpeedChange = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newRate = speeds[nextIdx];
    setPlaybackRate(newRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) setShowControls(false);
  };

  // --- COMMUTER MODE UI ---
  if (isCommuterMode) {
    return (
      <div className="bg-slate-900 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl border border-slate-700 min-h-[400px]">
        {/* Hidden Video Element for Audio Source */}
        <video ref={videoRef} src={src} className="hidden" />

        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-brand-600 to-purple-600 shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center mb-10">
          <AudioWaveform isPlaying={isPlaying} />
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-between text-slate-400 font-mono text-sm">
            <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Large Progress Bar */}
          <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 bottom-0 bg-brand-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range" min="0" max="100" value={progress} onChange={handleSeek}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {/* Giant Controls */}
          <div className="flex items-center justify-center gap-12">
            <button
              onClick={() => { if (videoRef.current) videoRef.current.currentTime -= 15; }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <SkipBack size={40} />
            </button>

            <button
              onClick={togglePlay}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform shadow-xl"
            >
              {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
            </button>

            <button
              onClick={() => { if (videoRef.current) videoRef.current.currentTime += 15; }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <SkipForward size={40} />
            </button>
          </div>

          <p className="text-center text-slate-500 text-sm flex items-center justify-center gap-2 mt-4">
            <WifiOff size={16} /> Commuter Mode Active
          </p>
        </div>
      </div>
    );
  }

  // --- STANDARD VIDEO UI ---
  return (
    <div
      ref={containerRef}
      className="relative rounded-xl overflow-hidden bg-black aspect-video group shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      />

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-pop-in">
            <Play size={32} fill="white" className="text-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-12 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>

        {/* Progress Bar */}
        <div className="relative h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer group/slider">
          <div
            className="absolute left-0 top-0 bottom-0 bg-brand-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {/* Scrubber Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity"
            style={{ left: `${progress}%`, marginLeft: '-6px' }}
          />
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-brand-400 transition-colors">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>

            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="hover:text-brand-400 transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>

            <span className="text-xs font-medium tabular-nums opacity-80">
              {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Feature: Save to Notes */}
            <button
              onClick={(e) => { e.stopPropagation(); onNoteClick(videoRef.current?.currentTime || 0); }}
              className="flex items-center gap-1 hover:text-brand-400 transition-colors text-xs font-bold bg-white/10 px-2 py-1 rounded"
              title="Add to Cheat Sheet"
            >
              <PenTool size={14} /> Add Note
            </button>

            <button
              onClick={handleSpeedChange}
              className="text-xs font-bold hover:bg-white/20 px-2 py-1 rounded transition-colors"
              title="Playback Speed"
            >
              {playbackRate}x
            </button>
            <button onClick={toggleFullscreen} className="hover:text-brand-400 transition-colors">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseViewer: React.FC<CourseViewerProps> = ({ course, currentUser, onBack }) => {
  // Safe initialization to handle empty courses or modules
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(() => {
    if (course.modules && course.modules.length > 0) {
      for (const module of course.modules) {
        if (module.lessons && module.lessons.length > 0) {
          return module.lessons[0];
        }
      }
    }
    return null;
  });

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAIPanelOpen, setAIPanelOpen] = useState(true);

  // Feature State
  const [isCommuterMode, setIsCommuterMode] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [currentNoteTime, setCurrentNoteTime] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<UserNote[]>(currentUser.notes || []);

  const defaultVideo = "https://cdn.pixabay.com/video/2020/05/25/40149-423580549_large.mp4";

  // Feature: Offline Data-Pack Download
  const handleDownloadPack = () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsDownloading(false), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Feature: Add Note Logic
  const handleAddNote = (time: number) => {
    setCurrentNoteTime(time);
    setShowNoteInput(true);
  };

  const saveNote = () => {
    if (!activeLesson) return;
    const newNote: UserNote = {
      id: `note-${Date.now()}`,
      courseId: course.id,
      lessonId: activeLesson.id,
      timestamp: currentNoteTime,
      text: noteText,
      createdAt: new Date().toISOString()
    };

    db.addNote(currentUser.id, newNote);
    setNotes(prev => [...prev, newNote]);
    setNoteText('');
    setShowNoteInput(false);
  };

  // Feature: Cheat Sheet Generation
  const generateCheatSheet = () => {
    const courseNotes = notes.filter(n => n.courseId === course.id);
    if (courseNotes.length === 0) {
      alert("No notes saved for this course yet!");
      return;
    }

    let content = `CHEAT SHEET: ${course.title}\nStudent: ${currentUser.name}\nGenerated: ${new Date().toLocaleDateString()}\n\n`;

    courseNotes.forEach((n, i) => {
      content += `${i + 1}. [${formatTime(n.timestamp)}] ${n.text}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CheatSheet_${course.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleLessonComplete = () => {
    if (!activeLesson) return;

    // Mock completion logic - find next lesson
    let foundCurrent = false;
    let nextLesson: Lesson | null = null;

    if (course.modules) {
      for (const module of course.modules) {
        if (module.lessons) {
          for (const lesson of module.lessons) {
            if (foundCurrent) {
              nextLesson = lesson;
              break;
            }
            if (lesson.id === activeLesson.id) {
              foundCurrent = true;
            }
          }
        }
        if (nextLesson) break;
      }
    }

    if (nextLesson) {
      setActiveLesson(nextLesson);
    } else {
      // Feature: Certificate Generation
      const cert = db.issueCertificate(currentUser.id, course.id, course.title);
      if (cert) {
        alert(`Course Completed! 🎉\nVerified Certificate Generated: ${cert.id}`);
      } else {
        alert("Course Completed! 🎉");
      }
    }
  };

  // --- Empty State (Crash Prevention) ---
  if (!activeLesson) {
    return (
      <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 px-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-slate-800 dark:text-white">{course.title}</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Content Available</h2>
          <p className="text-slate-500 max-w-md">This course doesn't have any lessons yet. Please check back later or contact the instructor.</p>
          <button onClick={onBack} className="mt-8 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Top Bar */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
            <ArrowLeft size={20} />
          </button>
          <div className="overflow-hidden">
            <h1 className="font-bold text-slate-800 dark:text-white leading-tight truncate">{course.title}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:block truncate">{activeLesson?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Feature 1: Commuter Mode Toggle */}
          <button
            onClick={() => setIsCommuterMode(!isCommuterMode)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isCommuterMode ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
            title="Toggle Commuter Mode (Audio Only)"
          >
            <Headphones size={16} /> <span className="hidden sm:inline">Commuter</span>
          </button>

          {/* Feature 2: Offline Download */}
          <button
            onClick={handleDownloadPack}
            disabled={isDownloading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isDownloading ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            {isDownloading ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                {downloadProgress}%
              </>
            ) : (
              <>
                <Download size={16} /> <span className="hidden lg:inline">Offline Pack</span>
              </>
            )}
          </button>

          <button
            onClick={() => setAIPanelOpen(!isAIPanelOpen)}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isAIPanelOpen ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
          >
            <Sparkles size={16} /> AI Tutor
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Lesson List (Hidden in Commuter Mode) */}
        {!isCommuterMode && (
          <aside className={`absolute md:relative z-10 h-full w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}`}>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center">
              <span>Course Content</span>
              <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                <ArrowLeft size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {course.modules?.map((mod) => (
                <div key={mod.id}>
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 sticky top-0">
                    {mod.title}
                  </div>
                  <div>
                    {mod.lessons?.map((lesson, lIdx) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setActiveLesson(lesson);
                          if (window.innerWidth < 768) setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 border-l-2 transition-colors ${activeLesson.id === lesson.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10 text-brand-700 dark:text-brand-400' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                      >
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${activeLesson.id === lesson.id ? 'bg-brand-200 dark:bg-brand-800 text-brand-800 dark:text-brand-100' : 'bg-slate-200 dark:bg-slate-700'}`}>
                          {lIdx + 1}
                        </span>
                        <span className="line-clamp-2">{lesson.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Feature 3: Export Cheat Sheet */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={generateCheatSheet}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <FileDown size={16} /> Download Cheat Sheet
              </button>
            </div>
          </aside>
        )}

        {/* Mobile Sidebar Toggle (when closed) */}
        {!isSidebarOpen && !isCommuterMode && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-4 top-4 z-10 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg md:hidden"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 flex flex-col relative overflow-y-auto custom-scrollbar scroll-smooth ${isCommuterMode ? 'bg-slate-950 items-center justify-center' : ''}`}>
          <div className={`p-4 md:p-8 w-full ${isCommuterMode ? 'max-w-xl' : 'max-w-5xl mx-auto'}`}>

            {/* Video Player */}
            <div className="mb-8 relative">
              <VideoPlayer
                key={activeLesson.id} // Re-mount on lesson change to reset state
                src={activeLesson.videoUrl || defaultVideo}
                poster={course.thumbnail}
                isCommuterMode={isCommuterMode}
                onNoteClick={handleAddNote}
              />

              {/* Note Input Overlay */}
              {showNoteInput && (
                <div className="absolute top-4 right-4 z-20 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-64 animate-pop-in">
                  <h3 className="text-sm font-bold mb-2 flex items-center justify-between">
                    Add Note at {formatTime(currentNoteTime)}
                    <button onClick={() => setShowNoteInput(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                  </h3>
                  <textarea
                    autoFocus
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    className="w-full h-20 bg-slate-50 dark:bg-slate-800 border-none rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-brand-500 mb-2 outline-none"
                    placeholder="Type your thought..."
                  />
                  <button
                    onClick={saveNote}
                    className="w-full bg-brand-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-brand-700"
                  >
                    Save to Cheat Sheet
                  </button>
                </div>
              )}
            </div>

            {/* Lesson Text Content (Hidden in Commuter Mode) */}
            {!isCommuterMode && (
              <div className="prose dark:prose-invert max-w-none mb-20">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 dark:text-white">{activeLesson.title}</h1>

                {/* Render Content or Fallback */}
                {activeLesson.content ? (
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                    {activeLesson.content.replace(/^#\s(.+)/gm, '')}
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center text-slate-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No text content available for this lesson.</p>
                    <p className="text-xs mt-2">Instructors can generate content in the Course Creator.</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-800">
              <button
                className="px-4 md:px-6 py-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                onClick={() => {/* Logic for prev */ }}
              >
                <SkipBack size={18} /> <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={handleLessonComplete}
                className="px-4 md:px-6 py-3 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/30"
              >
                <span className="hidden sm:inline">Next Lesson</span> <span className="sm:hidden">Next</span> <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </main>

        {/* AI Tutor Panel (Hidden in Commuter Mode) */}
        {!isCommuterMode && isAIPanelOpen && (
          <div className={`fixed inset-y-0 right-0 z-30 transform transition-transform duration-300 ${isAIPanelOpen ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0`}>
            <div className="h-full flex flex-col">
              {/* Mobile Close Button */}
              <button
                onClick={() => setAIPanelOpen(false)}
                className="md:hidden absolute top-2 right-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-full z-40"
              >
                <Minimize size={16} />
              </button>
              <AITutorPanel lessonContent={activeLesson.content || activeLesson.title} />
            </div>
          </div>
        )}

        {/* Mobile AI Toggle FAB */}
        {!isCommuterMode && (
          <button
            onClick={() => setAIPanelOpen(!isAIPanelOpen)}
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-brand-600 text-white rounded-full shadow-xl flex items-center justify-center z-40 animate-pop-in"
          >
            <Sparkles size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseViewer;
