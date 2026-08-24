'use client';

import React, { useEffect } from 'react';
import { X, ShieldCheck, Coins, User, Phone, Mail, Calendar, Key, CheckCircle, Clock } from 'lucide-react';
import { UserData } from '@/lib/firebase';
import { playSuccessAudio } from '@/lib/audio';

interface CheckCoinModalProps {
  user: UserData;
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckCoinModal({ user, isOpen, onClose }: CheckCoinModalProps) {
  useEffect(() => {
    if (isOpen) {
      playSuccessAudio();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-3xl bg-amber-50 text-amber-600 inline-flex items-center justify-center mb-2 shadow-inner p-2">
            <img src="/coin.png" alt="coin" className="w-full h-full object-contain" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">Check Coin & Firestore Data</h3>
          <p className="text-xs text-slate-500">Live Firebase Cloud Firestore Record</p>
        </div>

        {/* Giant Coin Balance */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center shadow-lg shadow-blue-500/20">
          <p className="text-xs uppercase tracking-wider text-blue-200 font-semibold mb-1">Total Coin Balance</p>
          <p className="text-3xl font-black">{user.balance || '0'} <span className="text-sm font-normal text-amber-300">GK Coins</span></p>
        </div>

        {/* Firestore Folder All Data List strictly as requested */}
        <div className="space-y-2.5 text-xs text-slate-700">
          <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 text-slate-400">
            Firestore Collection: <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">users/{user.uid}</code>
          </p>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 flex items-center gap-2"><User className="w-4 h-4 text-blue-500" /> name:</span>
            <span className="font-bold text-slate-900">{user.name}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-500" /> mobile:</span>
            <span className="font-bold text-slate-900">{user.mobile}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 flex items-center gap-2"><Mail className="w-4 h-4 text-purple-500" /> gmail:</span>
            <span className="font-bold text-slate-900 truncate max-w-[160px]">{user.gmail}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 flex items-center gap-2"><Coins className="w-4 h-4 text-amber-500" /> balance:</span>
            <span className="font-bold text-amber-600">&quot;{user.balance || '0'}&quot;</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> status:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {user.status || 'pending'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500" /> account:</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {user.account || 'active'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> registration date:</span>
            <span className="font-medium text-slate-800 text-[11px]">{new Date(user.registration_date || '2026-08-17T06:00:00.000Z').toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
            <span className="text-slate-500 flex items-center gap-2"><Key className="w-4 h-4 text-rose-500" /> uid:</span>
            <span className="font-mono text-[10px] text-slate-600 truncate max-w-[150px]">{user.uid}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition-all text-xs"
        >
          Close View
        </button>
      </div>
    </div>
  );
}
