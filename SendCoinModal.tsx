'use client';

import React, { useState } from 'react';
import { X, Send, Coins, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { transferCoinsInFirestore, UserData } from '@/lib/firebase';
import { playSuccessAudio } from '@/lib/audio';

interface SendCoinModalProps {
  user: UserData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBalance: string) => void;
}

export default function SendCoinModal({ user, isOpen, onClose, onSuccess }: SendCoinModalProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);

    const coinVal = parseFloat(amount);
    if (!recipient.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter receiver Mobile or Gmail' });
      return;
    }
    if (isNaN(coinVal) || coinVal <= 0) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid coin amount' });
      return;
    }

    setLoading(true);
    try {
      const res = await transferCoinsInFirestore(user.uid, recipient, coinVal, note || 'GK Coin Transfer');
      setLoading(false);

      if (res.success && res.newBalance !== undefined) {
        playSuccessAudio();
        setStatusMsg({ type: 'success', text: res.message });
        onSuccess(res.newBalance);
        setTimeout(() => {
          onClose();
          setRecipient('');
          setAmount('');
          setNote('');
          setStatusMsg(null);
        }, 1500);
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setLoading(false);
      setStatusMsg({ type: 'error', text: err.message || 'Transfer failed' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#e91e63] flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Send GK Coins</h3>
              <p className="text-xs text-slate-500">Instant user-to-user transfer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance badge */}
        <div className="mt-4 p-3 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
          <span className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-500" />
            Available Coins:
          </span>
          <span className="text-sm font-extrabold text-blue-900">{user.balance || '0'} Coins</span>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div
            className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSend} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recipient Mobile / Gmail
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. 9876543210 or user@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
              <UserCheck className="absolute right-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Coin Amount
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (e.g. 50)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                required
              />
              <span className="absolute right-3 text-xs font-bold text-amber-600">GK Coins</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Gift / Payment"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold py-3 rounded-xl shadow-md shadow-pink-500/20 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Processing Transfer...' : 'Confirm Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}
