'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Coins, 
  Send, 
  FileText, 
  QrCode, 
  History, 
  CircleDollarSign, 
  Building2, 
  Smartphone, 
  Zap, 
  Home, 
  Bell, 
  User, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  LogOut, 
  ChevronRight,
  Share2,
  Gift,
  Sparkles,
  ShieldAlert,
  FileCheck,
  CreditCard,
  Lock,
  ArrowRight,
  Film,
  ArrowLeft,
  X,
  Check,
  Fingerprint,
  ShieldCheck,
  Volume2,
  ExternalLink,
  RefreshCw,
  Video
} from 'lucide-react';
import { 
  UserData, TransactionData, getLocalTransactions, DetailedTransactionRecord, 
  fetchDetailedTransactionsFromFirestore, fetchSliderImagesFromFirestore,
  fetchSliderItemsFromFirestore, subscribeToSliderItems,
  fetchBestOfferItemsFromFirestore, subscribeToBestOfferItems, FirestoreSliderItem,
  fetchAllUnifiedTransactionsFromFirestore, UnifiedTransactionRecord,
  getCurrentUserFromFirestore, fetchKycFromFirestore,
  fetchAdsVideoFromFirestore, AdsVideoRecord,
  subscribeToFirestoreNotifications, AppNotification,
  parseVideoUrl, subscribeToAdsVideo
} from '@/lib/firebase';
import { getTranslation, LanguageCode } from '@/lib/translations';
import ScanToPayScreen from './ScanToPayScreen';
import {
  AddCoinsScreen,
  SendCoinScreen,
  CheckCoinScreen,
  ReceiveCoinsScreen,
  HistoryScreen,
  SendToNftScreen,
  SettlementScreen,
  MobileRechargeScreen,
  ElectricityBillScreen,
  ReferAndEarnScreen,
  PlatinumSavingsScreen,
  NotificationsScreen,
  ProfileScreen,
  TransactionReceiptModal,
  KycVerificationScreen,
  SixDotsLoader,
  NftCoinIllustration
} from './FullScreenViews';

interface HomeScreenProps {
  user: UserData;
  onUserUpdate: (updatedUser: UserData) => void;
  onLogout: () => void;
  onOpenCheckCoinModal?: () => void;
}

// Custom clean, high-definition SVG vector icons for Quick Actions & Services (Outline Line-Art Styles)
function AddMoneyIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bottom Stack Layer 1 */}
      <ellipse cx="44" cy="62" rx="26" ry="11" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <path d="M 18 62 V 72 C 18 78 30 82 44 82 C 58 82 70 78 70 72 V 62" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Front Coin */}
      <circle cx="44" cy="40" r="24" stroke={color} strokeWidth="4.5" fill="none" />
      <circle cx="44" cy="40" r="18" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" fill="none" opacity="0.6" />
      <text x="44" y="48.5" textAnchor="middle" fill={color} fontFamily="system-ui, -apple-system, sans-serif" fontSize="23" fontWeight="900">₹</text>

      {/* Modern Circle Plus Badge */}
      <circle cx="76" cy="24" r="14" fill="#ffffff" stroke={color} strokeWidth="3.5" />
      <path d="M 76 18 V 30 M 70 24 H 82" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SendMoneyIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Incline launch trail */}
      <path d="M 44 54 C 52 46 60 38 68 30" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="4 4" />
      
      {/* Bottom Left Coin */}
      <circle cx="34" cy="64" r="22" stroke={color} strokeWidth="4.5" fill="none" />
      <text x="34" y="72.5" textAnchor="middle" fill={color} fontFamily="system-ui, -apple-system, sans-serif" fontSize="21" fontWeight="900">₹</text>

      {/* Up-Right Arrow Badge */}
      <circle cx="76" cy="24" r="14" fill="#ffffff" stroke={color} strokeWidth="3.5" />
      <path d="M 68 32 L 84 16 M 74 16 H 84 V 26" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckBalanceIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Document outline */}
      <rect x="20" y="16" width="60" height="68" rx="8" stroke={color} strokeWidth="4.5" fill="none" />
      {/* Lines inside */}
      <line x1="32" y1="32" x2="68" y2="32" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="32" y1="44" x2="56" y2="44" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="32" y1="56" x2="68" y2="56" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
      {/* Checkmark Badge on bottom-right */}
      <circle cx="72" cy="72" r="15" fill="#ffffff" stroke={color} strokeWidth="3.5" />
      <path d="M 65 72 L 70 77 L 79 66" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReceiveMoneyIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Inward dynamic trail */}
      <path d="M 30 30 C 38 38 46 46 54 54" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="4 4" />
      
      {/* Bottom Right Coin */}
      <circle cx="66" cy="64" r="22" stroke={color} strokeWidth="4.5" fill="none" />
      <text x="66" y="72.5" textAnchor="middle" fill={color} fontFamily="system-ui, -apple-system, sans-serif" fontSize="21" fontWeight="900">₹</text>

      {/* Down-Right Arrow Badge on Top Left */}
      <circle cx="24" cy="24" r="14" fill="#ffffff" stroke={color} strokeWidth="3.5" />
      <path d="M 32 16 L 16 32 M 26 32 H 16 V 22" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HistoryReceiptIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Receipt body outline */}
      <path d="M 22 16 H 78 V 80 L 69 74 L 60 80 L 51 74 L 42 80 L 33 74 L 22 80 V 16 Z" stroke={color} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Inner line items */}
      <line x1="34" y1="32" x2="66" y2="32" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="34" y1="44" x2="56" y2="44" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="34" y1="56" x2="66" y2="56" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function ScanToPayIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Viewfinder corner brackets */}
      <path d="M 16 34 V 18 C 16 16.9 16.9 16 18 16 H 34 M 66 16 H 82 C 83.1 16 84 16.9 84 18 V 34 M 84 66 V 82 C 84 83.1 83.1 84 82 84 H 66 M 34 84 H 18 C 16.9 84 16 83.1 16 82 V 66" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      {/* Outline QR blocks */}
      <rect x="26" y="26" width="16" height="16" rx="2.5" stroke={color} strokeWidth="3.5" fill="none" />
      <rect x="31" y="31" width="6" height="6" fill={color} />
      
      <rect x="58" y="26" width="16" height="16" rx="2.5" stroke={color} strokeWidth="3.5" fill="none" />
      <rect x="63" y="31" width="6" height="6" fill={color} />

      <rect x="26" y="58" width="16" height="16" rx="2.5" stroke={color} strokeWidth="3.5" fill="none" />
      <rect x="31" y="63" width="6" height="6" fill={color} />

      <rect x="58" y="58" width="8" height="8" rx="1" fill="#94a3b8" />
      <rect x="68" y="68" width="8" height="8" rx="1" fill="#94a3b8" />

      {/* Laser line through middle */}
      <line x1="14" y1="50" x2="86" y2="50" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="6 4" />
    </svg>
  );
}

function NftCoinsIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central Coin */}
      <circle cx="50" cy="50" r="22" stroke={color} strokeWidth="4.5" fill="none" />
      <text x="50" y="58" textAnchor="middle" fill={color} fontFamily="sans-serif" fontSize="21" fontWeight="900">₹</text>
      
      {/* Dynamic outline curved arrow from bottom-left to top-right */}
      <path d="M 24 76 C 24 50 50 24 76 24" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 64 24 H 76 V 36" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Reverse outline arrow from top-right to bottom-left */}
      <path d="M 76 76 C 76 50 50 76 24 76" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BankIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Triangular Roof Pediment */}
      <path d="M 12 36 L 50 16 L 88 36 Z" stroke={color} strokeWidth="4.5" strokeLinejoin="round" fill="none" />
      <rect x="16" y="36" width="68" height="6" rx="2" stroke={color} strokeWidth="3.5" fill="none" />
      {/* 4 Pillars as outlines */}
      <line x1="26" y1="42" x2="26" y2="72" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="42" y1="42" x2="42" y2="72" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="58" y1="42" x2="58" y2="72" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" />
      <line x1="74" y1="42" x2="74" y2="72" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" />
      {/* Base Steps */}
      <rect x="12" y="72" width="76" height="6" rx="2" stroke={color} strokeWidth="3.5" fill="none" />
      <rect x="8" y="78" width="84" height="6" rx="2" stroke={color} strokeWidth="3.5" fill="none" />
    </svg>
  );
}

function ReferEarnIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gift Box Outline */}
      <rect x="22" y="38" width="56" height="46" rx="6" stroke={color} strokeWidth="4.5" fill="none" />
      {/* Lid of Gift Box */}
      <rect x="16" y="26" width="68" height="12" rx="3" stroke={color} strokeWidth="4.5" fill="none" />
      {/* Ribbon lines */}
      <line x1="50" y1="26" x2="50" y2="84" stroke={color} strokeWidth="4.5" />
      {/* Ribbon Loop Bow */}
      <path d="M 50 26 C 36 10 44 6 50 26 Z" stroke="#94a3b8" strokeWidth="3.5" fill="none" />
      <path d="M 50 26 C 64 10 56 6 50 26 Z" stroke="#94a3b8" strokeWidth="3.5" fill="none" />
    </svg>
  );
}

function SavingsIcon({ className = "w-11 h-11", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Piggy Bank Body Outline */}
      <path d="M 50 20 C 28 20 20 38 20 54 C 20 68 34 80 50 80 C 66 80 80 68 80 54 C 80 38 72 20 50 20 Z" stroke={color} strokeWidth="4.5" fill="none" />
      {/* Piggy Snout */}
      <rect x="76" y="44" width="10" height="16" rx="3" stroke={color} strokeWidth="3.5" fill="none" />
      {/* Piggy Ears */}
      <path d="M 30 24 L 20 10 L 38 18" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Legs */}
      <line x1="34" y1="80" x2="34" y2="90" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="66" y1="80" x2="66" y2="90" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* Coin Slot */}
      <line x1="50" y1="34" x2="50" y2="46" stroke="#94a3b8" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

// Outline SVG Icons for Recharge & Bills
function MobileRechargeIcon({ className = "w-9 h-9", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Smartphone Outer outline */}
      <rect x="24" y="12" width="44" height="76" rx="8" stroke={color} strokeWidth="4.5" fill="none" />
      {/* Screen area divider */}
      <line x1="24" y1="20" x2="68" y2="20" stroke={color} strokeWidth="2.5" />
      <line x1="24" y1="78" x2="68" y2="78" stroke={color} strokeWidth="2.5" />
      {/* Home Button and Speaker */}
      <circle cx="46" cy="83" r="2" stroke={color} strokeWidth="2.5" />
      <line x1="40" y1="16" x2="52" y2="16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Central Lightning Bolt inside screen */}
      <path d="M 49 28 L 36 48 H 47 L 43 68 L 56 46 H 45 L 49 28 Z" stroke={color} strokeWidth="3.5" strokeLinejoin="round" fill="none" />
      
      {/* Signal indicator on top-right */}
      <circle cx="76" cy="24" r="14" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />
      <path d="M 68 28 A 8 8 0 0 1 84 28 M 72 24 A 4 4 0 0 1 80 24" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function ElectricityBillIcon({ className = "w-9 h-9", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Lightbulb glass outline */}
      <path d="M 50 14 C 33.5 14 20 27.5 20 44 C 20 54 26 62.5 34 67.5 V 75 C 34 77 36 78 38 78 H 62 C 64 78 66 77 66 75 V 67.5 C 74 62.5 80 54 80 44 C 80 27.5 66.5 14 50 14 Z" stroke={color} strokeWidth="4.5" strokeLinejoin="round" fill="none" />
      {/* Screw Thread Base and cap */}
      <path d="M 38 82 H 62 M 42 87 H 58 M 46 91 H 54" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
      {/* Lightning bolt inside */}
      <path d="M 53 24 L 38 45 H 51 L 47 64 L 62 43 H 49 L 53 24 Z" stroke={color} strokeWidth="3.5" strokeLinejoin="round" fill="none" />
      {/* Glow Spark Rays */}
      <line x1="50" y1="6" x2="50" y2="10" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="16" y1="24" x2="20" y2="28" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <line x1="84" y1="24" x2="80" y2="28" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function DthRechargeIcon({ className = "w-9 h-9", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dish Stand Mount */}
      <path d="M 32 86 H 68 M 50 86 V 68 M 38 68 L 50 86 L 62 68" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Curved Dish outline */}
      <path d="M 22 28 C 14 46 22 68 44 76 C 58 81 72 74 80 62" stroke={color} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      {/* Feedhorn receiver Bracket and head */}
      <line x1="38" y1="52" x2="72" y2="28" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <rect x="68" y="20" width="12" height="12" rx="2" transform="rotate(-15 68 20)" stroke={color} strokeWidth="3" fill="none" />
      {/* Broadcast Signals */}
      <path d="M 78 12 A 12 12 0 0 1 92 26" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function LicInsuranceIcon({ className = "w-9 h-9", color = "#6495ED" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield outline */}
      <path d="M 50 12 L 82 24 C 82 56 68 76 50 88 C 32 76 18 56 18 24 L 50 12 Z" stroke={color} strokeWidth="4.5" strokeLinejoin="round" fill="none" />
      {/* Protecting umbrella canopy outline */}
      <path d="M 32 46 C 32 35 40 30 50 30 C 60 30 68 35 68 46" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <line x1="50" y1="30" x2="50" y2="58" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 50 58 C 50 63 45 64 43 60" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* LIC Label Text outline pill */}
      <rect x="36" y="64" width="28" height="12" rx="3" stroke={color} strokeWidth="2.5" fill="none" />
      <text x="50" y="73" textAnchor="middle" fill={color} fontFamily="system-ui, -apple-system, sans-serif" fontSize="8" fontWeight="900" letterSpacing="0.5">LIC</text>
    </svg>
  );
}

/* ==========================================
   COMING SOON SERVICE POPUP MODAL
   ========================================== */
function ComingSoonServiceModal({
  isOpen,
  onClose,
  serviceName,
  themeColor = '#6495ED',
  icon: IconComponent
}: {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  themeColor?: string;
  icon?: React.ComponentType<{ className?: string; color?: string }>;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white text-slate-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative overflow-hidden animate-scale-up text-center space-y-4">
        {/* Top Decorative Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#6495ED] via-pink-500 to-[#6495ED]" />

        {/* Close Top-Right Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Container with subtle glow */}
        <div className="pt-2">
          <div 
            className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg relative"
            style={{ backgroundColor: `${themeColor}15`, border: `2px solid ${themeColor}30` }}
          >
            {IconComponent ? (
              <IconComponent className="w-12 h-12" color={themeColor} />
            ) : (
              <Sparkles className="w-10 h-10" style={{ color: themeColor }} />
            )}
            <div className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs border border-amber-300 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 fill-amber-950" />
              <span>NEW</span>
            </div>
          </div>
        </div>

        {/* Title & Badge */}
        <div className="space-y-1.5">
          <div className="inline-block bg-amber-50 text-amber-700 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200/80">
            Coming Soon
          </div>
          <h3 className="text-xl font-black text-slate-900 leading-tight">
            {serviceName}
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed px-3">
            We are working hard to integrate seamless <span className="font-bold text-slate-700">{serviceName}</span>. This feature will be enabled in our next app release!
          </p>
        </div>

        {/* Feature Highlights Box */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-left space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-slate-700 font-bold">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
            <span>Instant Coin & Balance Deduction</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700 font-bold">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
            <span>Official BBPS & Operator Integration</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-700 font-bold">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
            <span>Instant Cashback & Rewards</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md active:scale-95 transition-all text-sm cursor-pointer"
          style={{ backgroundColor: themeColor }}
        >
          Got It
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   BEST OFFERS FIRESTORE AUTO SLIDER
   ========================================== */
function BestOffersSlider({
  onSelectRecharge,
  onSelectElectricity,
  onSelectSettlement,
  onSelectRefer,
  onSelectScan,
  onSelectSend,
  themeColor = '#6495ED',
  t,
}: {
  onSelectRecharge?: () => void;
  onSelectElectricity?: () => void;
  onSelectSettlement?: () => void;
  onSelectRefer?: () => void;
  onSelectScan?: () => void;
  onSelectSend?: () => void;
  themeColor?: string;
  t: any;
}) {
  const [offers, setOffers] = useState<FirestoreSliderItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchBestOfferItemsFromFirestore().then((items) => {
      if (isMounted && items && items.length > 0) {
        setOffers(items);
      }
    });

    const unsubscribe = subscribeToBestOfferItems((items) => {
      if (isMounted && items) {
        setOffers(items);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Auto-slide timer (3.5 seconds)
  useEffect(() => {
    if (offers.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, offers.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX.current === null || offers.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      setCurrentIndex((prev) => (prev + 1) % offers.length);
    } else if (diff < -40) {
      setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length);
    }
    touchStartX.current = null;
  };

  const handleOfferClick = (offer: FirestoreSliderItem) => {
    if (offer.url && offer.url.trim()) {
      const targetUrl = offer.url.trim();
      if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.open(`https://${targetUrl}`, '_blank', 'noopener,noreferrer');
      }
    }
  };

  if (offers.length === 0) {
    return null;
  }

  const cur = offers[currentIndex % offers.length];

  return (
    <div className="space-y-1.5 select-none animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
            {t.bestOffers || 'Best Offers'}
          </h3>
        </div>
        {offers.length > 1 && (
          <div className="flex items-center gap-1">
            {offers.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === (currentIndex % offers.length) ? 'w-4 bg-slate-900' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sliding Image Banner Box */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => handleOfferClick(cur)}
        className="relative overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200/80 cursor-pointer active:scale-[0.99] transition-all duration-300 h-28 sm:h-32 flex items-center justify-center group"
      >
        <img
          src={cur.image}
          alt={`Best Offer ${(currentIndex % offers.length) + 1}`}
          className="w-full h-full object-cover rounded-2xl"
        />
        {cur.url && (
          <div className="absolute bottom-2 right-2 bg-slate-950/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <span>Open Offer</span>
            <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================
   KYC REQUIRED POPUP MODAL COMPONENT
   ========================================== */
function KycRequiredPopupModal({
  isOpen,
  onClose,
  onKycNow,
}: {
  isOpen: boolean;
  onClose: () => void;
  onKycNow: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#6495ED]/30 relative overflow-hidden animate-scale-up space-y-5">
        
        {/* Top Decorative Background Accent */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#6495ED] via-blue-500 to-[#6495ED]" />

        {/* Header with Lock Shield Badge */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 bg-[#6495ED]/10 border-2 border-[#6495ED]/30 text-[#6495ED] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-9 h-9 stroke-[2.2]" />
          </div>
          <div className="inline-block bg-[#6495ED]/15 text-[#6495ED] text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider border border-[#6495ED]/30">
            KYC Verification Required
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            Verification Required
          </h2>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed px-2">
            Your account KYC status is not yet marked as <span className="text-[#6495ED] font-bold">Successful</span>. Please complete your Aadhaar and PAN Card verification to unlock Quick Actions and features.
          </p>
        </div>

        {/* Aadhaar & PAN Card Illustration Cards */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Aadhaar Card Box */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border-2 border-[#6495ED]/40 rounded-2xl p-3 text-center space-y-1.5 shadow-xs relative overflow-hidden">
            <div className="w-10 h-10 bg-[#6495ED] text-white rounded-xl flex items-center justify-center mx-auto shadow-xs">
              <FileCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-[11px] font-black text-slate-900">Aadhaar Card</div>
            <p className="text-[9px] font-extrabold text-[#6495ED] bg-[#6495ED]/10 py-0.5 px-2 rounded-full inline-block border border-[#6495ED]/20">
              ID Verification
            </p>
            <div className="text-[8px] font-bold text-slate-400 font-mono tracking-widest pt-0.5">
              XXXX-XXXX-1234
            </div>
          </div>

          {/* PAN Card Box */}
          <div className="bg-gradient-to-br from-sky-50/80 to-blue-50/60 border-2 border-[#6495ED]/40 rounded-2xl p-3 text-center space-y-1.5 shadow-xs relative overflow-hidden">
            <div className="w-10 h-10 bg-[#6495ED] text-white rounded-xl flex items-center justify-center mx-auto shadow-xs">
              <CreditCard className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-[11px] font-black text-slate-900">PAN Card</div>
            <p className="text-[9px] font-extrabold text-[#6495ED] bg-[#6495ED]/10 py-0.5 px-2 rounded-full inline-block border border-[#6495ED]/20">
              Photo Upload
            </p>
            <div className="text-[8px] font-bold text-slate-400 font-mono tracking-widest pt-0.5">
              ABCDE1234F
            </div>
          </div>
        </div>

        {/* Security Encrypted Tag */}
        <div className="bg-slate-50 border border-[#6495ED]/30 rounded-2xl p-2.5 flex items-center justify-center gap-2 text-center text-[11px] font-bold text-slate-600">
          <Lock className="w-3.5 h-3.5 text-[#6495ED] shrink-0" />
          <span>100% Encrypted & Verified by Govt Standards</span>
        </div>

        {/* Action Buttons: KYC Now & Skip */}
        <div className="space-y-2 pt-2">
          {/* KYC Now Button */}
          <button
            onClick={onKycNow}
            className="w-full bg-[#6495ED] hover:bg-[#4f82e0] active:scale-95 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg shadow-[#6495ED]/25 text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#6495ED]"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>KYC Now</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>

          {/* Skip Button */}
          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-2xl text-xs transition-colors cursor-pointer border border-slate-200"
          >
            Skip
          </button>
        </div>

      </div>
    </div>
  );
}

function VideoTutorialModal({
  isOpen,
  onClose,
  themeColor = '#6495ED'
}: {
  isOpen: boolean;
  onClose: () => void;
  themeColor?: string;
}) {
  const [videoData, setVideoData] = useState<AdsVideoRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    // Auto-reveal iframe after 1.5s even if onLoad is delayed by browser sandbox
    const timer = setTimeout(() => {
      if (isMounted) setIframeLoaded(true);
    }, 1500);

    async function loadVideoData() {
      try {
        const res = await fetchAdsVideoFromFirestore();
        if (isMounted && res) {
          setVideoData(res);
        }
      } catch (err) {
        console.warn('Could not load Firestore ads video:', err);
      }
    }

    loadVideoData();

    // Subscribe to real-time updates from Firestore ads collection
    const unsubscribe = subscribeToAdsVideo((updatedRecord) => {
      if (isMounted && updatedRecord) {
        setVideoData(updatedRecord);
        setVideoError(false);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      unsubscribe();
    };
  }, [isOpen]);

  const defaultVideoUrl = "https://www.youtube.com/watch?v=MYxanz0CVbs";
  const rawUrl = videoData?.videoUrl || videoData?.video || videoData?.url || videoData?.link || videoData?.src || defaultVideoUrl;
  const isActive = videoData?.isActive !== undefined ? videoData.isActive : true;
  const shouldAutoPlay = videoData?.autoPlay !== undefined ? videoData.autoPlay : true;
  const parsed = parseVideoUrl(rawUrl, shouldAutoPlay);

  // Attempt video autoplay when element mounts or URL changes (if autoPlay is true)
  useEffect(() => {
    if (isOpen && shouldAutoPlay && videoRef.current && parsed.type === 'direct') {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Video autoplay note:', err);
          // If browser policy blocked unmuted autoplay, mute and trigger playback
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [isOpen, rawUrl, shouldAutoPlay, parsed.type]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setVideoError(false);
    setIframeLoaded(false);
    const res = await fetchAdsVideoFromFirestore();
    setVideoData(res);
    setIsRefreshing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white w-full h-full min-h-screen flex flex-col select-none overflow-hidden p-0 m-0 animate-fade-in">
      <div className="w-full h-full max-w-md sm:max-w-lg mx-auto flex flex-col bg-white">
        
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-100 shadow-2xs shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              type="button"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight flex items-center gap-2">
                <Video className="w-4 h-4 text-[#6495ED]" style={{ color: themeColor }} />
                <span>Video Player</span>
              </h3>
              <p className="text-[11px] font-semibold text-slate-400">Official Video Tutorial</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualRefresh}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs cursor-pointer transition-all active:scale-95"
              title="Refresh Video"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#6495ED]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-black text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Content Container: Video Player Only */}
        <div className="flex-1 p-4 flex flex-col justify-center overflow-y-auto">
          
          {/* If isActive is false in Firestore */}
          {!isActive ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-3 my-auto">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Video className="w-6 h-6" />
              </div>
              <h5 className="text-sm font-black text-amber-900">Video Player Inactive</h5>
              <p className="text-xs text-amber-700 font-medium">
                The video stream in Firestore `ads/video` is currently inactive (`isActive: false`).
              </p>
            </div>
          ) : (
            /* Auto Video Player Box with YouTube, Google Drive, MP4, WEBM & Firebase Storage Support */
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-300 shadow-xl flex flex-col items-center justify-center text-white ring-1 ring-black/5 my-auto">
              {isLoading ? (
                <div className="flex flex-col items-center gap-2.5">
                  <SixDotsLoader className="text-[#6495ED]" />
                  <span className="text-xs font-bold text-slate-400">Loading video...</span>
                </div>
              ) : videoError ? (
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <span className="text-xs font-bold text-rose-400">Failed to load video</span>
                  <p className="text-[11px] text-slate-400">Please check the video link or internet connection.</p>
                  <button
                    type="button"
                    onClick={handleManualRefresh}
                    className="mt-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : parsed.type === 'googledrive' ? (
                // Google Drive Auto-Playing Video Embed Preview
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 gap-2">
                      <SixDotsLoader className="text-[#6495ED]" />
                      <span className="text-[11px] font-bold text-slate-300">Connecting to Google Drive...</span>
                    </div>
                  )}
                  <iframe
                    key={parsed.embedUrl}
                    src={parsed.embedUrl}
                    title="Google Drive Video Player"
                    className="w-full h-full border-0 rounded-2xl bg-black"
                    allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                    allowFullScreen
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => setVideoError(true)}
                  />
                </div>
              ) : parsed.type === 'youtube' ? (
                // YouTube Auto-Playing Video Embed with Sound Enabled (Unmuted)
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 gap-2">
                      <SixDotsLoader className="text-[#6495ED]" />
                      <span className="text-[11px] font-bold text-slate-300">Loading YouTube video...</span>
                    </div>
                  )}
                  <iframe
                    key={parsed.embedUrl}
                    src={parsed.embedUrl}
                    title="YouTube Video Player"
                    className="w-full h-full border-0 rounded-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setIframeLoaded(true)}
                    onError={() => setVideoError(true)}
                  />
                </div>
              ) : (
                // HTML5 Native Video Player with AutoPlay & Sound
                <video
                  ref={videoRef}
                  key={rawUrl}
                  src={rawUrl}
                  autoPlay={shouldAutoPlay}
                  playsInline
                  controls
                  loop
                  muted={false}
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-contain bg-black rounded-2xl"
                />
              )}
            </div>
          )}

        </div>

        {/* Pinned Bottom Action Button */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full text-white font-black py-3.5 rounded-2xl text-sm shadow-lg transition-all cursor-pointer active:scale-98"
            style={{ backgroundColor: themeColor }}
          >
            Got It, Close Tutorial
          </button>
        </div>

      </div>
    </div>
  );
}

export default function HomeScreen({ user, onUserUpdate, onLogout }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'notifications' | 'profile'>('home');
  const [isTutorialVideoOpen, setIsTutorialVideoOpen] = useState(false);
  
  // Full Screen Views states
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCheckOpen, setIsCheckOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isNftOpen, setIsNftOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isReferOpen, setIsReferOpen] = useState(false);
  const [isSavingsOpen, setIsSavingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [rechargeModal, setRechargeModal] = useState<'mobile' | 'electricity' | null>(null);
  const [comingSoonService, setComingSoonService] = useState<{
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  } | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // KYC Required Popup and Verification screen states
  const [isKycPopupOpen, setIsKycPopupOpen] = useState(false);
  const [isKycVerificationOpen, setIsKycVerificationOpen] = useState(false);

  // Biometric Fingerprint Lock states
  const [isBiometricUnlocked, setIsBiometricUnlocked] = useState<boolean>(!user?.biometricLock);
  const [isScanningBio, setIsScanningBio] = useState(false);
  const [bioScanSuccess, setBioScanSuccess] = useState(false);

  // Push Notifications state
  const [incomingPushNotif, setIncomingPushNotif] = useState<AppNotification | null>(null);
  const seenNotifIdsRef = useRef<Set<string>>(new Set());

  // Language translation & Theme color
  const appLang = (user?.appLanguage || 'English') as LanguageCode;
  const t = getTranslation(appLang);
  const themeColor = user?.themeColor || '#6495ED';

  // Real-time Push Notification Listener on Firestore 'notification' collection
  useEffect(() => {
    // Only listen and show push alerts if user has push notifications turned ON
    if (user?.pushNotifications === false) return;

    let isInitialLoad = true;
    const unsubscribe = subscribeToFirestoreNotifications((notifs) => {
      if (notifs && notifs.length > 0) {
        if (isInitialLoad) {
          // Record initial existing notification IDs to prevent alerting old messages
          notifs.forEach((n) => {
            if (n.id) seenNotifIdsRef.current.add(n.id);
          });
          isInitialLoad = false;
          return;
        }

        // Find any brand new incoming notification
        const newNotif = notifs.find((n) => n.id && !seenNotifIdsRef.current.has(n.id));
        if (newNotif && newNotif.id) {
          seenNotifIdsRef.current.add(newNotif.id);
          setIncomingPushNotif(newNotif);

          // Auto dismiss banner after 7 seconds
          const timer = setTimeout(() => {
            setIncomingPushNotif(null);
          }, 7000);
          return () => clearTimeout(timer);
        }
      }
      isInitialLoad = false;
    });

    return () => unsubscribe();
  }, [user?.pushNotifications]);

  // Handle Biometric Fingerprint unlock
  const handleVerifyBiometricUnlock = () => {
    setIsScanningBio(true);
    setTimeout(() => {
      setIsScanningBio(false);
      setBioScanSuccess(true);
      setTimeout(() => {
        setIsBiometricUnlocked(true);
        setBioScanSuccess(false);
      }, 500);
    }, 900);
  };

  // Quick Action Handler strictly validating Cloud Firestore 'kyc' collection status
  const handleQuickAction = async (actionFn: () => void) => {
    let isKycSuccessful = false;
    if (user?.uid) {
      try {
        const kycRecord = await fetchKycFromFirestore(user.uid);
        // Check if kyc record exists in Firestore 'kyc' collection AND its status equals "successful"
        if (kycRecord && kycRecord.status?.trim().toLowerCase() === 'successful') {
          isKycSuccessful = true;
        }
      } catch (err) {
        console.warn('Error checking Firestore KYC status:', err);
      }
    }

    if (isKycSuccessful) {
      // KYC status is "successful" in Firestore kyc collection -> Do NOT show popup -> Proceed to action directly
      actionFn();
    } else {
      // KYC status is missing or NOT "successful" -> Show full display KYC Required Popup
      setIsKycPopupOpen(true);
    }
  };

  // Detailed Firestore transactions & Unified Firestore transactions (cashback, nft, addmoney, transactions)
  const [firestoreTxs, setFirestoreTxs] = useState<DetailedTransactionRecord[]>([]);
  const [unifiedTxs, setUnifiedTxs] = useState<UnifiedTransactionRecord[]>([]);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<UnifiedTransactionRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  // Top Banner Firestore 'slider' items exclusively
  const [topSliderItems, setTopSliderItems] = useState<FirestoreSliderItem[]>([]);
  const [topSlideIndex, setTopSlideIndex] = useState(0);
  const [isTopSlidePaused, setIsTopSlidePaused] = useState(false);
  const topTouchStartX = useRef<number | null>(null);

  // Fetch and subscribe exclusively to Firestore 'slider' collection
  useEffect(() => {
    let isMounted = true;
    fetchSliderItemsFromFirestore().then((items) => {
      if (isMounted && items && items.length > 0) {
        setTopSliderItems(items);
      }
    });

    const unsubscribe = subscribeToSliderItems((items) => {
      if (isMounted && items) {
        setTopSliderItems(items);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Auto slide top banner every 3.5 seconds
  useEffect(() => {
    if (topSliderItems.length <= 1 || isTopSlidePaused) return;
    const interval = setInterval(() => {
      setTopSlideIndex((prev) => (prev + 1) % topSliderItems.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [topSliderItems.length, isTopSlidePaused]);

  const handleTopTouchStart = (e: React.TouchEvent) => {
    setIsTopSlidePaused(true);
    topTouchStartX.current = e.touches[0].clientX;
  };

  const handleTopTouchEnd = (e: React.TouchEvent) => {
    setIsTopSlidePaused(false);
    if (topTouchStartX.current === null || topSliderItems.length <= 1) return;
    const diff = topTouchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      setTopSlideIndex((prev) => (prev + 1) % topSliderItems.length);
    } else if (diff < -40) {
      setTopSlideIndex((prev) => (prev - 1 + topSliderItems.length) % topSliderItems.length);
    }
    topTouchStartX.current = null;
  };

  const handleTopSlideClick = (slide: FirestoreSliderItem) => {
    if (slide.url && slide.url.trim()) {
      const targetUrl = slide.url.trim();
      if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.open(`https://${targetUrl}`, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Periodically refresh logged-in user profile & balance directly from Cloud Firestore 'users' collection
  useEffect(() => {
    let mounted = true;
    const syncUserFromFirestore = async () => {
      if (!user?.uid) return;
      try {
        const liveUser = await getCurrentUserFromFirestore();
        if (liveUser && mounted) {
          if (
            liveUser.balance !== user.balance ||
            liveUser.status !== user.status ||
            liveUser.name !== user.name ||
            liveUser.profile_picture !== user.profile_picture
          ) {
            onUserUpdate(liveUser);
          }
        }
      } catch (e) {
        console.warn('User sync note:', e);
      }
    };

    syncUserFromFirestore();
    const interval = setInterval(syncUserFromFirestore, 4000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user?.uid, user?.balance, user?.status, user?.name, user?.profile_picture, onUserUpdate]);

  // Fetch all unified transactions from Firestore collections for logged-in user only
  useEffect(() => {
    const loadUnified = () => {
      if (!user?.uid && !user?.mobile) return;
      fetchAllUnifiedTransactionsFromFirestore(user?.uid, user?.mobile).then((records) => {
        setUnifiedTxs(records);
      });
    };
    loadUnified();
    const interval = setInterval(loadUnified, 3000);
    return () => clearInterval(interval);
  }, [user?.uid, user?.mobile, isSendOpen, isAddOpen, isNftOpen]);

  // Fetch transactions from Firestore
  useEffect(() => {
    fetchDetailedTransactionsFromFirestore(user?.uid).then((records) => {
      if (records && records.length > 0) {
        setFirestoreTxs(records);
      }
    });
  }, [user?.uid, isSendOpen]);

  const [sendInitialUid, setSendInitialUid] = useState<string>('');
  const [sendInitialAmount, setSendInitialAmount] = useState<string>('');

  const handleBalanceUpdate = (newBal: string) => {
    const updatedUser = { ...user, balance: newBal };
    onUserUpdate(updatedUser);
    fetchDetailedTransactionsFromFirestore(user?.uid).then((records) => {
      if (records && records.length > 0) {
        setFirestoreTxs(records);
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col justify-between max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto relative pb-24 select-none transition-all">
      
      {/* Top Floating Push Notification Mobile Banner */}
      {incomingPushNotif && (
        <div className="fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 animate-bounce-in bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-start gap-3 backdrop-blur-md">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
            style={{ backgroundColor: themeColor }}
          >
            <Bell className="w-5 h-5" />
          </div>
          <div
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => {
              setIsNotificationsOpen(true);
              setIncomingPushNotif(null);
            }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-white truncate">{incomingPushNotif.title}</h4>
              <span className="text-[9px] text-slate-400 font-semibold shrink-0 ml-2">Now</span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{incomingPushNotif.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setIncomingPushNotif(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Biometric Fingerprint Lock Screen Overlay */}
      {user?.biometricLock && !isBiometricUnlocked && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-between p-8 text-white select-none animate-fade-in">
          <div className="pt-12 text-center space-y-2">
            <div
              className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-lg mb-3"
              style={{ backgroundColor: themeColor }}
            >
              <Lock className="w-8 h-8 text-white stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {t.biometricLock}
            </h2>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
              {t.touchSensorToUnlock}
            </p>
          </div>

          {/* Fingerprint Sensor Touch Area */}
          <div className="flex flex-col items-center gap-4 py-8">
            <button
              type="button"
              onClick={handleVerifyBiometricUnlock}
              disabled={isScanningBio || bioScanSuccess}
              className="relative group p-6 rounded-full transition-all active:scale-95 cursor-pointer"
            >
              {/* Outer Pulsing Wave */}
              <div
                className="absolute inset-0 rounded-full opacity-30 animate-ping"
                style={{ backgroundColor: themeColor }}
              />
              <div
                className={`w-28 h-28 rounded-full border-4 flex items-center justify-center shadow-2xl transition-all ${
                  bioScanSuccess
                    ? 'bg-emerald-600 border-emerald-400 text-white'
                    : isScanningBio
                    ? 'border-white bg-slate-800 animate-pulse text-white'
                    : 'border-slate-700 bg-slate-900 text-white group-hover:border-slate-500'
                }`}
                style={!bioScanSuccess && !isScanningBio ? { borderColor: themeColor } : {}}
              >
                {bioScanSuccess ? (
                  <Check className="w-12 h-12 stroke-[3] animate-scale-in" />
                ) : (
                  <Fingerprint className={`w-14 h-14 transition-all ${isScanningBio ? 'animate-pulse scale-110' : ''}`} style={{ color: themeColor }} />
                )}
              </div>
            </button>
            <p className="text-xs font-extrabold text-slate-300">
              {bioScanSuccess
                ? 'Identity Verified!'
                : isScanningBio
                ? 'Scanning Fingerprint Sensor...'
                : 'Touch Sensor or Tap to Verify'}
            </p>
          </div>

          <div className="pb-8 text-center space-y-3 w-full max-w-xs">
            <button
              type="button"
              onClick={handleVerifyBiometricUnlock}
              className="w-full py-3.5 rounded-2xl text-xs font-black text-white shadow-lg transition-all active:scale-98 cursor-pointer"
              style={{ backgroundColor: themeColor }}
            >
              {t.verifyFingerprint}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="text-[11px] font-bold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {t.logout}
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Bar - Fixed / Sticky on Top during Scroll */}
      <div className="sticky top-0 z-40 bg-white/98 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-100 shadow-xs shrink-0 w-full">
        <div className="flex items-center gap-3">
          {/* Avatar opens Profile Full Screen */}
          <div 
            onClick={() => setIsProfileOpen(true)} 
            className="relative cursor-pointer group"
          >
            <img
              src={user.avatarUrl || 'https://picsum.photos/seed/user/100/100'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 p-0.5 shadow-xs group-hover:scale-105 transition-transform"
              style={{ borderColor: themeColor }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          {/* User Name & Greeting */}
          <div onClick={() => setIsProfileOpen(true)} className="cursor-pointer">
            <p className="text-[10px] font-semibold text-slate-400 leading-tight">Hello,</p>
            <h2 className="text-sm font-black text-slate-900 leading-tight flex items-center gap-1">
              {user.name || 'aaaa'}
            </h2>
            <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
              Good Day! 👋
            </p>
          </div>
        </div>

        {/* Right Notification Bell & Tutorial Video Icon */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="w-10 h-10 flex items-center justify-center relative active:scale-95 transition-transform cursor-pointer text-slate-800"
            title={t.notifications}
          >
            <Bell className="w-6 h-6 text-slate-800" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          <button
            onClick={() => setIsTutorialVideoOpen(true)}
            className="w-10 h-10 flex items-center justify-center active:scale-95 transition-transform cursor-pointer text-[#e91e63]"
            title={t.watchVideoTutorial}
          >
            <Play className="w-6 h-6 ml-0.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="px-3 sm:px-6 py-4 space-y-4 flex-1">

        {/* Top Auto-Sliding Dynamic Banner Carousel from Firestore 'slider' Collection Only */}
        {topSliderItems.length > 0 && (
          <div 
            className="relative w-full h-28 sm:h-32 rounded-2xl overflow-hidden shadow-2xs border border-slate-200/70 bg-white group select-none animate-fade-in"
            onMouseEnter={() => setIsTopSlidePaused(true)}
            onMouseLeave={() => setIsTopSlidePaused(false)}
            onTouchStart={handleTopTouchStart}
            onTouchEnd={handleTopTouchEnd}
          >
            {topSliderItems.map((slide, idx) => {
              const isVisible = idx === (topSlideIndex % topSliderItems.length);
              return (
                <div
                  key={slide.id || idx}
                  onClick={() => handleTopSlideClick(slide)}
                  className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700 ${
                    isVisible ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={`Slider ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {slide.url && (
                    <div className="absolute bottom-2 right-2 bg-slate-950/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <span>Visit Link</span>
                      <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Navigation Indicator Dots */}
            {topSliderItems.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {topSliderItems.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTopSlideIndex(idx);
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === (topSlideIndex % topSliderItems.length)
                        ? 'w-5 bg-slate-900 shadow-xs'
                        : 'w-1.5 bg-slate-400/50 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Quick Actions Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">{t.quickActions}</h3>
            <button
              onClick={() => handleQuickAction(() => setIsAddOpen(true))}
              className="font-bold text-[11px] hover:underline flex items-center gap-1 cursor-pointer"
              style={{ color: themeColor }}
            >
              + {t.addMoney}
            </button>
          </div>

          {/* 8 Action Items Responsive Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
            
            {/* 1. Add Coins */}
            <button
              onClick={() => handleQuickAction(() => setIsAddOpen(true))}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <AddMoneyIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.addCoins}</span>
            </button>

            {/* 2. Send Coin */}
            <button
              onClick={() => handleQuickAction(() => setIsSendOpen(true))}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <SendMoneyIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.sendCoin}</span>
            </button>

            {/* 3. Check Coin */}
            <button
              onClick={() => handleQuickAction(() => setIsCheckOpen(true))}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <CheckBalanceIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.checkCoin}</span>
            </button>

            {/* 4. Receive Coins */}
            <button
              onClick={() => handleQuickAction(() => setIsReceiveOpen(true))}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <ReceiveMoneyIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.receiveCoins}</span>
            </button>

            {/* 5. History */}
            <button
              onClick={() => handleQuickAction(() => setShowHistoryModal(true))}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <HistoryReceiptIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.history}</span>
            </button>

            {/* 6. Scan to Pay */}
            <button
              onClick={() => handleQuickAction(() => setIsScanOpen(true))}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <ScanToPayIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.scanToPay}</span>
            </button>

            {/* 7. Send To NFT */}
            <button
              onClick={() => handleQuickAction(() => setIsNftOpen(true))}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <NftCoinsIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.sendToNft}</span>
            </button>

            {/* 8. Settlement */}
            <button
              onClick={() => handleQuickAction(() => setIsSettlementOpen(true))}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <BankIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.settlement}</span>
            </button>

          </div>
        </div>

        {/* 4. Recharge & Bills Section (4-Column Layout) */}
        <div>
          <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2.5 px-1">{t.rechargeAndBills}</h3>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            {/* Mobile Recharge */}
            <button
              onClick={() => setComingSoonService({ title: t.mobileRecharge || 'Mobile Recharge', icon: MobileRechargeIcon })}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <MobileRechargeIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.mobileRecharge}</span>
            </button>

            {/* DTH Recharge */}
            <button
              onClick={() => setComingSoonService({ title: t.dthRecharge || 'DTH Recharge', icon: DthRechargeIcon })}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <DthRechargeIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.dthRecharge || 'DTH Recharge'}</span>
            </button>

            {/* Electricity Bill */}
            <button
              onClick={() => setComingSoonService({ title: t.electricityBill || 'Electricity Bill', icon: ElectricityBillIcon })}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <ElectricityBillIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.electricityBill}</span>
            </button>

            {/* LIC */}
            <button
              onClick={() => setComingSoonService({ title: t.licInsurance || 'LIC', icon: LicInsuranceIcon })}
              className="flex flex-col items-center justify-center p-2.5 bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <LicInsuranceIcon className="w-10 h-10" color={themeColor} />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">{t.licInsurance || 'LIC'}</span>
            </button>
          </div>
        </div>

        {/* 5. Best Offers Auto-Slider Banner (Small height, 6 slides, auto-sliding) */}
        <BestOffersSlider
          onSelectRecharge={() => setComingSoonService({ title: t.mobileRecharge || 'Mobile Recharge', icon: MobileRechargeIcon })}
          onSelectElectricity={() => setComingSoonService({ title: t.electricityBill || 'Electricity Bill', icon: ElectricityBillIcon })}
          onSelectSettlement={() => handleQuickAction(() => setIsSettlementOpen(true))}
          onSelectRefer={() => handleQuickAction(() => setIsReferOpen(true))}
          onSelectScan={() => handleQuickAction(() => setIsScanOpen(true))}
          onSelectSend={() => handleQuickAction(() => setIsSendOpen(true))}
          themeColor={themeColor}
          t={t}
        />

        {/* 6. Watch Video Tutorial Banner Box (Positioned below Best Offers) */}
        <div 
          onClick={() => setIsTutorialVideoOpen(true)}
          className="rounded-2xl p-3.5 shadow-2xs flex items-center justify-between cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
          style={{ backgroundColor: `${themeColor}12`, border: `2px solid ${themeColor}33` }}
        >
          <div className="flex items-center gap-3">
            {/* Vector Film Icon without outer box */}
            <div className="w-12 h-12 flex items-center justify-center text-slate-800 shrink-0">
              <Film className="w-8 h-8 text-slate-800 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                {t.watchVideoTutorial}
              </h4>
              <p className="text-[11px] font-semibold text-slate-500 leading-tight">
                {t.tutorialSubtitle}
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsTutorialVideoOpen(true);
            }}
            className="text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer flex items-center gap-1"
            style={{ backgroundColor: themeColor }}
          >
            <span>{t.watchNow}</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* 6. Recent Transactions Section */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">{t.recentTransactions}</h3>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="font-bold text-xs hover:underline flex items-center gap-0.5 cursor-pointer"
              style={{ color: themeColor }}
            >
              {t.viewAll} &gt;
            </button>
          </div>

          <div className="space-y-2.5">
            {unifiedTxs.length > 0 ? (
              unifiedTxs.slice(0, 10).map((tx) => {
                const statusUpper = (tx.status || 'SUCCESS').toUpperCase();
                const isPending = statusUpper.includes('PEND');
                const isFailed = statusUpper.includes('FAIL') || statusUpper.includes('REJ');
                const statusDisplay = isPending ? 'PENDING' : isFailed ? 'FAILED' : 'SUCCESS';

                const titleLower = (tx.title || '').toLowerCase();
                const reasonLower = (tx.reason || '').toLowerCase();
                const subtitleLower = (tx.subtitle || '').toLowerCase();
                const isCashback = tx.sourceCollection === 'cashback' || titleLower.includes('cashback') || titleLower.includes('reward') || reasonLower.includes('cashback') || subtitleLower.includes('cashback');
                const isAddMoney = tx.sourceCollection === 'addmoney' || titleLower.includes('add money');
                const isBank = tx.sourceCollection === 'nft' || tx.sourceCollection === 'ntt' || tx.sourceCollection === 'withdrawal' || titleLower.includes('withdrawal') || titleLower.includes('bank');

                // Display partner user's name (the other user, never logged in user's own name)
                const partnerDisplayName = tx.partnerName || tx.title || 'Smart Wallet Member';
                const partnerPic = tx.partnerProfilePicture || (tx.sourceCollection === 'transactions' ? (tx.isCredit ? tx.senderProfilePicture : tx.receiverProfilePicture) : '');

                const displayDateTime = tx.formattedDateTime || (tx.date && tx.time ? `${tx.date} • ${tx.time}` : tx.date || 'Just now');

                return (
                  <div 
                    key={tx.id} 
                    onClick={() => {
                      setSelectedReceiptTx(tx);
                      setIsReceiptOpen(true);
                    }}
                    className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between cursor-pointer active:scale-[0.99]"
                  >
                    {/* Left: Coin Icon / Avatar / Bank Icon + Name + Date/Time */}
                    <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                      {isCashback || isAddMoney ? (
                        <div className="w-12 h-12 flex items-center justify-center shrink-0">
                          <NftCoinIllustration className="w-11 h-11" />
                        </div>
                      ) : isBank ? (
                        <div className="w-12 h-12 flex items-center justify-center shrink-0">
                          <BankIcon className="w-9 h-9" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-slate-100 bg-slate-50 overflow-hidden shadow-2xs">
                          <img
                            src={partnerPic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(partnerDisplayName)}`}
                            alt={partnerDisplayName}
                            className="w-full h-full object-cover rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(partnerDisplayName)}`;
                            }}
                          />
                        </div>
                      )}

                      {/* Center: Partner Name + Date • Time */}
                      <div className="min-w-0">
                        <h4 className="text-[15px] font-bold text-slate-900 truncate leading-tight">
                          {partnerDisplayName}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium truncate mt-1">
                          {displayDateTime}
                        </p>
                      </div>
                    </div>

                    {/* Right: Amount + Status Pill */}
                    <div className="text-right shrink-0 ml-3 flex flex-col items-end">
                      <span className={`text-base sm:text-lg font-black tracking-tight ${
                        tx.isCredit ? 'text-emerald-600' : 'text-[#e11d48]'
                      }`}>
                        {tx.isCredit ? '+ ₹' : '- ₹'}{tx.amount.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-1 tracking-wider uppercase ${
                        isPending 
                          ? 'bg-amber-50 text-amber-600 border border-amber-200/60' 
                          : isFailed
                          ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100/60'
                      }`}>
                        {statusDisplay}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div 
                onClick={() => setIsSendOpen(true)}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100/90 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                  <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <NftCoinIllustration className="w-11 h-11" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-bold text-slate-900 leading-tight">Cashback Bonus</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">19 Aug 2026 • 11:49:15 AM</p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3 flex flex-col items-end">
                  <span className="text-base sm:text-lg font-black text-emerald-600 tracking-tight">
                    + ₹1.93
                  </span>
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/60 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-block mt-1 tracking-wider uppercase">
                    SUCCESS
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 7. Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-6 max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto shadow-lg">
        <div className="flex items-center justify-around">
          
          {/* Home Tab */}
          <button
            onClick={() => {
              setActiveTab('home');
              setIsScanOpen(false);
              setIsNotificationsOpen(false);
              setIsProfileOpen(false);
            }}
            className="flex flex-col items-center gap-1 group relative cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'home'
                  ? 'text-white shadow-md -translate-y-1'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              style={activeTab === 'home' ? { backgroundColor: themeColor, boxShadow: `0 4px 12px ${themeColor}66` } : {}}
            >
              <Home className="w-5 h-5" />
            </div>
            <span
              className="text-[10px] font-bold"
              style={{ color: activeTab === 'home' ? themeColor : '#94a3b8' }}
            >
              {t.home}
            </span>
          </button>

          {/* Scan to Pay Tab -> Checks Firestore KYC status before opening Scanner */}
          <button
            onClick={() => {
              setActiveTab('scan');
              handleQuickAction(() => setIsScanOpen(true));
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'scan'
                  ? 'text-white shadow-md -translate-y-1'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              style={activeTab === 'scan' ? { backgroundColor: themeColor, boxShadow: `0 4px 12px ${themeColor}66` } : {}}
            >
              <QrCode className="w-5 h-5" />
            </div>
            <span
              className="text-[10px] font-bold"
              style={{ color: activeTab === 'scan' ? themeColor : '#94a3b8' }}
            >
              {t.scanToPay}
            </span>
          </button>

          {/* Notifications Tab -> Opens Full Screen Notifications */}
          <button
            onClick={() => {
              setActiveTab('notifications');
              setIsNotificationsOpen(true);
            }}
            className="flex flex-col items-center gap-1 group relative cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'notifications'
                  ? 'text-white shadow-md -translate-y-1'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              style={activeTab === 'notifications' ? { backgroundColor: themeColor, boxShadow: `0 4px 12px ${themeColor}66` } : {}}
            >
              <Bell className="w-5 h-5" />
            </div>
            <span className="absolute top-1 right-3 w-2 h-2 bg-rose-500 rounded-full" />
            <span
              className="text-[10px] font-bold"
              style={{ color: activeTab === 'notifications' ? themeColor : '#94a3b8' }}
            >
              {t.notifications}
            </span>
          </button>

          {/* Profile Tab -> Opens Full Screen Profile */}
          <button
            onClick={() => {
              setActiveTab('profile');
              setIsProfileOpen(true);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'profile'
                  ? 'text-white shadow-md -translate-y-1'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              style={activeTab === 'profile' ? { backgroundColor: themeColor, boxShadow: `0 4px 12px ${themeColor}66` } : {}}
            >
              <User className="w-5 h-5" />
            </div>
            <span
              className="text-[10px] font-bold"
              style={{ color: activeTab === 'profile' ? themeColor : '#94a3b8' }}
            >
              {t.profile}
            </span>
          </button>

        </div>
      </div>

      {/* FULL SCREEN VIEWS */}
      <ProfileScreen
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setActiveTab('home');
        }}
        user={user}
        onUserUpdate={onUserUpdate}
        onLogout={onLogout}
        onOpenAddCoins={() => { setIsProfileOpen(false); handleQuickAction(() => setIsAddOpen(true)); }}
        onOpenRefer={() => { setIsProfileOpen(false); setIsReferOpen(true); }}
        onOpenWithdrawal={() => { setIsProfileOpen(false); handleQuickAction(() => setIsSettlementOpen(true)); }}
      />
      <AddCoinsScreen
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        user={user}
        currentBalance={parseFloat(user.balance || "0")}
        onAddCoins={(amt) => handleBalanceUpdate((parseFloat(user.balance || "0") + amt).toString())}
      />

      <SendCoinScreen
        isOpen={isSendOpen}
        onClose={() => {
          setIsSendOpen(false);
          setSendInitialUid('');
          setSendInitialAmount('');
        }}
        currentBalance={parseFloat(user.balance || "0")}
        onSendCoin={(rec, amt) => handleBalanceUpdate((parseFloat(user.balance || "0") - amt).toString())}
        user={user}
        initialRecipientUid={sendInitialUid}
        initialAmount={sendInitialAmount}
      />

      <CheckCoinScreen
        isOpen={isCheckOpen}
        onClose={() => setIsCheckOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      <ReceiveCoinsScreen
        isOpen={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
        user={user}
      />

      <HistoryScreen
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        user={user}
        history={firestoreTxs}
        onUserUpdate={onUserUpdate}
      />

      <ScanToPayScreen
        isOpen={isScanOpen}
        onClose={() => {
          setIsScanOpen(false);
          setActiveTab('home');
        }}
        onPaySuccess={(amt) => handleBalanceUpdate((parseFloat(user.balance || "0") - amt).toString())}
        onOpenSendCoinWithUid={(recipient, amt) => {
          setIsScanOpen(false);
          setSendInitialUid(recipient);
          if (amt) setSendInitialAmount(amt);
          setIsSendOpen(true);
        }}
      />

      <SendToNftScreen
        isOpen={isNftOpen}
        onClose={() => setIsNftOpen(false)}
        user={user}
        onBalanceUpdate={(newBal) => handleBalanceUpdate(newBal)}
      />

      <SettlementScreen
        isOpen={isSettlementOpen}
        onClose={() => setIsSettlementOpen(false)}
        user={user}
        currentBalance={parseFloat(user.balance || "0")}
        onBalanceUpdate={(newBal) => handleBalanceUpdate(newBal)}
      />

      <MobileRechargeScreen
        isOpen={rechargeModal === 'mobile'}
        onClose={() => setRechargeModal(null)}
        onPay={(op, plan, amt) => handleBalanceUpdate((parseFloat(user.balance || "0") - amt).toString())}
      />

      <ElectricityBillScreen
        isOpen={rechargeModal === 'electricity'}
        onClose={() => setRechargeModal(null)}
        onPay={(board, amt) => handleBalanceUpdate((parseFloat(user.balance || "0") - amt).toString())}
      />

      <ReferAndEarnScreen
        isOpen={isReferOpen}
        onClose={() => setIsReferOpen(false)}
        user={user}
        onUserUpdate={(updatedUser) => handleBalanceUpdate(updatedUser.balance)}
      />

      <PlatinumSavingsScreen
        isOpen={isSavingsOpen}
        onClose={() => setIsSavingsOpen(false)}
        currentBalance={parseFloat(user.balance || "0")}
      />

      <NotificationsScreen
        isOpen={isNotificationsOpen}
        onClose={() => {
          setIsNotificationsOpen(false);
          setActiveTab('home');
        }}
        user={user}
        themeColor={themeColor}
      />

      {/* Transaction Receipt Screen (Samsung Design Layout) */}
      <TransactionReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        record={selectedReceiptTx}
      />

      {/* KYC Required Popup Modal */}
      <KycRequiredPopupModal
        isOpen={isKycPopupOpen}
        onClose={() => setIsKycPopupOpen(false)}
        onKycNow={() => {
          setIsKycPopupOpen(false);
          setIsKycVerificationOpen(true);
        }}
      />

      {/* Full Screen KYC Verification Screen */}
      <KycVerificationScreen
        isOpen={isKycVerificationOpen}
        onClose={() => setIsKycVerificationOpen(false)}
        user={user}
        onUserUpdate={onUserUpdate}
      />

      {/* Video Tutorial Modal */}
      <VideoTutorialModal
        isOpen={isTutorialVideoOpen}
        onClose={() => setIsTutorialVideoOpen(false)}
        themeColor={themeColor}
      />

      {/* Service Coming Soon Popup Modal */}
      <ComingSoonServiceModal
        isOpen={!!comingSoonService}
        onClose={() => setComingSoonService(null)}
        serviceName={comingSoonService?.title || 'Service'}
        icon={comingSoonService?.icon}
        themeColor={themeColor}
      />

    </div>
  );
}
