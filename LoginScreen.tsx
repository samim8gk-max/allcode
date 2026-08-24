'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { loginUserFromFirestore, registerUserInFirestore, UserData } from '@/lib/firebase';
import { playSuccessAudio } from '@/lib/audio';

interface LoginScreenProps {
  onLoginSuccess: (user: UserData) => void;
  onNavigateToSignup: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToSignup }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Please enter your Gmail or Mobile number');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const user = await loginUserFromFirestore(identifier, password);
      setLoading(false);
      if (user) {
        playSuccessAudio();
        onLoginSuccess(user);
      } else {
        setErrorMsg('User account not found. Please Signup or check details.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    }
  };

  // Quick Demo Login helper for 1-click test
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const demoUser = await registerUserInFirestore({
        name: 'aaaa',
        mobile: '9876543210',
        gmail: 'aaaa@gkwallet.com',
        password: 'password123',
        profile_picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
      });
      // Give initial bonus coins for demo
      demoUser.balance = '500';
      if (typeof window !== 'undefined') {
        localStorage.setItem('gkwallet_current_user', JSON.stringify(demoUser));
      }
      setLoading(false);
      playSuccessAudio();
      onLoginSuccess(demoUser);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-between p-6 max-w-md mx-auto select-none">
      {/* Header */}
      <div className="pt-12 pb-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#6495ED]/10 text-[#6495ED] mb-4 shadow-2xs border border-[#6495ED]/20">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Welcome to GK Wallet
        </h1>
        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Log in to manage your GK Coins and make instant transfers
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="flex-1 flex flex-col justify-center space-y-4 my-2">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold px-4 py-2.5 rounded-xl text-center animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Gmail or Mobile */}
        <div className="relative flex items-center">
          <div className="absolute left-3 w-10 h-10 rounded-xl bg-[#6495ED]/10 text-[#6495ED] flex items-center justify-center border border-[#6495ED]/20">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your gmail or mobile no"
            className="w-full pl-16 pr-4 py-3.5 bg-white border border-[#6495ED]/40 rounded-2xl text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 transition-all shadow-2xs"
            required
          />
        </div>

        {/* Password */}
        <div className="relative flex items-center">
          <div className="absolute left-3 w-10 h-10 rounded-xl bg-[#6495ED]/10 text-[#6495ED] flex items-center justify-center border border-[#6495ED]/20">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full pl-16 pr-12 py-3.5 bg-white border border-[#6495ED]/40 rounded-2xl text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 transition-all shadow-2xs"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6495ED] hover:bg-[#4f82e0] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#6495ED]/25 active:scale-[0.99] transition-all flex items-center justify-center text-base mt-2 border border-[#6495ED] cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        {/* 1-Click Demo Account */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-2 border border-[#6495ED]/30 cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#6495ED]" />
          Log in with Demo Account (&quot;aaaa&quot;)
        </button>
      </form>

      {/* Footer Link */}
      <div className="pb-8 pt-4 text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <button
          onClick={onNavigateToSignup}
          className="text-[#6495ED] font-bold hover:underline ml-1 cursor-pointer"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
