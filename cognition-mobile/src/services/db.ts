// Database service adapted for React Native using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Course, Module, Lesson, Role, Achievement } from '../types';

const STORAGE_KEYS = {
    USERS: 'cognition_users',
    COURSES: 'cognition_courses',
    CURRENT_USER: 'cognition_current_user',
};

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Default avatar generator
const getDefaultAvatar = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff&size=128`;

// Mock courses data
const mockCourses: Course[] = [
    {
        id: 'course-1',
        title: 'Introduction to Machine Learning',
        description: 'Learn the fundamentals of machine learning, from basic concepts to practical implementations.',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
        instructorId: 'instructor-1',
        instructorName: 'Dr. Sarah Chen',
        category: 'AI & ML',
        difficulty: 'Beginner',
        isPublished: true,
        totalLessons: 12,
        createdAt: new Date().toISOString(),
        modules: [
            {
                id: 'mod-1',
                title: 'Getting Started with ML',
                lessons: [
                    { id: 'lesson-1', title: 'What is Machine Learning?', content: '# Introduction\n\nMachine Learning is a subset of artificial intelligence...', duration: '10 min' },
                    { id: 'lesson-2', title: 'Types of ML Algorithms', content: '# Types of ML\n\n## Supervised Learning\n\nIn supervised learning...', duration: '15 min' },
                    { id: 'lesson-3', title: 'Setting Up Your Environment', content: '# Environment Setup\n\nWe will use Python with popular ML libraries...', duration: '12 min' },
                ],
            },
            {
                id: 'mod-2',
                title: 'Supervised Learning',
                lessons: [
                    { id: 'lesson-4', title: 'Linear Regression', content: '# Linear Regression\n\nOne of the simplest ML algorithms...', duration: '20 min' },
                    { id: 'lesson-5', title: 'Classification Basics', content: '# Classification\n\nClassification is used for categorical predictions...', duration: '18 min' },
                ],
            },
        ],
    },
    {
        id: 'course-2',
        title: 'Advanced React Patterns',
        description: 'Master advanced React concepts including hooks, context, and performance optimization.',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
        instructorId: 'instructor-1',
        instructorName: 'Dr. Sarah Chen',
        category: 'Web Development',
        difficulty: 'Advanced',
        isPublished: true,
        totalLessons: 8,
        createdAt: new Date().toISOString(),
        modules: [
            {
                id: 'mod-3',
                title: 'Advanced Hooks',
                lessons: [
                    { id: 'lesson-6', title: 'Custom Hooks Deep Dive', content: '# Custom Hooks\n\nBuild reusable logic with custom hooks...', duration: '25 min' },
                    { id: 'lesson-7', title: 'useReducer Patterns', content: '# useReducer\n\nManage complex state with useReducer...', duration: '20 min' },
                ],
            },
        ],
    },
    {
        id: 'course-3',
        title: 'UI/UX Design Fundamentals',
        description: 'Create beautiful, user-friendly interfaces with modern design principles.',
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
        instructorId: 'instructor-2',
        instructorName: 'Alex Rivera',
        category: 'Design',
        difficulty: 'Beginner',
        isPublished: true,
        totalLessons: 10,
        createdAt: new Date().toISOString(),
        modules: [
            {
                id: 'mod-4',
                title: 'Design Principles',
                lessons: [
                    { id: 'lesson-8', title: 'Color Theory', content: '# Color Theory\n\nUnderstanding color psychology...', duration: '15 min' },
                    { id: 'lesson-9', title: 'Typography Basics', content: '# Typography\n\nChoosing the right fonts...', duration: '12 min' },
                ],
            },
        ],
    },
];

// Database class for AsyncStorage operations
class Database {
    private listeners: Set<() => void> = new Set();
    private usersCache: User[] | null = null;
    private coursesCache: Course[] | null = null;
    private currentUserCache: User | null = null;

    constructor() {
        this.init();
    }

    private async init() {
        // Initialize with mock data if empty
        const existingCourses = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
        if (!existingCourses) {
            await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(mockCourses));
        }
        // Initialize empty users array
        const existingUsers = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
        if (!existingUsers) {
            await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
        }
    }

    subscribe(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    async getUsers(): Promise<User[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    async getCourses(): Promise<Course[]> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.COURSES);
            return data ? JSON.parse(data) : mockCourses;
        } catch {
            return mockCourses;
        }
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    async registerUser(name: string, email: string, password: string, role: Role): Promise<User | null> {
        const users = await this.getUsers();

        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return null; // User already exists
        }

        const newUser: User = {
            id: generateId(),
            name,
            email,
            password,
            role,
            avatar: getDefaultAvatar(name),
            bio: '',
            xp: 0,
            streak: 0,
            enrolledCourseIds: [],
            completedLessonIds: [],
            achievements: [],
            notes: [],
            certificates: [],
            subscriptionStatus: 'active',
        };

        users.push(newUser);
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

        this.notifyListeners();
        return newUser;
    }

    async loginUser(email: string, password: string): Promise<User | null> {
        const users = await this.getUsers();
        const user = users.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (user) {
            // Update streak on login
            const updatedUser = { ...user, streak: user.streak + 1 };
            const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
            await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
            await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
            this.notifyListeners();
            return updatedUser;
        }

        return null;
    }

    async logout(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        this.notifyListeners();
    }

    async enrollUser(userId: string, courseId: string): Promise<void> {
        const users = await this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1 && !users[userIndex].enrolledCourseIds.includes(courseId)) {
            users[userIndex].enrolledCourseIds.push(courseId);
            await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

            const currentUser = await this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
            }

            this.notifyListeners();
        }
    }

    async completeLesson(userId: string, lessonId: string): Promise<void> {
        const users = await this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1 && !users[userIndex].completedLessonIds.includes(lessonId)) {
            users[userIndex].completedLessonIds.push(lessonId);
            users[userIndex].xp += 50; // Award XP

            await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

            const currentUser = await this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
            }

            this.notifyListeners();
        }
    }

    async addCourse(course: Omit<Course, 'id' | 'createdAt'>): Promise<Course> {
        const courses = await this.getCourses();
        const newCourse: Course = {
            ...course,
            id: generateId(),
            createdAt: new Date().toISOString(),
        };

        courses.push(newCourse);
        await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
        this.notifyListeners();

        return newCourse;
    }

    async updateCourse(courseId: string, updates: Partial<Course>): Promise<void> {
        const courses = await this.getCourses();
        const courseIndex = courses.findIndex(c => c.id === courseId);

        if (courseIndex !== -1) {
            courses[courseIndex] = { ...courses[courseIndex], ...updates };
            await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
            this.notifyListeners();
        }
    }

    async deleteCourse(courseId: string): Promise<void> {
        const courses = await this.getCourses();
        const filtered = courses.filter(c => c.id !== courseId);
        await AsyncStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(filtered));
        this.notifyListeners();
    }

    async updateUser(userId: string, updates: Partial<User>): Promise<void> {
        const users = await this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

            const currentUser = await this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
            }

            this.notifyListeners();
        }
    }

    async addAchievement(userId: string, achievement: Achievement): Promise<void> {
        const users = await this.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            users[userIndex].achievements.push(achievement);
            await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

            const currentUser = await this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
            }

            this.notifyListeners();
        }
    }
}

export const db = new Database();
