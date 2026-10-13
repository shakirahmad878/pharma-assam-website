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
    <div className="min-h-screen bg-[#090907] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-[#F2ECE1]">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6C5636]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B99D73]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8A7049] via-[#6C5636] to-[#4A3B24] border border-[#B99D73]/40 shadow-neu-raised mb-4">
            <Activity className="w-8 h-8 text-[#090907] stroke-[2.8]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#F2ECE1]">
            RepPulse <span className="text-[#B99D73]">Enterprise Portal</span>
          </h2>
          <p className="text-xs text-[#857866] mt-1.5">
            Official Administration & Management Portal • Pharma Assam
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-7 neu-card p-7 sm:p-8 border border-[#282319]">
          
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#F2ECE1]">Sign In to Your Account</h3>
            <p className="text-xs text-[#857866] mt-0.5">
              Enter your authorized username or Employee ID to continue
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-start gap-2.5 text-rose-300 text-xs shadow-neu-sunken">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-[#B99D73] mb-1.5">
                Username or Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-[#857866]" />
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
                  className="neu-input w-full pl-10 pr-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#B99D73]">
                  Password
                </label>
              </div>
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
                    if (error) setError(null);
                  }}
                  className="neu-input w-full pl-10 pr-10 py-2.5 text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#857866] hover:text-[#B99D73] focus:outline-none"
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
              className="neu-btn-gold w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 font-bold text-sm rounded-xl cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Security Assurance Footer */}
          <div className="mt-6 pt-5 border-t border-[#282319] flex items-center justify-center gap-2 text-[11px] text-[#857866]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B99D73]" />
            <span>Role-Based Access Control • Encrypted Session</span>
          </div>

        </div>

        {/* Quick Credentials Card */}
        <div className="mt-6 neu-card p-5 border border-[#282319]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#B99D73] mb-3">
            <Lock className="w-3.5 h-3.5 text-[#B99D73]" />
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
              className="p-3 bg-[#0c0c09] hover:bg-[#14130f] border border-[#282319] hover:border-[#6C5636] rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-neu-sunken"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F2ECE1] group-hover:text-[#B99D73] transition-colors">Super Admin</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181712] text-[#B99D73] border border-[#282319] font-mono">Full Access</span>
                </div>
                <div className="text-[11px] text-[#857866] mt-0.5">
                  User: <span className="font-mono text-[#F2ECE1]">shakir878</span> • Pass: <span className="font-mono text-[#F2ECE1]">Shakir@2026</span>
                </div>
              </div>
              <button
                type="button"
                className="neu-btn text-[11px] font-bold text-[#B99D73] px-2.5 py-1 rounded-lg cursor-pointer"
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
              className="p-3 bg-[#0c0c09] hover:bg-[#14130f] border border-[#282319] hover:border-[#6C5636] rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-neu-sunken"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F2ECE1] group-hover:text-[#B99D73] transition-colors">Regional Manager (RSM)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181712] text-[#B99D73] border border-[#282319] font-mono">Barak Valley</span>
                </div>
                <div className="text-[11px] text-[#857866] mt-0.5">
                  User: <span className="font-mono text-[#F2ECE1]">bodrudsadiol</span> • Pass: <span className="font-mono text-[#F2ECE1]">Bodrud@2026</span>
                </div>
              </div>
              <button
                type="button"
                className="neu-btn text-[11px] font-bold text-[#B99D73] px-2.5 py-1 rounded-lg cursor-pointer"
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
              className="p-3 bg-[#0c0c09] hover:bg-[#14130f] border border-[#282319] hover:border-[#6C5636] rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-neu-sunken"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F2ECE1] group-hover:text-[#B99D73] transition-colors">Medical Representative</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181712] text-[#B99D73] border border-[#282319] font-mono">Field Rep</span>
                </div>
                <div className="text-[11px] text-[#857866] mt-0.5">
                  User: <span className="font-mono text-[#F2ECE1]">0002</span> • Pass: <span className="font-mono text-[#F2ECE1]">1234</span>
                </div>
              </div>
              <button
                type="button"
                className="neu-btn text-[11px] font-bold text-[#B99D73] px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Auto Fill
              </button>
            </div>
          </div>
        </div>

        {/* Support note */}
        <p className="mt-6 text-center text-xs text-[#857866]">
          Need access or password reset? Contact your System Administrator.
        </p>

      </div>
    </div>
  );
};
