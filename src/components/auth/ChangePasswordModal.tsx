import React, { useState } from 'react';
import { User } from '../../types';
import { AuthService } from '../../services/authService';
import { KeyRound, CheckCircle2, AlertCircle, X, Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  users: User[];
  onPasswordChanged: (updatedUser: User) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onPasswordChanged,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('New password must be at least 4 characters long.');
      return;
    }

    const result = AuthService.changePassword(currentUser.id, currentPassword, newPassword, users);

    if (!result.success || !result.updatedUser) {
      setErrorMessage(result.error || 'Failed to update password.');
      return;
    }

    onPasswordChanged(result.updatedUser);
    setSuccessMessage('Password changed successfully!');
    setTimeout(() => {
      onClose();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#090907]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="neu-card border border-[#282319] rounded-2xl max-w-md w-full shadow-neu-raised animate-in fade-in zoom-in duration-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#282319] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 flex items-center justify-center text-[#B99D73] shadow-neu-sunken">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F2ECE1]">Change Account Password</h3>
              <p className="text-[11px] text-[#857866]">
                User: <span className="text-[#B99D73] font-semibold">{currentUser.name}</span> ({currentUser.role})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-[#1c0f0f] border border-[#662B2B]/60 rounded-xl text-rose-400 flex items-center gap-2 text-xs shadow-neu-sunken">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-[#101912] border border-[#384D2B]/60 rounded-xl text-emerald-400 flex items-center gap-2 text-xs font-semibold shadow-neu-sunken">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#B99D73] mb-1">Current Password *</label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="neu-input w-full pl-3 pr-10 py-2"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#857866] hover:text-[#F2ECE1]"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#B99D73] mb-1">New Password *</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              required
              placeholder="Enter new password (min. 4 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="neu-input w-full px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#B99D73] mb-1">Confirm New Password *</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              required
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="neu-input w-full px-3 py-2"
            />
          </div>

          <div className="pt-3.5 border-t border-[#282319] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="neu-btn px-4 py-2 rounded-xl text-[#857866] hover:text-[#F2ECE1] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neu-btn-gold px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
