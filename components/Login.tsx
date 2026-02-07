import React, { useState, useRef, useMemo } from 'react';
import { User, Mail, Key, Lock, Eye, EyeOff, Loader, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { User as UserType, Role } from '../types';
import { db } from '../services/db';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const HAPPY_EMOJIS = ['🎉', '🚀', '🎓', '⭐', '💡', '📚', '✨', '🏆', '🔥', '💫', '🦄', '🎈'];

const WelcomeOverlay = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const direction = i % 4;
      let animationClass = '';

      const style: React.CSSProperties = {
        position: 'absolute',
        fontSize: `${24 + Math.random() * 40}px`,
        animationDelay: `${Math.random() * 0.8}s`,
        textShadow: '0 4px 10px rgba(0,0,0,0.2)',
        opacity: 0,
      };

      if (direction === 0) {
        animationClass = 'animate-fly-bottom';
        style.left = `${Math.random() * 100}%`;
        style.bottom = '-10%';
      } else if (direction === 1) {
        animationClass = 'animate-fly-top';
        style.left = `${Math.random() * 100}%`;
        style.top = '-10%';
      } else if (direction === 2) {
        animationClass = 'animate-fly-left';
        style.top = `${Math.random() * 100}%`;
        style.left = '-10%';
      } else {
        animationClass = 'animate-fly-right';
        style.top = `${Math.random() * 100}%`;
        style.right = '-10%';
      }

      return {
        id: i,
        emoji: HAPPY_EMOJIS[Math.floor(Math.random() * HAPPY_EMOJIS.length)],
        animationClass,
        style
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-[9999] flex items-center justify-center overflow-hidden animate-in fade-in duration-300">
      <div className="relative z-20 text-center animate-pop-in bg-white/80 dark:bg-slate-800/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md border border-white/50">
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400 mb-4 drop-shadow-sm">Welcome Aboard!</h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 font-medium">Preparing your personal dashboard...</p>
      </div>

      {particles.map(p => (
        <div
          key={p.id}
          className={`pointer-events-none select-none absolute z-10 ${p.animationClass}`}
          style={p.style}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('student');

  const playSuccessSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1.0;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    }
  };

  const handleSuccess = (user: UserType) => {
    playSuccessSound();
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin(user);
    }, 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (mode === 'login') {
      try {
        const backendResponse = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await backendResponse.json();

        if (data.success && data.user) {
          const users = JSON.parse(localStorage.getItem('cognition_users') || '[]');
          const existingIndex = users.findIndex((u: any) => u.email === email);

          if (existingIndex >= 0) {
            users[existingIndex] = { ...data.user, password };
          } else {
            users.push({ ...data.user, password });
          }

          localStorage.setItem('cognition_users', JSON.stringify(users));
          handleSuccess(data.user);
        } else {
          setError(data.message || 'Invalid email or password');
        }
      } catch (error) {
        const user = db.login(email, password);
        if (user) {
          handleSuccess(user);
        } else {
          setError('Invalid email or password');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      try {
        const backendResponse = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });

        const data = await backendResponse.json();

        if (!data.success) {
          setError(data.message || 'Email already exists');
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Backend signup failed, continuing with frontend only:', error);
      }

      const user = db.signup(name, email, password, role);
      if (user) {
        handleSuccess(user);
      } else {
        setError('Email already exists');
      }
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: credentialResponse.credential,
          mode: mode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        handleSuccess(data.user);
      } else {
        setError(data.message || 'Google login failed');
      }
    } catch (err) {
      setError('An error occurred with Google login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setIsSendingEmail(true);

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotSuccess(true);
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotSuccess(false);
          setForgotEmail('');
        }, 3000);
      } else {
        setForgotError(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      setForgotError('Network error. Please check if the backend server is running.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    if (containerRef.current) {
      if (mode === 'login') {
        containerRef.current.classList.add('sign-up-mode');
      } else {
        containerRef.current.classList.remove('sign-up-mode');
      }
    }
  };

  return (
    <>
      <style>{`
        @keyframes slideCircle {
          0% { transform: translate(0, -50%); }
          100% { transform: translate(100%, -50%); }
        }

        .container {
          position: relative;
          width: 100%;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          overflow: hidden;
        }

        .dark .container {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        .sign-form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 5rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .sign-form.sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        .sign-form.sign-in-form {
          z-index: 2;
        }

        .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .container::before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: linear-gradient(-45deg, #4481eb 0%, #04befe 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
        }

        .dark .container::before {
          background: linear-gradient(-45deg, #3b82f6 0%, #06b6d4 100%);
        }

        .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .left-panel {
          pointer-events: all;
          padding: 3rem 17% 2rem 12%;
        }

        .right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .panel .content {
          color: #fff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .right-panel .content {
          transform: translateX(800px);
        }

        /* ANIMATION */
        .container.sign-up-mode::before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .container.sign-up-mode .left-panel .content {
          transform: translateX(-800px);
        }

        .container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .container.sign-up-mode .sign-form.sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .container.sign-up-mode .sign-form.sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .container.sign-up-mode .right-panel .content {
          transform: translateX(0%);
        }

        .container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        @media (max-width: 870px) {
          .container {
            min-height: 800px;
            height: 100vh;
          }
          
          .signin-signup {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }

          .signin-signup,
          .container.sign-up-mode .signin-signup {
            left: 50%;
          }

          .panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }

          .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.5rem 8%;
            grid-column: 1 / 2;
          }

          .right-panel {
            grid-row: 3 / 4;
          }

          .left-panel {
            grid-row: 1 / 2;
          }

          .panel .content {
            padding-right: 15%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }

          .container::before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }

          .container.sign-up-mode::before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }

          .container.sign-up-mode .left-panel .content {
            transform: translateY(-300px);
          }

          .container.sign-up-mode .right-panel .content {
            transform: translateY(0px);
          }

          .right-panel .content {
            transform: translateY(300px);
          }

          .container.sign-up-mode .signin-signup {
            top: 5%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          .sign-form {
            padding: 0 1.5rem;
          }
        }
      `}</style>

      {/* Hidden Audio Element for Success Sound */}
      <audio ref={audioRef} preload="auto">
        <source src="https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a" type="audio/mp4" />
      </audio>

      {isLoggingIn && <WelcomeOverlay />}

      <div ref={containerRef} className="container">
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="sign-form sign-in-form">
              <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-6">Sign in</h2>

              {error && mode === 'login' && (
                <div className="w-full max-w-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="relative w-full max-w-sm mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-full focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                />
              </div>

              <div className="relative w-full max-w-sm mb-2">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Key size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-full focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="w-full max-w-sm text-right mb-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-40 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader size={18} className="animate-spin" /> : 'Sign In'}
              </button>

              <p className="text-slate-600 dark:text-slate-400 text-sm my-4">Or sign in with</p>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Login Failed')}
                  theme="filled_blue"
                  shape="pill"
                />
              </div>
            </form>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="sign-form sign-up-form">
              <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-6">Sign up</h2>

              {error && mode === 'signup' && (
                <div className="w-full max-w-sm mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="relative w-full max-w-sm mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-full focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                />
              </div>

              <div className="relative w-full max-w-sm mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-full focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                />
              </div>

              <div className="relative w-full max-w-sm mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Key size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border-0 rounded-full focus:ring-2 focus:ring-brand-500 outline-none transition-all dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="w-full max-w-sm mb-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-2 px-4 rounded-full border-2 transition-all ${role === 'student'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('instructor')}
                  className={`flex-1 py-2 px-4 rounded-full border-2 transition-all ${role === 'instructor'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                    }`}
                >
                  Instructor
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-40 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader size={18} className="animate-spin" /> : 'Sign Up'}
              </button>

              <p className="text-slate-600 dark:text-slate-400 text-sm my-4">Or sign up with</p>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Login Failed')}
                  theme="filled_blue"
                  shape="pill"
                />
              </div>
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3 className="text-3xl font-bold mb-4">New here?</h3>
              <p className="text-base mb-6 opacity-90">
                Join us to start your learning journey and unlock amazing courses!
              </p>
              <button
                onClick={toggleMode}
                className="px-8 py-2 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-brand-600 transition-all"
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="panel right-panel">
            <div className="content">
              <h3 className="text-3xl font-bold mb-4">One of us?</h3>
              <p className="text-base mb-6 opacity-90">
                Welcome back! Sign in to continue your learning adventure.
              </p>
              <button
                onClick={toggleMode}
                className="px-8 py-2 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-brand-600 transition-all"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 mb-4">
                <Mail className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                Forgot Password?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {forgotSuccess ? (
              <div className="text-center py-6">
                <div className="mb-4 text-6xl">📧</div>
                <h4 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                  Email Sent!
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Check your inbox for the password reset link.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                {forgotError && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle size={18} />
                    {forgotError}
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotEmail('');
                      setForgotError(null);
                    }}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingEmail}
                    className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSendingEmail ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
