import React, { useState } from 'react';
import { useIE } from '../context/IEContext';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck, Factory } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useIE();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = login(username, password);
    if (!success) {
      setError('Invalid credentials. Default username is "admin" and password is "123".');
    }
  };

  const handleQuickDemo = () => {
    setUsername('admin');
    setPassword('123');
    login('admin', '123');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-white shadow-xs">
            <Factory className="h-6 w-6 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">OptiSew Smart IE</h1>
          <p className="text-xs text-slate-400">Garment Industrial Engineering Manufacturing Execution System</p>
        </div>

        {/* Default credentials banner */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Default System Credentials</span>
          </div>
          <div className="flex justify-between text-slate-400 font-mono text-[11px] pt-1">
            <span>Username: <strong className="text-white">admin</strong></span>
            <span>Password: <strong className="text-white">123</strong></span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-950/50 border border-rose-800/80 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-slate-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-9 pr-3 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-slate-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-slate-200 transition-colors shadow-xs"
          >
            <span>Sign In to IE Workbench</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Quick Demo 1-Click Button */}
        <div className="border-t border-slate-900 pt-4 text-center">
          <button
            onClick={handleQuickDemo}
            type="button"
            className="text-xs text-emerald-400 hover:text-emerald-300 hover:underline font-medium"
          >
            Click here for Instant 1-Click Login (admin / 123)
          </button>
        </div>
      </div>
    </div>
  );
};
