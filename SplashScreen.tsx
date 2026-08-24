'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { getCurrentUserFromFirestore, UserData } from '@/lib/firebase';

interface SplashScreenProps {
  onComplete: (user: UserData | null) => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    let isMounted = true;
    let fetchedUser: UserData | null = null;

    // 1. Check Firebase user data in background
    const checkUserPromise = getCurrentUserFromFirestore()
      .then((user) => {
        fetchedUser = user;
      })
      .catch((err) => {
        console.warn('Splash session check note:', err);
      });

    // 2. Fast 2 seconds timer for progress animation
    const timer = setTimeout(async () => {
      try {
        await Promise.race([checkUserPromise, new Promise((res) => setTimeout(res, 400))]);
      } catch {}
      if (isMounted) {
        onComplete(fetchedUser);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className="relative w-full h-full min-h-screen bg-gradient-to-b from-[#f4f8ff] via-[#ffffff] to-[#e8f1fd] flex flex-col items-center justify-center p-6 overflow-hidden select-none">
      {/* Decorative Wave & Dot Grid Background matching flash.png */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-70">
        {/* Top left soft blue gradient blur */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-100/60 blur-3xl" />
        
        {/* Top right dot grid */}
        <div className="absolute top-10 right-8 grid grid-cols-4 gap-2 opacity-30">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          ))}
        </div>

        {/* Bottom left dot grid */}
        <div className="absolute bottom-24 left-8 grid grid-cols-4 gap-2 opacity-30">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          ))}
        </div>

        {/* Bottom flowing curved lines matching flash.png */}
        <svg
          className="absolute bottom-0 left-0 w-full h-72 text-blue-200/40"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,165.3C672,171,768,213,864,224C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Center Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm w-full my-auto text-center px-4">
        {/* 3D Wallet Illustration matching flash.png */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6"
        >
          {/* Subtle glow backdrop */}
          <div className="absolute inset-0 bg-blue-400/20 rounded-full filter blur-2xl scale-125" />

          {/* 3D Wallet SVG Graphic */}
          <div className="relative w-56 h-56 flex items-center justify-center drop-shadow-2xl">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="walletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a3cbff" />
                  <stop offset="50%" stopColor="#6bb1ff" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="card1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="goldCoin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
                <linearGradient id="metalBtn" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>

              {/* Blue Card Peeking */}
              <rect x="55" y="45" width="80" height="65" rx="8" fill="url(#card1Grad)" transform="rotate(-15 95 77)" />
              
              {/* White Card Peeking */}
              <rect x="75" y="48" width="80" height="65" rx="8" fill="#f8fafc" transform="rotate(8 115 80)" />

              {/* Golden Rupee / GK Coin inside wallet */}
              <circle cx="100" cy="72" r="24" fill="url(#goldCoin)" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.15))" />
              <circle cx="100" cy="72" r="20" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 1" />
              <text x="100" y="80" textAnchor="middle" fill="#713f12" fontSize="22" fontWeight="bold" fontFamily="sans-serif">₹</text>

              {/* Front Wallet Body */}
              <path
                d="M35 80 C35 68, 48 68, 60 68 L140 68 C152 68, 165 68, 165 80 L165 140 C165 155, 152 165, 135 165 L65 165 C48 165, 35 155, 35 140 Z"
                fill="url(#walletGrad)"
                filter="drop-shadow(0px 12px 20px rgba(59, 130, 246, 0.35))"
              />
              <path
                d="M40 82 L160 82 M40 138 L160 138"
                stroke="#dbeafe"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                opacity="0.8"
              />

              {/* Wallet Leather Flap with Snap */}
              <path
                d="M130 98 C130 92, 160 92, 165 98 L165 125 C160 132, 130 132, 130 125 Z"
                fill="#60a5fa"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <circle cx="148" cy="111" r="8" fill="url(#metalBtn)" stroke="#94a3b8" strokeWidth="1" />
            </svg>
          </div>
        </motion.div>

        {/* Title & Subtitle matching flash.png */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
            <span className="text-[#1a73e8]">GK </span>
            <span className="text-[#1e293b]">Wallet</span>
          </h1>

          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 font-bold tracking-wide">
            <span className="w-8 h-[2px] bg-blue-500/40 rounded-full" />
            <span>Smart Payments, Easy Life</span>
            <span className="w-8 h-[2px] bg-blue-500/40 rounded-full" />
          </div>
        </motion.div>

        {/* Middle Smooth Rotating Circular Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex flex-col items-center justify-center"
        >
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a73e8] border-r-[#1a73e8] animate-spin" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

