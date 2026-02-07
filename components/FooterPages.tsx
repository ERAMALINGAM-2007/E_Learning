import React from 'react';
import { ArrowLeft, Shield, FileText, Cookie, Accessibility, Users, HelpCircle, Award, DollarSign, BookOpen, UserCheck, Lock, Map } from 'lucide-react';

interface PageProps {
    onBack: () => void;
}

const PageLayout = ({ title, icon: Icon, children, onBack }: { title: string, icon: any, children: React.ReactNode, onBack: () => void }) => (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </button>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-8 border-b border-slate-200 dark:border-slate-700 pb-8">
                    <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400">
                        <Icon size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">NeuroLearn Official Page</p>
                    </div>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                    {children}
                </div>
            </div>
        </div>
    </div>
);

export const PrivacyPage = ({ onBack }: PageProps) => (
    <PageLayout title="Privacy Policy" icon={Shield} onBack={onBack}>
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.</p>
        <h3>3. Data Security</h3>
        <p>We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
    </PageLayout>
);

export const TermsPage = ({ onBack }: PageProps) => (
    <PageLayout title="Terms of Service" icon={FileText} onBack={onBack}>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        <h3>2. User License</h3>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on NeuroLearn's website for personal, non-commercial transitory viewing only.</p>
    </PageLayout>
);

export const CookiePage = ({ onBack }: PageProps) => (
    <PageLayout title="Cookie Policy" icon={Cookie} onBack={onBack}>
        <h3>1. What Are Cookies</h3>
        <p>Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser.</p>
        <h3>2. How We Use Cookies</h3>
        <p>We use cookies to make our website function properly, to make it more secure, to provide better user experience, and to understand how the website performs.</p>
    </PageLayout>
);

export const AccessibilityPage = ({ onBack }: PageProps) => (
    <PageLayout title="Accessibility Statement" icon={Accessibility} onBack={onBack}>
        <p>NeuroLearn is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
        <h3>Conformance Status</h3>
        <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. NeuroLearn is partially conformant with WCAG 2.1 level AA.</p>
    </PageLayout>
);

export const HelpCenterPage = ({ onBack }: PageProps) => (
    <PageLayout title="Help Center" icon={HelpCircle} onBack={onBack}>
        <div className="grid md:grid-cols-2 gap-6 not-prose">
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Getting Started</h4>
                <p className="text-slate-500 text-sm">Learn the basics of setting up your account and starting your first course.</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Account & Billing</h4>
                <p className="text-slate-500 text-sm">Manage your subscription, payment methods, and account settings.</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Course Content</h4>
                <p className="text-slate-500 text-sm">Troubleshoot video playback, quizzes, and certificate issues.</p>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Contact Support</h4>
                <p className="text-slate-500 text-sm">Can't find what you're looking for? Reach out to our support team.</p>
            </div>
        </div>
    </PageLayout>
);

export const CommunityPage = ({ onBack }: PageProps) => (
    <PageLayout title="Community" icon={Users} onBack={onBack}>
        <p>Join thousands of learners from around the world. Share your progress, ask questions, and help others on their learning journey.</p>
        <div className="mt-8 grid md:grid-cols-3 gap-6 not-prose">
            <div className="text-center p-6 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                <div className="text-3xl font-bold text-brand-600 mb-2">50k+</div>
                <div className="text-sm text-slate-500">Active Learners</div>
            </div>
            <div className="text-center p-6 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                <div className="text-3xl font-bold text-brand-600 mb-2">100+</div>
                <div className="text-sm text-slate-500">Study Groups</div>
            </div>
            <div className="text-center p-6 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                <div className="text-3xl font-bold text-brand-600 mb-2">24/7</div>
                <div className="text-sm text-slate-500">Peer Support</div>
            </div>
        </div>
    </PageLayout>
);

export const SuccessStoriesPage = ({ onBack }: PageProps) => (
    <PageLayout title="Success Stories" icon={Award} onBack={onBack}>
        <div className="space-y-8 not-prose">
            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="italic text-slate-600 dark:text-slate-300 mb-4">
                    "NeuroLearn completely changed my career trajectory. The AI-driven personalization helped me focus exactly on what I needed to learn."
                </p>
                <div className="font-bold text-slate-900 dark:text-white">Sarah Johnson</div>
                <div className="text-sm text-brand-600">Software Engineer at Google</div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="italic text-slate-600 dark:text-slate-300 mb-4">
                    "The interactive courses and instant feedback made learning complex topics feel like a game. Highly recommended!"
                </p>
                <div className="font-bold text-slate-900 dark:text-white">Michael Chen</div>
                <div className="text-sm text-brand-600">Data Scientist at Amazon</div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="italic text-slate-600 dark:text-slate-300 mb-4">
                    "I went from complete beginner to landing my dream job in just six months. The personalized learning path gave me real-world skills."
                </p>
                <div className="font-bold text-slate-900 dark:text-white">Jessica Martinez</div>
                <div className="text-sm text-brand-600">Full Stack Developer at Meta</div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="italic text-slate-600 dark:text-slate-300 mb-4">
                    "As someone who learns best by doing, the hands-on coding challenges and immediate feedback were invaluable."
                </p>
                <div className="font-bold text-slate-900 dark:text-white">David Kumar</div>
                <div className="text-sm text-brand-600">ML Engineer at OpenAI</div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="italic text-slate-600 dark:text-slate-300 mb-4">
                    "The platform adapts to your learning style in ways I've never experienced before with any other educational platform."
                </p>
                <div className="font-bold text-slate-900 dark:text-white">Emily Watson</div>
                <div className="text-sm text-brand-600">Product Manager at Netflix</div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="italic text-slate-600 dark:text-slate-300 mb-4">
                    "What impressed me most was the depth of knowledge the AI tutor possesses. It could explain concepts from multiple angles."
                </p>
                <div className="font-bold text-slate-900 dark:text-white">Alex Thompson</div>
                <div className="text-sm text-brand-600">Senior DevOps Engineer at Microsoft</div>
            </div>
        </div>
    </PageLayout>
);

export const PricingPage = ({ onBack }: PageProps) => (
    <PageLayout title="Pricing Plans" icon={DollarSign} onBack={onBack}>
        <div className="grid md:grid-cols-3 gap-8 not-prose mt-8">
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Basic</h3>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">$0<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-8">
                    <li className="flex gap-2">✓ Access to free courses</li>
                    <li className="flex gap-2">✓ Basic community support</li>
                    <li className="flex gap-2">✓ Mobile app access</li>
                </ul>
                <button className="w-full py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Get Started</button>
            </div>
            <div className="p-8 rounded-2xl bg-brand-600 text-white shadow-xl transform scale-105">
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-3xl font-bold mb-6">$29<span className="text-sm font-normal opacity-80">/mo</span></div>
                <ul className="space-y-3 text-sm opacity-90 mb-8">
                    <li className="flex gap-2">✓ Unlimited course access</li>
                    <li className="flex gap-2">✓ AI Tutor assistance</li>
                    <li className="flex gap-2">✓ Certificates of completion</li>
                    <li className="flex gap-2">✓ Priority support</li>
                </ul>
                <button className="w-full py-2 px-4 rounded-lg bg-white text-brand-600 font-bold hover:bg-slate-100 transition-colors">Start Free Trial</button>
            </div>
            <div className="p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Team</h3>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-6">$99<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400 mb-8">
                    <li className="flex gap-2">✓ 5 Team members</li>
                    <li className="flex gap-2">✓ Admin dashboard</li>
                    <li className="flex gap-2">✓ Team analytics</li>
                    <li className="flex gap-2">✓ Dedicated account manager</li>
                </ul>
                <button className="w-full py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Contact Sales</button>
            </div>
        </div>
    </PageLayout>
);

export const CoursesPage = ({ onBack }: PageProps) => (
    <PageLayout title="Explore Courses" icon={BookOpen} onBack={onBack}>
        <p className="mb-8">Browse our extensive catalog of courses designed to help you master new skills.</p>
        <div className="grid md:grid-cols-2 gap-6 not-prose">
            {['Web Development', 'Data Science', 'Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Mobile Dev'].map((category) => (
                <div key={category} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-500 transition-colors cursor-pointer group">
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">{category}</h4>
                    <p className="text-sm text-slate-500 mt-2">15+ Courses Available</p>
                </div>
            ))}
        </div>
    </PageLayout>
);

export const InstructorsPage = ({ onBack }: PageProps) => (
    <PageLayout title="For Instructors" icon={UserCheck} onBack={onBack}>
        <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Teach on NeuroLearn</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Share your knowledge with millions of students around the world and earn money doing what you love.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 not-prose">
            <div className="text-center">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center text-brand-600 mx-auto mb-4 font-bold text-xl">1</div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Plan your curriculum</h3>
                <p className="text-sm text-slate-500">Use our AI tools to help structure your course content effectively.</p>
            </div>
            <div className="text-center">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center text-brand-600 mx-auto mb-4 font-bold text-xl">2</div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Record your video</h3>
                <p className="text-sm text-slate-500">Use your smartphone or professional gear. We help with the rest.</p>
            </div>
            <div className="text-center">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center text-brand-600 mx-auto mb-4 font-bold text-xl">3</div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Launch your course</h3>
                <p className="text-sm text-slate-500">Publish to our marketplace and start earning revenue.</p>
            </div>
        </div>
        <div className="mt-12 text-center">
            <button className="py-3 px-8 bg-brand-600 text-white rounded-full font-bold hover:bg-brand-700 transition-colors">Become an Instructor</button>
        </div>
    </PageLayout>
);

export const SecurityPage = ({ onBack }: PageProps) => (
    <PageLayout title="Security" icon={Lock} onBack={onBack}>
        <h3>1. Data Encryption</h3>
        <p>All data transmitted between your device and our servers is encrypted using industry-standard TLS (Transport Layer Security) protocols.</p>
        <h3>2. Secure Infrastructure</h3>
        <p>Our servers are hosted in secure data centers with 24/7 monitoring and strict access controls.</p>
        <h3>3. Account Protection</h3>
        <p>We use advanced hashing algorithms to protect your passwords and offer two-factor authentication for added security.</p>
    </PageLayout>
);

export const SitemapPage = ({ onBack }: PageProps) => (
    <PageLayout title="Sitemap" icon={Map} onBack={onBack}>
        <div className="grid md:grid-cols-3 gap-8 not-prose">
            <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Product</h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>Courses</li>
                    <li>Pricing</li>
                    <li>For Instructors</li>
                    <li>Success Stories</li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Resources</h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>Blog</li>
                    <li>Help Center</li>
                    <li>ART Book</li>
                    <li>Community</li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Legal</h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Cookie Policy</li>
                    <li>Accessibility</li>
                    <li>Security</li>
                </ul>
            </div>
        </div>
    </PageLayout>
);
