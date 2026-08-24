'use client';

import React, { useState } from 'react';
import { X, PlusCircle, Coins, Sparkles, CheckCircle2 } from 'lucide-react';
import { addCoinsInFirestore, UserData } from '@/lib/firebase';
import { playSuccessAudio } from '@/lib/audio';

interface AddCoinsModalProps {
  user: UserData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBalance: string) => void;
}

export default function AddCoinsModal({ user, isOpen, onClose, onSuccess }: AddCoinsModalProps) {
  const [amount, setAmount] = useState('100');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (valToAdd?: number) => {
    const val = valToAdd || parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    setLoading(true);
    try {
      const res = await addCoinsInFirestore(user.uid, val);
      setLoading(false);
      if (res.success) {
        setSuccess(true);
        playSuccessAudio();
        onSuccess(res.newBalance);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1200);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-2 pb-4">
          <div className="w-14 h-14 rounded-3xl bg-amber-50 text-amber-600 inline-flex items-center justify-center mb-3 shadow-inner p-2">
            <img src="/coin.png" alt="coin" className="w-full h-full object-contain" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">Add GK Coins</h3>
          <p className="text-xs text-slate-500 mt-1">Top up your wallet balance instantly</p>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <p className="text-sm font-bold text-emerald-700">GK Coins Added Successfully!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 200, 500, 1000, 2000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    amount === preset.toString()
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  +{preset} Coins
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Coin Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-bold"
              />
            </div>

            <button
              onClick={() => handleAdd()}
              disabled={loading}
              className="w-full bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-pink-500/20 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Adding Coins...' : `Add ${amount || 0} Coins Now`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
