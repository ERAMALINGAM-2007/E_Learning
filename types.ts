export enum ViewState {
  LANDING = 'landing',
  LOGIN = 'login',
  RESET_PASSWORD = 'reset_password',
  STUDENT_DASHBOARD = 'student_dashboard',
  INSTRUCTOR_DASHBOARD = 'instructor_dashboard',
  COURSE_CREATOR = 'course_creator',
  COURSE_VIEWER = 'course_viewer',
  PROFILE = 'profile',
  GAME_CENTER = 'game_center',
  PAYMENTS = 'payments',
  BLOG = 'blog',
  ART_GALLERY = 'art_gallery',
  COURSES = 'courses',
  PRICING = 'pricing',
  INSTRUCTORS = 'instructors',
  SUCCESS_STORIES = 'success_stories',
  HELP_CENTER = 'help_center',
  COMMUNITY = 'community',
  COMMUNITY_HIGHLIGHT = 'community_highlight',
  DAILY_CHALLENGES = 'daily_challenges',
  RELAX = 'relax',
  PRIVACY = 'privacy',
  TERMS = 'terms',
  COOKIE = 'cookie',
  ACCESSIBILITY = 'accessibility',
  SECURITY = 'security',
  SITEMAP = 'sitemap'
}

export type Role = 'student' | 'instructor';

export interface UserNote {
  id: string;
  courseId: string;
  lessonId: string;
  timestamp: number;
  text: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  verifyUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
  bio: string;
  xp: number;
  streak: number;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  achievements: Achievement[];
  notes: UserNote[];
  certificates: Certificate[];
  subscriptionStatus: 'active' | 'paused';
  subscriptionPausedUntil?: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlockedAt: string; // ISO date
}

export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown
  duration: string; // e.g. "5 min"
  videoUrl?: string; // Mock URL or Veo generated
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // URL
  previewVideoUrl?: string; // URL (Veo)
  instructorId: string;
  instructorName: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPublished: boolean;
  totalLessons: number;
  modules: Module[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Flashcard {
  front: string;
  back: string;
}
