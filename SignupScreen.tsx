'use client';

import React, { useState } from 'react';
import { User, Phone, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { registerUserInFirestore, UserData } from '@/lib/firebase';
import { playSuccessAudio } from '@/lib/audio';

interface SignupScreenProps {
  onSignupSuccess: (user: UserData) => void;
  onNavigateToLogin: () => void;
}

export default function SignupScreen({ onSignupSuccess, onNavigateToLogin }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!mobile.trim()) {
      setErrorMsg('Please enter your mobile number');
      return;
    }
    if (!gmail.trim() || !gmail.includes('@')) {
      setErrorMsg('Please enter a valid Gmail / Email address');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms and Conditions');
      return;
    }

    setLoading(true);
    try {
      const user = async () => {
        return await registerUserInFirestore({
          name: name.trim(),
          mobile: mobile.trim(),
          gmail: gmail.trim().toLowerCase(),
          password: password,
        });
      };
      const createdUser = await user();
      setLoading(false);
      playSuccessAudio();
      onSignupSuccess(createdUser);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Error registering user in Firestore. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col justify-between p-6 max-w-md mx-auto select-none">
      {/* Top Header */}
      <div className="pt-12 pb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Create your account
        </h1>
        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Create your account to access all features of GK Wallet
        </p>
      </div>

      {/* Form Fields matching Screenshot 2 */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center space-y-4 my-2">
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold px-4 py-2.5 rounded-xl text-center animate-shake">
            {errorMsg}
          </div>
        )}

        {/* 1. Name Input */}
        <div className="relative flex items-center">
          <div className="absolute left-3 w-10 h-10 rounded-xl bg-[#6495ED]/10 text-[#6495ED] flex items-center justify-center border border-[#6495ED]/20">
            <User className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full pl-16 pr-4 py-3.5 bg-white border border-[#6495ED]/40 rounded-2xl text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 transition-all shadow-2xs"
            required
          />
        </div>

        {/* 2. Mobile Input */}
        <div className="relative flex items-center">
          <div className="absolute left-3 w-10 h-10 rounded-xl bg-[#6495ED]/10 text-[#6495ED] flex items-center justify-center border border-[#6495ED]/20">
            <Phone className="w-5 h-5" />
          </div>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile no"
            className="w-full pl-16 pr-4 py-3.5 bg-white border border-[#6495ED]/40 rounded-2xl text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 transition-all shadow-2xs"
            required
          />
        </div>

        {/* 3. Gmail Input */}
        <div className="relative flex items-center">
          <div className="absolute left-3 w-10 h-10 rounded-xl bg-[#6495ED]/10 text-[#6495ED] flex items-center justify-center border border-[#6495ED]/20">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            placeholder="Enter your gmail"
            className="w-full pl-16 pr-4 py-3.5 bg-white border border-[#6495ED]/40 rounded-2xl text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#6495ED] focus:ring-2 focus:ring-[#6495ED]/20 transition-all shadow-2xs"
            required
          />
        </div>

        {/* 4. Password Input */}
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

        {/* Terms Checkbox */}
        <div className="flex items-center gap-2.5 pt-2 pb-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 text-[#6495ED] border-slate-300 rounded focus:ring-[#6495ED] cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer font-medium">
            Terms and condition
          </label>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6495ED] hover:bg-[#4f82e0] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#6495ED]/25 active:scale-[0.99] transition-all flex items-center justify-center text-base mt-2 border border-[#6495ED] cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </span>
          ) : (
            'Signup'
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="pb-8 pt-4 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <button
          onClick={onNavigateToLogin}
          className="text-[#6495ED] font-bold hover:underline ml-1 cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
}
