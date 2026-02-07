
import React, { useState } from 'react';
import { CreditCard, Download, Clock, CheckCircle, Shield, Eye, EyeOff, Loader2, PauseCircle, Calendar, PlayCircle } from 'lucide-react';
import { User } from '../types';
import { db } from '../services/db';

interface PaymentsProps {
  user: User;
}

const Payments: React.FC<PaymentsProps> = ({ user }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  // React state to reflect immediate change, though strictly we should sync with User prop
  const [isPaused, setIsPaused] = useState(user.subscriptionStatus === 'paused');

  const baseTransactions = [
    { id: 'inv_001', date: '2023-10-15', course: 'Introduction to Astrophysics', amount: 49.99, status: 'Paid' },
    { id: 'inv_002', date: '2023-11-02', course: 'Advanced React Patterns', amount: 89.99, status: 'Paid' },
    { id: 'inv_003', date: '2023-12-10', course: 'Digital Marketing Mastery', amount: 59.99, status: 'Paid' },
  ];

  const extraTransactions = [
    { id: 'inv_004', date: '2023-09-01', course: 'Machine Learning Basics', amount: 79.99, status: 'Paid' },
    { id: 'inv_005', date: '2023-08-15', course: 'Creative Writing Workshop', amount: 39.99, status: 'Paid' },
    { id: 'inv_006', date: '2023-07-20', course: 'Yoga for Beginners', amount: 29.99, status: 'Paid' },
    { id: 'inv_007', date: '2023-06-10', course: 'Financial Literacy 101', amount: 49.99, status: 'Paid' },
  ];

  const transactions = showAllTransactions ? [...baseTransactions, ...extraTransactions] : baseTransactions;

  const handleDownloadInvoice = (id: string, course: string, amount: number) => {
    setDownloadingId(id);
    
    // Simulate network delay and file generation
    setTimeout(() => {
        const content = `COGNITION AI LEARNING\nINVOICE #${id.toUpperCase()}\n\nDate: ${new Date().toLocaleDateString()}\nBilled To: ${user.name} (${user.email})\n\n--------------------------------\n\nItem: ${course}\nAmount: $${amount}\nStatus: Paid\n\n--------------------------------\n\nThank you for your purchase!`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setDownloadingId(null);
    }, 1500);
  };

  const toggleBilling = () => {
    setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
  };

  const togglePause = () => {
      db.toggleSubscriptionPause(user.id);
      setIsPaused(!isPaused);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Payments & Billing</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Manage your payment methods and view transaction history.</p>

      {/* Feature 5: Pause Subscription (Vacation Mode) */}
      <div className={`mb-10 rounded-2xl p-6 border transition-all ${isPaused ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50' : 'bg-slate-100 dark:bg-slate-800/50 border-transparent'}`}>
         <div className="flex justify-between items-center">
             <div className="flex gap-4">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isPaused ? 'bg-amber-200 text-amber-700' : 'bg-white dark:bg-slate-700 text-slate-500'}`}>
                     {isPaused ? <PauseCircle size={24} /> : <Calendar size={24} />}
                 </div>
                 <div>
                     <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                         {isPaused ? 'Vacation Mode Active' : 'Need a break?'}
                     </h3>
                     <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg">
                         {isPaused 
                            ? 'Your subscription is paused for 14 days. No charges will be applied, and your streak is frozen.' 
                            : 'Pause your subscription for up to 14 days without penalty. Perfect for vacations or busy weeks.'}
                     </p>
                 </div>
             </div>
             <button 
                onClick={togglePause}
                className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 ${isPaused ? 'bg-white text-slate-800 hover:bg-slate-50' : 'bg-slate-800 text-white hover:bg-slate-900 dark:bg-white dark:text-slate-900'}`}
             >
                 {isPaused ? <><PlayCircle size={18} /> Resume Now</> : <><PauseCircle size={18} /> Pause Subscription</>}
             </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Payment Method Card */}
        <div className="col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <Shield className="text-brand-400" size={32} />
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">Primary</span>
          </div>

          <div className="mb-8 relative z-10">
            <div className="flex items-center gap-2 mb-1">
                <p className="text-slate-400 text-sm">Card Number</p>
                <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                    title={showDetails ? "Hide details" : "Show details"}
                >
                    {showDetails ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
            </div>
            <p className="font-mono text-2xl tracking-widest transition-all duration-300">
                {showDetails ? '4532 1234 5678 4242' : '•••• •••• •••• 4242'}
            </p>
          </div>

          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-slate-400 text-xs uppercase mb-1">Cardholder</p>
              <p className="font-bold tracking-wide">{user.name.toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs uppercase mb-1">Expires</p>
              <p className="font-bold">12/25</p>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between ${isPaused ? 'opacity-50 pointer-events-none' : ''}`}>
           <div>
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1">Student Pro Plan</h3>
              <p className="text-sm text-slate-500 mb-4">
                  Billed {billingCycle === 'monthly' ? 'monthly' : 'annually'}
              </p>
              <div className="text-3xl font-black text-brand-600 dark:text-brand-400 mb-2">
                 {billingCycle === 'monthly' ? '$12' : '$120'}
                 <span className="text-sm text-slate-400 font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs font-bold">
                    <CheckCircle size={12} /> Active
                </span>
                {billingCycle === 'yearly' && (
                    <span className="text-xs text-brand-600 font-bold bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded">Save 17%</span>
                )}
              </div>
           </div>
           <button 
             onClick={toggleBilling}
             className="w-full mt-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
           >
              Switch to {billingCycle === 'monthly' ? 'Annual' : 'Monthly'}
           </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
           <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
             <Clock size={20} className="text-slate-400" /> Transaction History
           </h2>
           <button 
             onClick={() => setShowAllTransactions(!showAllTransactions)}
             className="text-brand-600 text-sm font-bold hover:underline"
           >
             {showAllTransactions ? 'Show Less' : 'View All'}
           </button>
        </div>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
           {transactions.map((tx) => (
             <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                      <CreditCard size={18} />
                   </div>
                   <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{tx.course}</p>
                      <p className="text-xs text-slate-500">{tx.date} • {tx.id.toUpperCase()}</p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <span className="font-bold text-slate-800 dark:text-white">${tx.amount}</span>
                   <button 
                      onClick={() => handleDownloadInvoice(tx.id, tx.course, tx.amount)}
                      disabled={downloadingId === tx.id}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-50" 
                      title="Download Invoice"
                   >
                      {downloadingId === tx.id ? <Loader2 size={18} className="animate-spin text-brand-500" /> : <Download size={18} />}
                   </button>
                </div>
             </div>
           ))}
        </div>
        {showAllTransactions && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 text-center text-xs text-slate-400">
                End of history
            </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
