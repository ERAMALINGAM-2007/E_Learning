
import React, { useState } from 'react';
import { Camera, Save, Shield, Award, Edit2, X, ExternalLink, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { User } from '../types';
import { db } from '../services/db';

interface ProfileProps {
  user: User;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio
  });
  const [avatar, setAvatar] = useState(user.avatar);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const updatedUser = { ...user, ...formData, avatar };
    await db.updateUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ name: user.name, bio: user.bio });
    setAvatar(user.avatar);
    setIsEditing(false);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        // Clear local storage and redirect
        localStorage.removeItem('cognition_user'); // Assuming this is the key
        // Force reload to reset app state (simple way to handle logout)
        window.location.reload();
      } else {
        alert('Failed to delete account: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting your account.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Your Profile</h1>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-0.5"
          >
            <Edit2 size={18} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <X size={18} /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-green-500/30"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col: Avatar */}
        <div className="col-span-1 flex flex-col items-center">
          <div className={`relative w-40 h-40 mb-4 transition-transform duration-300 ${isEditing ? 'cursor-pointer hover:scale-105 group' : ''}`}>
            <img
              src={avatar}
              alt="Profile"
              className={`w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl transition-all ${isEditing ? 'group-hover:opacity-80' : ''}`}
            />
            {isEditing && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <div className="text-center">
                  <Camera className="text-white mx-auto mb-1" size={24} />
                  <span className="text-xs text-white font-bold">Change</span>
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} accept="image/*" />
              </div>
            )}
            {isEditing && (
              <div className="absolute bottom-1 right-1 bg-brand-600 text-white p-2 rounded-full shadow-lg pointer-events-none z-10">
                <Edit2 size={14} />
              </div>
            )}
          </div>
          <div className="text-center">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white transition-all">{formData.name}</h3>
            <span className="inline-block px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase mt-2">
              {user.role}
            </span>
          </div>
        </div>

        {/* Right Col: Form & Achievements */}
        <div className="col-span-2 space-y-8">
          <div className={`bg-white dark:bg-slate-900 rounded-2xl p-6 border transition-all duration-300 shadow-sm relative overflow-hidden ${isEditing ? 'border-brand-300 dark:border-brand-700 ring-4 ring-brand-500/5' : 'border-slate-200 dark:border-slate-800'}`}>

            <h2 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <Shield size={20} className="text-brand-500" /> Personal Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                <input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all dark:text-white font-medium ${isEditing ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10' : 'border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 cursor-not-allowed'}`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all min-h-[120px] dark:text-white leading-relaxed ${isEditing ? 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10' : 'border-transparent bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 cursor-not-allowed resize-none'}`}
                />
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <Award size={20} className="text-yellow-500" /> Achievements
            </h2>
            {!user.achievements || user.achievements.length === 0 ? (
              <p className="text-slate-400 italic">No achievements yet. Complete lessons to earn badges!</p>
            ) : (
              <div className="flex gap-4 flex-wrap">
                {user.achievements?.map(a => (
                  <div key={a.id} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl flex flex-col items-center w-24 text-center border border-slate-100 dark:border-slate-700 hover:-translate-y-1 transition-transform cursor-default" title={`Unlocked: ${new Date(a.unlockedAt).toLocaleDateString()}`}>
                    <span className="text-3xl mb-2 filter drop-shadow-sm">{a.icon}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-2">{a.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feature 4: Verified Certificates Section */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-slate-800 dark:text-white flex items-center gap-2">
              <CheckCircle size={20} className="text-green-500" /> Verified Certificates
            </h2>
            {!user.certificates || user.certificates.length === 0 ? (
              <p className="text-slate-400 italic">No certificates yet. Finish a course to get certified!</p>
            ) : (
              <div className="space-y-3">
                {user.certificates?.map(cert => (
                  <div key={cert.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <Award size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800 dark:text-white">{cert.courseTitle}</p>
                        <p className="text-xs text-slate-500">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      onClick={(e) => { e.preventDefault(); alert(`Mock Verification:\nURL: ${cert.verifyUrl}\nStatus: VALID`); }}
                    >
                      Verify <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/30 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle size={20} /> Danger Zone
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Delete Account</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Delete Account?</h3>
              <p className="text-slate-500 dark:text-slate-400">
                This action cannot be undone. All your progress, achievements, and certificates will be permanently lost.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
