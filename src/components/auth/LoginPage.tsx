import React, { useState } from 'react';
import { User } from '../../types';
import { AuthService } from '../../services/authService';
import { Activity, Lock, User as UserIcon, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, Globe } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
  onOpenPublicSite?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, users, onOpenPublicSite }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your Username or Employee ID.');
      return;
    }

    if (!password) {
      setError('Please enter your Password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = AuthService.login(identifier, password, users);
      setIsLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed. Please check your credentials.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-[#1E293B]">
      
      {/* Link to Public Website (External, opens in new tab) */}
      <div className="absolute top-6 left-6 z-20">
        <a
          href="https://shakirahmad878.github.io/pharma-assam-website/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white hover:bg-[#F1F6F8] text-[#10243A] border border-[#DCE4EB] px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Globe className="w-4 h-4 text-[#18A6A6]" />
          <span>Visit Corporate Website ↗</span>
        </a>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#10243A] border border-[#182F49] shadow-xs mb-3 text-[#18A6A6]">
            <Activity className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#10243A]">
            RepPulse <span className="text-[#18A6A6]">Field Portal</span>
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Official SFA Administration & Field Force Workspace
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-6 bg-white rounded-2xl p-7 sm:p-8 border border-[#DCE4EB] shadow-sm">
          
          <div className="mb-6">
            <h3 className="text-base font-bold text-[#10243A]">Sign In to Your Workspace</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Enter your authorized credentials or select a quick-access role below
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                Username or Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-[#64748B]" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. shakir878 / bodrudsadiol / 0002"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6] text-[#1E293B]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#1E293B]">
                  Password
                </label>
              </div>
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
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 text-xs font-mono rounded-xl border border-[#DCE4EB] bg-white focus:outline-none focus:ring-1 focus:ring-[#18A6A6] text-[#1E293B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#10243A] focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-xs rounded-xl bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Field Portal</span>
                  <ArrowRight className="w-4 h-4 text-[#18A6A6]" />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Footer */}
          <div className="mt-6 pt-5 border-t border-[#DCE4EB] flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#18A6A6]" />
            <span>Role-Based PostgreSQL Session • Encrypted Transport</span>
          </div>

        </div>

        {/* Quick Credentials Card */}
        <div className="mt-5 bg-white rounded-2xl p-5 border border-[#DCE4EB] shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#10243A] mb-3">
            <Lock className="w-3.5 h-3.5 text-[#18A6A6]" />
            <span>Authorized Test Accounts (1-Click Fill)</span>
          </div>

          <div className="space-y-2">
            {/* Super Admin */}
            <div 
              onClick={() => {
                setIdentifier('shakir878');
                setPassword('Shakir@2026');
                if (error) setError(null);
              }}
              className="p-3 bg-[#F5F8FA] hover:bg-[#E8EEF4] border border-[#DCE4EB] rounded-xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#10243A]">Super Admin</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-[#137F83] border border-teal-200 font-semibold">Full Root</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  User: <span className="font-mono text-[#10243A] font-semibold">shakir878</span> • Pass: <span className="font-mono text-[#10243A]">Shakir@2026</span>
                </div>
              </div>
              <button
                type="button"
                className="text-[11px] font-semibold text-[#18A6A6] bg-white border border-[#DCE4EB] px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Auto Fill
              </button>
            </div>

            {/* Regional Manager */}
            <div 
              onClick={() => {
                setIdentifier('bodrudsadiol');
                setPassword('Bodrud@2026');
                if (error) setError(null);
              }}
              className="p-3 bg-[#F5F8FA] hover:bg-[#E8EEF4] border border-[#DCE4EB] rounded-xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#10243A]">Regional Manager (RSM)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-[#10243A] border border-[#DCE4EB] font-semibold">Barak Valley</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  User: <span className="font-mono text-[#10243A] font-semibold">bodrudsadiol</span> • Pass: <span className="font-mono text-[#10243A]">Bodrud@2026</span>
                </div>
              </div>
              <button
                type="button"
                className="text-[11px] font-semibold text-[#18A6A6] bg-white border border-[#DCE4EB] px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Auto Fill
              </button>
            </div>

            {/* Field MR */}
            <div 
              onClick={() => {
                setIdentifier('0002');
                setPassword('1234');
                if (error) setError(null);
              }}
              className="p-3 bg-[#F5F8FA] hover:bg-[#E8EEF4] border border-[#DCE4EB] rounded-xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#10243A]">Medical Representative</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-[#10243A] border border-[#DCE4EB] font-semibold">Field Rep</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">
                  User: <span className="font-mono text-[#10243A] font-semibold">0002</span> • Pass: <span className="font-mono text-[#10243A]">1234</span>
                </div>
              </div>
              <button
                type="button"
                className="text-[11px] font-semibold text-[#18A6A6] bg-white border border-[#DCE4EB] px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Auto Fill
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
