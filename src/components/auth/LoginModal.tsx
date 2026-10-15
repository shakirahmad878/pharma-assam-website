import React, { useState } from 'react';
import { User } from '../../types';
import { AuthService } from '../../services/authService';
import { 
  LogIn, 
  Lock, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  users,
  onLoginSuccess,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Username or Employee ID.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = AuthService.login(identifier, password, users);
      setIsLoading(false);

      if (!result.success || !result.user) {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      onLoginSuccess(result.user);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-[#10243A]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#DCE4EB] rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#DCE4EB] relative bg-[#10243A] text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#182F49] border border-slate-700 flex items-center justify-center text-[#18A6A6] shadow-2xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Switch User / Field Sign In</h2>
              <p className="text-xs text-slate-300">Enterprise Role-Based Access Control</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1E293B] mb-1.5">
                Username or Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-[#64748B]" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter Username or Employee ID"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6] text-[#1E293B]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#1E293B] mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#64748B]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full pl-10 pr-10 py-2.5 text-xs font-mono rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6] text-[#1E293B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#10243A] focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 text-xs mt-2 bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#18A6A6]" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick select pills */}
          <div className="pt-3 border-t border-[#DCE4EB]">
            <p className="text-[11px] font-semibold text-[#64748B] mb-2">Quick Fill Accounts:</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('shakir878');
                  setPassword('Shakir@2026');
                  if (errorMessage) setErrorMessage('');
                }}
                className="bg-[#F5F8FA] hover:bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
              >
                Super Admin (shakir878)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('bodrudsadiol');
                  setPassword('Bodrud@2026');
                  if (errorMessage) setErrorMessage('');
                }}
                className="bg-[#F5F8FA] hover:bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
              >
                Manager (bodrudsadiol)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('0002');
                  setPassword('1234');
                  if (errorMessage) setErrorMessage('');
                }}
                className="bg-[#F5F8FA] hover:bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
              >
                Field Rep (0002)
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#18A6A6]" />
            <span>Encrypted Session Security</span>
          </div>
        </div>

      </div>
    </div>
  );
};
