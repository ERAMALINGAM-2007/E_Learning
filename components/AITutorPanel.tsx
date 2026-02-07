
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, BrainCircuit, FileText, RotateCcw, Copy, Check, ChevronLeft, ChevronRight, GraduationCap, RefreshCw } from 'lucide-react';
import { generateTutorResponse, generateQuiz, generateSummary, generateFlashcards } from '../services/geminiService';
import { QuizQuestion, Flashcard } from '../types';

interface AITutorPanelProps {
  lessonContent: string;
}

type Tab = 'chat' | 'summary' | 'flashcards' | 'quiz';

const AITutorPanel: React.FC<AITutorPanelProps> = ({ lessonContent }) => {
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  // Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hi! I'm your AI Tutor. Ask me anything about this lesson!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quiz State
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [score, setScore] = useState<number | null>(null);

  // Summary State
  const [summary, setSummary] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Flashcards State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsError, setCardsError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'chat') scrollToBottom();
  }, [messages, activeTab]);

  // --- Chat Handlers ---
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await generateTutorResponse(messages, userMsg, lessonContent);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Quiz Handlers ---
  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setQuizError(null);
    setScore(null);
    setAnswers({});
    try {
      const generated = await generateQuiz(lessonContent);
      if (generated.length === 0) throw new Error("Failed to generate quiz");
      setQuiz(generated);
    } catch (e) {
      console.error(e);
      setQuizError("Failed to generate quiz. Please try again.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleAnswer = (qIndex: number, optIndex: number) => {
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const submitQuiz = () => {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (answers[i] === q.correctAnswerIndex) correct++;
    });
    setScore(correct);
  };

  // --- Summary Handlers ---
  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    try {
      const result = await generateSummary(lessonContent);
      setSummary(result);
    } catch (e) {
      console.error(e);
    } finally {
      setSummaryLoading(false);
    }
  };

  // --- Flashcard Handlers ---
  const handleGenerateCards = async () => {
    setCardsLoading(true);
    setCardsError(null);
    setFlashcards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    try {
      const result = await generateFlashcards(lessonContent);
      if (result.length === 0) throw new Error("Failed to generate flashcards");
      setFlashcards(result);
    } catch (e) {
      console.error(e);
      setCardsError("Failed to generate flashcards. Please try again.");
    } finally {
      setCardsLoading(false);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl w-80 md:w-96 shrink-0 transition-colors">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'chat', icon: Bot, label: 'Chat' },
          { id: 'summary', icon: FileText, label: 'Summary' },
          { id: 'flashcards', icon: GraduationCap, label: 'Cards' },
          { id: 'quiz', icon: BrainCircuit, label: 'Quiz' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex-1 py-3 text-xs md:text-sm font-medium flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 border-b-2 transition-colors ${activeTab === tab.id ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
          >
            <tab.icon size={16} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* --- Chat Tab --- */}
      {activeTab === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about the lesson..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none text-slate-800 dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- Summary Tab --- */}
      {activeTab === 'summary' && (
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {!summary ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <FileText size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Lesson Summary</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Get a concise overview of the key takeaways.</p>
              <button
                onClick={handleGenerateSummary}
                disabled={summaryLoading}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105"
              >
                {summaryLoading ? <Sparkles className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {summaryLoading ? 'Summarizing...' : 'Generate Summary'}
              </button>
            </div>
          ) : (
            <div className="animate-pop-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Key Takeaways</h3>
                <button onClick={handleGenerateSummary} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
                  <RefreshCw size={14} />
                </button>
              </div>
              <div className="prose prose-sm dark:prose-invert bg-yellow-50 dark:bg-yellow-900/10 p-5 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                {/* Simple markdown rendering */}
                {summary.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0 leading-relaxed text-slate-700 dark:text-slate-300">
                    {line.replace(/^-\s/, '• ')}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Flashcards Tab --- */}
      {activeTab === 'flashcards' && (
        <div className="flex-1 overflow-hidden flex flex-col p-4 bg-slate-50 dark:bg-slate-900/50">
          {flashcards.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <GraduationCap size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Study Flashcards</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Master concepts with AI-generated cards.</p>
              {cardsError && <p className="text-red-500 text-xs mb-4">{cardsError}</p>}
              <button
                onClick={handleGenerateCards}
                disabled={cardsLoading}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105"
              >
                {cardsLoading ? <Sparkles className="animate-spin" size={16} /> : <Sparkles size={16} />}
                {cardsLoading ? 'Creating Deck...' : 'Create Deck'}
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center animate-pop-in">
              {/* 3D Card Container */}
              <div className="perspective-1000 w-full max-w-xs h-64 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                <div className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>

                  {/* Front */}
                  <div className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-6 text-center backface-hidden">
                    <span className="text-xs uppercase font-bold text-slate-400 mb-4 tracking-widest">Question</span>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {flashcards[currentCardIndex].front}
                    </p>
                    <span className="absolute bottom-4 text-xs text-brand-500 animate-pulse">Tap to flip</span>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 w-full h-full bg-brand-600 dark:bg-brand-700 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 text-center backface-hidden rotate-y-180">
                    <span className="text-xs uppercase font-bold text-brand-200 mb-4 tracking-widest">Answer</span>
                    <p className="text-lg font-medium text-white">
                      {flashcards[currentCardIndex].back}
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between w-full max-w-xs mt-8">
                <button onClick={prevCard} className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <ChevronLeft size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
                <span className="text-sm font-bold text-slate-500">
                  {currentCardIndex + 1} / {flashcards.length}
                </span>
                <button onClick={nextCard} className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <ChevronRight size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>

              <button onClick={handleGenerateCards} className="mt-6 text-xs text-slate-400 hover:text-brand-500 underline">
                Regenerate Deck
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- Quiz Tab --- */}
      {activeTab === 'quiz' && (
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {quiz.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <BrainCircuit size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Test Your Knowledge</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Generate an AI quiz based on the current lesson content.</p>
              {quizError && <p className="text-red-500 text-xs mb-4">{quizError}</p>}
              <button
                onClick={handleGenerateQuiz}
                disabled={quizLoading}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105"
              >
                {quizLoading && <Sparkles className="animate-spin" size={16} />}
                {quizLoading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Lesson Quiz</h3>
                <button onClick={handleGenerateQuiz} className="text-xs text-slate-500 hover:text-brand-500 flex items-center gap-1"><RotateCcw size={12} /> New Quiz</button>
              </div>

              {quiz.map((q, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="font-medium text-slate-800 dark:text-slate-200 mb-3">{i + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnClass = "w-full text-left p-3 rounded-lg text-sm border transition-all ";

                      if (score !== null) {
                        // Results mode
                        if (optIdx === q.correctAnswerIndex) {
                          btnClass += "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200";
                        } else if (answers[i] === optIdx) {
                          btnClass += "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200";
                        } else {
                          btnClass += "opacity-50 border-transparent bg-slate-100 dark:bg-slate-800";
                        }
                      } else {
                        // Active mode
                        if (answers[i] === optIdx) {
                          btnClass += "bg-brand-100 dark:bg-brand-900/30 border-brand-500 text-brand-800 dark:text-brand-200";
                        } else {
                          btnClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-700 text-slate-700 dark:text-slate-300";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => score === null && handleAnswer(i, optIdx)}
                          className={btnClass}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {score === null ? (
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length < quiz.length}
                  className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-brand-500/20"
                >
                  Submit Answers
                </button>
              ) : (
                <div className="bg-slate-800 text-white p-4 rounded-xl text-center animate-pop-in shadow-xl">
                  <p className="text-sm opacity-80">You scored</p>
                  <p className="text-3xl font-black mb-2">{score} / {quiz.length}</p>
                  <p className="text-sm">{score === quiz.length ? 'Perfect! 🎉' : 'Keep learning! 📚'}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AITutorPanel;
