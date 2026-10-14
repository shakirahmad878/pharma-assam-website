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
    <div className="fixed inset-0 bg-[#090907]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="neu-card border border-[#282319] rounded-2xl max-w-md w-full shadow-neu-raised animate-in fade-in zoom-in duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#282319] relative">
          <button
            onClick={onClose}
            className="neu-btn absolute right-4 top-4 p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 flex items-center justify-center text-[#B99D73] shadow-neu-sunken">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F2ECE1]">Switch User / Sign In</h2>
              <p className="text-xs text-[#857866]">Enterprise Role-Based Access Control</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-[#1c0f0f] border border-[#662B2B]/60 rounded-xl text-rose-400 flex items-start gap-2.5 text-xs shadow-neu-sunken">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#B99D73] mb-1.5">
                Username or Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-[#857866]" />
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
                  className="neu-input w-full pl-10 pr-3.5 py-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#B99D73] mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#857866]" />
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
                  className="neu-input w-full pl-10 pr-10 py-2.5 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#857866] hover:text-[#F2ECE1] focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="neu-btn-gold w-full py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-xs mt-2 disabled:opacity-50 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Quick select pills */}
          <div className="pt-3 border-t border-[#282319]">
            <p className="text-[11px] font-semibold text-[#857866] mb-2">Quick Fill Accounts:</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('shakir878');
                  setPassword('Shakir@2026');
                  if (errorMessage) setErrorMessage('');
                }}
                className="neu-btn px-2.5 py-1 text-[#B99D73] hover:text-[#F2ECE1] rounded-xl text-[10px] font-medium transition-colors cursor-pointer"
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
                className="neu-btn px-2.5 py-1 text-[#D4BD95] hover:text-[#F2ECE1] rounded-xl text-[10px] font-medium transition-colors cursor-pointer"
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
                className="neu-btn px-2.5 py-1 text-[#857866] hover:text-[#F2ECE1] rounded-xl text-[10px] font-medium transition-colors cursor-pointer"
              >
                Field Rep (0002)
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#857866]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B99D73]" />
            <span>Encrypted Authentication & Session Security</span>
          </div>
        </div>

      </div>
    </div>
  );
};
