import React, { useState } from 'react';
import { User } from '../../types';
import { AuthService } from '../../services/authService';
import { Activity, Lock, User as UserIcon, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  users: User[];
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, users }) => {
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 shadow-xl shadow-teal-500/20 mb-4">
            <Activity className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            RepPulse <span className="text-teal-400">Admin & Enterprise Portal</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Official Administration & Management Portal • Pharma Assam
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-7 shadow-2xl backdrop-blur-sm sm:px-8">
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Sign In to Your Account</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your authorized username or Employee ID to continue
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username or Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. shakir878 / bodrudsadiol / EMP ID"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
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
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Footer */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Role-Based Access Control • Encrypted Session</span>
          </div>

        </div>

        {/* Quick Credentials Card */}
        <div className="mt-6 bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Authorized Login Credentials (1-Click Fill)</span>
          </div>

          <div className="space-y-2.5">
            {/* Super Admin */}
            <div 
              onClick={() => {
                setIdentifier('shakir878');
                setPassword('Shakir@2026');
                if (error) setError(null);
              }}
              className="p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">Super Admin</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono">Full Access</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  User: <span className="font-mono text-slate-200">shakir878</span> • Pass: <span className="font-mono text-slate-200">Shakir@2026</span>
                </div>
              </div>
              <button
                type="button"
                className="text-[11px] font-bold text-teal-400 group-hover:text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1 rounded-lg transition-colors"
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
              className="p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">Regional Manager (RSM)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono">Barak Valley</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  User: <span className="font-mono text-slate-200">bodrudsadiol</span> • Pass: <span className="font-mono text-slate-200">Bodrud@2026</span>
                </div>
              </div>
              <button
                type="button"
                className="text-[11px] font-bold text-sky-400 group-hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-2.5 py-1 rounded-lg transition-colors"
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
              className="p-2.5 bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">Medical Representative</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">Field Rep</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  User: <span className="font-mono text-slate-200">0002</span> • Pass: <span className="font-mono text-slate-200">1234</span>
                </div>
              </div>
              <button
                type="button"
                className="text-[11px] font-bold text-amber-400 group-hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg transition-colors"
              >
                Auto Fill
              </button>
            </div>
          </div>
        </div>

        {/* Support note */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Need access or password reset? Contact your System Administrator.
        </p>

      </div>
    </div>
  );
};
