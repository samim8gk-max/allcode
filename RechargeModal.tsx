'use client';

import React, { useState } from 'react';
import { X, Smartphone, Zap, CheckCircle2 } from 'lucide-react';
import { playSuccessAudio } from '@/lib/audio';

interface RechargeModalProps {
  type: 'mobile' | 'electricity';
  isOpen: boolean;
  onClose: () => void;
  onRechargeSuccess: (amount: number, serviceName: string) => void;
}

export default function RechargeModal({ type, isOpen, onClose, onRechargeSuccess }: RechargeModalProps) {
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('199');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const isMobile = type === 'mobile';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim() || !amount.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      playSuccessAudio();
      const val = parseFloat(amount);
      onRechargeSuccess(val, isMobile ? `Mobile Recharge (${number})` : `Electricity Bill (${number})`);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pb-4 border-b border-slate-100">
          <div className={`w-12 h-12 rounded-2xl inline-flex items-center justify-center mb-2 ${isMobile ? 'bg-amber-100 text-amber-600' : 'bg-yellow-100 text-yellow-600'}`}>
            {isMobile ? <Smartphone className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">
            {isMobile ? 'Mobile Recharge' : 'Electricity Bill'}
          </h3>
          <p className="text-xs text-slate-500">
            {isMobile ? 'Instant prepaid mobile recharge' : 'Pay electricity bill with GK Coins'}
          </p>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-emerald-700">Payment Successful!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isMobile ? 'Mobile Number' : 'Consumer / Account Number'}
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder={isMobile ? 'Enter 10 digit mobile no' : 'Enter Consumer ID'}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Amount (Coins)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold py-3 rounded-xl shadow-lg transition-all text-xs mt-2"
            >
              {loading ? 'Processing...' : `Pay ${amount} GK Coins`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
