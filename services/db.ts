
import { User, Course, Role, UserNote, Certificate } from '../types';

const STORAGE_KEYS = {
  USERS: 'cognition_users',
  COURSES: 'cognition_courses_v2',
  CURRENT_USER_ID: 'cognition_current_user_id',
  THEME: 'cognition_theme'
};

// Seed Data
const SEED_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to Astrophysics',
    description: 'Explore the wonders of the universe, from black holes to the big bang.',
    thumbnail: 'https://picsum.photos/id/1042/800/450',
    instructorId: 'u2',
    instructorName: 'Dr. Sarah Cosmos',
    category: 'Science',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 5,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'The Solar System',
        lessons: [
          { id: 'l1', title: 'The Sun: Our Star', content: '# The Sun\nThe sun is a star at the center of the Solar System.', duration: '5 min' },
          { id: 'l2', title: 'Planetary Orbits', content: '# Orbits\nKepler laws define planetary motion.', duration: '8 min' }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Advanced React Patterns',
    description: 'Master hooks, HOCs, and compound components.',
    thumbnail: 'https://picsum.photos/id/1/800/450',
    instructorId: 'u2',
    instructorName: 'Dev Master',
    category: 'Programming',
    difficulty: 'Advanced',
    isPublished: true,
    totalLessons: 12,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Hooks Deep Dive',
        lessons: [
          { id: 'l1', title: 'useMemo & useCallback', content: '# Performance Optimization\nLearn when to use memoization hooks.', duration: '15 min' },
          { id: 'l2', title: 'Custom Hooks', content: '# Reusability\nExtracting logic into custom hooks.', duration: '20 min' }
        ]
      },
      {
        id: 'm2',
        title: 'Component Patterns',
        lessons: [
          { id: 'l3', title: 'Compound Components', content: '# Flexible APIs\nBuilding components that work together.', duration: '25 min' }
        ]
      }
    ]
  },
  {
    id: 'c3',
    title: 'Digital Marketing Mastery',
    description: 'Learn SEO, SEM, and social media strategies to grow any business from scratch.',
    thumbnail: 'https://picsum.photos/id/60/800/450',
    instructorId: 'u3',
    instructorName: 'Emily Clark',
    category: 'Business',
    difficulty: 'Intermediate',
    isPublished: true,
    totalLessons: 8,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'SEO Fundamentals',
        lessons: [
          { id: 'l1', title: 'Keyword Research', content: '# Finding Keywords\nTools and strategies for keyword research.', duration: '10 min' },
          { id: 'l2', title: 'On-Page Optimization', content: '# Meta Tags\nOptimizing titles and descriptions.', duration: '12 min' }
        ]
      }
    ]
  },
  {
    id: 'c4',
    title: 'Machine Learning Basics',
    description: 'An introduction to neural networks, predictive modeling, and AI ethics.',
    thumbnail: 'https://picsum.photos/id/20/800/450',
    instructorId: 'u2',
    instructorName: 'Prof. AI Instructor',
    category: 'Data Science',
    difficulty: 'Intermediate',
    isPublished: true,
    totalLessons: 10,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Neural Networks',
        lessons: [
          { id: 'l1', title: 'Perceptrons', content: '# Basic Units\nUnderstanding the building blocks of NNs.', duration: '18 min' },
          { id: 'l2', title: 'Backpropagation', content: '# Learning\nHow networks learn from error.', duration: '22 min' }
        ]
      }
    ]
  },
  {
    id: 'c5',
    title: 'Creative Writing Workshop',
    description: 'Unlock your creativity and learn the techniques to write compelling short stories.',
    thumbnail: 'https://picsum.photos/id/24/800/450',
    instructorId: 'u4',
    instructorName: 'James Penman',
    category: 'Arts',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 6,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Story Structure',
        lessons: [
          { id: 'l1', title: 'The Hero\'s Journey', content: '# Monomyth\nClassic narrative structure.', duration: '15 min' },
          { id: 'l2', title: 'Character Arcs', content: '# Growth\nDeveloping compelling characters.', duration: '20 min' }
        ]
      }
    ]
  },
  {
    id: 'c6',
    title: 'Yoga for Beginners',
    description: 'Find your balance and inner peace with daily yoga routines for flexible living.',
    thumbnail: 'https://picsum.photos/id/65/800/450',
    instructorId: 'u5',
    instructorName: 'Sarah Zen',
    category: 'Health',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 15,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Foundations',
        lessons: [
          { id: 'l1', title: 'Sun Salutation', content: '# Morning Flow\nEnergize your body.', duration: '10 min' },
          { id: 'l2', title: 'Breathing Techniques', content: '# Pranayama\nControl your breath.', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 'c7',
    title: 'Financial Literacy 101',
    description: 'Understanding personal finance, budgeting, and investing for a secure future.',
    thumbnail: 'https://picsum.photos/id/160/800/450',
    instructorId: 'u6',
    instructorName: 'Michael Bond',
    category: 'Finance',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 7,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Budgeting Basics',
        lessons: [
          { id: 'l1', title: 'Tracking Expenses', content: '# Where does it go?\nUnderstanding your spending habits.', duration: '10 min' },
          { id: 'l2', title: 'The 50/30/20 Rule', content: '# Allocation\nA simple budgeting framework.', duration: '12 min' }
        ]
      }
    ]
  },
  {
    id: 'c8',
    title: 'Mobile App Development with Flutter',
    description: 'Build beautiful native apps for iOS and Android with a single codebase.',
    thumbnail: 'https://picsum.photos/id/180/800/450',
    instructorId: 'u2',
    instructorName: 'Dev Master',
    category: 'Programming',
    difficulty: 'Intermediate',
    isPublished: true,
    totalLessons: 20,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Dart Basics',
        lessons: [
          { id: 'l1', title: 'Variables & Functions', content: '# Dart Syntax\nGetting started with Dart.', duration: '15 min' }
        ]
      },
      {
        id: 'm2',
        title: 'Flutter Widgets',
        lessons: [
          { id: 'l2', title: 'Stateless vs Stateful', content: '# State Management\nUnderstanding widget lifecycle.', duration: '20 min' }
        ]
      }
    ]
  },
  {
    id: 'c9',
    title: 'Photography Masterclass',
    description: 'Master your camera and learn the art of composition and lighting.',
    thumbnail: 'https://picsum.photos/id/250/800/450',
    instructorId: 'u7',
    instructorName: 'Lens Queen',
    category: 'Arts',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 12,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Camera Settings',
        lessons: [
          { id: 'l1', title: 'ISO, Aperture, Shutter', content: '# Exposure Triangle\nBalancing light.', duration: '20 min' }
        ]
      }
    ]
  },
  {
    id: 'c10',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn how to protect networks, devices, and data from cyber attacks.',
    thumbnail: 'https://picsum.photos/id/300/800/450',
    instructorId: 'u8',
    instructorName: 'Secure Net',
    category: 'Technology',
    difficulty: 'Intermediate',
    isPublished: true,
    totalLessons: 15,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Threat Landscape',
        lessons: [
          { id: 'l1', title: 'Malware Types', content: '# Viruses & Trojans\nIdentifying threats.', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 'c11',
    title: 'Data Structures & Algorithms',
    description: 'Ace your coding interviews with a deep dive into DSA.',
    thumbnail: 'https://picsum.photos/id/350/800/450',
    instructorId: 'u2',
    instructorName: 'Dev Master',
    category: 'Programming',
    difficulty: 'Advanced',
    isPublished: true,
    totalLessons: 25,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Arrays & Strings',
        lessons: [
          { id: 'l1', title: 'Two Pointer Technique', content: '# Optimization\nSolving array problems efficiently.', duration: '20 min' }
        ]
      }
    ]
  },
  {
    id: 'c12',
    title: 'UI/UX Design Principles',
    description: 'Design user-friendly interfaces and experiences that users love.',
    thumbnail: 'https://picsum.photos/id/400/800/450',
    instructorId: 'u9',
    instructorName: 'Design Guru',
    category: 'Design',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 10,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Design Thinking',
        lessons: [
          { id: 'l1', title: 'Empathize', content: '# User Research\nUnderstanding user needs.', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 'c13',
    title: 'Introduction to Psychology',
    description: 'Explore the human mind and behavior.',
    thumbnail: 'https://picsum.photos/id/450/800/450',
    instructorId: 'u10',
    instructorName: 'Dr. Freud',
    category: 'Social Sciences',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 14,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Cognitive Psychology',
        lessons: [
          { id: 'l1', title: 'Memory & Learning', content: '# How we learn\nThe psychology of memory.', duration: '20 min' }
        ]
      }
    ]
  },
  {
    id: 'c14',
    title: 'Public Speaking Mastery',
    description: 'Overcome stage fright and deliver powerful presentations.',
    thumbnail: 'https://picsum.photos/id/500/800/450',
    instructorId: 'u11',
    instructorName: 'Speaker Pro',
    category: 'Personal Development',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 8,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Preparation',
        lessons: [
          { id: 'l1', title: 'Structuring Your Speech', content: '# Outline\nBuilding a logical flow.', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 'c15',
    title: 'Blockchain & Cryptocurrency',
    description: 'Understand the technology behind Bitcoin, Ethereum, and Web3.',
    thumbnail: 'https://picsum.photos/id/550/800/450',
    instructorId: 'u12',
    instructorName: 'Crypto King',
    category: 'Technology',
    difficulty: 'Advanced',
    isPublished: true,
    totalLessons: 12,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Blockchain Basics',
        lessons: [
          { id: 'l1', title: 'Distributed Ledger', content: '# Decentralization\nHow the blockchain works.', duration: '20 min' }
        ]
      }
    ]
  },
  {
    id: 'c16',
    title: 'Game Development with Unity',
    description: 'Create your first 2D and 3D games using Unity and C#.',
    thumbnail: 'https://picsum.photos/id/600/800/450',
    instructorId: 'u2',
    instructorName: 'Dev Master',
    category: 'Programming',
    difficulty: 'Intermediate',
    isPublished: true,
    totalLessons: 18,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Unity Interface',
        lessons: [
          { id: 'l1', title: 'Scene View & Inspector', content: '# Navigation\nGetting around Unity.', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 'c17',
    title: 'Digital Art for Beginners',
    description: 'Learn digital painting and illustration techniques.',
    thumbnail: 'https://picsum.photos/id/650/800/450',
    instructorId: 'u13',
    instructorName: 'Artistic Soul',
    category: 'Arts',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 10,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Tools & Brushes',
        lessons: [
          { id: 'l1', title: 'Layer Management', content: '# Organization\nWorking with layers.', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 'c18',
    title: 'Sustainable Living',
    description: 'Practical tips for reducing your carbon footprint.',
    thumbnail: 'https://picsum.photos/id/700/800/450',
    instructorId: 'u14',
    instructorName: 'Eco Warrior',
    category: 'Lifestyle',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 6,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Zero Waste Home',
        lessons: [
          { id: 'l1', title: 'Kitchen Swaps', content: '# Reusables\nDitching single-use plastics.', duration: '10 min' }
        ]
      }
    ]
  },
  {
    id: 'c19',
    title: 'Music Theory Basics',
    description: 'Learn to read music and understand harmony.',
    thumbnail: 'https://picsum.photos/id/750/800/450',
    instructorId: 'u15',
    instructorName: 'Maestro',
    category: 'Music',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 12,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Notation',
        lessons: [
          { id: 'l1', title: 'Treble Clef', content: '# Reading Notes\nIdentifying notes on the staff.', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 'c20',
    title: 'Nutrition & Wellness',
    description: 'The science of healthy eating and living.',
    thumbnail: 'https://picsum.photos/id/800/800/450',
    instructorId: 'u16',
    instructorName: 'Health Coach',
    category: 'Health',
    difficulty: 'Beginner',
    isPublished: true,
    totalLessons: 8,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Macronutrients',
        lessons: [
          { id: 'l1', title: 'Carbs, Proteins, Fats', content: '# Balance\nUnderstanding food groups.', duration: '15 min' }
        ]
      }
    ]
  },
  {
    id: 'c21',
    title: 'Project Management Essentials',
    description: 'Learn Agile, Scrum, and how to lead successful projects.',
    thumbnail: 'https://picsum.photos/id/850/800/450',
    instructorId: 'u17',
    instructorName: 'PM Expert',
    category: 'Business',
    difficulty: 'Intermediate',
    isPublished: true,
    totalLessons: 10,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: 'm1',
        title: 'Methodologies',
        lessons: [
          { id: 'l1', title: 'Agile vs Waterfall', content: '# Process\nChoosing the right approach.', duration: '20 min' }
        ]
      }
    ]
  }
];

const SEED_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Student',
    email: 'alex@learn.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    bio: 'Eager learner passionate about tech.',
    xp: 1250,
    streak: 5,
    enrolledCourseIds: ['c1'],
    completedLessonIds: ['l1'],
    achievements: [
      { id: 'a1', title: 'First Steps', icon: '🚀', unlockedAt: new Date().toISOString() }
    ],
    notes: [],
    certificates: [],
    subscriptionStatus: 'active'
  },
  {
    id: 'u2',
    name: 'Prof. AI Instructor',
    email: 'prof@teach.com',
    password: 'password123',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prof',
    bio: 'Senior Lecturer in Computer Science.',
    xp: 5000,
    streak: 20,
    enrolledCourseIds: [],
    completedLessonIds: [],
    achievements: [],
    notes: [],
    certificates: [],
    subscriptionStatus: 'active'
  }
];

class MockDB {
  private listeners: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
        localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(SEED_COURSES));
      }
    }
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  }

  getCourses(): Course[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSES) || '[]');
  }

  getCurrentUser(): User | null {
    const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!id) return null;
    return this.getUsers().find(u => u.id === id) || null;
  }

  login(email: string, password?: string): User | null {
    const user = this.getUsers().find(u => u.email === email);

    // If password provided, check it (simple check for mock)
    if (password && user?.password && user.password !== password) {
      return null;
    }

    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
      this.notify();
    }
    return user || null;
  }

  signup(name: string, email: string, password: string, role: Role): User | null {
    const users = this.getUsers();
    if (users.some(u => u.email === email)) {
      return null; // User already exists
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      bio: 'New learner ready to explore!',
      xp: 0,
      streak: 0,
      enrolledCourseIds: [],
      completedLessonIds: [],
      achievements: [],
      notes: [],
      certificates: [],
      subscriptionStatus: 'active'
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Auto login after signup
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    this.notify();

    return newUser;
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    this.notify();
  }

  saveCourse(course: Course) {
    const courses = this.getCourses();
    courses.push(course);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.notify();
  }

  updateCourse(course: Course) {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    if (index !== -1) {
      courses[index] = course;
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
      this.notify();
    }
  }

  enrollUser(userId: string, courseId: string) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      if (!users[userIndex].enrolledCourseIds.includes(courseId)) {
        users[userIndex].enrolledCourseIds.push(courseId);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        this.notify();
      }
    }
  }

  async updateUser(updatedUser: User): Promise<User | null> {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);

    if (index !== -1) {
      // Optimistic update for immediate UI feedback
      users[index] = updatedUser;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      this.notify();

      try {
        // Sync with backend
        const response = await fetch(`http://localhost:5000/api/users/${updatedUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: updatedUser.name,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar
          }),
        });

        if (!response.ok) {
          console.error('Failed to sync user update with backend');
          // Revert if needed, but for now we keep local changes
          // In a real app, we might show a toast error
        }

        const data = await response.json();
        return data.user || updatedUser;
      } catch (error) {
        console.error('Error syncing user update:', error);
        return updatedUser;
      }
    }
    return null;
  }

  // Feature: Add Notes
  addNote(userId: string, note: UserNote) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      if (!users[index].notes) users[index].notes = [];
      users[index].notes.push(note);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      this.notify();
    }
  }

  // Feature: Generate Certificate
  issueCertificate(userId: string, courseId: string, courseTitle: string) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      if (!users[index].certificates) users[index].certificates = [];
      // Check if already exists
      if (!users[index].certificates.some(c => c.courseId === courseId)) {
        const cert: Certificate = {
          id: `cert-${Date.now()}`,
          courseId,
          courseTitle,
          issueDate: new Date().toISOString(),
          verifyUrl: `https://cognition.ai/verify/${userId.substring(0, 5)}-${courseId}`
        };
        users[index].certificates.push(cert);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        this.notify();
        return cert;
      }
    }
    return null;
  }

  // Feature: Pause Subscription
  toggleSubscriptionPause(userId: string) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      const currentStatus = users[index].subscriptionStatus || 'active';
      users[index].subscriptionStatus = currentStatus === 'active' ? 'paused' : 'active';
      if (users[index].subscriptionStatus === 'paused') {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        users[index].subscriptionPausedUntil = date.toISOString();
      } else {
        delete users[index].subscriptionPausedUntil;
      }
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      this.notify();
    }
  }
}

export const db = new MockDB();
