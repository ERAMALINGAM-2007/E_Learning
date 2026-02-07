import React, { useState, useEffect, useMemo, useRef } from 'react';
import { flushSync } from 'react-dom';
import { BookOpen, BarChart2, User as UserIcon, LogOut, Loader2, Image as ImageIcon, Sun, Moon, Play, Pause, Volume2, VolumeX, Maximize, Captions, CreditCard, Gamepad2, Trophy, Users, Sparkles } from 'lucide-react';
import { ViewState, Course, User } from './types';
import { db } from './services/db';

import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import CourseCreator from './components/CourseCreator';
import CourseViewer from './components/CourseViewer';
import Profile from './components/Profile';
import GameCenter from './components/GameCenter';
import DailyChallenges from './components/DailyChallenges';
import CommunityHighlight from './components/CommunityHighlight';
import Payments from './components/Payments';
import TechStackMarquee from './components/TechStackMarquee';
import TypingText from './components/TypingText';
import Blog from './components/Blog';
import RelaxTab from './components/RelaxTab';


import { PrivacyPage, TermsPage, CookiePage, AccessibilityPage, HelpCenterPage, CommunityPage, SuccessStoriesPage, PricingPage, CoursesPage, InstructorsPage, SecurityPage, SitemapPage } from './components/FooterPages';
import ArtGallery from './components/ArtGallery';





// --- Theme Toggle Component ---
const ThemeToggle = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => {
  const [poppingIcon, setPoppingIcon] = useState<{ icon: 'sun' | 'moon', id: number } | null>(null);

  const handleClick = () => {
    // Capture the icon that is about to leave
    setPoppingIcon({ icon: isDark ? 'sun' : 'moon', id: Date.now() });
    toggleTheme();
    // Clear the popping icon after animation finishes
    setTimeout(() => setPoppingIcon(null), 600);
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group overflow-visible"
      title="Toggle Theme"
    >
      {/* The Popping Ghost Icon - Leaving */}
      {poppingIcon && (
        <div
          key={poppingIcon.id}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100] theme-toggle-ghost"
        >
          {poppingIcon.icon === 'sun' ? (
            <Sun size={20} className="text-orange-500 animate-pop-out-up" />
          ) : (
            <Moon size={20} className="text-blue-500 animate-pop-out-up" />
          )}
        </div>
      )}

      {/* The Main Icon - Entering */}
      {isDark ? (
        <Sun key="dark-sun" size={20} className="text-orange-500 animate-icon-pop theme-toggle-icon relative z-10" />
      ) : (
        <Moon key="light-moon" size={20} className="text-blue-500 animate-icon-pop theme-toggle-icon relative z-10" />
      )}
    </button>
  );
};

// --- Goodbye Overlay Component ---
const SAD_EMOJIS = ['😢', '😭', '😿', '💔', '👋', '😞', '🥺', '🌧️', '🧸', '🥀'];

const GoodbyeOverlay = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      // Calculate random angle and distance for explosion from center
      const angle = Math.random() * Math.PI * 2;
      const velocity = 300 + Math.random() * 800; // Distance to fly
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      const rotation = Math.random() * 720 - 360;

      return {
        id: i,
        emoji: SAD_EMOJIS[Math.floor(Math.random() * SAD_EMOJIS.length)],
        style: {
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          '--r': `${rotation}deg`,
          left: '50%',
          top: '50%',
          position: 'absolute' as const,
          fontSize: `${32 + Math.random() * 50}px`,
          animationDelay: `${Math.random() * 0.2}s`, // Slight stagger
          textShadow: '0 4px 10px rgba(0,0,0,0.3)'
        } as React.CSSProperties
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 z-[9999] flex items-center justify-center overflow-hidden animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />

      <div className="relative z-10 text-center animate-pop-in">
        <h2 className="text-6xl font-black text-white mb-6 drop-shadow-2xl">Good Bye!</h2>
        <p className="text-2xl text-slate-300">We'll miss you!</p>
      </div>

      {particles.map(p => (
        <div
          key={p.id}
          className="animate-explode pointer-events-none select-none absolute"
          style={p.style}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

// --- Footer Component ---
const Footer = ({ setView }: { setView: (view: ViewState) => void }) => (
  <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors duration-300 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-1.5 rounded-lg">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight">Cognition<span className="text-brand-600 dark:text-brand-400">AI</span></span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
            Empowering the next generation of learners with AI-driven personalized education. Master any skill, faster than ever.
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-brand-100 hover:text-brand-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-brand-100 hover:text-brand-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-brand-100 hover:text-brand-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Product</h3>
          <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm">
            <li><button onClick={() => setView(ViewState.COURSES)} className="hover:text-brand-600 transition-colors text-left">Courses</button></li>
            <li><button onClick={() => setView(ViewState.PRICING)} className="hover:text-brand-600 transition-colors text-left">Pricing</button></li>
            <li><button onClick={() => setView(ViewState.INSTRUCTORS)} className="hover:text-brand-600 transition-colors text-left">For Instructors</button></li>
            <li><button onClick={() => setView(ViewState.SUCCESS_STORIES)} className="hover:text-brand-600 transition-colors text-left">Success Stories</button></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Resources</h3>
          <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm">
            <li><button onClick={() => setView(ViewState.BLOG)} className="hover:text-brand-600 transition-colors text-left">Blog</button></li>
            <li><button onClick={() => setView(ViewState.HELP_CENTER)} className="hover:text-brand-600 transition-colors text-left">Help Center</button></li>
            <li><button onClick={() => setView(ViewState.ART_GALLERY)} className="hover:text-brand-600 transition-colors text-left">ART Book</button></li>
            <li><button onClick={() => setView(ViewState.COMMUNITY)} className="hover:text-brand-600 transition-colors text-left">Community</button></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Legal</h3>
          <ul className="space-y-3 text-slate-500 dark:text-slate-400 text-sm">
            <li><button onClick={() => setView(ViewState.PRIVACY)} className="hover:text-brand-600 transition-colors text-left">Privacy Policy</button></li>
            <li><button onClick={() => setView(ViewState.TERMS)} className="hover:text-brand-600 transition-colors text-left">Terms of Service</button></li>
            <li><button onClick={() => setView(ViewState.COOKIE)} className="hover:text-brand-600 transition-colors text-left">Cookie Policy</button></li>
            <li><button onClick={() => setView(ViewState.ACCESSIBILITY)} className="hover:text-brand-600 transition-colors text-left">Accessibility</button></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Cognition AI Learning. All rights reserved.</p>
        <div className="flex gap-6 text-sm text-slate-400">
          <button onClick={() => setView(ViewState.SECURITY)} className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Security</button>
          <button onClick={() => setView(ViewState.SITEMAP)} className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">Sitemap</button>
        </div>
      </div>
    </div>
  </footer>
);


interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  currentUser: User;
  view: ViewState;
  setView: (view: ViewState) => void;
  handleLogout: () => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  currentUser,
  view,
  setView,
  handleLogout,
  toggleTheme,
  isDark
}) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
    {/* Sidebar */}
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col fixed inset-y-0 z-20 transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 cursor-pointer" onClick={() => setView(currentUser.role === 'instructor' ? ViewState.INSTRUCTOR_DASHBOARD : ViewState.STUDENT_DASHBOARD)}>
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
          <BookOpen className="fill-current w-6 h-6" />
          <span className="font-bold text-lg text-slate-800 dark:text-slate-100">Cognition</span>
        </div>
      </div>

      <div className="p-4 space-y-1">
        <button
          onClick={() => setView(currentUser.role === 'instructor' ? ViewState.INSTRUCTOR_DASHBOARD : ViewState.STUDENT_DASHBOARD)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view.includes('DASHBOARD') ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <BookOpen size={20} /> {currentUser.role === 'instructor' ? 'Manage Courses' : 'My Learning'}
        </button>

        {/* Payment Section */}
        <button
          onClick={() => setView(ViewState.PAYMENTS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === ViewState.PAYMENTS ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <CreditCard size={20} /> Payments
        </button>

        {/* Play Section */}
        <button
          onClick={() => setView(ViewState.GAME_CENTER)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === ViewState.GAME_CENTER ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <Gamepad2 size={20} /> Play
        </button>

        {/* Daily Challenges Section */}
        <button
          onClick={() => setView(ViewState.DAILY_CHALLENGES)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === ViewState.DAILY_CHALLENGES ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <Trophy size={20} /> Daily Challenges
        </button>

        {/* Community Section */}
        <button
          onClick={() => setView(ViewState.COMMUNITY_HIGHLIGHT)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === ViewState.COMMUNITY_HIGHLIGHT ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <Users size={20} /> Community Highlight
        </button>

        {/* Relax Section - Only for students */}
        {currentUser.role === 'student' && (
          <button
            onClick={() => setView(ViewState.RELAX)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === ViewState.RELAX ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Sparkles size={20} /> Relax
          </button>
        )}

        <button
          onClick={() => setView(ViewState.PROFILE)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${view === ViewState.PROFILE ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <UserIcon size={20} /> Profile
        </button>
      </div>

      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
        </div>

        <div className="px-4 py-3 mb-2 flex items-center gap-3">
          <img src={currentUser.avatar} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{currentUser.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors">
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </aside>

    {/* Main */}
    <main className="flex-1 md:ml-64 relative">
      {children}
    </main>
  </div>
);

// Helper functions for URL navigation
const viewStateToHash = (viewState: ViewState): string => {
  // Convert ViewState enum to URL-friendly hash
  const stateMap: Record<ViewState, string> = {
    [ViewState.LANDING]: '',
    [ViewState.LOGIN]: 'login',
    [ViewState.RESET_PASSWORD]: 'reset-password',
    [ViewState.STUDENT_DASHBOARD]: 'dashboard',
    [ViewState.INSTRUCTOR_DASHBOARD]: 'instructor',
    [ViewState.COURSE_CREATOR]: 'create-course',
    [ViewState.COURSE_VIEWER]: 'course',
    [ViewState.PROFILE]: 'profile',
    [ViewState.GAME_CENTER]: 'games',
    [ViewState.PAYMENTS]: 'payments',
    [ViewState.BLOG]: 'blog',
    [ViewState.ART_GALLERY]: 'art-gallery',
    [ViewState.COURSES]: 'courses',
    [ViewState.PRICING]: 'pricing',
    [ViewState.INSTRUCTORS]: 'instructors',
    [ViewState.SUCCESS_STORIES]: 'success-stories',
    [ViewState.HELP_CENTER]: 'help',
    [ViewState.COMMUNITY]: 'community',
    [ViewState.COMMUNITY_HIGHLIGHT]: 'community-highlight',
    [ViewState.DAILY_CHALLENGES]: 'challenges',
    [ViewState.RELAX]: 'relax',
    [ViewState.PRIVACY]: 'privacy',
    [ViewState.TERMS]: 'terms',
    [ViewState.COOKIE]: 'cookies',
    [ViewState.ACCESSIBILITY]: 'accessibility',
    [ViewState.SECURITY]: 'security',
    [ViewState.SITEMAP]: 'sitemap'
  };
  return stateMap[viewState] || '';
};

const hashToViewState = (hash: string): ViewState => {
  // Convert URL hash to ViewState enum
  const cleanHash = hash.replace('#', '');
  const hashMap: Record<string, ViewState> = {
    '': ViewState.LANDING,
    'login': ViewState.LOGIN,
    'reset-password': ViewState.RESET_PASSWORD,
    'dashboard': ViewState.STUDENT_DASHBOARD,
    'instructor': ViewState.INSTRUCTOR_DASHBOARD,
    'create-course': ViewState.COURSE_CREATOR,
    'course': ViewState.COURSE_VIEWER,
    'profile': ViewState.PROFILE,
    'games': ViewState.GAME_CENTER,
    'payments': ViewState.PAYMENTS,
    'blog': ViewState.BLOG,
    'art-gallery': ViewState.ART_GALLERY,
    'courses': ViewState.COURSES,
    'pricing': ViewState.PRICING,
    'instructors': ViewState.INSTRUCTORS,
    'success-stories': ViewState.SUCCESS_STORIES,
    'help': ViewState.HELP_CENTER,
    'community': ViewState.COMMUNITY,
    'community-highlight': ViewState.COMMUNITY_HIGHLIGHT,
    'challenges': ViewState.DAILY_CHALLENGES,
    'relax': ViewState.RELAX,
    'privacy': ViewState.PRIVACY,
    'terms': ViewState.TERMS,
    'cookies': ViewState.COOKIE,
    'accessibility': ViewState.ACCESSIBILITY,
    'security': ViewState.SECURITY,
    'sitemap': ViewState.SITEMAP
  };
  return hashMap[cleanHash] || ViewState.LANDING;
};

const App: React.FC = () => {
  // Initialize view from URL hash if present
  const [view, setView] = useState<ViewState>(() => {
    const hash = window.location.hash;
    if (hash) {
      return hashToViewState(hash);
    }
    return ViewState.LANDING;
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCaptions, setShowCaptions] = useState(true);

  const [isSigningOut, setIsSigningOut] = useState(false);

  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const [showSecondLine, setShowSecondLine] = useState(false);

  // Check URL for token parameter (password reset)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // If there's a token in URL, show reset password view
      setView(ViewState.RESET_PASSWORD);
    }
  }, []);

  // Sync view state with URL hash for browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash;
      const newView = hashToViewState(hash);
      setView(newView);
    };

    // Listen for browser back/forward button clicks
    window.addEventListener('popstate', handlePopState);

    // Update hash when view changes
    const newHash = viewStateToHash(view);
    const currentHash = window.location.hash.replace('#', '');

    if (newHash !== currentHash) {
      if (newHash) {
        window.history.pushState(null, '', `#${newHash}`);
      } else {
        window.history.pushState(null, '', window.location.pathname);
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [view]);

  // Force video play on mount
  useEffect(() => {
    if (view === ViewState.LANDING && videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay blocked:", e));
    }
  }, [view]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Video State
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current?.parentElement) {
      if (!document.fullscreenElement) {
        videoRef.current.parentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const toggleCaptions = () => {
    if (videoRef.current && videoRef.current.textTracks[0]) {
      const mode = videoRef.current.textTracks[0].mode;
      videoRef.current.textTracks[0].mode = mode === 'showing' ? 'hidden' : 'showing';
      setShowCaptions(mode !== 'showing');
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Wave Transition Logic
  const toggleTheme = () => {
    const isDark = theme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    // @ts-ignore - Check for View Transition API support
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    // Start transition from BOTTOM-LEFT corner
    const x = 0;
    const y = window.innerHeight;

    // Calculate distance to furthest corner (Top Right)
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      // Use flushSync to force the state update to happen synchronously
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    // Animate the clip-path
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          // Always animate the NEW view entering on top
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  // Sync with Mock DB
  useEffect(() => {
    const syncData = () => {
      setCourses(db.getCourses());
      const user = db.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        // If on landing and has user, go to dashboard
        if (view === ViewState.LANDING || view === ViewState.LOGIN) {
          setView(user.role === 'instructor' ? ViewState.INSTRUCTOR_DASHBOARD : ViewState.STUDENT_DASHBOARD);
        }
      }
    };

    syncData();
    // Subscribe to DB changes (simulated websockets/storage events)
    const unsubscribe = db.subscribe(syncData);
    return () => unsubscribe();
  }, [view]);

  // --- Handlers ---

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView(user.role === 'instructor' ? ViewState.INSTRUCTOR_DASHBOARD : ViewState.STUDENT_DASHBOARD);
  };

  const handleLogout = () => {
    // Start Goodbye Animation
    setIsSigningOut(true);

    // Delay actual logout
    setTimeout(() => {
      db.logout();
      setCurrentUser(null);
      setCourseToEdit(null);
      setView(ViewState.LANDING);
      setIsSigningOut(false);
    }, 2800); // Wait for animation to finish
  };

  const handleCourseClick = (id: string) => {
    if (currentUser?.role === 'instructor') {
      // Instructor preview
      const course = courses.find(c => c.id === id);
      if (course) {
        setCourseToEdit(course);
        setView(ViewState.COURSE_CREATOR);
      }
    } else {
      // Enroll if not enrolled
      if (currentUser && !currentUser.enrolledCourseIds.includes(id)) {
        db.enrollUser(currentUser.id, id);
      }
      setSelectedCourseId(id);
      setView(ViewState.COURSE_VIEWER);
    }
  };

  // --- Render Function ---
  const renderCurrentView = () => {
    // Reset Password View
    if (view === ViewState.RESET_PASSWORD) {
      return <ResetPassword onBackToLogin={() => setView(ViewState.LOGIN)} />;
    }

    if (view === ViewState.BLOG) {
      return <Blog onBack={() => setView(ViewState.LANDING)} />;
    }

    if (view === ViewState.ART_GALLERY) {
      return <ArtGallery onBack={() => setView(ViewState.LANDING)} />;
    }

    if (view === ViewState.PRIVACY) return <PrivacyPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.TERMS) return <TermsPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.COOKIE) return <CookiePage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.ACCESSIBILITY) return <AccessibilityPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.HELP_CENTER) return <HelpCenterPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.COMMUNITY) return <CommunityPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.SUCCESS_STORIES) return <SuccessStoriesPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.PRICING) return <PricingPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.COURSES) return <CoursesPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.INSTRUCTORS) return <InstructorsPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.SECURITY) return <SecurityPage onBack={() => setView(ViewState.LANDING)} />;
    if (view === ViewState.SITEMAP) return <SitemapPage onBack={() => setView(ViewState.LANDING)} />;

    // Login View
    if (view === ViewState.LOGIN) {
      return <Login onLogin={handleLogin} />;
    }

    if (currentUser) {
      if (view === ViewState.COURSE_CREATOR) {
        return (
          <AuthenticatedLayout
            currentUser={currentUser}
            view={view}
            setView={setView}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDark={theme === 'dark'}
          >
            <CourseCreator
              key={courseToEdit ? courseToEdit.id : 'new-course'}
              currentUser={currentUser}
              initialCourse={courseToEdit || undefined}
              onBack={() => {
                setCourseToEdit(null);
                setView(ViewState.INSTRUCTOR_DASHBOARD);
              }}
              onCreated={() => {
                setCourseToEdit(null);
                setView(ViewState.INSTRUCTOR_DASHBOARD);
              }}
            />
          </AuthenticatedLayout>
        );
      }

      if (view === ViewState.INSTRUCTOR_DASHBOARD) {
        return (
          <AuthenticatedLayout
            currentUser={currentUser}
            view={view}
            setView={setView}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDark={theme === 'dark'}
          >
            <InstructorDashboard
              user={currentUser}
              courses={courses}
              onCreateCourse={() => {
                setCourseToEdit(null);
                setView(ViewState.COURSE_CREATOR);
              }}
              onEditCourse={(courseId) => {
                const course = courses.find(c => c.id === courseId);
                if (course) {
                  setCourseToEdit(course);
                  setView(ViewState.COURSE_CREATOR);
                }
              }}
            />
          </AuthenticatedLayout>
        );
      }

      if (view === ViewState.STUDENT_DASHBOARD) {
        return (
          <AuthenticatedLayout
            currentUser={currentUser}
            view={view}
            setView={setView}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDark={theme === 'dark'}
          >
            <StudentDashboard
              user={currentUser}
              courses={courses.filter(c => c.isPublished)}
              onCourseClick={handleCourseClick}
              onResumeCourse={(id) => {
                setSelectedCourseId(id);
                setView(ViewState.COURSE_VIEWER);
              }}
              onOpenGames={() => setView(ViewState.GAME_CENTER)}
            />
          </AuthenticatedLayout>
        );
      }

      if (view === ViewState.GAME_CENTER) {
        return (
          <AuthenticatedLayout
            currentUser={currentUser}
            view={view}
            setView={setView}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDark={theme === 'dark'}
          >
            <GameCenter onBack={() => setView(ViewState.STUDENT_DASHBOARD)} />
          </AuthenticatedLayout>
        );
      }

      if (view === ViewState.DAILY_CHALLENGES) {
        return (
          <AuthenticatedLayout
            currentUser={currentUser}
            view={view}
            setView={setView}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDark={theme === 'dark'}
          >
            <DailyChallenges onBack={() => setView(ViewState.STUDENT_DASHBOARD)} />
          </AuthenticatedLayout>
        );
      }

      if (view === ViewState.COMMUNITY_HIGHLIGHT) {
        return (
          <AuthenticatedLayout
            currentUser={currentUser}
            view={view}
            setView={setView}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDark={theme === 'dark'}
          >
            <CommunityHighlight onBack={() => setView(ViewState.STUDENT_DASHBOARD)} />
          </AuthenticatedLayout>
        );
      }

      if (view === ViewState.RELAX) {
        return (
          <AuthenticatedLayout
            currentUser={currentUser}
            view={view}
            setView={setView}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDark={theme === 'dark'}
          >
            <RelaxTab onBack={() => setView(ViewState.STUDENT_DASHBOARD)} />
          </AuthenticatedLayout>
        );
      }

      if (view === ViewState.PAYMENTS) {
        return (
          <AuthenticatedLayout
            currentUser={currentUser}
            view={view}
            setView={setView}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDark={theme === 'dark'}
          >
            <Payments user={currentUser} />
          </AuthenticatedLayout>
        );
      }

      if (view === ViewState.PROFILE) {
        return (
          <AuthenticatedLayout
            currentUser={currentUser}
            view={view}
            setView={setView}
            handleLogout={handleLogout}
            toggleTheme={toggleTheme}
            isDark={theme === 'dark'}
          >
            <Profile user={currentUser} onBack={() => { }} />
          </AuthenticatedLayout>
        );
      }



      if (view === ViewState.COURSE_VIEWER && selectedCourseId) {
        const course = courses.find(c => c.id === selectedCourseId);
        if (course) {
          return <CourseViewer course={course} currentUser={currentUser} onBack={() => setView(ViewState.STUDENT_DASHBOARD)} />;
        }
      }
    }

    // Default Landing Page
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
        <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 p-1.5 rounded-lg">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-slate-800 dark:text-slate-100 tracking-tight">Cognition<span className="text-brand-600 dark:text-brand-400">AI</span></span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle isDark={theme === 'dark'} toggleTheme={toggleTheme} />
              <button onClick={() => setView(ViewState.LOGIN)} className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-sm">Log in</button>
              <button onClick={() => setView(ViewState.LOGIN)} className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-brand-500/30">
                Get Started
              </button>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-400/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px]" />

          <div className="max-w-4xl mx-auto text-center relative z-10">

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
              <TypingText
                text="Master any skill with your"
                speed={50}
                loop={false}
                className="block mb-2"
                cursorClassName="hidden"
                hideCursorOnComplete={true}
                onComplete={() => setShowSecondLine(true)}
              />
              <TypingText
                text="Personal AI Tutor"
                speed={100}
                loop={false}
                start={showSecondLine}
                hideCursorOnComplete={true}
                className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400"
                cursorClassName="text-brand-600 dark:text-brand-400"
              />
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
              Experience the future of learning. Generate courses instantly, track real progress, and master topics with AI assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 fill-mode-both mb-16">
              <button onClick={() => setView(ViewState.LOGIN)} className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white rounded-full font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/40 hover:-translate-y-1">
                Start Learning Now
              </button>
            </div>

            <div
              className="mb-10 relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-1000 group"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setShowControls(false)}
            >
              <div className="absolute inset-0 bg-brand-900/10 z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
              <video
                ref={videoRef}
                src="/landing-video.mp4"
                poster="/video-thumbnail-small.png"
                autoPlay
                playsInline
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={togglePlay}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105 cursor-pointer"
              >
                <track
                  kind="subtitles"
                  src="/subtitles.vtt"
                  srcLang="en"
                  label="English"
                  default
                />
              </video>

              {/* Custom Controls Overlay */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 z-30 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500"
                />

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    {/* Play/Pause */}
                    <button onClick={togglePlay} className="hover:text-brand-400 transition-colors">
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>

                    {/* CC Button (Left of Volume) */}
                    <button
                      onClick={toggleCaptions}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${showCaptions ? 'text-brand-400 bg-white/10' : 'text-white/70 hover:text-white'}`}
                      title="Toggle Captions"
                    >
                      <Captions size={20} />
                    </button>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2 group/vol">
                      <button onClick={toggleMute} className="hover:text-brand-400 transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                    </div>
                  </div>

                  {/* Fullscreen */}
                  <button onClick={toggleFullscreen} className="hover:text-brand-400 transition-colors">
                    <Maximize size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Marquee */}
          <div className="w-full mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-both">
            <div className="text-center mb-10">
              <p className="text-base font-bold text-brand-600 dark:text-brand-400 tracking-widest uppercase">Powered by Modern Tech</p>
            </div>
            <TechStackMarquee />
          </div>

        </div>

        <Footer setView={setView} />
      </div>
    );
  };

  return (
    <>
      {isSigningOut && <GoodbyeOverlay />}
      {renderCurrentView()}
    </>
  );
};

export default App;
