import React, { useState } from 'react';
import { HrmsUser } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  Building2, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  Globe,
  Briefcase,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

interface HrmsLoginPageProps {
  onLoginSuccess: (user: HrmsUser) => void;
  users: HrmsUser[];
}

export const HrmsLoginPage: React.FC<HrmsLoginPageProps> = ({ onLoginSuccess, users }) => {
  const [identifier, setIdentifier] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your Employee Code or Registered Email.');
      return;
    }

    if (!pin.trim()) {
      setError('Please enter your 4-digit PIN (Default: 1234).');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = HrmsService.authenticateUser(identifier, pin);
      setIsLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-indigo-50/40 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Top Left Navigation Links */}
      <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
        <a
          href="https://nlcl.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs backdrop-blur-xs transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-sky-600" />
          <span>nlcl.in ↗</span>
        </a>
        <a
          href="https://reppulse.nlcl.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs backdrop-blur-xs transition-colors cursor-pointer"
        >
          <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
          <span>RepPulse SFA ↗</span>
        </a>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/25 mb-3 border border-sky-400/40">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Apex<span className="text-sky-600">HRMS</span>
          </h1>
          <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wide">
            New Life Care Laboratories Pvt. Ltd.
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Centralized Workforce, Attendance & Statutory Payroll Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
          
          <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Employee Login</h2>
              <p className="text-[11px] text-slate-500">Sign in to access your self-service dashboard</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS Encrypted</span>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Employee Identifier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Employee Code / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="e.g. NLCL-0002 or shakir.hr@nlcl.in"
                  required
                  autoFocus
                  className="block w-full pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-500/10 transition-all font-medium"
                />
              </div>
            </div>

            {/* PIN / Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Security PIN / Password
                </label>
                <span className="text-[10px] text-slate-400">Default: 1234</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  maxLength={16}
                  required
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-500/10 transition-all font-mono tracking-wider font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-sky-600/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Corporate HR Access Support */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Forgot PIN or need account access?</span>
            <a 
              href="mailto:hr@nlcl.in" 
              className="font-bold text-sky-600 hover:underline"
            >
              Contact People Operations
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-[11px] text-slate-400 space-y-1">
          <p>© 2026 New Life Care Laboratories Pvt. Ltd. All rights reserved.</p>
          <p>Assam Regional HQ: Silchar 788001 • Statutory HRMS & Field Force</p>
        </div>

      </div>
    </div>
  );
};
