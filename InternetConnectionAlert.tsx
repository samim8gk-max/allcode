'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WifiOff, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function InternetConnectionAlert() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkConnectivity = useCallback(async () => {
    setIsChecking(true);
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsOnline(false);
        setIsChecking(false);
        return;
      }
      // Attempt a lightweight fetch with cache busting
      const res = await fetch('/favicon.ico?' + Date.now(), { method: 'HEAD', cache: 'no-store' });
      if (res.ok || res.status < 500) {
        setIsOnline(true);
      } else {
        setIsOnline(true); // Server responded, so network is working
      }
    } catch (e) {
      if (typeof navigator !== 'undefined') {
        setIsOnline(navigator.onLine);
      }
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-500/30 text-center space-y-4 animate-scale-up relative overflow-hidden">
        {/* Top Decorative Warning Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500" />

        {/* Offline Icon Illustration */}
        <div className="w-20 h-20 bg-rose-50 border-2 border-rose-200 text-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner relative">
          <WifiOff className="w-10 h-10 stroke-[2.2] animate-pulse" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs">
            !
          </span>
        </div>

        {/* Exact Bengali Alert Message */}
        <div className="space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 bg-rose-100/80 text-rose-800 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>নো ইন্টারনেট কানেকশন</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug px-1">
            আপনার মোবাইলে ইন্টারনেট কানেকশন বন্ধ আছে
          </h2>

          <p className="text-xs font-semibold text-slate-500 leading-relaxed px-2">
            অনুগ্রহ করে আপনার ডিভাইসের Wi-Fi বা মোবাইল ডাটা চালু করুন এবং আবার চেষ্টা করুন।
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={checkConnectivity}
            disabled={isChecking}
            className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-rose-600/25 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-700 disabled:opacity-75"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'চেক করা হচ্ছে...' : 'পুনরায় চেষ্টা করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
