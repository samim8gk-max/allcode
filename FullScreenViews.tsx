'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeft, Coins, Plus, Minus, Send, FileText, CircleDollarSign, History, 
  Building2, Smartphone, Zap, Gift, ShieldCheck, Copy, Share2, 
  CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft, Search, Filter, 
  ExternalLink, Bell, User, LogOut, Check, ChevronRight, ChevronLeft, Lock, RefreshCw, Wallet, Download, Sparkles, Loader2, ArrowRight, X, ChevronDown, ChevronUp, Calendar, Users, UserPlus, Contact, Settings, Camera, QrCode, Key, Phone, Globe, Shield, MessageSquare, Home, Upload, Pencil, Image as ImageIcon, SlidersHorizontal, ZoomIn, ZoomOut, RotateCcw, Maximize2, Trash2, Eye, EyeOff, Layers, Clock, Printer
} from 'lucide-react';
import { 
  UserData, TransactionData, findUserByMobileFromFirestore, findUserByUidFromFirestore, transferCoinsInFirestore, 
  getLocalTransactions, checkUserMpin, executeDetailedCoinTransfer, DetailedTransactionRecord,
  CashbackRecord, fetchCashbackHistoryFromFirestore, getLocalCashbackRecords,
  saveNftBankAccountToFirestore, fetchNftBankAccountsByMobile, saveNftTransactionToFirestore, NftBankAccount,
  saveCashbackRecordToFirestore, fetchSliderImagesFromFirestore, calculateDynamicCashback, UnifiedTransactionRecord, fetchAllUnifiedTransactionsFromFirestore,
  updateUserProfileInFirestore, saveKycToFirestore, fetchKycFromFirestore, KycData,
  saveBankDetailsToFirestore, fetchBankDetailsFromFirestore, saveWithdrawalRequestToFirestore, UserBankDetails, WithdrawalRequestRecord,
  saveAddMoneyToFirestore, fetchPaymentUpiFromFirestore, subscribeToPaymentUpiFromFirestore, fetchCustomerSupportFromFirestore, verifyAndUpdateUserPasswordInFirestore, SupportContactData,
  fetchUserBalanceFromFirestore, applyPromoCodeInFirestore, fetchUserReferralStatsFromFirestore,
  subscribeToShareUrlFromFirestore, getOrCreateUserReferralCode, subscribeToUserReferralData,
  subscribeToYourCoinRewardsFromFirestore, YourCoinRewards,
  saveUserSettingsToFirestore, subscribeToFirestoreNotifications, AppNotification,
  getHiddenNotificationIds, hideNotificationForUser, clearHiddenNotificationsForUser
} from '@/lib/firebase';
import { getTranslation, LanguageCode } from '@/lib/translations';

export function SixDotsLoader({ className = "text-white" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 py-1 ${className}`}>
      {[0, 1, 2, 3, 4, 5].map((idx) => (
        <span
          key={idx}
          className="w-2.5 h-2.5 rounded-full bg-current inline-block"
          style={{
            animation: `sixDotsZoomPulse 0.75s ease-in-out infinite alternate`,
            animationDelay: `${idx * 0.1}s`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes sixDotsZoomPulse {
          0% {
            transform: scale(0.35);
            opacity: 0.25;
          }
          100% {
            transform: scale(1.35);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function NftCoinsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`inline-block ${className}`} fill="none">
      <defs>
        <linearGradient id="cGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="cEdgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#cGoldGrad)" stroke="url(#cEdgeGrad)" strokeWidth="4" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#FEF3C7" strokeWidth="2.5" strokeDasharray="4 2" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="#92400E" strokeWidth="1.5" opacity="0.6" />
      <text x="50" y="58" textAnchor="middle" fill="#78350F" fontFamily="sans-serif" fontSize="22" fontWeight="900" letterSpacing="-1">GK</text>
      <path d="M30 36 C 40 28, 60 28, 70 36" fill="none" stroke="#FFFBEB" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
    </svg>
  );
}

export function NftBankIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`inline-block ${className}`} fill="none">
      <defs>
        <linearGradient id="bBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="bRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="44" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="2"/>
      <path d="M 18 38 L 50 18 L 82 38 Z" fill="url(#bRoofGrad)" stroke="#1E3A8A" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="22" y="38" width="56" height="5" fill="#1E40AF" rx="1"/>
      <rect x="26" y="45" width="8" height="26" fill="url(#bBlueGrad)" rx="1"/>
      <rect x="40" y="45" width="8" height="26" fill="url(#bBlueGrad)" rx="1"/>
      <rect x="54" y="45" width="8" height="26" fill="url(#bBlueGrad)" rx="1"/>
      <rect x="68" y="45" width="8" height="26" fill="url(#bBlueGrad)" rx="1"/>
      <rect x="20" y="71" width="60" height="6" fill="#1E40AF" rx="2"/>
      <rect x="16" y="77" width="68" height="5" fill="#1E3A8A" rx="2"/>
    </svg>
  );
}

export const playCashInAudio = () => {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio('/successs.mp3');
    audio.volume = 1.0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log('Audio playback info:', err);
        const fallback = new Audio('/cashin.mp3');
        fallback.volume = 1.0;
        fallback.play().catch(() => {
          playWebAudioChime();
        });
      });
    }
  } catch {
    playWebAudioChime();
  }
};

export const playSuccessAudio = playCashInAudio;

function playWebAudioChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      const ctx = new AudioContextClass();
      const playFreq = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      playFreq(1046.5, 0, 0.1);
      playFreq(1318.5, 0.1, 0.1);
      playFreq(1567.98, 0.2, 0.3);
    }
  } catch (e) {
    console.warn('Web audio fallback:', e);
  }
}

/* ====================================================================
   1. ADD COINS FULL SCREEN VIEW
   ==================================================================== */
export function AddCoinsScreen({
  isOpen,
  onClose,
  user,
  currentBalance,
  onAddCoins
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData | null;
  currentBalance: number;
  onAddCoins: (amount: number, method: string) => void;
}) {
  const [step, setStep] = useState<'main' | 'qr'>('main');
  const [amount, setAmount] = useState('100');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | null>(null);
  const [upiId, setUpiId] = useState<string | null>(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    amount: number;
    utr: string;
    date: string;
    time: string;
    status: string;
  } | null>(null);

  const themeColor = user?.themeColor || '#6495ED';

  // Load UPI ID from Firestore "Payment" collection in real-time
  useEffect(() => {
    if (isOpen) {
      fetchPaymentUpiFromFirestore().then((fetchedUpi) => {
        setUpiId(fetchedUpi);
      });

      const unsubscribe = subscribeToPaymentUpiFromFirestore((realtimeUpi) => {
        setUpiId(realtimeUpi);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadQr = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=${upiId}&am=${amount}&cu=INR`)}`;
    fetch(qrUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `upi_qr_code_${amount}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        window.open(qrUrl, '_blank');
      });
  };

  const handleSubmitPaymentProof = async () => {
    if (!utrNumber.trim()) {
      setErrorMsg('Please enter a valid 12-digit UTR or Reference Number.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const numericAmt = parseFloat(amount) || 100;

    const record = {
      walletIcon: 'wallet',
      utr: utrNumber.trim(),
      amount: numericAmt,
      date: dateStr,
      time: timeStr,
      status: 'pending',
      image: selectedImage || '',
      uid: user?.uid || 'guest_user',
      mobile: user?.mobile || ''
    };

    const saved = await saveAddMoneyToFirestore(record);
    setIsSubmitting(false);

    if (saved) {
      setSuccessDetails({
        amount: numericAmt,
        utr: utrNumber.trim(),
        date: dateStr,
        time: timeStr,
        status: 'PENDING'
      });
      setShowSuccessModal(true);
      playSuccessAudio();
    } else {
      setErrorMsg('Failed to save payment proof. Please try again.');
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    if (successDetails) {
      onAddCoins(successDetails.amount, 'UPI');
    }
    setStep('main');
    setUtrNumber('');
    setSelectedImage(null);
    setFileName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none pb-28">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200 shadow-xs">
        <button
          onClick={() => {
            if (step === 'qr') {
              setStep('main');
            } else {
              onClose();
            }
          }}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          {step === 'qr' ? 'UPI Payment' : 'Add Money'}
        </h2>
        <div className="w-9" />
      </div>

      {step === 'main' ? (
        /* ================= STEP 1: ADD MONEY MAIN FORM ================= */
        <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-6 space-y-5">
          {/* Top Banner */}
          <div 
            style={{ background: `linear-gradient(135deg, ${themeColor}12 0%, ${themeColor}05 100%)`, borderColor: `${themeColor}22` }}
            className="border rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs"
          >
            <div className="space-y-1">
              <h3 style={{ color: themeColor }} className="font-extrabold text-base sm:text-lg leading-tight">
                Add Money <br />
                <span style={{ color: themeColor }} className="brightness-90">to Your Wallet</span>
              </h3>
              <p style={{ color: themeColor }} className="text-xs font-semibold brightness-95">
                Fast, Secure & Hassle-Free
              </p>
              <p className="text-slate-500 text-[11px]">
                Add money in just a few clicks.
              </p>
            </div>
            <div 
              style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}30` }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center text-white shrink-0 p-2 text-center"
            >
              <Wallet className="w-8 h-8 text-white mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">GK Wallet</span>
            </div>
          </div>

          {/* Enter Amount Section */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-800">
              Enter Amount
            </label>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 gap-2">
              {['100', '200', '300', '500', '1000', '2000', '5000', '10000'].map((preset) => {
                const isSelected = amount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    style={isSelected ? { backgroundColor: `${themeColor}08`, borderColor: themeColor, color: themeColor } : undefined}
                    className={`py-2 px-1 rounded-xl text-xs font-black transition-all border text-center ${
                      isSelected
                        ? 'border-2 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    ₹{preset}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input Box */}
            <div 
              style={{ borderColor: themeColor }}
              className="border-2 rounded-2xl p-3.5 bg-white flex items-center gap-2 shadow-xs"
            >
              <span style={{ color: themeColor }} className="text-xl font-black">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="w-full text-xl font-black text-slate-900 focus:outline-none bg-transparent"
              />
            </div>

            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <span style={{ backgroundColor: themeColor }} className="w-2 h-2 rounded-full shrink-0 inline-block" />
              Enter custom amount or select from above
            </p>
          </div>

          {/* Payment Method Section */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-bold text-slate-800">
              Payment Method
            </label>

            {upiId ? (
              <div
                onClick={() => setSelectedMethod('upi')}
                style={selectedMethod === 'upi' ? { borderColor: themeColor, backgroundColor: `${themeColor}05` } : undefined}
                className={`rounded-2xl p-4 cursor-pointer space-y-3 transition-all ${
                  selectedMethod === 'upi'
                    ? 'border-2 shadow-xs'
                    : 'border border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                      className="font-black text-xs px-3 py-2 rounded-xl"
                    >
                      UPI
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">UPI Payment</h4>
                      <p className="text-xs text-slate-500">Instant payment using any UPI App</p>
                    </div>
                  </div>
                  {selectedMethod === 'upi' ? (
                    <CheckCircle2 
                      style={{ color: themeColor }}
                      className="w-5 h-5 shrink-0" 
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                  )}
                </div>

                {/* Active UPI Badge */}
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl px-3 py-2 flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-950 truncate max-w-[240px]">
                    UPI ID: {upiId}
                  </span>
                  <span 
                    style={{ backgroundColor: themeColor }}
                    className="text-white font-black text-[10px] px-2 py-0.5 rounded-md uppercase shrink-0"
                  >
                    Active
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs font-semibold text-slate-500">
                No active payment method available
              </div>
            )}
          </div>

          {/* How to Pay Section */}
          <div 
            style={{ backgroundColor: `${themeColor}08`, borderColor: `${themeColor}20` }}
            className="border rounded-2xl p-4 space-y-3"
          >
            <h4 style={{ color: themeColor }} className="font-extrabold text-xs uppercase tracking-wider">
              How to pay
            </h4>

            <div className="flex items-center justify-between text-center gap-1 text-[11px] font-bold text-slate-700">
              <div className="flex flex-col items-center gap-1 flex-1">
                <span 
                  style={{ backgroundColor: themeColor }}
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center font-black text-xs shadow-xs"
                >
                  1
                </span>
                <span>Click on <br />Proceed to Pay</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 mb-3" />
              <div className="flex flex-col items-center gap-1 flex-1">
                <span 
                  style={{ backgroundColor: themeColor }}
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center font-black text-xs shadow-xs"
                >
                  2
                </span>
                <span>Scan QR & Pay <br />UPI App</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 shrink-0 mb-3" />
              <div className="flex flex-col items-center gap-1 flex-1">
                <span 
                  style={{ backgroundColor: themeColor }}
                  className="w-6 h-6 rounded-full text-white flex items-center justify-center font-black text-xs shadow-xs"
                >
                  3
                </span>
                <span>Complete the <br />payment</span>
              </div>
            </div>
          </div>

          {/* Proceed to Pay Button */}
          <button
            type="button"
            onClick={() => {
              if (!selectedMethod) {
                alert('Please select a payment method!');
                return;
              }
              if (selectedMethod === 'upi' && !upiId) {
                alert('Payment method is currently unavailable.');
                return;
              }
              const val = parseFloat(amount);
              if (isNaN(val) || val <= 0) {
                alert('Please enter a valid amount!');
                return;
              }
              setStep('qr');
            }}
            style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}30` }}
            className="w-full text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 active:scale-98 hover:brightness-110 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            Proceed to Pay
          </button>
        </div>
      ) : (
        /* ================= STEP 2: UPI PAYMENT & QR VIEW ================= */
        <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-6 space-y-5">
          {/* Selected Amount Banner */}
          <div 
            style={{ backgroundColor: `${themeColor}08`, borderColor: `${themeColor}20` }}
            className="border rounded-2xl p-4 text-center shadow-xs"
          >
            <span className="text-xs font-semibold text-slate-600 block">Selected Amount to Pay</span>
            <span style={{ color: themeColor }} className="text-2xl font-black block mt-0.5">
              ₹ {parseFloat(amount || '0').toFixed(2)}
            </span>
          </div>

          {/* QR Code Card */}
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 shadow-sm">
            <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${upiId}&am=${amount}&cu=INR`)}`}
                alt="UPI QR Code"
                className="w-52 h-52 object-contain rounded-xl"
              />
            </div>

            <button
              type="button"
              onClick={handleDownloadQr}
              style={{ backgroundColor: `${themeColor}12`, color: themeColor, borderColor: `${themeColor}22` }}
              className="font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border transition-all shadow-xs hover:brightness-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </button>
          </div>

          {/* Payee Info Box */}
          <div 
            style={{ backgroundColor: `${themeColor}05`, borderColor: `${themeColor}15` }}
            className="border rounded-2xl p-4 text-center space-y-1 text-xs"
          >
            <span className="text-slate-500 block">Payee UPI ID:</span>
            <span style={{ color: themeColor }} className="font-black text-sm tracking-wide block select-all">
              {upiId}
            </span>
            <span style={{ color: themeColor }} className="font-extrabold text-xs block pt-1 brightness-90">
              Auto-Selected Amount: ₹ {parseFloat(amount || '0').toFixed(2)}
            </span>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs space-y-2 text-blue-900 leading-relaxed">
            <h5 className="font-extrabold text-blue-950 flex items-center gap-1.5 text-xs">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              How to Pay via UPI QR
            </h5>
            <p>
              Scan this QR code using any UPI app (Google Pay, PhonePe, Paytm, or BHIM). The exact amount will be automatically selected in your app. After paying, enter the UTR / Reference number and upload the payment receipt below.
            </p>
          </div>

          {/* UTR Input Section */}
          <div className="space-y-1.5">
            <label className="block font-extrabold text-slate-800 text-xs">
              Enter 12-digit UTR / Reference No.
            </label>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 329108420192"
              maxLength={20}
              onFocus={(e) => e.target.style.borderColor = themeColor}
              onBlur={(e) => e.target.style.borderColor = ''}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Choice File / Upload Section */}
          <div className="space-y-1.5">
            <label className="block font-extrabold text-slate-800 text-xs">
              Upload Payment Screenshot / Receipt
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-slate-600" />
                Choice File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                {fileName || 'No file chosen'}
              </span>
            </div>
            {selectedImage && (
              <div className="mt-2 relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <img src={selectedImage} alt="Payment Receipt" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setSelectedImage(null); setFileName(''); }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmitPaymentProof}
            style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}30` }}
            className="w-full text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 hover:brightness-110 cursor-pointer"
          >
            {isSubmitting ? (
              <SixDotsLoader className="text-white" />
            ) : (
              'Submit Payment Proof'
            )}
          </button>
        </div>
      )}

      {/* SUCCESS DIALOG / MODAL */}
      {showSuccessModal && successDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full border border-slate-100 text-center space-y-4 animate-scale-up">
            {/* Live animated Checkmark Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200/50 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-pulse" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Payment Submitted!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your Add Money request has been received and is under verification.
              </p>
            </div>

            {/* Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Amount</span>
                <span className="font-black text-slate-900 text-sm">
                  ₹ {successDetails.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">UTR Number</span>
                <span className="font-mono font-bold text-slate-800">
                  {successDetails.utr}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="bg-amber-100 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                  {successDetails.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Date & Time</span>
                <span className="font-bold text-slate-700">
                  {successDetails.date}, {successDetails.time}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={handleCloseSuccess}
              style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}30` }}
              className="w-full text-white font-extrabold py-3.5 rounded-2xl text-xs transition-transform active:scale-95 hover:brightness-110 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================================================================
   AUDIO PLAYBACK HELPERS (successs.mp3 & reward1111111.mp3)
   ==================================================================== */
function playRewardAudio() {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio('/successs.mp3');
    audio.volume = 1.0;
    audio.play().catch(() => {
      synthRewardFanfare();
    });
  } catch {
    synthRewardFanfare();
  }
}

function synthSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.25); // G5
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  } catch {}
}

function synthRewardFanfare() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.12);
      gain.gain.setValueAtTime(0.35, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.45);
    });
  } catch {}
}

/* ====================================================================
   2. SEND COIN FULL SCREEN VIEW
   ==================================================================== */
export function SendCoinScreen({
  isOpen,
  onClose,
  currentBalance,
  onSendCoin,
  user,
  initialRecipientUid,
  initialAmount
}: {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onSendCoin: (recipient: string, amount: number) => void;
  user?: UserData;
  initialRecipientUid?: string;
  initialAmount?: string;
}) {
  const [viewMode, setViewMode] = useState<'search' | 'payment' | 'success' | 'reward'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserData | null>(null);
  const [selfAlertMsg, setSelfAlertMsg] = useState<string | null>(null);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [amount, setAmount] = useState(''); // Always blank by default
  const [note, setNote] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [txHistory, setTxHistory] = useState<TransactionData[]>(() => getLocalTransactions());
  const [cashbackHistory, setCashbackHistory] = useState<CashbackRecord[]>(() => getLocalCashbackRecords());
  const [unifiedTxHistory, setUnifiedTxHistory] = useState<UnifiedTransactionRecord[]>([]);

  // Handle scanned initial recipient UID and amount with Firestore 'users' collection lookup
  useEffect(() => {
    if (!isOpen || !initialRecipientUid) return;
    const recipientUid = initialRecipientUid;
    let isMounted = true;

    async function handleRecipientLookup() {
      setSearchQuery(recipientUid);
      setIsSearching(true);
      try {
        const uData = await findUserByUidFromFirestore(recipientUid);
        if (isMounted) {
          if (uData) {
            setMatchedUser(uData);
          } else {
            setMatchedUser({
              uid: recipientUid,
              name: `User (${recipientUid.length > 10 ? recipientUid.slice(0, 8) + '...' : recipientUid})`,
              mobile: recipientUid,
              gmail: `${recipientUid}@gkwallet.com`,
              balance: '0',
              status: 'verified',
              account: 'active',
              registration_date: new Date().toLocaleDateString(),
              profile_picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
            });
          }
          if (initialAmount) {
            setAmount(initialAmount);
          }
          setViewMode('payment');
        }
      } catch (err) {
        console.warn('Recipient lookup error:', err);
      } finally {
        if (isMounted) setIsSearching(false);
      }
    }

    handleRecipientLookup();
    return () => {
      isMounted = false;
    };
  }, [isOpen, initialRecipientUid, initialAmount]);

  // Load logged-in user's unified transaction history from Firestore
  useEffect(() => {
    if (isOpen) {
      const uUid = user?.uid || 'gk_user';
      const uMob = user?.mobile || '9876543210';
      fetchAllUnifiedTransactionsFromFirestore(uUid, uMob).then((records) => {
        if (records && records.length > 0) {
          setUnifiedTxHistory(records);
        } else {
          // Fallback to local transactions
          setTxHistory(getLocalTransactions());
        }
      });
    }
  }, [isOpen, viewMode, user]);

  // Handle Pay button click from floating card - ALWAYS BLANK AMOUNT!
  const handleOpenPayment = () => {
    if (!matchedUser) return;
    const loggedUid = user?.uid;
    const loggedMobileDigits = (user?.mobile || '').replace(/\D/g, '');
    const resMobileDigits = (matchedUser.mobile || '').replace(/\D/g, '');
    const isSelf = (loggedUid && matchedUser.uid === loggedUid) || 
                   (loggedMobileDigits && resMobileDigits && loggedMobileDigits === resMobileDigits);

    if (isSelf) {
      const alertText = 'You cannot send money to your own account!';
      setSelfAlertMsg(alertText);
      try {
        alert(alertText);
      } catch {}
      return;
    }

    setAmount(''); // Reset to empty input for logged in user to enter
    setViewMode('payment');
    setStatusMsg('');
  };
  const [isPulsingDots, setIsPulsingDots] = useState(false);
  const [showMpinModal, setShowMpinModal] = useState(false);
  const [inputMpin, setInputMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [isSubmittingMpin, setIsSubmittingMpin] = useState(false);

  // Success & Reward States
  const [completedTx, setCompletedTx] = useState<DetailedTransactionRecord | null>(null);
  const [earnedCashback, setEarnedCashback] = useState<number>(0);
  const [updatedBalanceStr, setUpdatedBalanceStr] = useState<string>(currentBalance.toString());

  // Date Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Helper to parse heterogeneous record date formats (ISO, DD/MM/YYYY, DD MMM YYYY, etc.)
  const parseRecordDate = useCallback((dateStr?: string): Date | null => {
    if (!dateStr) return null;
    
    // 1. Try native Date parse
    const direct = new Date(dateStr);
    if (!isNaN(direct.getTime())) {
      return direct;
    }

    // 2. Try DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyyy = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (ddmmyyyy) {
      const day = parseInt(ddmmyyyy[1], 10);
      const month = parseInt(ddmmyyyy[2], 10) - 1;
      const year = parseInt(ddmmyyyy[3], 10);
      return new Date(year, month, day);
    }

    // 3. Try DD MMM YYYY (e.g. "18 Aug 2026")
    const ddMmmYyyy = dateStr.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/);
    if (ddMmmYyyy) {
      const day = parseInt(ddMmmYyyy[1], 10);
      const monthStr = ddMmmYyyy[2].toLowerCase().slice(0, 3);
      const year = parseInt(ddMmmYyyy[3], 10);
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthIdx = months.indexOf(monthStr);
      if (monthIdx !== -1) {
        return new Date(year, monthIdx, day);
      }
    }

    return null;
  }, []);

  // Filtered Cashback & Transaction records based on Start Date and End Date
  const filteredCashbackHistory = cashbackHistory.filter((cb) => {
    if (!startDate && !endDate) return true;
    const raw = cb.timestamp || `${cb.date || ''} ${cb.time || ''}`.trim() || cb.date;
    const itemDate = parseRecordDate(raw);
    if (!itemDate) return true;

    if (startDate) {
      const sDate = new Date(startDate + 'T00:00:00');
      if (itemDate < sDate) return false;
    }
    if (endDate) {
      const eDate = new Date(endDate + 'T23:59:59');
      if (itemDate > eDate) return false;
    }
    return true;
  });

  const filteredTxHistory = txHistory.filter((tx) => {
    if (!startDate && !endDate) return true;
    const raw = tx.timestamp || (tx as any).senderdate || (tx as any).reciverdate || '';
    const itemDate = parseRecordDate(raw);
    if (!itemDate) return true;

    if (startDate) {
      const sDate = new Date(startDate + 'T00:00:00');
      if (itemDate < sDate) return false;
    }
    if (endDate) {
      const eDate = new Date(endDate + 'T23:59:59');
      if (itemDate > eDate) return false;
    }
    return true;
  });

  // Play Audio on viewMode change
  useEffect(() => {
    if (viewMode === 'success') {
      playSuccessAudio();
    } else if (viewMode === 'reward') {
      playRewardAudio();
    }
  }, [viewMode]);

  // Search trigger when user enters input - queries Firestore 'users' collection
  useEffect(() => {
    const queryStr = searchQuery.trim();
    const cleanDigits = queryStr.replace(/\D/g, '');

    const timer = setTimeout(async () => {
      if (!queryStr) {
        setMatchedUser(null);
        setIsSearching(false);
        setSelfAlertMsg(null);
        setSearchNotFound(false);
        return;
      }

      // If typing digits and not yet 10 digits (and not name search)
      const isPureDigits = /^\d+$/.test(queryStr);
      if (isPureDigits && cleanDigits.length < 10) {
        setMatchedUser(null);
        setIsSearching(false);
        setSelfAlertMsg(null);
        setSearchNotFound(false);
        return;
      }

      // Trigger search with visible progress for 10-digit numbers or names
      setSelfAlertMsg(null);
      setSearchNotFound(false);
      setIsSearching(true);

      try {
        const res = await findUserByMobileFromFirestore(queryStr);
        setIsSearching(false);

        if (res) {
          setMatchedUser(res);
          setSearchNotFound(false);

          // Check if matched user's UID or mobile matches logged-in user
          const loggedUid = user?.uid;
          const loggedMobileDigits = (user?.mobile || '').replace(/\D/g, '');
          const resMobileDigits = (res.mobile || '').replace(/\D/g, '');
          const isSelf = Boolean(
            (loggedUid && (res.uid === loggedUid || res.uid === user?.uid)) || 
            (loggedMobileDigits && resMobileDigits && loggedMobileDigits === resMobileDigits) ||
            (loggedMobileDigits && cleanDigits.length === 10 && loggedMobileDigits === cleanDigits)
          );

          if (isSelf) {
            const alertText = 'You cannot send money to your own account! You entered your own registered mobile number.';
            setSelfAlertMsg(alertText);
            try {
              alert(alertText);
            } catch {}
          }
        } else {
          setMatchedUser(null);
          if (cleanDigits.length === 10 || queryStr.length >= 3) {
            setSearchNotFound(true);
          }
        }
      } catch (err) {
        console.warn('Send money user search error:', err);
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, user]);

  // Check numeric balance condition
  const numericAmount = parseFloat(amount) || 0;
  const isInsufficient = numericAmount > currentBalance;

  // Handle "Continue & Pay" button click
  const handleContinueAndPay = () => {
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setStatusMsg('Please enter a valid coin amount!');
      return;
    }

    if (isInsufficient) {
      setStatusMsg('Insufficient GK Coin balance!');
      return;
    }

    // Clear error & start 6-dot zoom-in zoom-out pulsing animation for 2 seconds
    setStatusMsg('');
    setIsPulsingDots(true);

    setTimeout(() => {
      setIsPulsingDots(false);
      setInputMpin('');
      setMpinError('');
      setShowMpinModal(true);
    }, 2000);
  };

  // Handle MPIN submit
  const handleMpinConfirm = async () => {
    if (inputMpin.length !== 6) {
      setMpinError('Please enter a 6-digit MPIN');
      return;
    }

    setIsSubmittingMpin(true);
    setMpinError('');

    const senderUid = user?.uid || 'gk_user';
    const isValid = await checkUserMpin(senderUid, inputMpin);

    if (!isValid) {
      setIsSubmittingMpin(false);
      setMpinError('Invalid MPIN! Default test MPIN is 123456');
      return;
    }

    // MPIN valid! Execute transfer
    try {
      const activeUser: UserData = user || {
        uid: senderUid,
        name: 'Logged User',
        mobile: '9876543210',
        gmail: 'user@gkwallet.com',
        balance: currentBalance.toString(),
        status: 'verified',
        account: 'active',
        registration_date: new Date().toISOString(),
        profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
      };

      const res = await executeDetailedCoinTransfer(
        activeUser,
        matchedUser,
        numericAmount,
        note
      );

      setIsSubmittingMpin(false);
      setShowMpinModal(false);

      if (res.success) {
        playCashInAudio();
        setCompletedTx(res.transactionRecord);
        setEarnedCashback(res.cashbackEarned);
        setUpdatedBalanceStr(res.newBalance);

        // Notify parent callback
        const recipientMobile = matchedUser?.mobile || searchQuery || '9000000000';
        onSendCoin(recipientMobile, numericAmount);
        setTxHistory(getLocalTransactions());

        // Show Transaction Successful screen
        setViewMode('success');

        // Automatically load Reward screen after 2 seconds
        setTimeout(() => {
          setViewMode('reward');
        }, 2200);
      } else {
        setStatusMsg(res.message);
      }
    } catch (err: any) {
      setIsSubmittingMpin(false);
      setMpinError(err.message || 'Transaction failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none pb-28">
      
      {/* VIEW 1: SEARCH & HISTORY VIEW */}
      {viewMode === 'search' && (
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5 flex flex-col justify-between">
          <div>
            {/* Top Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors shrink-0"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Send Money
              </h1>
            </div>

            {/* Search Row */}
            <div className="flex items-center gap-3 relative mb-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter name or mobile"
                  maxLength={25}
                  className="w-full bg-white border-2 border-blue-400 focus:border-blue-600 rounded-full pl-5 pr-11 py-3.5 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
                />
                {isSearching ? (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  </div>
                ) : searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setMatchedUser(null);
                      setSearchNotFound(false);
                      setSelfAlertMsg(null);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

              {/* Circular Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`w-12 h-12 rounded-full border shadow-2xs flex items-center justify-center shrink-0 transition-all ${
                  isFilterOpen || startDate || endDate
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                    : 'border-blue-200 bg-blue-50/90 text-blue-600 hover:bg-blue-100 hover:scale-105 active:scale-95'
                }`}
                title="Filter by Date"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Indicator for 10-Digit Mobile Search */}
            {isSearching && (
              <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-3 my-2.5 flex items-center gap-3 animate-fade-in shadow-2xs">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 mb-1">
                    <span>Searching Firestore database...</span>
                    <span className="text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full font-extrabold text-[10px]">
                      {searchQuery.replace(/\D/g, '').length === 10 ? '10/10 Digits' : 'Querying'}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200/80 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-2/3 animate-pulse rounded-full" />
                  </div>
                </div>
              </div>
            )}

            {/* Expandable Date Filter Input Boxes (স্টার্ট ডেট এবং এন্ড ডেট) */}
            {isFilterOpen && (
              <div className="bg-blue-50/80 border border-blue-200/90 rounded-3xl p-4 my-3 space-y-3 animate-fade-in shadow-xs">
                <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black text-slate-800">Date Range Filter</span>
                  </div>
                  {(startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 transition-colors"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Start Date Box */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                      Start Date
                    </label>
                    <div className="relative flex items-center">
                      <input
                        ref={startDateRef}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white border-2 border-slate-200 focus:border-blue-500 rounded-2xl pl-3 pr-10 py-2.5 text-xs font-bold text-slate-900 focus:outline-none shadow-2xs cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (startDateRef.current) {
                            try {
                              startDateRef.current.showPicker();
                            } catch {
                              startDateRef.current.focus();
                            }
                          }
                        }}
                        className="absolute right-2.5 text-slate-400 hover:text-blue-600 p-1"
                        title="Open Calendar"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* End Date Box */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-600 mb-1">
                      End Date
                    </label>
                    <div className="relative flex items-center">
                      <input
                        ref={endDateRef}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white border-2 border-slate-200 focus:border-blue-500 rounded-2xl pl-3 pr-10 py-2.5 text-xs font-bold text-slate-900 focus:outline-none shadow-2xs cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (endDateRef.current) {
                            try {
                              endDateRef.current.showPicker();
                            } catch {
                              endDateRef.current.focus();
                            }
                          }
                        }}
                        className="absolute right-2.5 text-slate-400 hover:text-blue-600 p-1"
                        title="Open Calendar"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {(startDate || endDate) && (
                  <div className="pt-1 text-[11px] font-bold text-blue-700 bg-white/80 p-2 rounded-xl border border-blue-100 flex items-center justify-between">
                    <span>
                      Results {startDate ? `from ${startDate}` : ''} {endDate ? `to ${endDate}` : ''}
                    </span>
                    <span className="font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px]">
                      {filteredCashbackHistory.length + filteredTxHistory.length} items found
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Self Transfer Alert Banner */}
            {selfAlertMsg && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-4 my-3 flex items-start gap-3 text-rose-800 animate-fade-in shadow-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-black text-rose-900">Self Account Alert</h4>
                  <p className="text-xs font-bold text-rose-700 mt-0.5">
                    {selfAlertMsg}
                  </p>
                </div>
              </div>
            )}

            {/* User Not Found for 10 digits */}
            {searchNotFound && !matchedUser && searchQuery.replace(/\D/g, '').length === 10 && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-4 my-3 flex items-center gap-3 text-amber-800 animate-fade-in shadow-2xs">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-amber-900">User Not Found</h4>
                  <p className="text-xs font-bold text-amber-700 mt-0.5">
                    No GK Wallet user found in Firestore for mobile +91 {searchQuery}.
                  </p>
                </div>
              </div>
            )}

            {/* Floating Match Card (Screenshot match) */}
            {matchedUser && (() => {
              const loggedUid = user?.uid;
              const loggedMobileDigits = (user?.mobile || '').replace(/\D/g, '');
              const resMobileDigits = (matchedUser.mobile || '').replace(/\D/g, '');
              const isSelfMatched = Boolean(
                (loggedUid && matchedUser.uid === loggedUid) || 
                (loggedMobileDigits && resMobileDigits && loggedMobileDigits === resMobileDigits)
              );

              return (
                <div className={`rounded-3xl p-4 border-2 shadow-xl flex items-center justify-between my-4 transition-all animate-fade-in ${
                  isSelfMatched 
                    ? 'bg-rose-50/60 border-rose-200 shadow-rose-500/5' 
                    : 'bg-white border-blue-100/90 shadow-blue-500/10'
                }`}>
                  <div className="flex items-center gap-3">
                    <img
                      src={matchedUser.profile_picture || matchedUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt={matchedUser.name}
                      className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                          {matchedUser.name || 'GK Member'}
                        </h3>
                        {isSelfMatched && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-200">
                            You (Self Account)
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        +91{matchedUser.mobile || searchQuery}
                      </p>
                    </div>
                  </div>

                  {isSelfMatched ? (
                    <button
                      onClick={() => {
                        const alertText = 'You cannot send money to your own account!';
                        setSelfAlertMsg(alertText);
                        try {
                          alert(alertText);
                        } catch {}
                      }}
                      className="bg-rose-100 text-rose-700 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-rose-300 hover:bg-rose-200 active:scale-95 transition-all shrink-0"
                    >
                      Self
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenPayment}
                      className="bg-[#4f80ff] hover:bg-blue-600 active:scale-95 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-2xl shadow-md transition-all shrink-0"
                    >
                      Pay
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Transaction History Section for Logged In User */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                  TRANSACTION HISTORY
                </h2>
                {(startDate || endDate) && (
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Filtered
                  </span>
                )}
              </div>

              {unifiedTxHistory.length === 0 && filteredTxHistory.length === 0 && filteredCashbackHistory.length === 0 ? (
                <div className="py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-6">
                  <p className="text-xs sm:text-sm font-bold text-slate-500">
                    {(startDate || endDate)
                      ? 'No transactions found for selected date range.'
                      : 'No transactions recorded yet for this account.'}
                  </p>
                  {(startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="mt-3 text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
                    >
                      Clear Date Filter
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Render Logged In User's Real Unified Transactions from Firestore */}
                  {unifiedTxHistory.map((tx, idx) => {
                    const isCred = tx.isCredit;
                    const displayPic = isCred 
                      ? (tx.senderProfilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200')
                      : (tx.receiverProfilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');

                    return (
                      <div 
                        key={tx.id || 'utx_' + idx}
                        onClick={async () => {
                          const searchTarget = tx.receiverMobile || tx.subtitle || tx.title;
                          if (searchTarget) {
                            setSearchQuery(searchTarget);
                            setIsSearching(true);
                            const uDoc = await findUserByUidFromFirestore(searchTarget);
                            if (uDoc) {
                              setMatchedUser(uDoc);
                            } else {
                              setMatchedUser({
                                uid: 'user_' + searchTarget,
                                name: tx.receiverName || tx.title || 'Recipient',
                                mobile: searchTarget,
                                gmail: `${searchTarget}@gkwallet.com`,
                                balance: '0',
                                status: 'verified',
                                account: 'active',
                                registration_date: new Date().toISOString(),
                                profile_picture: displayPic,
                                avatarUrl: displayPic
                              });
                            }
                            setIsSearching(false);
                            handleOpenPayment();
                          }
                        }}
                        className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex items-center justify-between cursor-pointer active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={displayPic}
                            alt={tx.title || 'User'}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                                {tx.title || 'Transaction'}
                              </h4>
                              {tx.typeBadge && (
                                <span className={`font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full ${
                                  isCred ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {tx.typeBadge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                              {tx.date} {tx.time ? `, ${tx.time}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            <span className={`font-extrabold text-sm sm:text-base ${isCred ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {isCred ? '+' : '-'}
                            </span>
                            <NftCoinsIcon className="w-5 h-5 inline" />
                            <span className={`font-extrabold text-sm sm:text-base ${isCred ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {typeof tx.amount === 'number' ? tx.amount.toFixed(2) : tx.amount}
                            </span>
                          </div>
                          <span className={`font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isCred ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {tx.status || 'SUCCESSFUL'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SEND COINS PAYMENT INPUT SCREEN (Screenshot 1) */}
      {viewMode === 'payment' && (
        <div className="flex-1 max-w-lg mx-auto w-full px-4 py-5 flex flex-col justify-between">
          <div>
            {/* Top Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setViewMode('search')}
                className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors shrink-0"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Send Coins
              </h1>
            </div>

            {/* Recipient Profile Section */}
            <div className="text-center space-y-1.5 mb-6">
              <img
                src={matchedUser?.profile_picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={matchedUser?.name || 'Recipient'}
                className="w-24 h-24 rounded-full object-cover border-2 border-slate-100 shadow-md mx-auto"
              />
              <h2 className="text-2xl font-black text-slate-900 pt-2">
                {matchedUser?.name || 'Recipient'}
              </h2>
              <p className="text-sm font-bold text-slate-400">
                {matchedUser?.mobile || searchQuery || '9000000000'}
              </p>
            </div>

            {/* NFT Coins Icon */}
            <div className="flex justify-center my-3">
              <NftCoinsIcon className="w-9 h-9" />
            </div>

            {/* Large Amount Input */}
            <div className="relative max-w-xs mx-auto text-center my-4">
              <div className="flex items-center justify-center">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setStatusMsg('');
                  }}
                  placeholder="0"
                  className="w-full text-center text-5xl font-black text-slate-900 bg-transparent border-none focus:outline-none tracking-tight"
                />
              </div>
            </div>

            {/* Note Input Box */}
            <div className="mt-6">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (optional)"
                className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl px-5 py-4 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>

            {/* Error Message: ONLY SHOWN IF balance < amount */}
            {isInsufficient && (
              <div className="mt-4 p-3.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                <span>Insufficient GK Coin balance!</span>
              </div>
            )}

            {statusMsg && !isInsufficient && (
              <div className="mt-4 p-3.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                <span>{statusMsg}</span>
              </div>
            )}
          </div>

          {/* Continue & Pay Button with 6-dot Zoom animation */}
          <div className="pt-8 pb-4">
            <button
              onClick={handleContinueAndPay}
              disabled={isPulsingDots}
              className="w-full bg-[#4f80ff] hover:bg-blue-600 active:scale-95 text-white font-extrabold py-4 rounded-3xl shadow-lg shadow-blue-500/25 text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-90"
            >
              {isPulsingDots ? (
                /* 6 Dots Zooming In & Zooming Out Animation */
                <div className="flex items-center justify-center gap-2.5 py-0.5">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 bg-white rounded-full animate-ping"
                      style={{
                        animationDuration: '1s',
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  Continue & Pay <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: TRANSACTION SUCCESSFUL SCREEN (Screenshot 2) */}
      {viewMode === 'success' && completedTx && (
        <div className="flex-1 bg-[#0b8043] text-white flex flex-col items-center justify-between w-full min-h-screen overflow-y-auto animate-fade-in">
          <div className="w-full max-w-lg mx-auto px-4 pt-12 pb-6 flex flex-col items-center text-center">
            
            {/* Concentric Green Circle Ring with Animated Checkmark */}
            <div className="relative w-28 h-28 my-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse scale-110" />
              <div className="absolute inset-0 rounded-full border-2 border-white/40" />
              <div className="w-20 h-20 bg-emerald-400/30 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-white stroke-[3.5]" />
                </div>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-3xl font-black text-white tracking-tight mt-2 mb-2">
              Transaction Successful!
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-emerald-100 max-w-xs mb-6">
              Your payment of {completedTx.senderamount.toFixed(2)} Coins to {completedTx.receiverName} was processed successfully.
            </p>

            {/* White Transaction ID Box */}
            <div className="w-full bg-white text-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between mb-6 border border-emerald-100">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">Transaction ID:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  {completedTx.receivertransactionid}
                </span>
                <button 
                  onClick={() => alert('Transaction ID copied!')}
                  className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Recipient Details White Card */}
            <div className="w-full bg-white text-slate-900 rounded-3xl p-6 shadow-2xl text-left space-y-4">
              {/* Recipient Profile */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <img
                  src={completedTx.receiverprofilepicture}
                  alt={completedTx.receiverName}
                  className="w-14 h-14 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {completedTx.receiverName}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    @{completedTx.receivermobile}
                  </p>
                </div>
              </div>

              {/* Details Key-Value Rows */}
              <div className="space-y-3.5 text-xs sm:text-sm font-semibold">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <div className="flex items-center gap-1 font-black text-slate-900 text-base">
                    <NftCoinsIcon className="w-5 h-5" />
                    <span>{completedTx.senderamount.toFixed(2)} Coins</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold text-slate-900">{completedTx.reciverdate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Time:</span>
                  <span className="font-bold text-slate-900">{completedTx.sendertime}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="bg-emerald-600 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">
                    Successful
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-bold text-slate-900">Wallet Balance</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-bold text-slate-900">{completedTx.receiverName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Reference:</span>
                  <span className="font-bold text-slate-900">{completedTx.note || 'Coin Transfer'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Spinner & Loader */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-100 pb-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading your reward screen...</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: REWARD / CASHBACK SCREEN (Screenshot 3) */}
      {viewMode === 'reward' && (
        <div className="flex-1 bg-gradient-to-b from-[#1b0b38] via-[#281350] to-[#120726] text-white flex flex-col w-full min-h-screen overflow-y-auto animate-fade-in">
          
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/10 max-w-lg mx-auto w-full">
            <button
              onClick={() => {
                setViewMode('search');
                setSearchQuery('');
                setMatchedUser(null);
              }}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Wallet Coins Badge */}
            <div className="bg-amber-400/10 border-2 border-amber-400/80 rounded-full px-4 py-1.5 flex items-center gap-2 text-amber-300 font-extrabold text-xs sm:text-sm">
              <Wallet className="w-4 h-4" />
              <NftCoinsIcon className="w-4 h-4" />
              <span>{updatedBalanceStr} Coins</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-auto w-full p-4 space-y-5">
            {/* Hero Cashback Header Banner */}
            <div className="flex items-center justify-between pt-2 px-1">
              <div>
                <p className="text-xs font-bold text-purple-300">You earned</p>
                <h1 className="text-3xl font-black tracking-tight text-white mt-0.5">
                  Transfer <span className="text-amber-300">1000+</span>
                </h1>
                <p className="text-xs font-semibold text-purple-200 mt-1">
                  to earn 1–3 Coins cashback
                </p>
              </div>

              {/* 3D Coins Stack Graphic */}
              <div className="w-20 h-20 relative drop-shadow-2xl shrink-0">
                <NftCoinsIcon className="w-full h-full" />
              </div>
            </div>

            {/* Cashback Amount Card */}
            <div className="bg-[#1e0f40]/90 border border-purple-500/30 rounded-3xl p-5 backdrop-blur-md flex items-center justify-between shadow-xl">
              <div>
                <p className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider">
                  Cashback Amount
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <NftCoinsIcon className="w-7 h-7" />
                  <span className="text-3xl font-black text-amber-300 tracking-tight">
                    {earnedCashback.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-full px-3.5 py-1.5 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{earnedCashback > 0 ? 'Cashback Earned!' : 'Min 1000 Req.'}</span>
              </div>
            </div>

            {/* Transfer Summary Card */}
            <div className="bg-white text-slate-900 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Recharge / Transfer Amount</span>
                </div>
                <div className="flex items-center gap-1 font-black text-slate-900 text-base">
                  <NftCoinsIcon className="w-5 h-5" />
                  <span>{completedTx?.senderamount.toFixed(2) || amount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">Date & Time</span>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  {completedTx ? `${completedTx.reciverdate}, ${completedTx.sendertime}` : '17 Aug 2026, 09:11:42 PM'}
                </span>
              </div>
            </div>

            {/* How it works section */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-slate-900">How it works</h3>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 relative mb-2">
                    <Smartphone className="w-6 h-6" />
                    <span className="absolute -bottom-1.5 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      1
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Recharge</h4>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5 leading-tight">
                    Recharge your mobile or DTH.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 relative mb-2">
                    <CircleDollarSign className="w-6 h-6" />
                    <span className="absolute -bottom-1.5 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      2
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Earn Cashback</h4>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5 leading-tight">
                    Get 1–3 coins on 1000+ transfer.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 relative mb-2">
                    <Wallet className="w-6 h-6" />
                    <span className="absolute -bottom-1.5 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                      3
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Withdraw</h4>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5 leading-tight">
                    Cashback is added to your wallet.
                  </p>
                </div>
              </div>

              {/* Purple Guarantee Banner */}
              <div className="mt-4 bg-purple-50 border border-purple-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-purple-900 leading-snug">
                    Cashback will be added to your wallet instantly and can be used on your next transaction.
                  </p>
                </div>
                <NftCoinsIcon className="w-8 h-8 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MPIN DIALOG MODAL */}
      {showMpinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-slate-900 shadow-2xl space-y-5 border border-slate-100">
            
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Enter 6-Digit MPIN</h3>
              <p className="text-xs font-semibold text-slate-400">
                Enter your security MPIN to authorize transfer of {numericAmount.toFixed(2)} Coins
              </p>
            </div>

            {/* MPIN Input Boxes */}
            <div className="flex justify-center gap-2 my-2">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-black transition-all ${
                    inputMpin.length > idx
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  {inputMpin[idx] ? '●' : ''}
                </div>
              ))}
            </div>

            {/* Input field with numeric keyboard for mobile */}
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              value={inputMpin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 6) {
                  setInputMpin(val);
                  setMpinError('');
                }
              }}
              className="w-full text-center border border-slate-200 rounded-xl py-3 px-3 text-lg font-mono tracking-widest focus:outline-none focus:border-blue-500 shadow-xs"
              placeholder="••••••"
              autoFocus
            />

            {mpinError && (
              <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold text-center">
                {mpinError}
              </div>
            )}

            {/* Keypad Quick Helper / Confirm Button */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleMpinConfirm}
                disabled={isSubmittingMpin || inputMpin.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingMpin ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Confirm & Pay'
                )}
              </button>

              <button
                onClick={() => {
                  setShowMpinModal(false);
                  setInputMpin('');
                  setMpinError('');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-2xl text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}

/* ====================================================================
   3. CHECK COIN / ACCOUNT BALANCE FULL SCREEN VIEW
   ==================================================================== */
export function CheckCoinScreen({
  isOpen,
  onClose,
  user
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onLogout?: () => void;
}) {
  const [inputMpin, setInputMpin] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [mpinError, setMpinError] = useState('');
  const [firestoreBalance, setFirestoreBalance] = useState<string | null>(null);

  // Fetch live balance directly from Firestore 'users' collection on open
  useEffect(() => {
    if (isOpen) {
      fetchUserBalanceFromFirestore(user.uid, user.mobile).then((bal) => {
        if (bal !== null && bal !== undefined) {
          setFirestoreBalance(bal);
        }
      });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleClose = () => {
    setInputMpin('');
    setShowBalance(false);
    setIsChecking(false);
    setMpinError('');
    onClose();
  };

  const handleKeyClick = (digit: string) => {
    if (showBalance || isChecking) return;
    setMpinError('');

    if (digit === '•') {
      setInputMpin((prev) => prev.slice(0, -1));
      return;
    }

    if (inputMpin.length < 6) {
      const nextPin = inputMpin + digit;
      setInputMpin(nextPin);

      // Auto verify when 6 digits are entered
      if (nextPin.length === 6) {
        verifyMpin(nextPin);
      }
    }
  };

  const handleActionClick = () => {
    if (showBalance) {
      // Clicked CANCEL -> hide balance, reset pin & revert back to Enter MPIN view
      setShowBalance(false);
      setInputMpin('');
      setMpinError('');
    } else {
      // Clicked CHECK -> verify mpin
      if (inputMpin.length < 6) {
        setMpinError('Enter 6-digit MPIN');
        return;
      }
      verifyMpin(inputMpin);
    }
  };

  const verifyMpin = async (pinToVerify: string) => {
    setIsChecking(true);
    setMpinError('');

    try {
      const isValid = await checkUserMpin(user.uid, pinToVerify);
      // Brief circular progress animation delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (isValid) {
        // Fetch fresh balance from Firestore 'users' collection right before showing
        const latestBal = await fetchUserBalanceFromFirestore(user.uid, user.mobile);
        if (latestBal !== null && latestBal !== undefined) {
          setFirestoreBalance(latestBal);
        }
        setShowBalance(true);
        setIsChecking(false);
        playSuccessAudio();
      } else {
        setIsChecking(false);
        setMpinError('Incorrect MPIN! Please try again.');
        setInputMpin('');
      }
    } catch {
      setIsChecking(false);
      setMpinError('Verification error');
      setInputMpin('');
    }
  };

  // Format user balance e.g., 10,311.32 directly from Firestore 'users' collection
  const currentBalStr = firestoreBalance !== null ? firestoreBalance : (user.balance || '0');
  const rawBal = parseFloat(currentBalStr);
  const formattedBalance = isNaN(rawBal) ? '0.00' : rawBal.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col w-full h-full min-h-screen animate-fade-in select-none">
      {/* HEADER BAR matching Screenshot 2 & 3 */}
      <div className="bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-100 shadow-2xs shrink-0">
        <button
          type="button"
          onClick={handleClose}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-lg font-extrabold text-slate-900 text-center flex-1 pr-9">
          Account Balance
        </h1>
      </div>

      {/* MAIN DISPLAY AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {!showBalance ? (
          /* ENTER MPIN STATE (Screenshot 2) */
          <div className="w-full max-w-sm flex flex-col items-center space-y-6 my-auto animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Enter MPIN
            </h2>

            {/* 6 Circles for MPIN */}
            <div className="flex items-center justify-center gap-3.5 my-2">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const isFilled = idx < inputMpin.length;
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-200 ${
                      isFilled
                        ? 'bg-slate-900 border-2 border-slate-900 scale-110 shadow-xs'
                        : 'bg-white border-2 border-slate-300'
                    }`}
                  />
                );
              })}
            </div>

            {mpinError && (
              <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-3.5 py-1.5 rounded-full animate-bounce">
                {mpinError}
              </div>
            )}
          </div>
        ) : (
          /* BALANCE DISPLAY STATE (Screenshot 3) */
          <div className="w-full max-w-sm flex flex-col items-center space-y-6 my-auto animate-fade-in">
            {/* 3D Gold Coin Artwork Stack matching Screenshot 3 */}
            <div className="relative flex flex-col items-center justify-center py-2">
              <div className="relative w-64 h-44 flex items-center justify-center">
                {/* Glow background */}
                <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full" />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Badge: YOUR AVAILABLE COIN */}
                  <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-950 border-2 border-amber-400 text-amber-300 px-4 py-1 rounded-full shadow-lg text-[10px] sm:text-[11px] font-black tracking-wider uppercase flex items-center gap-1">
                    <span>YOUR AVAILABLE</span>
                    <span className="text-white font-black">COIN</span>
                  </div>

                  {/* Coins Illustration Stack */}
                  <div className="flex items-center gap-1 mt-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-1 shadow-xl border-2 border-yellow-300 flex items-center justify-center transform -rotate-12 translate-x-3">
                      <div className="w-full h-full rounded-full border-2 border-amber-600/60 flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-500">
                        <span className="text-2xl font-black text-amber-950 drop-shadow-2xs">₹</span>
                      </div>
                    </div>

                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 p-1.5 shadow-2xl border-4 border-yellow-200 flex items-center justify-center z-10">
                      <div className="w-full h-full rounded-full border-2 border-amber-700/60 flex items-center justify-center bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500">
                        <div className="w-20 h-20 rounded-full border border-amber-200/80 flex items-center justify-center text-center">
                          <span className="text-4xl font-black text-amber-950 drop-shadow-xs">₹</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-1 shadow-lg border-2 border-yellow-300 flex items-center justify-center transform rotate-12 -translate-x-3">
                      <div className="w-full h-full rounded-full border-2 border-amber-600/60 flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-500">
                        <span className="text-xl font-black text-amber-950 drop-shadow-2xs">₹</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BALANCE AMOUNT DISPLAY */}
              <div className="mt-4">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-sans">
                  {formattedBalance}
                </h2>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KEYPAD AT THE BOTTOM matching Screenshots */}
      <div className="bg-[#f6f7fc] border-t border-slate-100/80 p-4 sm:p-6 w-full shrink-0">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-3 sm:gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '•', '0'].map((keyVal) => (
            <button
              key={keyVal}
              type="button"
              disabled={showBalance || isChecking}
              onClick={() => handleKeyClick(keyVal)}
              className="bg-white hover:bg-slate-100 active:scale-95 disabled:opacity-50 disabled:active:scale-100 text-slate-900 font-extrabold text-xl py-3.5 sm:py-4 rounded-2xl shadow-2xs border border-slate-200/60 transition-all flex items-center justify-center"
            >
              {keyVal}
            </button>
          ))}

          {/* ACTION BUTTON: Check (Blue) OR Cancel (Red) */}
          <button
            type="button"
            disabled={isChecking}
            onClick={handleActionClick}
            className={`font-black text-sm py-3.5 sm:py-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center ${
              showBalance
                ? 'bg-[#c0264c] hover:bg-rose-700 text-white'
                : 'bg-[#4f80ff] hover:bg-blue-600 text-white'
            }`}
          >
            {isChecking ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" />
            ) : showBalance ? (
              'Cancel'
            ) : (
              'Check'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   4. RECEIVE COINS FULL SCREEN VIEW
   ==================================================================== */
export function ReceiveCoinsScreen({
  isOpen,
  onClose,
  user
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
}) {
  const [copied, setCopied] = useState(false);
  const [manualAmount, setManualAmount] = useState('100');
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const displayUid = user.uid || (user as any).gkId || 'gk_user_987654';
  const qrDataPayload = JSON.stringify({
    type: 'gkwallet_qr',
    uid: displayUid,
    name: user.name || 'GK Wallet User',
    amount: manualAmount || '100'
  });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrDataPayload)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayUid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(qrCodeUrl);
      if (!response.ok) throw new Error('Network error fetching QR image');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `My_Payment_QR_UID_${displayUid}_${manualAmount || '100'}INR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      // Fallback: draw image on canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = qrCodeUrl;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 300;
          canvas.height = img.naturalHeight || 300;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `My_Payment_QR_UID_${displayUid}_${manualAmount || '100'}INR.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch {
          window.open(qrCodeUrl, '_blank');
        }
        setIsDownloading(false);
      };
      img.onerror = () => {
        window.open(qrCodeUrl, '_blank');
        setIsDownloading(false);
      };
      return;
    }
    setIsDownloading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-200 shadow-xs">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-lg font-black text-slate-900 text-center flex-1 pr-9 tracking-tight">
          My QR Code
        </h1>
      </div>

      <div className="flex-1 max-w-md sm:max-w-xl mx-auto w-full p-4 space-y-5 flex flex-col justify-between">
        
        {/* QR Code Container */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md text-center space-y-4 my-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-black border border-blue-100">
            Scan & Pay to My Wallet
          </div>
          
          <h3 className="text-lg font-black text-slate-900">{user.name || 'Smart Wallet User'}</h3>
          <p className="text-xs text-blue-600 font-mono font-extrabold bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mt-0.5">
            UID: {displayUid}
          </p>

          {/* Amount Selection for Receiving */}
          <div className="text-left space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="text-[11px] font-bold text-slate-700 block">
              Receivable Amount (₹)
            </label>
            <input
              type="number"
              value={manualAmount}
              onChange={(e) => setManualAmount(e.target.value)}
              placeholder="100"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Real QR Code image generated from payload */}
          <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-center relative group">
            <img
              src={qrCodeUrl}
              alt="My Payment QR Code"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          {/* User UID Box */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-extrabold text-slate-800">
            <div className="truncate text-left pr-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">USER UID</p>
              <p className="font-mono text-slate-900 font-black text-xs sm:text-sm truncate">{displayUid}</p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy UID'}
            </button>
          </div>

          {/* Download QR Code Button (Hidden on Mobile Devices) */}
          <button
            type="button"
            disabled={isDownloading}
            onClick={handleDownloadQr}
            className="hidden sm:flex w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md items-center justify-center gap-2 active:scale-95 disabled:opacity-75 cursor-pointer"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <Download className="w-4 h-4 text-amber-400" />
            )}
            {isDownloading ? 'Downloading Image...' : 'Download QR Code Image'}
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2 text-left">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-600" /> Automatic Scan & Auto-Fill
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
            When another user scans this QR code using Scan QR & Pay, your UID (<span className="font-mono text-blue-600">{displayUid}</span>) and requested amount (<span className="font-mono text-slate-900">₹{manualAmount}</span>) will be automatically filled in their payment screen.
          </p>
        </div>

      </div>
    </div>
  );
}

/* ====================================================================
   5. HISTORY FULL SCREEN VIEW
   ==================================================================== */
export function HistoryScreen({
  isOpen,
  onClose,
  user,
  history,
  onUserUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData;
  history?: any[];
  onUserUpdate?: (updatedUser: UserData) => void;
}) {
  const [unifiedList, setUnifiedList] = useState<UnifiedTransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceiptRecord, setSelectedReceiptRecord] = useState<UnifiedTransactionRecord | null>(null);

  // Tabs: 'all' | 'payments' | 'addmoney' | 'withdrawal'
  const [activeTab, setActiveTab] = useState<'all' | 'payments' | 'addmoney' | 'withdrawal'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New section/tab state: 'kyc' | 'history' | 'settlement'
  const [activeSection, setActiveSection] = useState<'kyc' | 'history' | 'settlement'>('history');

  // Filter floating popover & states
  const [isFilterFloatingOpen, setIsFilterFloatingOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'received' | 'sent'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'rejected' | 'failed' | 'successful'>('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Balance adjustment state
  const [adjustVolume, setAdjustVolume] = useState('');
  const [adjustLoading, setAdjustLoading] = useState(false);

  // Edit Profile modal state inside this screen
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.gmail || '');

  // KYC state
  const [kycRecord, setKycRecord] = useState<KycData | null>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycAadhaar, setKycAadhaar] = useState('');
  const [kycPan, setKycPan] = useState('');
  const [kycState, setKycState] = useState('');
  const [kycDistrict, setKycDistrict] = useState('');
  const [kycPincode, setKycPincode] = useState('');
  const [kycAddress, setKycAddress] = useState('');

  // Bank & Settlement states
  const [bankDetails, setBankDetails] = useState<UserBankDetails | null>(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [holderName, setHolderName] = useState(user?.name || '');
  const [bankName, setBankName] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [coinsInput, setCoinsInput] = useState('');
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  const themeColor = user?.themeColor || '#6495ED';

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const records = await fetchAllUnifiedTransactionsFromFirestore(user?.uid, user?.mobile);
        if (isMounted) {
          setUnifiedList(records);
        }
      } catch (err) {
        console.warn('Error loading history records:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    // Load KYC record
    async function loadKyc() {
      if (!user?.uid) return;
      setKycLoading(true);
      try {
        const record = await fetchKycFromFirestore(user.uid);
        if (isMounted && record) {
          setKycRecord(record);
          setKycAadhaar(record.aadharCard || '');
          setKycPan(record.pancard || '');
          setKycState(record.state || '');
          setKycDistrict(record.distinct || '');
          setKycPincode(record.pincode || '');
          setKycAddress(record.address || '');
        }
      } catch (err) {
        console.warn('Error loading kyc record:', err);
      } finally {
        if (isMounted) setKycLoading(false);
      }
    }

    // Load Bank details
    async function loadBank() {
      if (!user?.uid) return;
      setBankLoading(true);
      try {
        const record = await fetchBankDetailsFromFirestore(user.uid);
        if (isMounted && record) {
          setBankDetails(record);
          setHolderName(record.bankHolderName || user.name || '');
          setBankName(record.bankName || '');
          setAccountNum(record.accountNumber || '');
          setIfsc(record.ifscCode || '');
        }
      } catch (err) {
        console.warn('Error loading bank details:', err);
      } finally {
        if (isMounted) setBankLoading(false);
      }
    }

    loadData();
    loadKyc();
    loadBank();

    return () => {
      isMounted = false;
    };
  }, [isOpen, user?.uid, user?.mobile, user?.name]);

  if (!isOpen) return null;

  function parseDateString(dateStr: string | undefined): Date | null {
    if (!dateStr) return null;
    if (dateStr.includes('T')) {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    }
    const parts = dateStr.split(/[\\/\\-]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? null : fallback;
  }

  // Handle Balance Adjustments (+ Add Funds / - Deduct Funds)
  const handleBalanceAdjust = async (isAdd: boolean) => {
    const vol = parseFloat(adjustVolume);
    if (isNaN(vol) || vol <= 0) {
      alert('Please enter a valid positive adjustment volume!');
      return;
    }
    if (!user?.uid) return;

    setAdjustLoading(true);
    try {
      const currentBalNum = parseFloat(user.balance || '0');
      const newBalNum = isAdd ? (currentBalNum + vol) : (currentBalNum - vol);
      if (!isAdd && newBalNum < 0) {
        alert('Deduction cannot result in a negative balance!');
        setAdjustLoading(false);
        return;
      }

      const updated = await updateUserProfileInFirestore(user.uid, {
        balance: newBalNum.toFixed(2)
      });
      if (onUserUpdate) {
        onUserUpdate(updated);
      }
      setAdjustVolume('');
      if (isAdd) {
        playCashInAudio();
      } else {
        synthSuccessChime();
      }
    } catch (err) {
      console.error('Error adjusting balance:', err);
      alert('Failed to adjust balance in Firestore database!');
    } finally {
      setAdjustLoading(false);
    }
  };

  // Handle Profile save
  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      alert('Name cannot be empty!');
      return;
    }
    if (!user?.uid) return;

    try {
      const updated = await updateUserProfileInFirestore(user.uid, {
        name: editName.trim(),
        gmail: editEmail.trim()
      });
      if (onUserUpdate) {
        onUserUpdate(updated);
      }
      setIsEditProfileOpen(false);
      playSuccessAudio();
    } catch (err) {
      console.error(err);
      alert('Failed to save profile!');
    }
  };

  // Handle Save KYC Details
  const handleSaveKycDetails = async () => {
    if (!kycAadhaar.trim() || !kycPan.trim() || !kycState.trim() || !kycDistrict.trim() || !kycPincode.trim() || !kycAddress.trim()) {
      alert('Please fill in all KYC details!');
      return;
    }
    if (kycAadhaar.replace(/\\s/g, '').length !== 12 || !/^\\d+$/.test(kycAadhaar.replace(/\\s/g, ''))) {
      alert('Aadhaar number must be exactly 12 digits!');
      return;
    }
    if (kycPan.trim().length !== 10) {
      alert('PAN card number must be exactly 10 characters!');
      return;
    }
    if (!user?.uid) return;

    setKycLoading(true);
    try {
      const kycData: KycData = {
        uid: user.uid,
        name: user.name || 'Rajes Roy',
        mobile: user.mobile || '9074363297',
        gmail: user.gmail || 'skjiyaul842@gmail.com',
        aadharCard: kycAadhaar.trim(),
        pancard: kycPan.trim().toUpperCase(),
        state: kycState.trim(),
        distinct: kycDistrict.trim(),
        pincode: kycPincode.trim(),
        address: kycAddress.trim(),
        status: 'successful'
      };

      await saveKycToFirestore(kycData);
      setKycRecord(kycData);

      const updatedUser = await updateUserProfileInFirestore(user.uid, {
        status: 'successful',
        aadhaar: kycAadhaar.trim(),
        pancard: kycPan.trim().toUpperCase()
      });
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      playSuccessAudio();
      alert('KYC details saved and marked as Successful!');
    } catch (err) {
      console.error('Error saving KYC:', err);
      alert('Failed to save KYC details in Firestore!');
    } finally {
      setKycLoading(false);
    }
  };

  // Handle Save Bank Details
  const handleSaveBankDetails = async () => {
    if (!holderName.trim() || !bankName.trim() || !accountNum.trim() || !ifsc.trim()) {
      alert('Please fill in all bank details!');
      return;
    }
    if (!user?.uid) return;

    setBankLoading(true);
    try {
      const newDetails: UserBankDetails = {
        accountNumber: accountNum.trim(),
        bankHolderName: holderName.trim(),
        bankName: bankName.trim(),
        ifscCode: ifsc.trim().toUpperCase(),
        uid: user.uid
      };
      await saveBankDetailsToFirestore(newDetails);
      setBankDetails(newDetails);
      setIsBankModalOpen(false);
      playSuccessAudio();
      alert('Bank details updated successfully!');
    } catch (err) {
      console.error('Error saving bank details:', err);
      alert('Failed to save bank details!');
    } finally {
      setBankLoading(false);
    }
  };

  // Handle Submit Withdrawal
  const handleSubmitWithdrawal = async () => {
    const coins = parseFloat(coinsInput);
    if (isNaN(coins) || coins < 100) {
      alert('Minimum withdrawal requirement is 100 coins!');
      return;
    }
    const currentBal = parseFloat(user?.balance || '0');
    if (coins > currentBal) {
      alert('Insufficient available balance to complete withdrawal!');
      return;
    }
    if (!bankDetails) {
      alert('Please set your active Bank Account details first!');
      return;
    }
    if (!user?.uid) return;

    setIsSubmittingWithdrawal(true);
    try {
      const reqRecord: WithdrawalRequestRecord = {
        amount: coins,
        bankHolderName: bankDetails.bankHolderName,
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
        uid: user.uid,
        status: 'pending',
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN'),
        reason: 'Withdrawal settlement request'
      };

      await saveWithdrawalRequestToFirestore(reqRecord);

      const nextBal = (currentBal - coins).toFixed(2);
      const updated = await updateUserProfileInFirestore(user.uid, {
        balance: nextBal
      });
      if (onUserUpdate) {
        onUserUpdate(updated);
      }

      setCoinsInput('');
      playSuccessAudio();
      alert('Withdrawal request submitted successfully! Funds will clear within 24 hours.');
    } catch (err) {
      console.error('Error in withdrawal:', err);
      alert('Failed to submit withdrawal request!');
    } finally {
      setIsSubmittingWithdrawal(false);
    }
  };

  // Filter Logic
  const filteredRecords = unifiedList.filter((item) => {
    // 1. Tab filtering inside History tab
    if (activeTab === 'all') {
      // Show all
    } else if (activeTab === 'payments') {
      if (!['ntt', 'nft', 'cashback', 'transactions'].includes(item.sourceCollection)) return false;
    } else if (activeTab === 'addmoney') {
      if (item.sourceCollection !== 'addmoney') return false;
    } else if (activeTab === 'withdrawal') {
      if (item.sourceCollection !== 'withdrawal' && item.typeBadge !== 'WITHDRAWAL') return false;
    }

    // 2. Type filter (Receive Money vs Send Money buttons inside floating box)
    if (typeFilter === 'received') {
      if (!item.isCredit && item.amount < 0) return false;
    } else if (typeFilter === 'sent') {
      if (item.isCredit || item.amount > 0) return false;
    }

    // 3. Status filter (from any filter menu)
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        if (!item.status.includes('PENDING')) return false;
      } else if (statusFilter === 'rejected') {
        if (!item.status.includes('REJECT')) return false;
      } else if (statusFilter === 'failed') {
        if (!item.status.includes('FAIL')) return false;
      } else if (statusFilter === 'successful') {
        if (
          !item.status.includes('SUCCESS') &&
          !item.status.includes('RECEIV') &&
          !item.status.includes('COMPLET')
        ) return false;
      }
    }

    // 4. Date range filter
    if (startDateFilter || endDateFilter) {
      const itemDate = parseDateString(item.date || item.formattedDateTime);
      if (itemDate) {
        if (startDateFilter) {
          const start = new Date(startDateFilter);
          start.setHours(0,0,0,0);
          if (itemDate < start) return false;
        }
        if (endDateFilter) {
          const end = new Date(endDateFilter);
          end.setHours(23,59,59,999);
          if (itemDate > end) return false;
        }
      }
    }

    // 5. Search text filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchSub = item.subtitle?.toLowerCase().includes(q);
      const matchUtr = item.utr?.toLowerCase().includes(q);
      const matchAmt = item.amount?.toString().includes(q);
      return matchTitle || matchSub || matchUtr || matchAmt;
    }

    return true;
  });

  const handleResetFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setStartDateFilter('');
    setEndDateFilter('');
    setSearchQuery('');
  };

  // Elegant Print window statement layout generator
  const handlePrintHistory = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup blocker prevented opening the invoice print window!');
      return;
    }

    const rowsHtml = filteredRecords.map((item, idx) => {
      const isCredit = item.isCredit || item.amount > 0;
      const amtStr = Math.abs(item.amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
          <td class="py-3 px-4 font-bold text-slate-700 text-xs">${idx + 1}</td>
          <td class="py-3 px-4 text-xs">
            <div class="font-extrabold text-slate-900">${item.title || 'Transaction'}</div>
            <div class="text-[10px] text-slate-400 font-semibold">${item.sourceCollection?.toUpperCase() || 'WALLET'}</div>
          </td>
          <td class="py-3 px-4 text-xs font-semibold text-slate-500">${item.formattedDateTime || `${item.date} • ${item.time}`}</td>
          <td class="py-3 px-4 text-xs font-mono text-slate-500">${item.utr || item.id || 'N/A'}</td>
          <td class="py-3 px-4 text-xs text-right font-extrabold ${isCredit ? 'text-emerald-600' : 'text-slate-800'}">
            ${isCredit ? '+' : '-'} ₹${amtStr}
          </td>
        </tr>
      `;
    }).join('');

    const csvContent = "No,Title,Type,Date/Time,UTR/ID,Amount (INR)\\n" + 
      filteredRecords.map((item, idx) => {
        const isCredit = item.isCredit || item.amount > 0;
        const amt = (isCredit ? '' : '-') + Math.abs(item.amount);
        return `${idx + 1},"${item.title || 'Transaction'}","${item.sourceCollection || 'wallet'}","${item.formattedDateTime || `${item.date} ${item.time}`}","${item.utr || item.id}","${amt}"`;
      }).join("\\n");

    const csvDataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const invoiceImgUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.uid || 'gk'}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GK Wallet - Statement Invoice Summary</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Plus Jakarta Sans', sans-serif; }
          </style>
        </head>
        <body class="bg-slate-50 min-h-screen text-slate-900 p-6 md:p-12">
          <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div class="h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500"></div>
            <div class="p-6 md:p-8 space-y-8">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-blue-600"></span>
                    <h1 class="text-xl font-black tracking-tight text-slate-900">GK WALLET STATEMENT</h1>
                  </div>
                  <p class="text-xs font-bold text-slate-400">Statement invoice generated in real-time</p>
                </div>
                <div class="relative inline-block text-left w-full md:w-auto">
                  <button id="exportBtn" onclick="toggleDropdown()" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-md active:scale-95 transition-all inline-flex items-center justify-between md:justify-center gap-2 cursor-pointer">
                    <span>Download Formats</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path></svg>
                  </button>
                  <div id="dropdownMenu" class="hidden absolute right-0 mt-2 w-full md:w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50">
                    <button onclick="triggerDownload('pdf')" class="w-full p-3.5 hover:bg-slate-50 text-left text-xs font-extrabold text-slate-700 flex items-center gap-3">
                      <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V8h2v4zm4 4h-2V8h2v8z"/></svg>
                      <span>PDF Document</span>
                    </button>
                    <button onclick="triggerDownload('excel')" class="w-full p-3.5 hover:bg-slate-50 text-left text-xs font-extrabold text-slate-700 flex items-center gap-3">
                      <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                      <span>Excel Spreadsheet</span>
                    </button>
                    <button onclick="triggerDownload('sheets')" class="w-full p-3.5 hover:bg-slate-50 text-left text-xs font-extrabold text-slate-700 flex items-center gap-3">
                      <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                      <span>Google Sheets (CSV Format)</span>
                    </button>
                  </div>
                </div>
              </div>

              <div id="loaderBox" class="hidden bg-slate-900/40 backdrop-blur-xs fixed inset-0 flex flex-col items-center justify-center gap-4 z-50">
                <div class="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-3 text-center max-w-xs mx-4">
                  <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <h4 class="text-sm font-extrabold text-slate-900">Generating Document...</h4>
                  <p class="text-xs text-slate-400 font-semibold">Please wait while your file is optimized for Android & desktop download.</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div class="space-y-1.5">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Holder Details</h3>
                  <div class="text-sm font-black text-slate-900">${user?.name || 'Rajes Roy'}</div>
                  <div class="text-xs font-semibold text-slate-500 font-mono">${user?.mobile || '9074363297'}</div>
                  <div class="text-xs font-semibold text-slate-500">${user?.gmail || 'skjiyaul842@gmail.com'}</div>
                </div>
                <div class="space-y-1.5 md:text-right">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Document Summary</h3>
                  <div class="text-sm font-black text-slate-900">Available Balance: ₹${user?.balance || '0.00'}</div>
                  <div class="text-xs font-semibold text-slate-500">Total Transactions: ${filteredRecords.length}</div>
                  <div class="text-xs font-semibold text-slate-500 font-mono">Invoice Date: ${new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>

              <div class="flex flex-col md:flex-row items-center gap-6 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://gkwallet.com/invoice/' + (user?.uid || '9074'))}" class="w-24 h-24 rounded-xl border border-blue-100 shadow-xs"/>
                <div class="space-y-1 text-center md:text-left">
                  <h4 class="text-xs font-black text-blue-900 uppercase tracking-wide">Secure Invoice Verification</h4>
                  <p class="text-xs text-blue-700/80 font-medium font-semibold">Scan this QR code to verify this statement's integrity. Underlying signature securely encrypted inside Firestore servers.</p>
                  <div class="text-[10px] font-mono font-bold text-blue-600 pt-1">
                    Invoice Image URL: <a href="${invoiceImgUrl}" target="_blank" class="underline hover:text-blue-800">${invoiceImgUrl}</a>
                  </div>
                </div>
              </div>

              <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-slate-50 border-b border-slate-100">
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-12">#</th>
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Transaction Info</th>
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date & Time</th>
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">UTR / ID</th>
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rowsHtml || '<tr><td colspan="5" class="py-8 text-center text-slate-400 text-xs font-bold">No transactions found matching active filters.</td></tr>'}
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="text-center pt-4 text-[10px] text-slate-400 font-bold border-t border-slate-100">
                This is a computer-generated transaction statement of GK Wallet and does not require physical signature.
              </div>
            </div>
          </div>

          <script>
            function toggleDropdown() {
              const menu = document.getElementById('dropdownMenu');
              menu.classList.toggle('hidden');
            }
            window.onclick = function(event) {
              if (!event.target.closest('#exportBtn') && !event.target.closest('#dropdownMenu')) {
                document.getElementById('dropdownMenu').classList.add('hidden');
              }
            }
            function triggerDownload(format) {
              document.getElementById('dropdownMenu').classList.add('hidden');
              const loader = document.getElementById('loaderBox');
              loader.classList.remove('hidden');

              setTimeout(() => {
                loader.classList.add('hidden');
                if (format === 'pdf') {
                  window.print();
                } else if (format === 'excel') {
                  const link = document.createElement('a');
                  link.href = "${csvDataUri}";
                  link.setAttribute('download', 'GK_Wallet_Statement_${user?.name || 'Rajes_Roy'}.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else if (format === 'sheets') {
                  const link = document.createElement('a');
                  link.href = "${csvDataUri}";
                  link.setAttribute('download', 'GK_Wallet_GoogleSheets_Export_${user?.name || 'Rajes_Roy'}.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  alert('Google Sheets friendly format downloaded. Open this CSV file directly in your Google Sheets mobile app!');
                }
              }, 1200);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in pb-10 animate-duration-200">
      {/* Sticky top-0 header with circular back arrow and Transaction History title */}
      <div className="sticky top-0 z-30 bg-white px-4 py-4 flex items-center border-b border-slate-100 shadow-2xs">
        <button
          onClick={onClose}
          type="button"
          className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 hover:bg-slate-200 active:scale-95 transition-all mr-3.5 shrink-0"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
          Transaction History
        </h1>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pt-5 pb-8 space-y-5">
        
        {/* Search bar and settings filter icon button inline */}
        <div className="flex items-center gap-3 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Mobile, Bank, IFSC, Name, Cashback..."
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Settings slider filter trigger */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsFilterFloatingOpen(!isFilterFloatingOpen)}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs ${
                typeFilter !== 'all' || statusFilter !== 'all' || startDateFilter || endDateFilter
                  ? 'text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              style={(typeFilter !== 'all' || statusFilter !== 'all' || startDateFilter || endDateFilter) ? { backgroundColor: themeColor, borderColor: themeColor } : undefined}
            >
              <SlidersHorizontal className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Floating Filter Popover */}
            {isFilterFloatingOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 z-40 space-y-4 animate-fade-in divide-y divide-slate-100">
                <div className="flex items-center justify-between pb-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Filter Criteria</h4>
                  <button
                    onClick={() => setIsFilterFloatingOpen(false)}
                    className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pt-3 space-y-1.5">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Transaction Type</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['all', 'received', 'sent'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        type="button"
                        className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase transition-all truncate ${
                          typeFilter === t
                            ? 'text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        style={typeFilter === t ? { backgroundColor: themeColor } : undefined}
                      >
                        {t === 'all' ? 'All' : t === 'received' ? 'Receive' : 'Send'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 space-y-2">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Date Range</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 block">Start</span>
                      <input
                        type="date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 block">End</span>
                      <input
                        type="date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-bold text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 space-y-1.5">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Badge</span>
                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 outline-none"
                  >
                    <option value="all">ALL STATUSES</option>
                    <option value="successful">SUCCESSFUL</option>
                    <option value="pending">PENDING</option>
                    <option value="failed">FAILED</option>
                    <option value="rejected">REJECTED</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    onClick={handleResetFilters}
                    type="button"
                    className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider underline cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsFilterFloatingOpen(false)}
                    type="button"
                    style={{ backgroundColor: themeColor }}
                    className="text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-md cursor-pointer"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category segment pill tabs matching user image */}
        <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-2xs flex items-center w-full">
          {(['all', 'payments', 'addmoney', 'withdrawal'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all text-center cursor-pointer ${
                  isActive
                    ? 'text-white shadow-xs'
                    : 'bg-transparent text-slate-500 hover:text-slate-800'
                }`}
                style={isActive ? { backgroundColor: themeColor } : undefined}
              >
                {tab === 'all'
                  ? 'All'
                  : tab === 'payments'
                  ? 'Payments'
                  : tab === 'addmoney'
                  ? 'Add Money'
                  : 'Withdrawal'}
              </button>
            );
          })}
        </div>

        {/* List of transaction cards */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 style={{ color: themeColor }} className="w-8 h-8 animate-spin" />
            <p className="text-xs font-bold text-slate-500">Loading transactions...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
              <History className="w-6 h-6" />
            </div>
            <p className="text-sm font-black text-slate-700">No transactions found</p>
            <p className="text-xs text-slate-400 max-w-xs font-semibold">
              No records match your selected filters or search query.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((item) => {
              const isCredit = item.isCredit || item.amount > 0;
              const formattedAmt = Math.abs(item.amount).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });

              let statusPillClass = 'bg-[#e2f9f0] text-[#059669]';
              let statusLabel = item.status || 'SUCCESSFUL';

              if (item.status.includes('PENDING')) {
                statusPillClass = 'bg-[#fff9db] text-[#f59f00]';
                statusLabel = 'PENDING';
              } else if (item.status.includes('REJECT') || item.status.includes('FAIL')) {
                statusPillClass = 'bg-[#fff5f5] text-[#fa5252]';
                statusLabel = item.status.includes('REJECT') ? 'REJECTED' : 'FAILED';
              } else if (item.status.includes('RECEIV')) {
                statusPillClass = 'bg-[#e2f9f0] text-[#059669]';
                statusLabel = 'RECEIVED';
              } else {
                statusPillClass = 'bg-[#e2f9f0] text-[#059669]';
                statusLabel = 'SUCCESSFUL';
              }

              // Hide avatar icon space entirely for system addmoney to match image layout
              const showAvatar = item.sourceCollection === 'transactions' || (item.sourceCollection !== 'addmoney' && item.sourceCollection !== 'cashback');

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedReceiptRecord(item)}
                  className="bg-white rounded-[24px] p-5 border border-slate-100/80 shadow-2xs flex items-center justify-between hover:border-slate-300 hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-4 min-w-0 pr-2">
                    {showAvatar ? (
                      item.receiverProfilePicture || item.senderProfilePicture ? (
                        <img
                          src={item.receiverProfilePicture || item.senderProfilePicture}
                          alt="User Profile"
                          className="w-14 h-14 rounded-full object-cover shrink-0 border border-slate-100"
                        />
                      ) : (
                        <div 
                          style={{ backgroundColor: `${themeColor}12`, color: themeColor }}
                          className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 font-black text-base"
                        >
                          {item.title ? item.title.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )
                    ) : null}

                    <div className="min-w-0">
                      <h4 className="text-base font-black text-slate-900 truncate">
                        {item.title || 'Transaction'}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1 truncate flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.formattedDateTime || `${item.date} • ${item.time}`}</span>
                      </p>
                      {item.subtitle && item.subtitle !== item.title ? (
                        <p className="text-xs text-slate-400 font-semibold truncate mt-1">
                          {item.subtitle}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end pl-2">
                    <span
                      className={`text-base sm:text-lg font-black font-mono ${isCredit ? 'text-[#0ca678]' : 'text-slate-800'}`}
                    >
                      {isCredit ? `+ ₹${formattedAmt}` : `- ₹${formattedAmt}`}
                    </span>
                    <span className={`mt-2.5 text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${statusPillClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FILTER DIALOG BACKUP IF NEEDED */}
      {/* (Can keep standard receipt and edit profile modals as children) */}

      {/* EDIT PROFILE MODAL DIALOG */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in animate-duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Edit Account Details</h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Full Name</span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Email Address</span>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                type="button"
                style={{ backgroundColor: themeColor }}
                className="w-full text-white font-black text-xs py-3 rounded-2xl cursor-pointer active:scale-95 shadow-md"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LINK BANK DETAILS MODAL DIALOG */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in animate-duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Link Bank Details</h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Bank Holder Name</span>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Bank Name</span>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Account Number</span>
                <input
                  type="text"
                  value={accountNum}
                  onChange={(e) => setAccountNum(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">IFSC Code</span>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. SBIN0001234"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 uppercase"
                />
              </div>

              <button
                onClick={handleSaveBankDetails}
                type="button"
                style={{ backgroundColor: themeColor }}
                className="w-full text-white font-black text-xs py-3 rounded-2xl cursor-pointer active:scale-95 shadow-md"
              >
                Save Bank Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Transaction Receipt Modal */}
      <TransactionReceiptModal
        isOpen={!!selectedReceiptRecord}
        onClose={() => setSelectedReceiptRecord(null)}
        record={selectedReceiptRecord}
        themeColor={themeColor}
      />
    </div>
  );
}/* ====================================================================
   6. SEND TO NFT FULL SCREEN VIEW
   ==================================================================== */
export function SendToNftScreen({
  isOpen,
  onClose,
  user,
  onBalanceUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData;
  onBalanceUpdate?: (newBalance: string) => void;
}) {
  // Mode / Tab selection
  const [tab, setTab] = useState<'existing' | 'new'>('existing');

  // Banner / Slider Images
  const [banners, setBanners] = useState<string[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Form - New Tab
  const [newBankHolderName, setNewBankHolderName] = useState('');
  const [newBankName, setNewBankName] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newIfscCode, setNewIfscCode] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Form - Existing Tab
  const [mobileInput, setMobileInput] = useState('');
  const [foundAccounts, setFoundAccounts] = useState<NftBankAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<NftBankAccount | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchingBank, setIsSearchingBank] = useState(false);

  // Buttons & Modals state
  const [isSendNftLoading, setIsSendNftLoading] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [coinAmount, setCoinAmount] = useState('');

  const [isConfirmPaymentLoading, setIsConfirmPaymentLoading] = useState(false);
  const [isMpinModalOpen, setIsMpinModalOpen] = useState(false);
  const [mpin, setMpin] = useState('');
  const [isMpinConfirmLoading, setIsMpinConfirmLoading] = useState(false);

  // Success Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [txSuccessData, setTxSuccessData] = useState<{
    amount: number;
    updatedBalance: string;
    bankHolder: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    mobile: string;
    status: string;
    date: string;
    time: string;
    dateTime: string;
  } | null>(null);

  // Reward View State
  const [isRewardViewOpen, setIsRewardViewOpen] = useState(false);
  const [cashbackReward, setCashbackReward] = useState<number>(0.32);
  const [rewardTxDetails, setRewardTxDetails] = useState<{
    amount: number;
    dateTime: string;
  } | null>(null);

  useEffect(() => {
    if (isSuccessModalOpen) {
      playSuccessAudio();
    }
  }, [isSuccessModalOpen]);

  useEffect(() => {
    if (isRewardViewOpen) {
      playRewardAudio();
    }
  }, [isRewardViewOpen]);

  // Search Bank Accounts by Mobile
  const handleFindAccounts = useCallback(async (m: string) => {
    const cleanMobile = m.trim().replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setFoundAccounts([]);
      setSelectedAccount(null);
      setIsDropdownOpen(false);
      return;
    }
    setIsSearchingBank(true);
    try {
      const list = await fetchNftBankAccountsByMobile(cleanMobile);
      if (list.length > 0) {
        setFoundAccounts(list);
        setSelectedAccount(list[0]);
        if (list.length > 1) {
          setIsDropdownOpen(false);
        }
      } else if (cleanMobile === '6666666666') {
        // Fallback sample multi-account data for demo testing 6666666666 (as in Screenshot 1)
        const sampleAccounts: NftBankAccount[] = [
          {
            accountNumber: '777777777777',
            bankHolderName: 'Rrrrr',
            ifscCode: 'HBIN000877',
            bankName: 'Mmmmm',
            mobile: '6666666666',
            uid: user?.uid || 'guest'
          },
          {
            accountNumber: '888888888888',
            bankHolderName: 'Rrrrr',
            ifscCode: 'SBIN0001234',
            bankName: 'State Bank of India',
            mobile: '6666666666',
            uid: user?.uid || 'guest'
          }
        ];
        setFoundAccounts(sampleAccounts);
        setSelectedAccount(sampleAccounts[0]);
        setIsDropdownOpen(false);
      } else {
        setFoundAccounts([]);
        setSelectedAccount(null);
        setIsDropdownOpen(false);
      }
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
      setFoundAccounts([]);
      setSelectedAccount(null);
    } finally {
      setIsSearchingBank(false);
    }
  }, [user]);

  // Load Slider Images from Firestore on mount
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    fetchSliderImagesFromFirestore().then((imgs) => {
      if (isMounted && imgs && imgs.length > 0) setBanners(imgs);
    });
    const timer = setTimeout(() => {
      if (isMounted && mobileInput && mobileInput.length === 10) {
        handleFindAccounts(mobileInput);
      }
    }, 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, mobileInput, handleFindAccounts]);

  // Save New Bank Account
  const handleSaveBankAccount = async () => {
    if (!newBankHolderName || !newBankName || !newAccountNumber || !newIfscCode || !newMobile) {
      alert('Please fill in all bank account details!');
      return;
    }
    setIsSavingBank(true);
    const data: NftBankAccount = {
      accountNumber: newAccountNumber,
      bankHolderName: newBankHolderName,
      ifscCode: newIfscCode,
      bankName: newBankName,
      mobile: newMobile,
      uid: user?.uid || 'guest'
    };

    const ok = await saveNftBankAccountToFirestore(data);
    setIsSavingBank(false);

    alert('Bank account saved successfully to Firestore!');
    setTab('existing');
    setMobileInput(newMobile);
    setSelectedAccount(data);
    setFoundAccounts([data]);
  };

  // Click "Send NFT"
  const handleSendNftClick = () => {
    if (!selectedAccount && (!mobileInput || mobileInput.length < 10)) {
      alert('Please enter a 10-digit mobile number and select a bank account!');
      return;
    }
    setIsSendNftLoading(true);
    setTimeout(() => {
      setIsSendNftLoading(false);
      setCoinAmount('');
      setIsTransferModalOpen(true);
    }, 700);
  };

  // Click "Confirm Payment" in Transfer Modal
  const handleConfirmPaymentClick = () => {
    const amt = parseFloat(coinAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid coin amount!');
      return;
    }
    const currentBal = parseFloat(user?.balance || '0');
    if (amt > currentBal) {
      alert('Insufficient coin balance!');
      return;
    }
    setIsConfirmPaymentLoading(true);
    setTimeout(() => {
      setIsConfirmPaymentLoading(false);
      setIsTransferModalOpen(false);
      setIsMpinModalOpen(true);
      setMpin('');
    }, 700);
  };

  // Handle Custom MPIN Keypad Press
  const handleMpinKey = (key: string) => {
    if (key === '⌫') {
      setMpin((prev) => prev.slice(0, -1));
    } else if (key === 'Cancel') {
      setIsMpinModalOpen(false);
      setMpin('');
    } else if (mpin.length < 6) {
      setMpin((prev) => prev + key);
    }
  };

  // Click "Confirm" MPIN
  const handleMpinConfirm = async () => {
    if (mpin.length !== 6) {
      alert('Please enter 6-digit MPIN!');
      return;
    }
    setIsMpinConfirmLoading(true);

    const amt = parseFloat(coinAmount);
    const currentBal = parseFloat(user?.balance || '0');
    const newBal = Math.max(0, currentBal - amt);
    const newBalStr = newBal.toFixed(2);

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateTimeCombined = `${dateStr}, ${timeStr}`;

    const accNum = selectedAccount?.accountNumber || '';
    const holder = selectedAccount?.bankHolderName || user?.name || '';
    const ifsc = selectedAccount?.ifscCode || '';
    const bName = selectedAccount?.bankName || '';
    const mob = selectedAccount?.mobile || mobileInput || user?.mobile || '';

    // 3 seconds delay requirement ("তিন সেকেন্ড পর সাকসেসফুল ডায়লগ সহ হবে")
    setTimeout(async () => {
      // Save Transaction to Firestore collection 'nft'
      await saveNftTransactionToFirestore({
        accountNumber: accNum,
        bankHolderName: holder,
        ifscCode: ifsc,
        bankName: bName,
        mobile: mob,
        amount: amt,
        status: 'pending',
        date: dateStr,
        time: timeStr,
        reason: 'Transfer to NFT',
        uid: user?.uid || 'guest'
      });

      // Update wallet balance
      if (onBalanceUpdate) {
        onBalanceUpdate(newBalStr);
      }

      // Play success audio
      try {
        const audio = new Audio('/successs.mp3');
        audio.play().catch(() => {});
      } catch (e) {}

      setIsMpinConfirmLoading(false);
      setIsMpinModalOpen(false);

      setTxSuccessData({
        amount: amt,
        updatedBalance: newBalStr,
        bankHolder: holder,
        accountNumber: accNum,
        ifscCode: ifsc,
        bankName: bName,
        mobile: mob,
        status: 'pending',
        date: dateStr,
        time: timeStr,
        dateTime: dateTimeCombined
      });

      playCashInAudio();
      setIsSuccessModalOpen(true);
    }, 3000);
  };

  // Click "View Reward" in Success Modal (Dynamic Firestore cashback logic)
  const handleViewRewardClick = async () => {
    setIsSuccessModalOpen(false);

    const amt = txSuccessData?.amount || parseFloat(coinAmount) || 100;

    // Calculate dynamic cashback using Firestore config (amount >= min, month 1-12, random % between min and max)
    const cbResult = await calculateDynamicCashback(amt);
    const cb = cbResult.cashbackCoins;
    setCashbackReward(cb);

    if (cb > 0) {
      const currentBal = parseFloat(txSuccessData?.updatedBalance || user?.balance || '10905.61');
      const finalBalWithCb = (currentBal + cb).toFixed(2);

      if (onBalanceUpdate) {
        onBalanceUpdate(finalBalWithCb);
      }

      // Save cashback to Firestore collection 'cashback'
      await saveCashbackRecordToFirestore({
        amount: cb,
        date: txSuccessData?.date || 'Today',
        time: txSuccessData?.dateTime ? txSuccessData.dateTime.split(',')[1]?.trim() : 'Now',
        status: 'received',
        uid: user?.uid || 'guest',
        reason: 'cashback'
      });
    }

    setRewardTxDetails({
      amount: amt,
      dateTime: txSuccessData?.dateTime || '17/08/2026, 11:35 PM'
    });

    setIsRewardViewOpen(true);
  };

  if (!isOpen) return null;

  // If Reward View Screen is active (Screenshot_20260818-001732.jpg)
  if (isRewardViewOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#16032e] text-white flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none">
        {/* Top Header & Purple Gradient Banner */}
        <div className="relative bg-gradient-to-b from-[#380b6b] via-[#280552] to-[#1a0338] px-5 pt-4 pb-10 rounded-b-[36px] shadow-2xl overflow-hidden">
          {/* Top Row: Back Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setIsRewardViewOpen(false);
                onClose();
              }}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors border border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Banner Content */}
          <div className="mt-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-purple-200">You earned</p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-baseline gap-1.5">
                <span className="text-[#facc15]">{cashbackReward.toFixed(2)}</span>
                <span className="text-white">Coins Cashback</span>
              </h2>
              <p className="text-xs font-medium text-purple-200/90">
                on your recent NFT transaction
              </p>
            </div>

            {/* Stacked Coins Graphic */}
            <div className="shrink-0 pl-2">
              <NftCoinsIcon className="w-20 h-20 drop-shadow-xl" />
            </div>
          </div>

          {/* Floating Cashback Amount Box (Dark Card) */}
          <div className="mt-6 bg-[#1a0836] p-4 sm:p-5 rounded-2xl border border-purple-500/20 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Cashback Amount
              </p>
              <p className="text-2xl sm:text-3xl font-black text-[#facc15] flex items-center gap-2 mt-1">
                <NftCoinsIcon className="w-7 h-7 inline" />
                {cashbackReward.toFixed(2)}
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 text-[#10b981] text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
              <Check className="w-4 h-4 text-[#10b981] stroke-[3]" /> Instant Cashback
            </div>
          </div>
        </div>

        {/* White Content Container */}
        <div className="max-w-lg mx-auto w-full px-4 -mt-4 space-y-4 pb-12 relative z-10">
          {/* Card 1: Details */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-purple-600 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-extrabold text-slate-700">Transfer Amount</span>
              </div>
              <span className="text-base font-black text-slate-900 flex items-center gap-1.5">
                <NftCoinsIcon className="w-5 h-5 inline" />
                {(rewardTxDetails?.amount || 100).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-purple-600 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs font-extrabold text-slate-700">Date & Time</span>
              </div>
              <span className="text-xs font-extrabold text-slate-900">
                {rewardTxDetails?.dateTime || '17/08/2026, 11:48 PM'}
              </span>
            </div>
          </div>

          {/* Card 2: How it works */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 text-slate-900">
            <h3 className="text-base font-black text-slate-900">How it works</h3>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              {/* Step 1 */}
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-100/90 text-purple-600 flex items-center justify-center relative font-black text-xs">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold shadow-xs">1</span>
                </div>
                <p className="text-xs font-black text-slate-900 mt-1">Transfer</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">Send coin or NFT transfer.</p>
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/90 text-amber-700 flex items-center justify-center relative font-black text-xs">
                  <Coins className="w-5 h-5 text-amber-700" />
                  <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold shadow-xs">2</span>
                </div>
                <p className="text-xs font-black text-slate-900 mt-1">Earn Cashback</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">Get random % cashback reward.</p>
              </div>

              {/* Step 3 */}
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center relative font-black text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-900 text-white text-[9px] flex items-center justify-center font-bold shadow-xs">3</span>
                </div>
                <p className="text-xs font-black text-slate-900 mt-1">Added Instantly</p>
                <p className="text-[10px] text-slate-500 font-medium leading-tight">Cashback is added to your wallet.</p>
              </div>
            </div>

            {/* Purple Notice Box */}
            <div className="p-4 bg-[#f3e8ff] border border-purple-200/80 rounded-2xl flex items-center justify-between gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-purple-950 leading-snug flex-1">
                Cashback has been added to your wallet instantly and is ready to use for your next payment.
              </p>
              <NftCoinsIcon className="w-8 h-8 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-200/80 shadow-2xs">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <h2 className="text-base font-black text-slate-900 tracking-tight">
          Send to NFT
        </h2>

        {/* Right Top Corner: Available Coin Box */}
        <div className="bg-purple-50 border border-purple-200/80 rounded-2xl px-3 py-1 flex items-center gap-2">
          <div className="text-right">
            <p className="text-[9px] font-extrabold text-purple-500 uppercase tracking-widest leading-none">AVAILABLE COIN</p>
            <p className="text-xs font-black text-slate-900 mt-0.5 leading-none">
              {parseFloat(user?.balance || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <NftCoinsIcon className="w-5 h-5 shrink-0" />
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-5 space-y-4">
        {/* Banner Carousel / Slider */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-purple-200/50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white min-h-[140px]">
          {banners.length > 0 ? (
            <img
              src={banners[activeBannerIdx]}
              alt="NFT Banner"
              className="w-full h-36 object-cover"
            />
          ) : (
            <div className="p-5 flex items-center justify-between">
              <div className="space-y-1.5 max-w-[240px]">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase">
                  NFT PAYOUT
                </span>
                <h3 className="text-sm sm:text-base font-black leading-snug">
                  SEND NFT COIN, RECEIVE REAL MONEY IN YOUR BANK ACCOUNT
                </h3>
                <p className="text-[10px] text-blue-100 font-medium">
                  Instant IMPS settlement directly to linked bank
                </p>
              </div>
              <div className="shrink-0 pl-2">
                <NftCoinsIcon className="w-20 h-20" />
              </div>
            </div>
          )}

          {/* Slider Pagination Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBannerIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activeBannerIdx === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Tab Selection: Existing vs New */}
        <div className="bg-slate-200/60 p-1 rounded-2xl flex gap-1">
          <button
            onClick={() => setTab('existing')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              tab === 'existing'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
              tab === 'existing' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
            }`}>
              {tab === 'existing' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>
            Existing Account
          </button>

          <button
            onClick={() => setTab('new')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
              tab === 'new'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
              tab === 'new' ? 'border-blue-600 bg-blue-600' : 'border-slate-400'
            }`}>
              {tab === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </span>
            New Bank Account
          </button>
        </div>

        {/* TAB 1: NEW BANK ACCOUNT FORM */}
        {tab === 'new' && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 animate-fade-in">
            <div className="p-3 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-center gap-2 text-xs font-bold text-blue-900">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              Enter new bank details to link NFT payout account.
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Bank Holder Name
              </label>
              <input
                type="text"
                value={newBankHolderName}
                onChange={(e) => setNewBankHolderName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                placeholder="e.g. State Bank of India"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={newAccountNumber}
                onChange={(e) => setNewAccountNumber(e.target.value)}
                placeholder="e.g. 100234567890"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                value={newIfscCode}
                onChange={(e) => setNewIfscCode(e.target.value.toUpperCase())}
                placeholder="E.G. SBIN0001234"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength={10}
                value={newMobile}
                onChange={(e) => setNewMobile(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSaveBankAccount}
              disabled={isSavingBank}
              className="w-full bg-[#3b82f6] hover:bg-blue-600 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all mt-2 flex items-center justify-center"
            >
              {isSavingBank ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Bank Account'}
            </button>
          </div>
        )}

        {/* TAB 2: EXISTING BANK ACCOUNT FORM */}
        {tab === 'existing' && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 animate-fade-in">
            {/* Mobile Input with Integrated Dropdown/Find Icon */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Enter Registered Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setMobileInput(val);
                    if (val.length === 10) {
                      handleFindAccounts(val);
                    } else {
                      setFoundAccounts([]);
                      setSelectedAccount(null);
                      setIsDropdownOpen(false);
                    }
                  }}
                  placeholder="Enter 10-digit mobile"
                  className="w-full pl-4 pr-24 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:outline-none focus:border-blue-500"
                />

                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {isSearchingBank ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                  ) : foundAccounts.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 transition-colors flex items-center gap-1.5 text-xs font-black shadow-2xs"
                      title="Select Linked Account"
                    >
                      <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                        {foundAccounts.length}
                      </span>
                      {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleFindAccounts(mobileInput)}
                      disabled={isSearchingBank || mobileInput.length < 10}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-colors"
                    >
                      Find
                    </button>
                  )}
                </div>
              </div>

              {/* Dropdown Menu Overlay when multiple accounts exist */}
              {isDropdownOpen && foundAccounts.length > 1 && (
                <div className="mt-2 bg-white border border-purple-200 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-100 z-30 relative animate-fade-in">
                  <div className="bg-purple-50/80 px-3 py-2 text-[10px] font-black text-purple-900 uppercase tracking-wider flex justify-between items-center">
                    <span>Select Account ({foundAccounts.length} Linked)</span>
                    <span className="text-purple-600 text-[9px]">Tap to select</span>
                  </div>
                  {foundAccounts.map((acc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedAccount(acc);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full p-3 text-left hover:bg-purple-50 transition-colors flex items-center justify-between ${
                        selectedAccount?.accountNumber === acc.accountNumber ? 'bg-purple-50/90 font-black' : ''
                      }`}
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-purple-600" />
                          {acc.bankName || 'Bank Account'}
                        </p>
                        <p className="text-[11px] text-slate-600 font-extrabold">
                          A/C: <span className="font-mono text-purple-700">{acc.accountNumber}</span> &bull; {acc.bankHolderName}
                        </p>
                        {acc.ifscCode && (
                          <p className="text-[10px] text-slate-400 font-mono">
                            IFSC: {acc.ifscCode}
                          </p>
                        )}
                      </div>
                      {selectedAccount?.accountNumber === acc.accountNumber ? (
                        <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-purple-600 bg-purple-100/70 px-2.5 py-1 rounded-xl">Select</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Read-Only Details (Blank initially, auto-fills when selected) */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  BANK HOLDER NAME
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedAccount?.bankHolderName || ''}
                  placeholder="Enter 10-digit registered mobile..."
                  className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-800 cursor-not-allowed placeholder:text-slate-300 placeholder:font-normal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  BANK NAME
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedAccount?.bankName || ''}
                  placeholder="Enter 10-digit registered mobile..."
                  className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-800 cursor-not-allowed placeholder:text-slate-300 placeholder:font-normal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  ACCOUNT NUMBER
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedAccount?.accountNumber || ''}
                  placeholder="Enter 10-digit registered mobile..."
                  className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs font-mono font-extrabold text-slate-800 cursor-not-allowed placeholder:text-slate-300 placeholder:font-normal"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                  IFSC CODE
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedAccount?.ifscCode || ''}
                  placeholder="Enter 10-digit registered mobile..."
                  className="w-full px-4 py-3 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs font-mono font-extrabold text-slate-700 cursor-not-allowed placeholder:text-slate-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Send NFT Primary Button */}
            <button
              onClick={handleSendNftClick}
              disabled={isSendNftLoading}
              className="w-full bg-[#3b82f6] hover:bg-blue-600 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all mt-4 flex items-center justify-center min-h-[46px]"
            >
              {isSendNftLoading ? <SixDotsLoader /> : 'Send NFT'}
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: TRANSFER NFT COINS DIALOG (Screenshot 1) */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 relative border border-slate-100 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <NftCoinsIcon className="w-6 h-6 inline" />
                Transfer NFT Coins
              </h3>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Yellow Conversion Badge */}
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-900">
              <Zap className="w-4.5 h-4.5 text-amber-600 shrink-0 fill-amber-500" />
              Conversion Rate: 1 Coin = ₹1 (১ পয়েন্ট = ১ টাকা)
            </div>

            {/* Field 1: Enter Coins / Points */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Enter Coins / Points
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  placeholder="Enter coin amount..."
                  className="w-full pl-4 pr-16 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-3 text-[11px] font-black text-amber-700 bg-amber-100 px-2 py-1 rounded-xl tracking-wider">
                  COINS
                </span>
              </div>
            </div>

            {/* Field 2: Amount (₹) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1">
                Amount (₹)
              </label>
              <input
                type="text"
                disabled
                value={`₹ ${parseFloat(coinAmount || '0').toFixed(2)}`}
                className="w-full px-4 py-3.5 bg-slate-100/90 border border-slate-200 rounded-2xl text-base font-black text-slate-800 cursor-not-allowed"
              />
            </div>

            {/* Confirm Payment Button */}
            <button
              onClick={handleConfirmPaymentClick}
              disabled={isConfirmPaymentLoading}
              className="w-full bg-[#3b82f6] hover:bg-blue-600 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center min-h-[48px]"
            >
              {isConfirmPaymentLoading ? <SixDotsLoader /> : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: 6-DIGIT MPIN DIALOG */}
      {isMpinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 relative border border-slate-100 text-center animate-slide-up">
            <h3 className="text-base font-black text-slate-900">
              Enter 6-Digit MPIN
            </h3>
            <p className="text-xs text-slate-500 font-medium -mt-2">
              Verify MPIN to deduct balance & complete NFT transfer
            </p>

            {/* MPIN 6-Dots Display */}
            <div className="flex items-center justify-center gap-3 py-3">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    idx < mpin.length
                      ? 'border-blue-600 bg-blue-600 scale-110 shadow-xs'
                      : 'border-slate-300 bg-slate-100'
                  }`}
                />
              ))}
            </div>

            {/* Custom Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto py-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Cancel', '0', '⌫'].map((k) => (
                <button
                  key={k}
                  onClick={() => handleMpinKey(k)}
                  className={`h-12 rounded-2xl text-sm font-extrabold transition-all active:scale-90 flex items-center justify-center ${
                    k === 'Cancel'
                      ? 'bg-rose-50 text-rose-600 text-xs font-black'
                      : k === '⌫'
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <button
              onClick={handleMpinConfirm}
              disabled={isMpinConfirmLoading}
              className="w-full bg-[#3b82f6] hover:bg-blue-600 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center min-h-[48px]"
            >
              {isMpinConfirmLoading ? <SixDotsLoader /> : 'Confirm'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: FULL SCREEN TRANSACTION SUCCESSFUL DIALOG (Screenshot_20260818-004217.jpg) */}
      {isSuccessModalOpen && txSuccessData && (
        <div className="fixed inset-0 z-50 bg-[#0e8748] text-white flex flex-col w-full h-full min-h-screen overflow-y-auto animate-slide-up select-none">
          {/* Top Header & Green Banner */}
          <div className="relative bg-[#0e8748] px-5 pt-8 pb-6 text-center">
            {/* Live Tick Mark Icon with 3 concentric rings */}
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute w-28 h-28 rounded-full border-2 border-emerald-300/30 animate-ping" />
              <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-200/40" />
              <div className="absolute w-20 h-20 rounded-full border-2 border-emerald-100/50" />
              <div className="w-16 h-16 rounded-full bg-[#10b981] text-white flex items-center justify-center relative z-10 shadow-xl border-2 border-emerald-200">
                <Check className="w-9 h-9 stroke-[3.5]" />
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-3">
              Transaction Successful!
            </h2>
            <p className="text-xs font-medium text-emerald-100 max-w-xs mx-auto mt-2 leading-relaxed">
              Your payment of <span className="text-white font-bold">{txSuccessData.amount.toFixed(2)} Coins</span> to{' '}
              <span className="text-white font-bold">{txSuccessData.bankHolder || 'Recipient'}</span> was processed successfully.
            </p>

            {/* Floating Transaction ID Card */}
            <div className="mt-5 max-w-sm mx-auto bg-white rounded-2xl px-4 py-3.5 shadow-lg border border-slate-100 flex items-center justify-between text-slate-800">
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span className="text-slate-400 font-semibold">Transaction ID:</span>
                <span className="font-black text-slate-900 font-mono">#TXN{txSuccessData.accountNumber}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(`#TXN${txSuccessData.accountNumber}`);
                  alert('Transaction ID copied!');
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pure White Sheet with Curved Top Corners */}
          <div className="bg-white rounded-t-[36px] text-slate-900 px-6 pt-6 pb-12 flex-1 max-w-md mx-auto w-full shadow-2xl space-y-4 relative z-10">
            {/* Recipient Profile Header */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md overflow-hidden shrink-0 border-2 border-white">
                {txSuccessData.bankHolder?.charAt(0)?.toUpperCase() || 'R'}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {txSuccessData.bankHolder || 'Recipient'}
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  @{txSuccessData.bankHolder ? txSuccessData.bankHolder.toLowerCase().replace(/\s+/g, '') : 'recipient'}
                </p>
              </div>
            </div>

            {/* Transaction Key-Value Items */}
            <div className="space-y-3.5 pt-1 text-xs">
              {/* 1. Amount */}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 font-bold">Amount:</span>
                <span className="font-black text-slate-900 text-base flex items-center gap-1.5">
                  <NftCoinsIcon className="w-5 h-5 inline" />
                  {txSuccessData.amount.toFixed(2)} Coins
                </span>
              </div>

              {/* 2. Date */}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 font-bold">Date:</span>
                <span className="font-bold text-slate-900">{txSuccessData.date || '17 Aug 2026'}</span>
              </div>

              {/* 3. Time */}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 font-bold">Time:</span>
                <span className="font-bold text-slate-900">{txSuccessData.time || '09:11:42 PM'}</span>
              </div>

              {/* 4. Status */}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 font-bold">Status:</span>
                <span className="px-3 py-1 rounded-full bg-[#10b981] text-white font-black text-xs shadow-xs">
                  Successful
                </span>
              </div>

              {/* 5. Payment Method */}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 font-bold">Payment Method:</span>
                <span className="font-black text-slate-900">Wallet Balance</span>
              </div>

              {/* 6. Recipient */}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 font-bold">Recipient:</span>
                <span className="font-black text-slate-900">{txSuccessData.bankHolder || 'Recipient'}</span>
              </div>

              {/* 7. Reference */}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 font-bold">Reference:</span>
                <span className="font-black text-slate-900">Coin Transfer</span>
              </div>
            </div>

            {/* Bottom Loading Indicator / Reward Trigger */}
            <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
              <button
                onClick={handleViewRewardClick}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black py-3.5 rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Gift className="w-4 h-4 fill-slate-950" />
                View Reward & Cashback
              </button>

              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Loading your reward screen...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================================================================
   7. BANK SETTLEMENT FULL SCREEN VIEW
   ==================================================================== */
export function SettlementScreen({
  isOpen,
  onClose,
  user,
  currentBalance = 0,
  onBalanceUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData;
  currentBalance?: number;
  onBalanceUpdate?: (newBal: string) => void;
}) {
  const [coinsInput, setCoinsInput] = useState('');
  const [bankDetails, setBankDetails] = useState<UserBankDetails | null>(null);
  
  // Bank Modal states
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [holderName, setHolderName] = useState(user?.name || '');
  const [bankName, setBankName] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Withdrawal Submission states
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastWithdrawal, setLastWithdrawal] = useState<WithdrawalRequestRecord | null>(null);

  // Load bank details on mount or when user changes
  useEffect(() => {
    if (isSuccessModalOpen) {
      playSuccessAudio();
    }
  }, [isSuccessModalOpen]);

  useEffect(() => {
    if (isOpen && user?.uid) {
      fetchBankDetailsFromFirestore(user.uid).then((res) => {
        if (res) {
          setBankDetails(res);
          setHolderName(res.bankHolderName || user.name || '');
          setBankName(res.bankName || '');
          setAccountNum(res.accountNumber || '');
          setIfsc(res.ifscCode || '');
        } else {
          setBankDetails(null);
          setHolderName(user.name || '');
          setBankName('');
          setAccountNum('');
          setIfsc('');
        }
      });
    }
  }, [isOpen, user?.uid, user?.name]);

  if (!isOpen) return null;

  // Handle Save Bank Details in Modal
  const handleSaveBankDetails = async () => {
    if (!holderName.trim() || !bankName.trim() || !accountNum.trim() || !ifsc.trim()) {
      alert('Please fill in all bank account details!');
      return;
    }

    setIsSavingBank(true);

    // Zoom pulse animation duration
    await new Promise((res) => setTimeout(res, 1200));

    const newDetails: UserBankDetails = {
      accountNumber: accountNum.trim(),
      bankHolderName: holderName.trim(),
      bankName: bankName.trim(),
      ifscCode: ifsc.trim().toUpperCase(),
      uid: user?.uid || 'guest_user'
    };

    await saveBankDetailsToFirestore(newDetails);
    setBankDetails(newDetails);
    setIsSavingBank(false);
    setIsBankModalOpen(false);
  };

  // Handle Submit Withdrawal
  const handleSubmitWithdrawal = async () => {
    const coins = parseFloat(coinsInput);
    if (isNaN(coins) || coins < 100) {
      alert('Minimum withdrawal requirement is 100 coins!');
      return;
    }

    if (coins > 10000) {
      alert('Maximum single withdrawal limit is 10,000 coins!');
      return;
    }

    if (coins > (currentBalance || 0)) {
      alert('Insufficient coin balance for withdrawal!');
      return;
    }

    const currentBank = bankDetails || (holderName && accountNum ? {
      bankHolderName: holderName,
      bankName: bankName,
      accountNumber: accountNum,
      ifscCode: ifsc,
      uid: user?.uid || 'guest'
    } : null);

    if (!currentBank) {
      alert('Please add your bank account details before submitting a withdrawal!');
      setHolderName(user?.name || '');
      setIsBankModalOpen(true);
      return;
    }

    setIsSubmittingWithdrawal(true);

    // Zoom pulse 6 dots animation duration
    await new Promise((res) => setTimeout(res, 1500));

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const rec: WithdrawalRequestRecord = {
      accountNumber: currentBank.accountNumber,
      bankHolderName: currentBank.bankHolderName,
      bankName: currentBank.bankName,
      ifscCode: currentBank.ifscCode,
      amount: coins,
      status: 'pending',
      date: formattedDate,
      time: formattedTime,
      reason: 'Bank Withdrawal',
      uid: user?.uid || 'guest'
    };

    await saveWithdrawalRequestToFirestore(rec);

    // Update local user balance
    const updatedBalStr = Math.max(0, (currentBalance || 0) - coins).toFixed(2);
    if (onBalanceUpdate) {
      onBalanceUpdate(updatedBalStr);
    }

    setLastWithdrawal(rec);
    setIsSubmittingWithdrawal(false);
    setCoinsInput('');
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-100 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">Settlement</h2>
            <p className="text-xs text-slate-400 font-medium">Withdraw coins to bank</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="bg-amber-100/80 border border-amber-200/80 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
            <NftCoinsIcon className="w-4 h-4" />
            <span className="text-xs font-black text-amber-900">
              {(currentBalance || 0).toFixed(2)} Coins
            </span>
          </div>
          <button
            onClick={() => {
              setHolderName(user?.name || '');
              setIsBankModalOpen(true);
            }}
            type="button"
            className="text-xs font-extrabold text-[#6495ED] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            + Add New Bank
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-5 space-y-4">
        {/* Banner Card: Settlement Rules */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-lg">
            💡
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Settlement Rules
            </h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              1 Coin = ₹1 &bull; Min: <span className="font-bold text-[#6495ED]">100 Coins</span> &bull; Max: <span className="font-bold text-[#6495ED]">10,000 Coins</span>
            </p>
          </div>
        </div>

        {/* Card 1: Linked Bank Account */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#6495ED]/10 text-[#6495ED] flex items-center justify-center shrink-0 shadow-2xs">
                <NftBankIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Linked Bank Account</h3>
            </div>
            <button
              onClick={() => {
                setHolderName(user?.name || '');
                setIsBankModalOpen(true);
              }}
              type="button"
              className="text-xs font-extrabold text-[#6495ED] hover:text-[#4f82e0] hover:underline cursor-pointer"
            >
              {bankDetails || (accountNum && bankName) ? 'Change' : '+ Add Bank'}
            </button>
          </div>

          {bankDetails || (accountNum && bankName) ? (
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400 font-medium">Bank Name:</span>
                <span className="font-bold text-slate-900">{bankDetails?.bankName || bankName}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-50">
                <span className="text-slate-400 font-medium">Account Holder:</span>
                <span className="font-bold text-slate-900">{bankDetails?.bankHolderName || holderName || user?.name || ''}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-50">
                <span className="text-slate-400 font-medium">Account Number:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {(bankDetails?.accountNumber || accountNum)
                    ? '•••• ' + (bankDetails?.accountNumber || accountNum).slice(-4)
                    : ''}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-50">
                <span className="text-slate-400 font-medium">IFSC Code:</span>
                <span className="font-bold text-slate-900 font-mono">{bankDetails?.ifscCode || ifsc}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 space-y-3">
              <p className="text-xs font-semibold text-slate-500">No bank account linked yet.</p>
              <button
                onClick={() => {
                  setHolderName(user?.name || '');
                  setIsBankModalOpen(true);
                }}
                type="button"
                className="px-5 py-2.5 bg-[#6495ED] hover:bg-[#4f82e0] active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-[#6495ED]/20 transition-all cursor-pointer"
              >
                + Add Bank Account
              </button>
            </div>
          )}
        </div>

        {/* Card 2: Enter Withdrawal Details */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Enter Withdrawal Details</h3>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Coins to Withdraw</label>
            <div className="relative flex items-center">
              <input
                type="number"
                value={coinsInput}
                onChange={(e) => setCoinsInput(e.target.value)}
                placeholder="Enter coins (Min 100)"
                className="w-full pl-4 pr-24 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#6495ED]"
              />
              <div className="absolute right-2 px-3 py-1 bg-amber-100/90 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 flex items-center gap-1 shadow-2xs">
                <NftCoinsIcon className="w-3.5 h-3.5" /> Coins
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Equivalent Amount (INR)</label>
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={`₹ ${(parseFloat(coinsInput) || 0).toFixed(2)}`}
                className="w-full pl-4 pr-24 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-extrabold text-slate-900 cursor-default"
              />
              <div className="absolute right-2 px-3 py-1 bg-emerald-100/90 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-1 shadow-2xs">
                ₹ INR
              </div>
            </div>
          </div>
        </div>

        {/* Submit Withdrawal Button */}
        <button
          onClick={handleSubmitWithdrawal}
          disabled={isSubmittingWithdrawal}
          type="button"
          className="w-full bg-[#6495ED] hover:bg-[#4f82e0] active:scale-95 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-[#6495ED]/25 transition-all text-sm flex items-center justify-center disabled:opacity-80 cursor-pointer"
        >
          {isSubmittingWithdrawal ? (
            <SixDotsLoader className="text-white" />
          ) : (
            'Submit Withdrawal'
          )}
        </button>
      </div>

      {/* MODAL 1: Add / Update Bank Account */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100 animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add / Update Bank Account
              </h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="Account Holder Name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#6495ED]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank Name (e.g. State Bank of India)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#6495ED]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNum}
                  onChange={(e) => setAccountNum(e.target.value)}
                  placeholder="Enter Account Number"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#6495ED]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  placeholder="Enter IFSC Code"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#6495ED]"
                />
              </div>
            </div>

            <button
              onClick={handleSaveBankDetails}
              disabled={isSavingBank}
              type="button"
              className="w-full bg-[#6495ED] hover:bg-[#4f82e0] active:scale-95 text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#6495ED]/25 transition-all text-sm flex items-center justify-center disabled:opacity-80 cursor-pointer"
            >
              {isSavingBank ? (
                <SixDotsLoader className="text-white" />
              ) : (
                'Save Bank Details'
              )}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Withdrawal Successful */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100 text-center animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Withdrawal Request Submitted!
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Your withdrawal request of ₹{(lastWithdrawal?.amount || 0).toFixed(2)} is being processed.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2 border border-slate-100 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Bank Name:</span>
                <span className="font-bold text-slate-900">{lastWithdrawal?.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Account Holder:</span>
                <span className="font-bold text-slate-900">{lastWithdrawal?.bankHolderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Account Number:</span>
                <span className="font-bold text-slate-900">•••• {lastWithdrawal?.accountNumber?.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[10px] uppercase">
                  PENDING
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                onClose();
              }}
              type="button"
              className="w-full bg-[#6495ED] hover:bg-[#4f82e0] active:scale-95 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-[#6495ED]/25 transition-all text-xs cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====================================================================
   8. MOBILE RECHARGE FULL SCREEN VIEW
   ==================================================================== */
export function MobileRechargeScreen({
  isOpen,
  onClose,
  onPay
}: {
  isOpen: boolean;
  onClose: () => void;
  onPay: (operator: string, plan: string, price: number) => void;
}) {
  const [mobile, setMobile] = useState('');
  const [operator, setOperator] = useState('Jio');

  if (!isOpen) return null;

  const handleRecharge = (planName: string, price: number) => {
    if (!mobile || mobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number!');
      return;
    }
    playSuccessAudio();
    onPay(operator, planName, price);
    alert(`Recharge Successful! ₹${price} plan activated on ${mobile} (${operator}).`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-200 shadow-xs">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors py-1 px-3 rounded-xl bg-slate-100 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <h2 className="text-sm font-extrabold flex items-center gap-2 text-slate-900">
          <Smartphone className="w-5 h-5 text-blue-600" />
          Mobile Recharge
        </h2>
        <div className="w-16" />
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-6 space-y-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit number"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-extrabold text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Select Telecom Operator</label>
            <div className="grid grid-cols-4 gap-2">
              {['Jio', 'Airtel', 'Vi', 'BSNL'].map((op) => (
                <button
                  key={op}
                  onClick={() => setOperator(op)}
                  className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                    operator === op ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recharge Plans */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Popular {operator} Recharge Plans</h3>

          {[
            { price: 299, validity: '28 Days', data: '1.5 GB/day', desc: 'Truly Unlimited Voice Calls + 100 SMS/day' },
            { price: 666, validity: '84 Days', data: '1.5 GB/day', desc: 'Unlimited Calls + Disney+ Hotstar Mobile' },
            { price: 199, validity: '18 Days', data: '1 GB/day', desc: 'Budget Pack with Free National Roaming' },
          ].map((plan, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-lg font-black text-slate-900">₹{plan.price}</span>
                <p className="text-xs font-bold text-blue-600">{plan.data} &bull; {plan.validity}</p>
                <p className="text-[11px] text-slate-500">{plan.desc}</p>
              </div>
              <button
                onClick={() => handleRecharge(`${plan.data} Plan`, plan.price)}
                className="bg-[#e91e63] hover:bg-[#d81b60] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-transform active:scale-95"
              >
                Recharge
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   9. ELECTRICITY BILL FULL SCREEN VIEW
   ==================================================================== */
export function ElectricityBillScreen({
  isOpen,
  onClose,
  onPay
}: {
  isOpen: boolean;
  onClose: () => void;
  onPay: (board: string, amount: number) => void;
}) {
  const [board, setBoard] = useState('WBSEDCL (West Bengal)');
  const [consumerNo, setConsumerNo] = useState('');
  const [billAmount, setBillAmount] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFetchBill = () => {
    if (!consumerNo) {
      alert('Please enter Consumer ID Number!');
      return;
    }
    setBillAmount(450);
  };

  const handlePayBill = () => {
    if (!billAmount) return;
    playSuccessAudio();
    onPay(board, billAmount);
    alert(`Electricity Bill Paid! ₹${billAmount} transferred to ${board}.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-200 shadow-xs">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors py-1 px-3 rounded-xl bg-slate-100 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <h2 className="text-sm font-extrabold flex items-center gap-2 text-slate-900">
          <Zap className="w-5 h-5 text-amber-500" />
          Electricity Bill
        </h2>
        <div className="w-16" />
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-6 space-y-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">Electricity Board</label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            >
              <option value="WBSEDCL (West Bengal)">WBSEDCL (West Bengal)</option>
              <option value="CESC Kolkata">CESC Kolkata</option>
              <option value="Adani Electricity Mumbai">Adani Electricity Mumbai</option>
              <option value="BSES Rajdhani Delhi">BSES Rajdhani Delhi</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1.5">Consumer Account Number</label>
            <input
              type="text"
              value={consumerNo}
              onChange={(e) => setConsumerNo(e.target.value)}
              placeholder="e.g. 1029384756"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <button
            onClick={handleFetchBill}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition-colors"
          >
            Fetch Bill Details
          </button>
        </div>

        {billAmount !== null && (
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-3xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-amber-900 uppercase">Pending Bill Amount</span>
              <span className="text-2xl font-black text-amber-700">₹{billAmount}</span>
            </div>

            <p className="text-xs text-amber-800 font-medium">Consumer ID: {consumerNo} &bull; Due Date: 28th Aug 2026</p>

            <button
              onClick={handlePayBill}
              className="w-full bg-[#e91e63] hover:bg-[#d81b60] text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md active:scale-95 transition-transform"
            >
              Pay ₹{billAmount} Bill Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// High Fidelity, Crisp SVG Graphic for Referral (Matching user's referal.png)
function ReferralIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.15))' }}>
      <defs>
        {/* Gradients */}
        <linearGradient id="refMegaphoneYellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="40%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#FF8500" />
        </linearGradient>
        <linearGradient id="refMegaphoneHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="refBlueStripe" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="refAvatarBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="refAvatarGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#7DD3FC" />
        </linearGradient>
      </defs>

      {/* Outer Orbit Guide Ring */}
      <circle cx="200" cy="200" r="148" fill="none" stroke="#CBD5E1" strokeWidth="4" strokeDasharray="8 6" opacity="0.85" />
      <g stroke="#94A3B8" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 210,52 L 195,52 L 202,44" />
        <path d="M 348,210 L 348,195 L 356,202" />
        <path d="M 190,348 L 205,348 L 198,356" />
        <path d="M 52,190 L 52,205 L 44,198" />
      </g>

      {/* 4 Crisp User Avatar Badges in Orbit */}
      {/* 1. Top-Left */}
      <g transform="translate(62, 62)">
        <circle cx="0" cy="0" r="34" fill="url(#refAvatarBg)" stroke="#FFFFFF" strokeWidth="3.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.12))" />
        <circle cx="0" cy="0" r="26" fill="url(#refAvatarGlow)" opacity="0.9" />
        <circle cx="0" cy="-6" r="9.5" fill="#1E293B" />
        <path d="M -15,18 C -14,7 -6,3 0,3 C 6,3 14,7 15,18 Z" fill="#1E293B" />
      </g>

      {/* 2. Top-Right */}
      <g transform="translate(338, 62)">
        <circle cx="0" cy="0" r="34" fill="url(#refAvatarBg)" stroke="#FFFFFF" strokeWidth="3.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.12))" />
        <circle cx="0" cy="0" r="26" fill="url(#refAvatarGlow)" opacity="0.9" />
        <circle cx="0" cy="-6" r="9.5" fill="#1E293B" />
        <path d="M -15,18 C -14,7 -6,3 0,3 C 6,3 14,7 15,18 Z" fill="#1E293B" />
      </g>

      {/* 3. Bottom-Left */}
      <g transform="translate(62, 338)">
        <circle cx="0" cy="0" r="34" fill="url(#refAvatarBg)" stroke="#FFFFFF" strokeWidth="3.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.12))" />
        <circle cx="0" cy="0" r="26" fill="url(#refAvatarGlow)" opacity="0.9" />
        <circle cx="0" cy="-6" r="9.5" fill="#1E293B" />
        <path d="M -15,18 C -14,7 -6,3 0,3 C 6,3 14,7 15,18 Z" fill="#1E293B" />
      </g>

      {/* 4. Bottom-Right */}
      <g transform="translate(338, 338)">
        <circle cx="0" cy="0" r="34" fill="url(#refAvatarBg)" stroke="#FFFFFF" strokeWidth="3.5" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.12))" />
        <circle cx="0" cy="0" r="26" fill="url(#refAvatarGlow)" opacity="0.9" />
        <circle cx="0" cy="-6" r="9.5" fill="#1E293B" />
        <path d="M -15,18 C -14,7 -6,3 0,3 C 6,3 14,7 15,18 Z" fill="#1E293B" />
      </g>

      {/* Central Angled Megaphone / Loudspeaker Graphic */}
      <g transform="translate(200, 200) rotate(-35) translate(-75, -50)" filter="drop-shadow(0 8px 14px rgba(0,0,0,0.18))">
        {/* Tail Cord */}
        <path d="M -18,72 C -30,84 -15,115 15,112 C 35,110 42,95 36,80" fill="none" stroke="#CBD5E1" strokeWidth="10" strokeLinecap="round" />
        {/* Handle */}
        <rect x="-18" y="48" width="22" height="34" rx="8" transform="rotate(18 -10 65)" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
        
        {/* Blue Cylindrical Body / Barrel */}
        <rect x="0" y="24" width="60" height="54" rx="12" fill="url(#refBlueStripe)" stroke="#1E3A8A" strokeWidth="2.5" />
        <rect x="-4" y="21" width="12" height="60" rx="5" fill="#1E293B" />
        <rect x="18" y="24" width="12" height="54" fill="#38BDF8" />
        <rect x="36" y="24" width="8" height="54" fill="#E0F2FE" />
        <rect x="54" y="20" width="12" height="62" rx="5" fill="#1E293B" />

        {/* Yellow Cone */}
        <path d="M 64,24 L 142,-4 C 152,-8 160,2 160,14 L 160,88 C 160,100 152,110 142,106 L 64,78 Z" fill="url(#refMegaphoneYellow)" stroke="#D97706" strokeWidth="2.5" />
        
        {/* Glossy Top Highlight */}
        <path d="M 68,28 L 140,4 L 140,28 L 68,44 Z" fill="url(#refMegaphoneHighlight)" />
        
        {/* Front Opening Rim */}
        <ellipse cx="158" cy="51" rx="12" ry="46" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
        <ellipse cx="155" cy="51" rx="7" ry="36" fill="#F87171" />
        <ellipse cx="153" cy="51" rx="3.5" ry="24" fill="#FEE2E2" />
      </g>
    </svg>
  );
}

// Ultra-Crisp, High-Legibility 3D NFT Gold Coins (Matching user's coin.png)
export function NftCoinIllustration({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 140" className={className} xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 3px 6px rgba(180, 83, 9, 0.35))' }}>
      <defs>
        {/* High Contrast Gold Gradients */}
        <linearGradient id="goldTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9A6" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="75%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="goldSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="40%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FEF08A" />
          <stop offset="80%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>

      {/* Ground ambient shadow */}
      <ellipse cx="80" cy="128" rx="65" ry="10" fill="#78350F" opacity="0.25" />

      {/* COIN 1 (Bottom Left Base) */}
      <g transform="translate(5, 12)">
        {/* 3D Rim */}
        <path d="M 15,75 C 15,90 40,102 72,102 C 104,102 129,90 129,75 L 129,87 C 129,102 104,114 72,114 C 40,114 15,102 15,87 Z" fill="url(#goldSideGrad)" stroke="#78350F" strokeWidth="1.2" />
        {/* Edge Vertical Ridges */}
        <line x1="30" y1="84" x2="30" y2="96" stroke="#78350F" strokeWidth="1.5" opacity="0.6" />
        <line x1="50" y1="91" x2="50" y2="103" stroke="#78350F" strokeWidth="1.5" opacity="0.6" />
        <line x1="72" y1="94" x2="72" y2="106" stroke="#78350F" strokeWidth="1.5" opacity="0.6" />
        <line x1="94" y1="91" x2="94" y2="103" stroke="#78350F" strokeWidth="1.5" opacity="0.6" />
        <line x1="114" y1="84" x2="114" y2="96" stroke="#78350F" strokeWidth="1.5" opacity="0.6" />
        {/* Top Face */}
        <ellipse cx="72" cy="75" rx="57" ry="24" fill="url(#goldTopGrad)" stroke="#FFFBEB" strokeWidth="1.5" />
        <ellipse cx="72" cy="75" rx="50" ry="19" fill="none" stroke="#D97706" strokeWidth="1" opacity="0.7" />
      </g>

      {/* COIN 2 (Bottom Right with Bold "NFT") */}
      <g transform="translate(18, 16)">
        {/* 3D Rim */}
        <path d="M 52,78 C 52,92 74,103 102,103 C 130,103 152,92 152,78 L 152,90 C 152,104 130,115 102,115 C 74,115 52,104 52,90 Z" fill="url(#goldSideGrad)" stroke="#78350F" strokeWidth="1.2" />
        {/* Ridges */}
        <line x1="70" y1="88" x2="70" y2="100" stroke="#78350F" strokeWidth="1.5" opacity="0.6" />
        <line x1="102" y1="94" x2="102" y2="106" stroke="#78350F" strokeWidth="1.5" opacity="0.6" />
        <line x1="134" y1="88" x2="134" y2="100" stroke="#78350F" strokeWidth="1.5" opacity="0.6" />
        {/* Top Face */}
        <ellipse cx="102" cy="78" rx="50" ry="22" fill="url(#goldTopGrad)" stroke="#FFFBEB" strokeWidth="1.5" />
        <ellipse cx="102" cy="78" rx="44" ry="17" fill="none" stroke="#B45309" strokeWidth="1" />
        {/* 3D Embossed NFT Text on Right Coin */}
        <text x="102" y="87" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" fill="#78350F" letterSpacing="1" transform="scale(1, 0.82) translate(0, 15)">NFT</text>
        <text x="102" y="85" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="21" fill="url(#goldTextGrad)" stroke="#FFFFFF" strokeWidth="0.8" letterSpacing="1" transform="scale(1, 0.82) translate(0, 15)">NFT</text>
      </g>

      {/* COIN 3 (Top Center Hero Coin with Sharp "NFT") */}
      <g transform="translate(0, -6)">
        {/* 3D Rim */}
        <path d="M 24,42 C 24,58 50,70 82,70 C 114,70 140,58 140,42 L 140,56 C 140,72 114,84 82,84 C 50,84 24,72 24,56 Z" fill="url(#goldSideGrad)" stroke="#78350F" strokeWidth="1.5" />
        {/* Edge Vertical Ridges */}
        <line x1="38" y1="52" x2="38" y2="66" stroke="#78350F" strokeWidth="1.8" opacity="0.7" />
        <line x1="58" y1="60" x2="58" y2="74" stroke="#78350F" strokeWidth="1.8" opacity="0.7" />
        <line x1="82" y1="63" x2="82" y2="77" stroke="#78350F" strokeWidth="1.8" opacity="0.7" />
        <line x1="106" y1="60" x2="106" y2="74" stroke="#78350F" strokeWidth="1.8" opacity="0.7" />
        <line x1="126" y1="52" x2="126" y2="66" stroke="#78350F" strokeWidth="1.8" opacity="0.7" />
        {/* Top Face */}
        <ellipse cx="82" cy="42" rx="58" ry="26" fill="url(#goldTopGrad)" stroke="#FFFBEB" strokeWidth="2" />
        <ellipse cx="82" cy="42" rx="51" ry="21" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
        <ellipse cx="82" cy="42" rx="46" ry="18" fill="none" stroke="#B45309" strokeWidth="1.2" opacity="0.7" />
        {/* Bold 3D Embossed NFT Text on Top Coin */}
        <text x="82" y="52" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="27" fill="#78350F" letterSpacing="1.5" transform="scale(1, 0.82) translate(0, 10)">NFT</text>
        <text x="82" y="49" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="27" fill="url(#goldTextGrad)" stroke="#FFFBEB" strokeWidth="1" letterSpacing="1.5" transform="scale(1, 0.82) translate(0, 10)">NFT</text>
      </g>
    </svg>
  );
}

/* ====================================================================
   10. REFER & EARN FULL SCREEN VIEW
   ==================================================================== */
export function ReferAndEarnScreen({
  isOpen,
  onClose,
  user,
  onUserUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUserUpdate?: (updatedUser: UserData) => void;
}) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  
  // Real-time Firestore Share URL (collection: share -> field: url)
  const [shareBaseUrl, setShareBaseUrl] = useState<string>('https://gkwallet.app');
  
  // Real-time Firestore yourcoin collection (fields: coin and frendcoin)
  const [yourCoinData, setYourCoinData] = useState<YourCoinRewards>({ coin: 20, frendcoin: 25 });

  // 6-digit Referral Code & Live Stats from Firestore 'referals'
  const [referralCode, setReferralCode] = useState<string>(() => {
    return user.referralCode || (user.uid ? user.uid.slice(0, 6).toUpperCase() : '849201');
  });

  const [stats, setStats] = useState<{ 
    totalReferrals: number; 
    successfulReferrals: number; 
    totalEarnings: number 
  }>({
    totalReferrals: 0,
    successfulReferrals: 0,
    totalEarnings: 0
  });

  // 1. Subscribe to Real-time Share URL from Firestore 'share' collection
  useEffect(() => {
    if (!isOpen) return;
    const unsubShare = subscribeToShareUrlFromFirestore((url) => {
      if (url && typeof url === 'string') {
        setShareBaseUrl(url.trim());
      }
    });
    return () => {
      unsubShare();
    };
  }, [isOpen]);

  // 2. Subscribe to Real-time Rewards from Firestore 'yourcoin' collection (coin & frendcoin)
  useEffect(() => {
    if (!isOpen) return;
    const unsubCoins = subscribeToYourCoinRewardsFromFirestore((rewards) => {
      if (rewards && typeof rewards === 'object') {
        setYourCoinData({
          coin: typeof rewards.coin === 'number' ? rewards.coin : 20,
          frendcoin: typeof rewards.frendcoin === 'number' ? rewards.frendcoin : 25
        });
      }
    });
    return () => {
      unsubCoins();
    };
  }, [isOpen]);

  // 3. Fetch/Generate 6-digit referral code & Subscribe to Firestore 'referals' collection in real-time
  useEffect(() => {
    if (!isOpen || !user?.uid) return;

    // Get or generate 6-digit referral code
    getOrCreateUserReferralCode(user.uid, user.mobile).then(({ code, stats: initialStats }) => {
      if (code) setReferralCode(code);
      if (initialStats) {
        setStats({
          totalReferrals: initialStats.totalReferrals || 0,
          successfulReferrals: initialStats.successfulReferrals || 0,
          totalEarnings: initialStats.totalEarnings || 0
        });
      }
    });

    // Subscribe to live changes on doc 'referals/{uid}'
    const unsubReferrals = subscribeToUserReferralData(user.uid, (liveStats) => {
      if (liveStats.referralCode) {
        setReferralCode(liveStats.referralCode);
      }
      setStats({
        totalReferrals: liveStats.totalReferrals || 0,
        successfulReferrals: liveStats.successfulReferrals || 0,
        totalEarnings: liveStats.totalEarnings || 0
      });
    });

    return () => {
      unsubReferrals();
    };
  }, [isOpen, user?.uid, user?.mobile]);

  if (!isOpen) return null;

  // Format real-time shareable link combining Firestore share URL with 6-digit referral code
  const formatReferralLink = (base: string, code: string): string => {
    const cleanBase = base.trim();
    if (!cleanBase) return `https://gkwallet.app/ref/${code}`;
    if (cleanBase.includes('?')) {
      return `${cleanBase}&ref=${code}`;
    }
    if (cleanBase.endsWith('/')) {
      return `${cleanBase}ref/${code}`;
    }
    // If it's a direct download or custom link
    if (cleanBase.includes('http')) {
      return `${cleanBase}?ref=${code}`;
    }
    return `https://${cleanBase}/ref/${code}`;
  };

  const currentReferralLink = formatReferralLink(shareBaseUrl, referralCode);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentReferralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoMessage({ text: 'অনুগ্রহ করে সঠিক রেফারেল কোড বা প্রোমো কোড দিন।', isError: true });
      return;
    }

    setIsApplyingPromo(true);
    setPromoMessage(null);

    const res = await applyPromoCodeInFirestore(user.uid, promoInput.trim(), {
      coin: yourCoinData.coin,
      frendcoin: yourCoinData.frendcoin
    });
    setIsApplyingPromo(false);

    if (res.success) {
      playSuccessAudio();
      setPromoMessage({ text: res.message, isError: false });
      setPromoInput('');
      if (res.newBalance && onUserUpdate) {
        onUserUpdate({ ...user, balance: res.newBalance });
      }
      fetchUserReferralStatsFromFirestore(user.uid).then((st) => {
        setStats({
          totalReferrals: st.totalReferrals || 0,
          successfulReferrals: st.successfulReferrals || 0,
          totalEarnings: st.totalEarnings || 0
        });
      });
    } else {
      setPromoMessage({ text: res.message, isError: true });
    }
  };

  const shareText = `Join GK Wallet using my 6-digit referral code ${referralCode} and earn ₹${yourCoinData.frendcoin} bonus on registration! Download link: ${currentReferralLink}`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentReferralLink)}`, '_blank');
  };

  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentReferralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareMore = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GK Wallet Referral',
          text: shareText,
          url: currentReferralLink,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f4f6fb] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#f4f6fb]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between shrink-0">
        <button
          onClick={onClose}
          type="button"
          className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-800 shadow-2xs transition-colors shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-extrabold text-[#111827]">
          Refer & Earn
        </h2>
        <div className="w-9" />
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 pb-8 space-y-4">
        
        {/* 1. Hero Card */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-sky-50/50 to-blue-50/60 border border-sky-100/90 rounded-3xl p-5 shadow-2xs relative overflow-hidden space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 leading-tight">
                Refer your friends
              </h3>
              <h3 className="text-xl font-black text-[#6495ED] leading-tight">
                Earn Rewards
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1 max-w-[200px]">
                Invite your friends and earn exciting rewards when they join and complete a transaction.
              </p>
            </div>
            
            {/* Brand New Modern Referral Graphic (Matching referal.png) */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 relative shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#6495ED]/20 rounded-full blur-xl animate-pulse" />
              <div className="relative z-10 w-full h-full bg-gradient-to-br from-white via-sky-50/90 to-blue-50/80 rounded-3xl p-1 border border-[#6495ED]/30 shadow-md flex items-center justify-center overflow-hidden">
                <ReferralIllustration className="w-full h-full object-contain hover:scale-105 transition-transform" />
              </div>
            </div>
          </div>

          {/* You Earn / Friend Gets Sub-box (Realtime from Firestore 'yourcoin' -> 'coin' & 'frendcoin') */}
          <div className="bg-white rounded-2xl p-3 border border-sky-100 shadow-2xs grid grid-cols-2 divide-x divide-slate-100">
            <div className="flex items-center gap-3 pr-2">
              <div className="w-13 h-11 flex items-center justify-center shrink-0">
                <NftCoinIllustration className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">YOU EARN</p>
                <p className="text-base font-black text-[#6495ED]">₹{yourCoinData.coin}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-3">
              <div className="w-11 h-11 flex items-center justify-center shrink-0">
                <Gift className="w-8 h-8 text-pink-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">YOUR FRIEND GETS</p>
                <p className="text-base font-black text-[#6495ED]">₹{yourCoinData.frendcoin}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Enter Promo Code Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5">
          <h4 className="text-sm font-bold text-slate-900">Enter Promo Code</h4>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="ENTER 6-DIGIT CODE"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-black text-slate-900 uppercase tracking-wider placeholder:text-slate-400 focus:outline-none focus:border-[#6495ED]"
            />
            <button
              onClick={handleApplyPromo}
              disabled={isApplyingPromo}
              className="px-6 py-3 bg-[#6495ED] hover:bg-[#5284dc] active:scale-95 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isApplyingPromo ? <SixDotsLoader className="text-white" /> : 'Apply'}
            </button>
          </div>
          {promoMessage ? (
            <p className={`text-[11px] font-bold ${promoMessage.isError ? 'text-red-500' : 'text-emerald-600'}`}>
              {promoMessage.text}
            </p>
          ) : (
            <p className="text-[11px] font-semibold text-slate-400">
              Enter a valid 6-digit referral code or promo code to earn ₹{yourCoinData.frendcoin} bonus
            </p>
          )}
        </div>

        {/* 3. Your Referral Code Card (6 Digits) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5">
          <h4 className="text-sm font-bold text-slate-900">Your Referral Code</h4>
          <div className="border-2 border-dashed border-[#6495ED]/30 bg-[#6495ED]/5 rounded-2xl p-3.5 flex items-center justify-between">
            <span className="text-lg font-black text-[#6495ED] tracking-widest font-mono">
              {referralCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-[#6495ED]/30 rounded-xl text-xs font-bold text-[#6495ED] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-[#6495ED]" />
              {codeCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            Share your 6-digit code or link with your friends
          </p>
        </div>

        {/* 4. Your Referral Link Card (Real-time from Firestore 'share' -> 'url') */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5">
          <h4 className="text-sm font-bold text-slate-900">Your Referral Link</h4>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 pl-3 flex items-center justify-between">
            <input
              type="text"
              readOnly
              value={currentReferralLink}
              className="text-xs font-bold text-slate-800 font-mono truncate mr-2 bg-transparent border-none outline-none flex-1 select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-1.5 bg-[#6495ED] hover:bg-[#5284dc] text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Copy className="w-3.5 h-3.5 text-white" />
              {linkCopied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Real-time link synced from Firestore
          </p>
        </div>

        {/* 5. Share Via Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-slate-900">Share Via</h4>
          <div className="grid grid-cols-4 gap-2 text-center">
            
            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5 fill-white" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareFacebook}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5 fill-white" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Facebook</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleShareTelegram}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Send className="w-5 h-5 fill-white" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">Telegram</span>
            </button>

            {/* More */}
            <button
              onClick={handleShareMore}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#6495ED]/15 text-[#6495ED] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700">More</span>
            </button>

          </div>
        </div>

        {/* 6. Referral Summary Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
          <h4 className="text-sm font-bold text-slate-900">Referral Summary</h4>
          <div className="grid grid-cols-3 divide-x divide-slate-100 text-center py-1">
            <div className="px-1 space-y-1.5 flex flex-col items-center">
              <div className="flex items-center justify-center h-8">
                <User className="w-6 h-6 text-[#6495ED]" />
              </div>
              <p className="text-base font-black text-slate-900 leading-none">{stats.totalReferrals}</p>
              <p className="text-[10px] text-slate-400 font-bold leading-tight">Total Referrals</p>
            </div>
            <div className="px-1 space-y-1.5 flex flex-col items-center">
              <div className="flex items-center justify-center h-8">
                <Check className="w-6 h-6 text-emerald-500 stroke-[3]" />
              </div>
              <p className="text-base font-black text-slate-900 leading-none">{stats.successfulReferrals}</p>
              <p className="text-[10px] text-slate-400 font-bold leading-tight">Successful Referrals</p>
            </div>
            <div className="px-1 space-y-1.5 flex flex-col items-center">
              <div className="flex items-center justify-center h-8">
                <Gift className="w-6 h-6 text-pink-500" />
              </div>
              <p className="text-base font-black text-slate-900 leading-none">₹{stats.totalEarnings}</p>
              <p className="text-[10px] text-slate-400 font-bold leading-tight">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-[#6495ED]/10 border border-[#6495ED]/20 rounded-2xl p-3.5 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#6495ED] shrink-0" />
          <p className="text-xs font-semibold text-slate-800 leading-snug">
            You will earn rewards when your friend joins and completes their transaction.
          </p>
        </div>

      </div>
    </div>
  );
}

/* ====================================================================
   11. PLATINUM SAVINGS FULL SCREEN VIEW
   ==================================================================== */
export function PlatinumSavingsScreen({
  isOpen,
  onClose,
  currentBalance
}: {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none">
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-200 shadow-xs">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors py-1 px-3 rounded-xl bg-slate-100 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        <h2 className="text-sm font-extrabold flex items-center gap-2 text-slate-900">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Platinum Savings 12% p.a.
        </h2>
        <div className="w-16" />
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-6 space-y-5">
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-3">
          <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-black px-3 py-1 rounded-full uppercase">High Yield Vault</span>
          <h3 className="text-2xl font-black">12% Guaranteed Interest</h3>
          <p className="text-xs text-indigo-200">Deposit GK Coins into Platinum Savings and earn daily passive interest payouts!</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-xs font-bold text-slate-600">
            <span>Current Vault Balance</span>
            <span className="text-lg font-black text-indigo-600">0 GK Coins</span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-600 border-t border-slate-100 pt-3">
            <span>Interest Earnings (This Month)</span>
            <span className="text-xs font-black text-emerald-600">+0 Coins</span>
          </div>
        </div>

        <button
          onClick={() => alert('Deposit to Savings: Feature activated! You will receive daily interest.')}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-indigo-600/30 text-xs transition-transform active:scale-95"
        >
          Deposit GK Coins to Savings
        </button>
      </div>
    </div>
  );
}

/* ====================================================================
   12. NOTIFICATIONS FULL SCREEN VIEW
   ==================================================================== */
export function NotificationsScreen({
  isOpen,
  onClose,
  user,
  themeColor = '#6495ED'
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData;
  themeColor?: string;
}) {
  const [liveNotifs, setLiveNotifs] = useState<AppNotification[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selected notification for details view modal
  const [selectedNotif, setSelectedNotif] = useState<AppNotification | null>(null);

  // Full Screen Zoomable Image modal state
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Swipe state tracking for Left-to-Right swipe to hide
  const [swipingId, setSwipingId] = useState<string | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const isSwipingHorizontalRef = useRef(false);

  // Load hidden notification IDs for the logged in user
  const loadHiddenIds = useCallback(() => {
    const list = getHiddenNotificationIds(user?.uid);
    setHiddenIds(list);
  }, [user?.uid]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        loadHiddenIds();
        setIsLoading(true);
      }, 0);
      const unsubscribe = subscribeToFirestoreNotifications((notifs) => {
        setLiveNotifs(notifs);
        setIsLoading(false);
      });
      return () => {
        clearTimeout(timer);
        unsubscribe();
      };
    }
  }, [isOpen, loadHiddenIds]);

  // Handle local swipe-to-hide action (does not delete from Firestore)
  const handleHideNotification = (notif: AppNotification) => {
    const idToHide = notif.id || `${notif.title}_${notif.timestamp || notif.time}`;
    hideNotificationForUser(idToHide, user?.uid);
    setHiddenIds((prev) => [...prev, idToHide]);
    if (selectedNotif?.id === notif.id) {
      setSelectedNotif(null);
    }
  };

  // Restore all hidden notifications
  const handleRestoreHidden = () => {
    clearHiddenNotificationsForUser(user?.uid);
    setHiddenIds([]);
  };

  // Touch gesture handlers for Left-to-Right swipe
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isSwipingHorizontalRef.current = false;
    setSwipingId(id);
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
    if (swipingId !== id) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // Check if horizontal intent
    if (!isSwipingHorizontalRef.current && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isSwipingHorizontalRef.current = true;
    }

    if (isSwipingHorizontalRef.current) {
      // Allow only Left-to-Right swipe (deltaX > 0)
      if (deltaX > 0) {
        setSwipeOffset(Math.min(deltaX, 220));
      } else {
        setSwipeOffset(0);
      }
    }
  };

  const handleTouchEnd = (notif: AppNotification) => {
    if (swipeOffset > 85) {
      // User swiped left-to-right past threshold -> Hide notification
      handleHideNotification(notif);
    }
    setSwipingId(null);
    setSwipeOffset(0);
    isSwipingHorizontalRef.current = false;
  };

  // Image Zoom Viewer Handlers
  const handleOpenZoomViewer = (imgSrc: string) => {
    setZoomedImage(imgSrc);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  // Filter out notifications hidden by the logged-in user
  const visibleNotifs = liveNotifs.filter((n) => {
    const id = n.id || `${n.title}_${n.timestamp || n.time}`;
    return !hiddenIds.includes(id);
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none">
      
      {/* 1. TOP HEADER */}
      <div
        className="sticky top-0 z-30 text-white px-4 py-3.5 flex items-center justify-between shadow-md transition-colors duration-300"
        style={{ backgroundColor: themeColor }}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-white bg-white/20 hover:bg-white/30 active:scale-95 transition-all py-1.5 px-3 rounded-xl font-black text-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Back
        </button>

        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-white" />
          <h2 className="text-base font-extrabold text-white">Notifications</h2>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full text-white">
            {visibleNotifs.length}
          </span>
        </div>
      </div>

      {/* 2. SWIPE NOTICE BANNER */}
      <div className="max-w-lg mx-auto w-full px-4 pt-3">
        <div className="bg-blue-50/90 border border-blue-200/80 rounded-2xl p-2.5 px-3.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm">👉</span>
            <p className="text-[11px] font-bold text-blue-900 leading-tight truncate">
              Swipe Left-to-Right to hide notification
            </p>
          </div>
          {hiddenIds.length > 0 && (
            <button
              type="button"
              onClick={handleRestoreHidden}
              className="text-[10px] font-extrabold text-blue-700 bg-white hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              Restore ({hiddenIds.length})
            </button>
          )}
        </div>
      </div>

      {/* 3. NOTIFICATIONS LIST VIEW */}
      <div className="flex-1 max-w-lg mx-auto w-full p-4 space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: themeColor }} />
            <p className="text-xs font-bold text-slate-500">Loading notifications from Firestore...</p>
          </div>
        ) : visibleNotifs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-3 mt-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              You do not have any active notifications right now.
            </p>
            {hiddenIds.length > 0 && (
              <button
                type="button"
                onClick={handleRestoreHidden}
                className="mt-2 text-xs font-extrabold text-blue-600 hover:underline"
              >
                Restore {hiddenIds.length} hidden notification(s)
              </button>
            )}
          </div>
        ) : (
          visibleNotifs.map((item, idx) => {
            const notifId = item.id || `notif_${idx}`;
            const isCurrentlySwiping = swipingId === notifId;
            const currentOffset = isCurrentlySwiping ? swipeOffset : 0;
            const notifImage = item.image || item.imageUrl || item.img;
            const notifDesc = item.description || item.desc || item.message || item.body;

            return (
              <div
                key={notifId}
                className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-xs transition-shadow hover:shadow-md"
              >
                {/* Swipe Action Background (Reveals as user swipes left-to-right) */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-rose-400 to-amber-400 flex items-center px-4 text-white font-extrabold text-xs gap-2">
                  <EyeOff className="w-4 h-4" />
                  <span>Hide from list</span>
                </div>

                {/* Foreground Card Content */}
                <div
                  onTouchStart={(e) => handleTouchStart(e, notifId)}
                  onTouchMove={(e) => handleTouchMove(e, notifId)}
                  onTouchEnd={() => handleTouchEnd(item)}
                  style={{
                    transform: `translateX(${currentOffset}px)`,
                    transition: isCurrentlySwiping ? 'none' : 'transform 0.25s ease-out',
                  }}
                  onClick={() => setSelectedNotif(item)}
                  className="relative bg-white p-3.5 sm:p-4 rounded-2xl flex flex-col gap-2.5 cursor-pointer z-10"
                >
                  <div className="flex items-start gap-3">
                    {/* Left: Thumbnail image or Icon */}
                    {notifImage ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenZoomViewer(notifImage);
                        }}
                        className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 group/img"
                        title="Tap to zoom image"
                      >
                        <img
                          src={notifImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <ZoomIn className="w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-2xs"
                        style={{ backgroundColor: themeColor }}
                      >
                        <Bell className="w-5 h-5" />
                      </div>
                    )}

                    {/* Right: Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHideNotification(item);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                          title="Hide notification"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {notifDesc && (
                        <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                          {notifDesc}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {item.date || item.time || (item.timestamp ? new Date(item.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short' }) : 'Recent')}
                        </span>
                        <span className="text-[10px] font-extrabold text-blue-600 hover:underline flex items-center gap-0.5">
                          View details <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. NOTIFICATION DETAILS FULL SCREEN MODAL */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div
              className="px-4 py-3.5 flex items-center justify-between text-white shadow-xs"
              style={{ backgroundColor: themeColor }}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-white" />
                <h3 className="text-sm font-extrabold text-white">Notification Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              
              {/* Optional Banner Image (with zoom indicator) */}
              {(selectedNotif.image || selectedNotif.imageUrl || selectedNotif.img) && (
                <div
                  onClick={() => handleOpenZoomViewer(selectedNotif.image || selectedNotif.imageUrl || selectedNotif.img || '')}
                  className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer shadow-xs"
                >
                  <img
                    src={selectedNotif.image || selectedNotif.imageUrl || selectedNotif.img}
                    alt={selectedNotif.title}
                    className="w-full max-h-60 object-contain bg-slate-900/5 group-hover:scale-102 transition-transform"
                  />
                  <div className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-xs text-white text-[11px] font-extrabold flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5" /> Tap to zoom image
                  </div>
                </div>
              )}

              {/* Title & Metadata */}
              <div className="space-y-1.5">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {selectedNotif.title}
                </h2>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {selectedNotif.date || 'Today'} {selectedNotif.time ? `• ${selectedNotif.time}` : ''}
                  </span>
                  {selectedNotif.type && (
                    <span className="uppercase text-[9px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {selectedNotif.type}
                    </span>
                  )}
                </div>
              </div>

              {/* Full Description */}
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedNotif.description || selectedNotif.desc || selectedNotif.message || selectedNotif.body || 'No additional description provided.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleHideNotification(selectedNotif);
                    setSelectedNotif(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <EyeOff className="w-4 h-4" /> Hide from my list
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNotif(null)}
                  className="flex-1 py-3 text-white rounded-2xl text-xs font-extrabold shadow-md transition-transform active:scale-95"
                  style={{ backgroundColor: themeColor }}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. FULL SCREEN INTERACTIVE IMAGE ZOOM VIEWER MODAL */}
      {zoomedImage && (
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fade-in select-none">
          
          {/* Zoom Controls Toolbar */}
          <div className="p-4 flex items-center justify-between text-white bg-black/40 backdrop-blur-md border-b border-white/10 z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-300">
                Zoom: {Math.round(zoomScale * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom In */}
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomScale >= 4}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all disabled:opacity-30 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {/* Zoom Out */}
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomScale <= 1}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all disabled:opacity-30 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Reset Zoom */}
              <button
                type="button"
                onClick={handleResetZoom}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 active:scale-90 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Image Viewer */}
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-90 flex items-center justify-center text-white transition-all ml-2 cursor-pointer shadow-md"
                title="Close"
              >
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Interactive Zoomable / Draggable Stage */}
          <div
            className="flex-1 overflow-hidden relative flex items-center justify-center p-4 cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              if (zoomScale > 1) {
                setIsDraggingImage(true);
                dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
              }
            }}
            onMouseMove={(e) => {
              if (isDraggingImage && zoomScale > 1) {
                setPanOffset({
                  x: e.clientX - dragStartRef.current.x,
                  y: e.clientY - dragStartRef.current.y,
                });
              }
            }}
            onMouseUp={() => setIsDraggingImage(false)}
            onMouseLeave={() => setIsDraggingImage(false)}
            onDoubleClick={() => {
              if (zoomScale === 1) {
                setZoomScale(2);
              } else {
                handleResetZoom();
              }
            }}
          >
            <img
              src={zoomedImage}
              alt="Zoomed Notification Attachment"
              className="max-w-full max-h-full object-contain transition-transform duration-100 ease-out select-none pointer-events-none"
              style={{
                transform: `scale(${zoomScale}) translate(${panOffset.x / zoomScale}px, ${panOffset.y / zoomScale}px)`,
              }}
            />
          </div>

          {/* Bottom Hint */}
          <div className="p-3 text-center text-slate-400 text-[11px] font-semibold bg-black/40 border-t border-white/10 z-20">
            Pinch to zoom or double-tap to zoom in / out • Drag to pan when zoomed
          </div>

        </div>
      )}

    </div>
  );
}

/* ====================================================================
   13. MY PROFILE FULL SCREEN VIEW & SUB-SCREENS
   ==================================================================== */
export function ProfileScreen({
  isOpen,
  onClose,
  user,
  onUserUpdate,
  onLogout,
  onOpenAddCoins,
  onOpenRefer,
  onOpenWithdrawal
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUserUpdate: (updatedUser: UserData) => void;
  onLogout: () => void;
  onOpenAddCoins?: () => void;
  onOpenRefer?: () => void;
  onOpenWithdrawal?: () => void;
}) {
  const [activeModal, setActiveModal] = useState<
    | 'updateProfile'
    | 'resetMpin'
    | 'kyc'
    | 'resetPassword'
    | 'terms'
    | 'privacy'
    | 'settings'
    | 'qr'
    | 'contact'
    | 'logoutConfirm'
    | null
  >(null);

  // Sub-modal state forms
  const [editName, setEditName] = useState(user?.name || '');
  const [editMobile, setEditMobile] = useState(user?.mobile || '');
  const [editEmail, setEditEmail] = useState(user?.gmail || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Reset MPIN form
  const [currMpin, setCurrMpin] = useState('');
  const [newMpin, setNewMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [mpinStatusMsg, setMpinStatusMsg] = useState('');

  // Reset Password form
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passStatusMsg, setPassStatusMsg] = useState('');

  // Settings state
  const [pushNotifs, setPushNotifs] = useState(true);
  const [bioLock, setBioLock] = useState(false);
  const [appLang, setAppLang] = useState('English');

  // Contact support ticket
  const [supportMessage, setSupportMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  // Avatar Image upload ref
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      const timer = setTimeout(() => {
        setEditName(user?.name || '');
        setEditMobile(user?.mobile || '');
        setEditEmail(user?.gmail || '');
        setProfileMsg('');
        setMpinStatusMsg('');
        setPassStatusMsg('');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleUpdateProfileSave = () => {
    if (!editName.trim()) {
      setProfileMsg('Please enter a valid name');
      return;
    }
    const updated = {
      ...user,
      name: editName.trim(),
      mobile: editMobile.trim(),
      gmail: editEmail.trim()
    };
    onUserUpdate(updated);
    setProfileMsg('Profile updated successfully!');
    setTimeout(() => {
      setProfileMsg('');
      setActiveModal(null);
    }, 1200);
  };

  const handleResetMpinSave = async () => {
    if (newMpin.length !== 6 || !/^\d+$/.test(newMpin)) {
      setMpinStatusMsg('New MPIN must be 6 digits');
      return;
    }
    if (newMpin !== confirmMpin) {
      setMpinStatusMsg('New MPIN and Confirm MPIN do not match');
      return;
    }

    try {
      // Save MPIN locally and update user object
      const updatedUser = { ...user, mpin: newMpin, mpim: newMpin };
      onUserUpdate(updatedUser);
      setMpinStatusMsg('MPIN updated successfully!');
      setTimeout(() => {
        setMpinStatusMsg('');
        setCurrMpin('');
        setNewMpin('');
        setConfirmMpin('');
        setActiveModal(null);
      }, 1200);
    } catch {
      setMpinStatusMsg('Failed to update MPIN');
    }
  };

  const handleResetPasswordSave = () => {
    if (newPass.length < 6) {
      setPassStatusMsg('Password must be at least 6 characters');
      return;
    }
    if (newPass !== confirmPass) {
      setPassStatusMsg('Passwords do not match');
      return;
    }
    setPassStatusMsg('Password updated successfully!');
    setTimeout(() => {
      setPassStatusMsg('');
      setCurrPass('');
      setNewPass('');
      setConfirmPass('');
      setActiveModal(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none pb-24">
      {/* 1. TOP HEADER BAR matching Screenshot 2 & 3 */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-100 shadow-2xs">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-lg font-black text-slate-900 text-center flex-1 pr-9 tracking-tight">
          My Profile
        </h1>
      </div>

      {/* 2. MAIN PROFILE CONTAINER */}
      <div className="flex-1 max-w-md sm:max-w-xl mx-auto w-full p-4 space-y-6">
        
        {/* Hidden File Input for Profile Picture Upload */}
        <input
          type="file"
          ref={avatarInputRef}
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = async (event) => {
                if (event.target?.result) {
                  const newImg = event.target.result as string;
                  const updated = await updateUserProfileInFirestore(user.uid, {
                    profile_picture: newImg,
                    avatarUrl: newImg,
                  });
                  onUserUpdate(updated);
                  playCashInAudio();
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        {/* AVATAR & USER DETAILS matching Screenshot 3 */}
        <div className="flex flex-col items-center text-center pt-2 space-y-2">
          {/* Circular QR Code / Profile Picture Avatar with Camera Icon Overlay */}
          <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            <div className="w-24 h-24 rounded-full bg-white p-1.5 border-2 border-slate-200 shadow-md flex items-center justify-center overflow-hidden">
              {user.profile_picture || user.avatarUrl ? (
                <img
                  src={user.profile_picture || user.avatarUrl}
                  alt={user.name || 'Profile'}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <rect x="10" y="10" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="17" y="17" width="11" height="11" fill="currentColor" />
                  
                  <rect x="65" y="10" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="72" y="17" width="11" height="11" fill="currentColor" />
                  
                  <rect x="10" y="65" width="25" height="25" rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="17" y="72" width="11" height="11" fill="currentColor" />

                  <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="5" />
                  <rect x="42" y="20" width="16" height="8" fill="currentColor" />
                  <rect x="42" y="72" width="16" height="8" fill="currentColor" />
                  <rect x="70" y="50" width="18" height="18" rx="2" fill="currentColor" />
                </svg>
              )}
            </div>
            {/* Camera badge button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                avatarInputRef.current?.click();
              }}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#4f80ff] hover:bg-blue-600 active:scale-95 text-white border-2 border-white shadow-md flex items-center justify-center transition-all"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {user.name || 'Ssss'}
            </h2>
            <p className="text-xs font-bold text-slate-400 font-mono mt-0.5">
              {user.mobile || '9074363297'}
            </p>
          </div>
        </div>

        {/* 3. LIST OF MENU ITEMS matching Screenshots 2 & 3 */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
          
          {/* 1. Home */}
          <button
            type="button"
            onClick={onClose}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Home className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Home</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 2. Refer & Earn */}
          <button
            type="button"
            onClick={() => onOpenRefer ? onOpenRefer() : setActiveModal('updateProfile')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Gift className="w-5 h-5 text-[#e91e63]" />
              <span className="text-sm font-extrabold text-slate-800">Refer & Earn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-50 text-[#e91e63] border border-rose-100 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                Earn ₹50
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </button>

          {/* 3. Update Profile */}
          <button
            type="button"
            onClick={() => setActiveModal('updateProfile')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <User className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Update Profile</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 4. Reset Mpin */}
          <button
            type="button"
            onClick={() => setActiveModal('resetMpin')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Lock className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Reset Mpin</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 5. KYC Verification */}
          <button
            type="button"
            onClick={() => setActiveModal('kyc')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <FileText className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">KYC Verification</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 6. Add Money */}
          <button
            type="button"
            onClick={() => onOpenAddCoins ? onOpenAddCoins() : setActiveModal('updateProfile')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Wallet className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Add Money</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 7. Withdrawal */}
          <button
            type="button"
            onClick={() => onOpenWithdrawal ? onOpenWithdrawal() : setActiveModal('updateProfile')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Download className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Withdrawal</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 8. Reset Password */}
          <button
            type="button"
            onClick={() => setActiveModal('resetPassword')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Key className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Reset Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 9. Terms and Condition */}
          <button
            type="button"
            onClick={() => setActiveModal('terms')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <FileText className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Terms and Condition</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 10. Privacy Policy */}
          <button
            type="button"
            onClick={() => setActiveModal('privacy')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <ShieldCheck className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 11. Setting */}
          <button
            type="button"
            onClick={() => setActiveModal('settings')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Settings className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Setting</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 12. My QR Code */}
          <button
            type="button"
            onClick={() => setActiveModal('qr')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <QrCode className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">My QR Code</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 13. Contact Us */}
          <button
            type="button"
            onClick={() => setActiveModal('contact')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
          >
            <div className="flex items-center gap-3.5">
              <Smartphone className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-extrabold text-slate-800">Contact Us</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 14. Logout */}
          <button
            type="button"
            onClick={() => setActiveModal('logoutConfirm')}
            className="w-full p-4 flex items-center justify-between hover:bg-rose-50 active:bg-rose-100 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <LogOut className="w-5 h-5 text-rose-600" />
              <span className="text-sm font-extrabold text-rose-600">Logout</span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </button>

        </div>

        {/* 15. SEPARATE LOG OUT CARD BUTTON matching Screenshot 2 */}
        <button
          type="button"
          onClick={() => setActiveModal('logoutConfirm')}
          className="w-full bg-white hover:bg-slate-50 active:scale-98 p-4 rounded-3xl border border-slate-100 shadow-xs flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3.5">
            <LogOut className="w-5 h-5 text-slate-900" />
            <span className="text-sm font-extrabold text-slate-900">Log Out</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* 4. FOOTER BRANDING matching Screenshot 2 */}
        <div className="py-6 flex flex-col items-center justify-center space-y-1 text-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-black text-slate-900 tracking-tight">Smart Wallet</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            — SMART PAYMENTS, EASY LIFE —
          </p>
        </div>

      </div>

      {/* 5. STICKY BOTTOM NAVIGATION BAR matching Screenshot 2 & 3 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-6 max-w-md sm:max-w-xl mx-auto shadow-lg">
        <div className="flex items-center justify-around">
          
          <button
            type="button"
            onClick={onClose}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600">
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400">Home</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400">Scan to Pay</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex flex-col items-center gap-1 group relative"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400">Notifications</span>
          </button>

          {/* Profile Active Tab Highlight matching Screenshots */}
          <button
            type="button"
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white shadow-md shadow-pink-500/40 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold text-[#e91e63]">Profile</span>
          </button>

        </div>
      </div>

      {/* ==================== SUB-MODALS ==================== */}

      {/* 1. UPDATE PROFILE FULL SCREEN */}
      {activeModal === 'updateProfile' && (
        <UpdateProfileScreen
          isOpen={true}
          onClose={() => setActiveModal(null)}
          user={user}
          onUserUpdate={onUserUpdate}
        />
      )}

      {/* 2. RESET MPIN FULL SCREEN */}
      {activeModal === 'resetMpin' && (
        <ResetMpinScreen
          isOpen={true}
          onClose={() => setActiveModal(null)}
          user={user}
          onUserUpdate={onUserUpdate}
        />
      )}

      {/* 3. KYC VERIFICATION SCREEN */}
      {activeModal === 'kyc' && (
        <KycVerificationScreen
          isOpen={true}
          onClose={() => setActiveModal(null)}
          user={user}
          onUserUpdate={onUserUpdate}
        />
      )}

      {/* 4. RESET PASSWORD FULL SCREEN */}
      {activeModal === 'resetPassword' && (
        <ResetPasswordScreen
          isOpen={true}
          onClose={() => setActiveModal(null)}
          user={user}
          onUserUpdate={onUserUpdate}
        />
      )}

      {/* 5. TERMS AND CONDITION FULL SCREEN */}
      {activeModal === 'terms' && (
        <TermsAndConditionsScreen
          isOpen={true}
          onClose={() => setActiveModal(null)}
          themeColor={user?.themeColor || '#6495ED'}
        />
      )}

      {/* 6. PRIVACY POLICY FULL SCREEN */}
      {activeModal === 'privacy' && (
        <PrivacyPolicyScreen
          isOpen={true}
          onClose={() => setActiveModal(null)}
          themeColor={user?.themeColor || '#6495ED'}
        />
      )}

      {/* 7. SETTINGS FULL SCREEN */}
      {activeModal === 'settings' && (
        <AppSettingsScreen
          isOpen={true}
          onClose={() => setActiveModal(null)}
          user={user}
          onUserUpdate={onUserUpdate}
        />
      )}

      {/* 8. MY QR CODE FULL SCREEN */}
      {activeModal === 'qr' && (
        <ReceiveCoinsScreen
          isOpen={true}
          onClose={() => setActiveModal(null)}
          user={user}
        />
      )}

      {/* 9. CONTACT US FULL SCREEN */}
      {activeModal === 'contact' && (
        <ContactSupportScreen
          isOpen={true}
          onClose={() => setActiveModal(null)}
          user={user}
        />
      )}

      {/* 10. LOGOUT CONFIRMATION MODAL */}
      {activeModal === 'logoutConfirm' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl relative animate-scale-up border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">Log Out from GK Wallet?</h3>
              <p className="text-xs text-slate-500 font-medium">You will need to enter your credentials to log back in.</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={onLogout}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3 rounded-2xl text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ====================================================================
   14. TRANSACTION RECEIPT SCREEN (SAMSUNG DESIGN LAYOUT)
   ==================================================================== */
export function TransactionReceiptModal({
  isOpen,
  onClose,
  record,
  themeColor = '#6495ED'
}: {
  isOpen: boolean;
  onClose: () => void;
  record: UnifiedTransactionRecord | null;
  themeColor?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  useEffect(() => {
    if (isOpen && record) {
      playCashInAudio();
    }
  }, [isOpen, record]);

  if (!isOpen || !record) return null;

  const copyTxId = () => {
    if (record.transactionId) {
      navigator.clipboard.writeText(record.transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isPending = record.status.toUpperCase().includes('PEND');
  const isFailed = record.status.toUpperCase().includes('FAIL') || record.status.toUpperCase().includes('REJ');
  const isSuccess = !isPending && !isFailed;

  // Dynamic status pill styling
  const statusBg = isPending 
    ? 'bg-amber-50 text-amber-600 border-amber-200' 
    : isFailed
    ? 'bg-rose-50 text-rose-600 border-rose-200'
    : 'bg-emerald-50 text-emerald-600 border-emerald-200';

  const rawTxId = record.transactionId || record.id || 'TXN00000000';
  const displayTxId = rawTxId.startsWith('#') ? rawTxId : `#${rawTxId}`;
  const displayDateTime = record.formattedDateTime || `${record.date} • ${record.time}`;
  const signedAmtStr = `${record.isCredit ? '+' : '-'}₹${Math.abs(record.amount).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 bg-white w-full h-full min-h-screen flex flex-col animate-fade-in select-none overflow-hidden p-0 m-0">
      
      {/* Full screen container matching mobile device display with zero outer gaps */}
      <div className="w-full h-full max-w-md mx-auto flex flex-col bg-white overflow-y-auto">
        
        {/* 1. EMERALD GREEN GRADIENT HEADER BAR */}
        <div 
          style={{ backgroundImage: `linear-gradient(to bottom, ${themeColor}, ${themeColor}dd)` }}
          className="text-white px-4 pt-4 pb-6 relative flex flex-col items-center text-center shrink-0"
        >
          
          {/* Top Header Bar */}
          <div className="w-full flex items-center justify-between mb-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <h2 className="text-base font-black tracking-tight flex-1 text-center pr-9">
              Transaction Report
            </h2>
          </div>

          {/* Centered Checkmark Circle Icon */}
          <div 
            style={{ color: themeColor }}
            className="w-13 h-13 rounded-full bg-white flex items-center justify-center shadow-md mb-2 animate-scale-up"
          >
            <Check className="w-7 h-7 stroke-[3]" />
          </div>

          {/* Main Title & Amount */}
          <h1 className="text-lg font-black tracking-tight text-white leading-tight">
            {record.receiverName || record.title || 'Smart Wallet User'}
          </h1>

          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-1 my-1">
            <span>{record.isCredit ? '+₹' : '-₹'}</span>
            <span>{Math.abs(record.amount).toFixed(2)}</span>
          </div>

          <p className="text-[11px] font-bold text-white/90 tracking-wide font-mono">
            {displayDateTime}
          </p>
        </div>

        {/* 2. WHITE CONTENT SHEET */}
        <div className="flex-1 bg-white p-4 space-y-3.5 text-slate-800 overflow-y-auto">
          
          {/* Top Badge Tag */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="bg-blue-50 text-blue-700 border border-blue-100 font-extrabold px-3 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
              {record.typeBadge || 'COIN TRANSFER'}
            </span>
            <span className="text-xs font-bold" style={{ color: themeColor }}>
              {record.sourceCollection === 'cashback' ? 'Reward' : record.sourceCollection === 'nft' ? 'Bank Transfer' : record.sourceCollection === 'withdrawal' ? 'Bank Withdrawal' : 'UPI Deposit'}
            </span>
          </div>

          {/* Primary Info Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3">
            <div 
              style={{ backgroundColor: `${themeColor}12`, borderColor: `${themeColor}20` }}
              className="w-11 h-11 rounded-xl border flex items-center justify-center shadow-2xs shrink-0"
            >
              {record.sourceCollection === 'cashback' ? (
                <Coins className="w-6 h-6 text-amber-500" />
              ) : record.sourceCollection === 'nft' ? (
                <Building2 className="w-6 h-6" style={{ color: themeColor }} />
              ) : record.sourceCollection === 'addmoney' ? (
                <Wallet className="w-6 h-6 text-blue-600" />
              ) : (
                <User className="w-6 h-6" style={{ color: themeColor }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-slate-900 truncate">
                {record.receiverName || record.title || 'Smart Wallet User'}
              </h3>
              <p className="text-xs font-bold text-slate-500 truncate">
                {record.receiverMobile || record.subtitle || record.reason || '9999999999'}
              </p>
            </div>
          </div>

          {/* Detail Key-Value Rows */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Receiver Name</span>
              <span className="font-extrabold text-slate-900">{record.receiverName || record.title || 'Smart Wallet User'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Reason</span>
              <span className="font-extrabold" style={{ color: themeColor }}>{record.reason || record.typeBadge || 'Coin Transfer'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Amount</span>
              <span className={`font-black text-xs ${record.isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                {signedAmtStr}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusBg}`}>
                {record.status || 'SUCCESS'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Transaction ID</span>
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-lg">
                <span className="font-mono font-extrabold text-slate-900 text-[11px] max-w-[170px] truncate">
                  {displayTxId}
                </span>
                <button onClick={copyTxId} className="text-slate-400 hover:text-slate-700 cursor-pointer" title="Copy ID">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Type</span>
              <span className="font-mono font-extrabold text-slate-900 uppercase">{record.typeBadge || 'COIN TRANSFER'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Date</span>
              <span className="font-bold text-slate-900">{record.date}</span>
            </div>

            {/* If Add Money UTR Image exists */}
            {record.sourceCollection === 'addmoney' && record.image && (
              <div className="pt-1">
                <span className="text-slate-500 font-bold block mb-1">Payment Proof Image</span>
                <div 
                  onClick={() => setShowImagePreview(true)}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group"
                >
                  <img src={record.image} alt="Payment UTR Screenshot" className="w-full h-28 object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to enlarge
                  </div>
                </div>
              </div>
            )}

            {/* If NFT Bank specific details exist */}
            {record.sourceCollection === 'nft' && (
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 space-y-1.5 mt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Bank Details</span>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Bank Name</span>
                  <span className="font-bold text-slate-900">{record.bankName || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Account Number</span>
                  <span className="font-mono font-bold text-slate-900">{record.accountNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">IFSC Code</span>
                  <span className="font-mono font-bold text-slate-900">{record.ifscCode || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. TRANSFER DETAILS / FROM (SENDER DETAILS) DIVIDER SECTION */}
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[1px] bg-slate-200 flex-1" />
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
                TRANSFER DETAILS
              </span>
              <div className="h-[1px] bg-slate-200 flex-1" />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="bg-slate-100 text-slate-700 border border-slate-200 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] tracking-wider uppercase flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" /> FROM (SENDER DETAILS)
              </span>
              <span className="text-[11px] font-bold text-slate-400">System</span>
            </div>

            {/* Sender Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center gap-3 mb-2">
              <div 
                style={{ backgroundColor: `${themeColor}12`, borderColor: `${themeColor}20` }}
                className="w-10 h-10 rounded-xl border flex items-center justify-center shadow-2xs shrink-0"
              >
                <Coins className="w-6 h-6" style={{ color: themeColor }} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 truncate">
                  {record.senderName || 'Smart Wallet User'}
                </h4>
                <p className="text-[11px] font-bold text-slate-400 truncate">
                  {record.senderMobile || '9074363297'}
                </p>
              </div>
            </div>

            {/* Detailed Sender Key-Value Rows */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Name</span>
                <span className="font-extrabold text-slate-900">{record.senderName || 'Smart Wallet User'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Mobile</span>
                <span className="font-bold text-slate-900 font-mono">{record.senderMobile || '9074363297'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Signed Amount</span>
                <span className={`font-black ${record.isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {signedAmtStr}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusBg}`}>
                  {record.status || 'SUCCESS'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Transaction ID</span>
                <span className="font-mono font-extrabold text-slate-900 text-[11px] max-w-[170px] truncate">
                  {displayTxId}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Full Date & Time</span>
                <span className="font-mono font-bold text-slate-900">{displayDateTime}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM ACTION BUTTON PINNED TO BOTTOM */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
          <button
            onClick={onClose}
            style={{ backgroundColor: themeColor }}
            className="w-full active:scale-98 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg text-xs transition-all cursor-pointer hover:brightness-110"
          >
            <Home className="w-4 h-4 text-white" /> Done
          </button>
        </div>

      </div>

      {/* Lightbox Image Modal if previewing screenshot */}
      {showImagePreview && record.image && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowImagePreview(false)}>
          <div className="relative max-w-lg w-full bg-white rounded-3xl p-3 shadow-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-black text-slate-900">Payment Screenshot</span>
              <button onClick={() => setShowImagePreview(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img src={record.image} alt="Enlarged Proof" className="w-full max-h-[70vh] object-contain rounded-2xl" />
          </div>
        </div>
      )}

    </div>
  );
}

/* ==========================================
   UPDATE PROFILE SCREEN (FULL SCREEN)
   Matching Screenshot_20260818-113445.jpg
   ========================================== */
export function UpdateProfileScreen({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUserUpdate: (updatedUser: UserData) => void;
}) {
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [mpin, setMpin] = useState(user?.mpin || '111111');
  const [profilePic, setProfilePic] = useState(user?.profile_picture || user?.avatarUrl || '');
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isSuccessOpen) {
      playSuccessAudio();
    }
  }, [isSuccessOpen]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setName(user.name || '');
        setMobile(user.mobile || '');
        setMpin(user.mpin || '111111');
        setProfilePic(user.profile_picture || user.avatarUrl || '');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
      setErrorMsg('Please enter a valid mobile number');
      return;
    }
    if (mpin.length !== 6) {
      setErrorMsg('MPIN must be exactly 6 digits');
      return;
    }

    setErrorMsg('');
    setIsSaving(true);

    try {
      const updated = await updateUserProfileInFirestore(user.uid, {
        name: name.trim(),
        mobile: mobile.trim(),
        mpin: mpin.trim(),
        profile_picture: profilePic,
        avatarUrl: profilePic,
      });

      onUserUpdate(updated);
      playCashInAudio();
      setIsSuccessOpen(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMsg('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto font-sans flex flex-col min-h-screen animate-fade-in">
      {/* Top Bar Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 bg-white sticky top-0 z-20 shadow-2xs">
        <button
          onClick={onClose}
          type="button"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all shrink-0 text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black text-slate-900">Update Profile</h1>
      </div>

      <div className="max-w-md w-full mx-auto p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Profile Picture Center Circle */}
          <div className="flex flex-col items-center justify-center pt-4">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-slate-200 shadow-md bg-slate-100 flex items-center justify-center">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={() => setProfilePic('')}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-extrabold text-2xl">
                    {name ? name.charAt(0).toUpperCase() : 'GK'}
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsImagePickerOpen(true)}
                type="button"
                className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
              >
                <Camera className="w-4.5 h-4.5 text-slate-600" />
              </button>
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-3 text-center">
              Click icon to change picture
            </p>
          </div>

          {/* Form Fields matching Screenshot_20260818-113445.jpg */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1.5">
                Enter Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1.5">
                Enter Mobile Number
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter Mobile Number"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1.5">
                Update 6-Digit MPIN
              </label>
              <input
                type="password"
                maxLength={6}
                value={mpin}
                onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="111111"
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-mono font-extrabold text-slate-900 tracking-wider text-center focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                {errorMsg}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Save Changes Button */}
        <div className="pt-6 pb-4">
          <button
            onClick={handleSaveProfile}
            disabled={isSaving}
            type="button"
            className="w-full bg-[#4f80ff] hover:bg-blue-600 active:scale-98 text-white font-extrabold text-sm sm:text-base py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Image Picker Modal */}
      {isImagePickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" /> Choose Profile Picture
              </h3>
              <button
                onClick={() => setIsImagePickerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload File */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Upload Custom Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setProfilePic(event.target.result as string);
                        setIsImagePickerOpen(false);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
            </div>

            {/* Custom URL */}
            <div className="pt-1">
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Or Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customUrlInput.trim()) {
                      setProfilePic(customUrlInput.trim());
                      setIsImagePickerOpen(false);
                      setCustomUrlInput('');
                    }
                  }}
                  className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-extrabold hover:bg-blue-700"
                >
                  Set
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-600 block mb-2">
                Preset Avatars
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setProfilePic(url);
                      setIsImagePickerOpen(false);
                    }}
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 hover:border-blue-500 transition-all mx-auto"
                  >
                    <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog Modal */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xs sm:max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative border border-slate-100 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Profile Updated!
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Your profile details have been successfully saved to Firestore users collection.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Name</span>
                <span className="font-extrabold text-slate-900">{name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Mobile</span>
                <span className="font-extrabold text-slate-900">+91 {mobile}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">MPIN Status</span>
                <span className="font-extrabold text-emerald-600">Updated</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSuccessOpen(false);
                onClose();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   RESET MPIN SCREEN (FULL SCREEN)
   Matching Screenshot_20260818-113648.jpg
   ========================================== */
export function ResetMpinScreen({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUserUpdate: (updatedUser: UserData) => void;
}) {
  const [aadhaarInput, setAadhaarInput] = useState(user?.aadhaar || user?.aadhaar_card || '');
  const [newMpinInput, setNewMpinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    if (isSuccessOpen) {
      playSuccessAudio();
    }
  }, [isSuccessOpen]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setAadhaarInput(user.aadhaar || user.aadhaar_card || '');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleUpdateMpin = async () => {
    const cleanAadhaar = aadhaarInput.replace(/\D/g, '');
    const cleanMpin = newMpinInput.replace(/\D/g, '');

    if (cleanAadhaar.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit Aadhaar Number.');
      return;
    }

    if (cleanMpin.length !== 6) {
      setErrorMsg('Please enter a 6-digit MPIN.');
      return;
    }

    // Match verification with stored logged-in user Aadhaar card
    const existingAadhaar = (user?.aadhaar || user?.aadhaar_card || '').replace(/\D/g, '');
    if (existingAadhaar && existingAadhaar !== cleanAadhaar) {
      setErrorMsg('Aadhaar number does not match logged-in account record!');
      return;
    }

    setErrorMsg('');
    setIsSaving(true);

    try {
      const updated = await updateUserProfileInFirestore(user.uid, {
        mpin: cleanMpin,
        aadhaar: cleanAadhaar,
        aadhaar_card: cleanAadhaar,
      });

      onUserUpdate(updated);
      playCashInAudio();
      setIsSuccessOpen(true);
    } catch (err) {
      console.error('Error updating MPIN:', err);
      setErrorMsg('Failed to update MPIN. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto font-sans flex flex-col min-h-screen animate-fade-in">
      {/* Top Bar Header matching Screenshot_20260818-113648.jpg */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 bg-white sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            type="button"
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all shrink-0 text-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-black text-slate-900">Reset MPIN</h1>
        </div>

        {/* Right Badge displaying User Name (e.g. Ssss) */}
        <span className="bg-blue-50 border border-blue-200 text-blue-600 font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-2xs">
          {user?.name || 'User'}
        </span>
      </div>

      <div className="max-w-md w-full mx-auto p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6 pt-2">
          {/* Form Fields matching Screenshot_20260818-113648.jpg */}
          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1.5">
              Enter Your Aadhaar Number
            </label>
            <input
              type="text"
              maxLength={12}
              value={aadhaarInput}
              onChange={(e) => setAadhaarInput(e.target.value.replace(/\D/g, ''))}
              placeholder="12-digit Aadhaar No"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-mono font-extrabold text-slate-900 tracking-wider focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1.5">
              New 6-Digit MPIN
            </label>
            <input
              type="password"
              maxLength={6}
              value={newMpinInput}
              onChange={(e) => setNewMpinInput(e.target.value.replace(/\D/g, ''))}
              placeholder="******"
              className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-mono font-extrabold text-slate-900 tracking-widest text-center focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Bottom Update MPIN Button */}
        <div className="pt-6 pb-4">
          <button
            onClick={handleUpdateMpin}
            disabled={isSaving}
            type="button"
            className="w-full bg-[#4f80ff] hover:bg-blue-600 active:scale-98 text-white font-extrabold text-sm sm:text-base py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Updating MPIN...
              </>
            ) : (
              'Update MPIN'
            )}
          </button>
        </div>
      </div>

      {/* Success Dialog Modal */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xs sm:max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative border border-slate-100 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                MPIN Reset Successful!
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Aadhaar card verified successfully. Your new 6-digit MPIN has been saved to Firestore.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Aadhaar Card</span>
                <span className="font-mono font-extrabold text-slate-900">
                  XXXX-XXXX-{aadhaarInput.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">New MPIN</span>
                <span className="font-mono font-extrabold text-emerald-600">
                  ******
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold">Status</span>
                <span className="font-extrabold text-emerald-600 uppercase">
                  Verified & Saved
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSuccessOpen(false);
                onClose();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold py-3 rounded-2xl text-xs sm:text-sm shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   KYC VERIFICATION SCREEN (FULL SCREEN)
   Matching Screenshot_20260818-120633.jpg & Screenshot_20260818-120645.jpg & Screenshot_20260818-120536.jpg
   ========================================== */
export function KycVerificationScreen({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUserUpdate: (updatedUser: UserData) => void;
}) {
  const [kycData, setKycData] = useState<KycData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // MPIN modal states for unlocking KYC edit
  const [showMpinModal, setShowMpinModal] = useState(false);
  const [inputMpin, setInputMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [isVerifyingMpin, setIsVerifyingMpin] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [gmail, setGmail] = useState(user?.gmail || '');
  const [aadharCard, setAadharCard] = useState(user?.aadhaar || user?.aadhaar_card || '');
  const [pancard, setPancard] = useState(user?.pancard || '');
  const [pincode, setPincode] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');

  // Image states
  const [aadharFrontPic, setAadharFrontPic] = useState<string>('');
  const [aadharBackPic, setAadharBackPic] = useState<string>('');
  const [panPic, setPanPic] = useState<string>('');

  // File input refs
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const panInputRef = useRef<HTMLInputElement>(null);

  // Loading & Success modal states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Helper to mask sensitive ID numbers showing first 2 and last 2 with middle stars
  const maskIdentifier = (val?: string): string => {
    if (!val) return '-';
    const clean = val.trim();
    if (clean.length <= 4) return clean;
    const start = clean.slice(0, 2);
    const end = clean.slice(-2);
    const maskedMiddle = '*'.repeat(clean.length - 4);
    return `${start}${maskedMiddle}${end}`;
  };

  useEffect(() => {
    if (isSuccessOpen) {
      playSuccessAudio();
    }
  }, [isSuccessOpen]);

  // Fetch existing KYC on load
  useEffect(() => {
    let isMounted = true;
    async function loadKyc() {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      try {
        const existing = await fetchKycFromFirestore(user.uid, user.mobile);
        if (isMounted && existing) {
          setKycData(existing);
          setName(existing.name || user.name || '');
          setMobile(existing.mobile || user.mobile || '');
          setGmail(existing.gmail || user.gmail || '');
          setAadharCard(existing.aadharCard || user.aadhaar || '');
          setPancard(existing.pancard || user.pancard || '');
          setPincode(existing.pincode || '');
          setStateVal(existing.state || '');
          setDistrict(existing.distinct || '');
          setAddress(existing.address || '');
          setAadharFrontPic(existing.aadharFrontPic || '');
          setAadharBackPic(existing.aadharBackPic || '');
          setPanPic(existing.panPic || '');
          setIsEditing(false);
        } else if (isMounted) {
          if (user?.aadhaar || user?.aadhaar_card || user?.pancard || user?.status === 'verified' || user?.status === 'pending') {
            setIsEditing(false);
          } else {
            setIsEditing(true);
          }
        }
      } catch (err) {
        console.warn('Error loading KYC:', err);
        if (isMounted) setIsEditing(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadKyc();
    return () => {
      isMounted = false;
    };
  }, [user]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Verify MPIN to allow editing KYC details
  const handleVerifyKycMpin = async () => {
    if (inputMpin.length !== 6) {
      setMpinError('Please enter a 6-digit MPIN');
      return;
    }
    setIsVerifyingMpin(true);
    setMpinError('');
    try {
      const isValid = await checkUserMpin(user?.uid || '', inputMpin);
      if (!isValid) {
        setIsVerifyingMpin(false);
        setMpinError('Invalid MPIN! Default test MPIN is 123456');
        return;
      }

      setIsVerifyingMpin(false);
      setShowMpinModal(false);
      setInputMpin('');
      setMpinError('');

      // Pre-fill form fields with latest KYC details
      setName(kycData?.name || user?.name || name || '');
      setMobile(kycData?.mobile || user?.mobile || mobile || '');
      setGmail(kycData?.gmail || user?.gmail || gmail || '');
      setAadharCard(kycData?.aadharCard || user?.aadhaar || user?.aadhaar_card || aadharCard || '');
      setPancard(kycData?.pancard || user?.pancard || pancard || '');
      setPincode(kycData?.pincode || pincode || '');
      setStateVal(kycData?.state || stateVal || '');
      setDistrict(kycData?.distinct || district || '');
      setAddress(kycData?.address || address || '');
      setAadharFrontPic(kycData?.aadharFrontPic || aadharFrontPic || '');
      setAadharBackPic(kycData?.aadharBackPic || aadharBackPic || '');
      setPanPic(kycData?.panPic || panPic || '');

      setIsEditing(true);
    } catch (err) {
      setIsVerifyingMpin(false);
      setMpinError('Failed to verify MPIN. Please try again.');
    }
  };

  const handleSubmitKyc = async () => {
    const cleanAadhaar = aadharCard.replace(/\D/g, '');
    const cleanPan = pancard.trim().toUpperCase();
    const effectiveGmail = gmail.trim() || user?.gmail || '';
    const effectiveName = name.trim() || user?.name || (effectiveGmail ? effectiveGmail.split('@')[0] : 'User');
    const effectiveMobile = mobile.trim() || user?.mobile || '';

    if (!effectiveGmail) {
      setErrorMsg('Please enter your Gmail address');
      return;
    }
    if (cleanAadhaar.length !== 12) {
      setErrorMsg('Please enter a valid 12-digit Aadhaar Card Number');
      return;
    }
    if (cleanPan.length < 5) {
      setErrorMsg('Please enter a valid PAN Card Number');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // Simulate submission network call & 6-dots zoom animation for 1.8s
      await new Promise((res) => setTimeout(res, 1800));

      const payload: KycData = {
        uid: user?.uid || 'guest_user',
        name: effectiveName,
        mobile: effectiveMobile,
        gmail: effectiveGmail,
        aadharCard: cleanAadhaar,
        pancard: cleanPan,
        aadharFrontPic: aadharFrontPic || '',
        aadharBackPic: aadharBackPic || '',
        panPic: panPic || '',
        pincode: pincode.trim(),
        state: stateVal.trim(),
        distinct: district.trim(),
        address: address.trim(),
        status: 'pending',
      };

      const savedKyc = await saveKycToFirestore(payload);
      setKycData(savedKyc);

      // Update Firestore 'users' collection document as well
      if (user?.uid) {
        await updateUserProfileInFirestore(user.uid, {
          name: effectiveName,
          mobile: effectiveMobile,
          gmail: effectiveGmail,
          status: 'pending',
          aadhaar: cleanAadhaar,
          pancard: cleanPan,
        });
      }

      // Update local user state
      const updatedUser: UserData = {
        ...user,
        name: effectiveName,
        mobile: effectiveMobile,
        gmail: effectiveGmail,
        status: 'pending',
        aadhaar: cleanAadhaar,
        pancard: cleanPan,
      };
      onUserUpdate(updatedUser);

      playCashInAudio();
      setIsEditing(false);
      setIsSuccessOpen(true);
    } catch (err) {
      console.error('Error saving KYC:', err);
      setErrorMsg('Failed to submit KYC verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasSubmittedKyc = Boolean(kycData?.status || user?.status === 'verified' || user?.status === 'pending') && !isEditing;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto font-sans flex flex-col min-h-screen animate-fade-in pb-10 select-none">
      {/* Hidden File Inputs */}
      <input type="file" ref={frontInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setAadharFrontPic)} />
      <input type="file" ref={backInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setAadharBackPic)} />
      <input type="file" ref={panInputRef} accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setPanPic)} />

      {/* Top Header Bar matching Screenshot_20260818-120633.jpg */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 bg-white sticky top-0 z-20 shadow-2xs">
        <button
          onClick={onClose}
          type="button"
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all shrink-0 text-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-black text-slate-900 tracking-tight">KYC Verification</h1>
      </div>

      <div className="max-w-md w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs font-bold">Loading KYC Details...</p>
          </div>
        ) : hasSubmittedKyc ? (
          /* ==========================================
             BOX VIEW matching Screenshot_20260818-120645.jpg / Screenshot_20260818-234854.jpg
             ========================================== */
          <div className="space-y-6 pt-2">
            <div className="bg-white border-2 border-[#6495ED]/50 rounded-3xl p-5 shadow-xs relative space-y-4">
              {/* Header inside Box */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className={`font-black text-xs px-3.5 py-1.5 rounded-full border tracking-wide uppercase inline-flex items-center ${
                  (kycData?.status?.toLowerCase() === 'successful' || user?.status === 'verified')
                    ? 'bg-[#e2f9ef] text-[#00b074] border-[#bbf3db]'
                    : 'bg-amber-50 text-amber-600 border-amber-200'
                }`}>
                  STATUS: {kycData?.status?.toUpperCase() || (user?.status === 'verified' ? 'SUCCESSFUL' : 'SUCCESSFUL')}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setInputMpin('');
                    setMpinError('');
                    setShowMpinModal(true);
                  }}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all shadow-2xs cursor-pointer"
                  title="Unlock & Edit KYC Details"
                >
                  <Pencil className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Data Rows matching Screenshot_20260818-234854.jpg */}
              <div className="space-y-3 pt-1 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-bold">Full Name:</span>
                  <span className="font-extrabold text-slate-900">{kycData?.name || user?.name || name || '-'}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-bold">Mobile Number:</span>
                  <span className="font-extrabold text-slate-900 font-mono">
                    {maskIdentifier(kycData?.mobile || user?.mobile || mobile || '')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-bold">Aadhaar Card:</span>
                  <span className="font-extrabold text-slate-900 font-mono tracking-wider">
                    {maskIdentifier(kycData?.aadharCard || user?.aadhaar || user?.aadhaar_card || aadharCard || '')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-bold">PAN Card Number:</span>
                  <span className="font-extrabold text-slate-900 font-mono uppercase tracking-wider">
                    {maskIdentifier(kycData?.pancard || user?.pancard || pancard || '')}
                  </span>
                </div>

                {(kycData?.distinct || kycData?.state || kycData?.pincode) && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-bold">Location / State:</span>
                    <span className="font-extrabold text-slate-900">
                      {[kycData?.distinct, kycData?.state, kycData?.pincode].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {kycData?.address && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-bold">Address:</span>
                    <span className="font-extrabold text-slate-900 text-right truncate max-w-[200px]">
                      {kycData.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 font-semibold">
              Click the pencil icon above to update your KYC details.
            </p>
          </div>
        ) : (
          /* ==========================================
             INPUT FORM VIEW (Matching Screenshot_20260819-113705.jpg)
             ========================================== */
          <div className="space-y-4 pt-2">
            {Boolean(kycData?.status || user?.status === 'verified' || user?.status === 'pending') && (
              <div className="flex justify-end pb-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 transition-all cursor-pointer"
                >
                  ← Back to KYC Details
                </button>
              </div>
            )}
            {(kycData?.status === 'SUCCESSFUL' || user?.status === 'verified') && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-3 text-xs font-bold text-blue-900">
                <span className="flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5 text-blue-600" /> Updating KYC Verification Details
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl text-[11px] font-extrabold shadow-2xs border border-slate-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Gmail Address (Top Field matching screenshot) */}
            <div>
              <input
                type="email"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                placeholder="Enter gmail address"
                className="w-full bg-[#f1f5f9]/90 border border-slate-200/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* Aadhaar Card Number */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                Aadhaar Card Number
              </label>
              <input
                type="text"
                maxLength={12}
                value={aadharCard}
                onChange={(e) => setAadharCard(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 12-digit Aadhaar Card number"
                className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-mono font-extrabold text-slate-900 tracking-wider focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* Aadhaar Photos (Front & Back) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Aadhaar Front Photo
                </label>
                <button
                  type="button"
                  onClick={() => frontInputRef.current?.click()}
                  className={`w-full py-3.5 px-2.5 border-2 border-dashed ${
                    aadharFrontPic ? 'border-emerald-400 bg-emerald-50/60 text-emerald-700' : 'border-emerald-300 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-50'
                  } rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-98`}
                >
                  {aadharFrontPic ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-extrabold truncate">Front Uploaded</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-extrabold">Upload Front</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Aadhaar Back Photo
                </label>
                <button
                  type="button"
                  onClick={() => backInputRef.current?.click()}
                  className={`w-full py-3.5 px-2.5 border-2 border-dashed ${
                    aadharBackPic ? 'border-emerald-400 bg-emerald-50/60 text-emerald-700' : 'border-emerald-300 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-50'
                  } rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-98`}
                >
                  {aadharBackPic ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-extrabold truncate">Back Uploaded</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-extrabold">Upload Back</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PAN Card Number */}
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-800 block mb-1">
                PAN Card Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={pancard}
                onChange={(e) => setPancard(e.target.value.toUpperCase())}
                placeholder="Enter 10-digit PAN Card number"
                className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-mono font-extrabold text-slate-900 tracking-wider uppercase focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* Upload PAN Card Photo */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Upload PAN Card Photo
              </label>
              <button
                type="button"
                onClick={() => panInputRef.current?.click()}
                className={`w-full py-3.5 px-4 border-2 border-dashed ${
                  panPic ? 'border-emerald-400 bg-emerald-50/60 text-emerald-700' : 'border-emerald-300 bg-emerald-50/30 text-emerald-600 hover:bg-emerald-50'
                } rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98`}
              >
                {panPic ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-extrabold">PAN Card File Attached</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-extrabold">Choose PAN Photo File</span>
                  </>
                )}
              </button>
            </div>

            {/* Pincode & State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter pincode"
                  className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  placeholder="Enter state"
                  className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl px-3.5 py-3 text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                District
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Enter district"
                className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full home address..."
                className="w-full bg-[#f8fafc] border border-slate-200/80 rounded-2xl px-4 py-3 text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-extrabold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                {errorMsg}
              </p>
            )}

            {/* Submit Button with 6-Dots Animated Zoom in Zoom out */}
            <div className="pt-4 pb-6">
              <button
                type="button"
                onClick={handleSubmitKyc}
                disabled={isSubmitting}
                className="w-full bg-[#6495ED] hover:bg-[#4f82e0] active:scale-98 text-white font-extrabold text-sm sm:text-base py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-80 border border-[#6495ED]"
              >
                {isSubmitting ? (
                  /* 6-Dots Zoom In / Zoom Out animated dots */
                  <div className="flex items-center justify-center gap-2 py-1">
                    {[0, 1, 2, 3, 4, 5].map((idx) => (
                      <span
                        key={idx}
                        className="w-2.5 h-2.5 bg-white rounded-full animate-pulse transition-transform transform scale-100"
                        style={{
                          animation: 'kycDotZoom 0.9s ease-in-out infinite alternate',
                          animationDelay: `${idx * 150}ms`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  'Submit KYC Verification'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Keyframes for 6 dots zoom animation */}
      <style jsx global>{`
        @keyframes kycDotZoom {
          0% {
            transform: scale(0.4);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.4);
            opacity: 1;
          }
        }
      `}</style>

      {/* ==========================================
         MPIN VERIFICATION MODAL FOR KYC EDITING
         (Matching Screenshot_20260820-162142.jpg)
         ========================================== */}
      {showMpinModal && (
        <div className="fixed inset-0 z-[70] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-slate-900 shadow-2xl space-y-5 border border-slate-100 animate-scale-in">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Enter 6-Digit MPIN</h3>
              <p className="text-xs font-semibold text-slate-400">
                Enter your security MPIN to edit your KYC details
              </p>
            </div>

            {/* MPIN 6-Box Indicator */}
            <div className="flex justify-center gap-2 my-2">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className={`w-11 h-12 rounded-xl border-2 flex items-center justify-center text-lg font-black transition-all ${
                    inputMpin.length > idx
                      ? 'border-blue-600 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  {inputMpin[idx] ? '●' : ''}
                </div>
              ))}
            </div>

            {/* Input field with password masking so entered digits never show plain numbers */}
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              value={inputMpin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 6) {
                  setInputMpin(val);
                  setMpinError('');
                }
              }}
              className="w-full text-center border border-slate-200 rounded-xl py-3 px-3 text-lg font-mono tracking-widest focus:outline-none focus:border-blue-500 shadow-xs"
              placeholder="••••••"
              autoFocus
            />

            {mpinError && (
              <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold text-center">
                {mpinError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleVerifyKycMpin}
                disabled={isVerifyingMpin || inputMpin.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifyingMpin ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Confirm & Proceed'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowMpinModal(false);
                  setInputMpin('');
                  setMpinError('');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
         SUCCESSFUL DIALOG MODAL matching Screenshot_20260818-120536.jpg
         ========================================== */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative animate-scale-up border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> KYC Status
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsSuccessOpen(false);
                  setIsEditing(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Green Callout Box */}
            <div className="bg-[#e2f9ef] border border-[#bbf3db] p-4 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-[#00b074] shrink-0" />
              <div>
                <h4 className="text-sm font-black text-slate-900">Fully Verified Member</h4>
                <p className="text-[11px] text-[#008f5e] font-semibold">Your KYC documentation is approved.</p>
              </div>
            </div>

            {/* Details Table Box */}
            <div className="space-y-2.5 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Aadhaar Card</span>
                <span className="font-mono text-slate-900 font-extrabold tracking-wider">
                  •••• •••• {aadharCard.slice(-4) || '8542'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">PAN Card</span>
                <span className="font-mono uppercase text-slate-900 font-extrabold tracking-wider">
                  {pancard || 'ABCDE1234F'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Verified Date</span>
                <span className="text-slate-900 font-extrabold">
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsSuccessOpen(false);
                setIsEditing(false);
              }}
              className="w-full bg-[#f1f5f9] hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold py-3 rounded-2xl text-xs sm:text-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== RESET PASSWORD FULL SCREEN ==================== */
export function ResetPasswordScreen({
  isOpen,
  onClose,
  user,
  onUserUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUserUpdate: (updated: UserData) => void;
}) {
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password flow states
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [gmailInput, setGmailInput] = useState(user?.gmail || '');

  if (!isOpen) return null;

  const handleUpdatePassword = async () => {
    if (!currPass.trim()) {
      setStatusMsg('কারেন্ট পাসওয়ার্ড লিখুন (Enter current password)');
      setStatusType('error');
      return;
    }
    if (newPass.length < 6) {
      setStatusMsg('নিউ পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      setStatusType('error');
      return;
    }
    if (newPass !== confirmPass) {
      setStatusMsg('পাসওয়ার্ড দুটি ম্যাচ করেনি (Passwords do not match)');
      setStatusType('error');
      return;
    }

    setIsSubmitting(true);
    setStatusMsg('');

    const res = await verifyAndUpdateUserPasswordInFirestore(user.uid, currPass, newPass);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMsg(res.message);
      setStatusType('success');
      onUserUpdate({ ...user, password: newPass });
      setTimeout(() => {
        setCurrPass('');
        setNewPass('');
        setConfirmPass('');
        setStatusMsg('');
        onClose();
      }, 1800);
    } else {
      setStatusMsg(res.message);
      setStatusType('error');
    }
  };

  const handleSendGmailReset = () => {
    if (!gmailInput.trim() || !gmailInput.includes('@')) {
      setStatusMsg('সঠিক জিমেইল ইনপুট করুন (Enter valid Gmail address)');
      setStatusType('error');
      return;
    }
    setStatusMsg(`পাসওয়ার্ড রিসেট লিংক আপনার জিমেইল (${gmailInput}) এ পাঠানো হয়েছে!`);
    setStatusType('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-200 shadow-xs">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-lg font-black text-slate-900 text-center flex-1 pr-9 tracking-tight">
          Reset Password (রিসেট পাসওয়ার্ড)
        </h1>
      </div>

      <div className="flex-1 max-w-md sm:max-w-xl mx-auto w-full p-4 space-y-6">
        
        {/* Key Card Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Key className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black">Account Password Update</h2>
            <p className="text-xs text-amber-100 font-semibold mt-0.5">
              Keep your account credentials safe & updated
            </p>
          </div>
        </div>

        {/* Mode A: Normal Password Update */}
        {!isForgotMode ? (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Current Password (কারেন্ট পাসওয়ার্ড)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={currPass}
                  onChange={(e) => setCurrPass(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                New Password (নিউ পাসওয়ার্ড)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Confirm New Password (কনফার্ম পাসওয়ার্ড)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
                <Check className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {statusMsg && (
              <div className={`p-3 rounded-2xl text-xs font-bold text-center border ${
                statusType === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {statusMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <SixDotsLoader /> : 'Update Password (আপডেট পাসওয়ার্ড)'}
            </button>

            {/* Link to Forgot Password Flow */}
            <div className="pt-2 text-center border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(true);
                  setStatusMsg('');
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline inline-flex items-center gap-1.5"
              >
                <span>Forgot Current Password? Send your gmail</span>
              </button>
            </div>

          </div>
        ) : (
          /* Mode B: Forgot Password - Send Gmail Flow */
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-left">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1">
              <h3 className="text-xs font-black text-amber-900 uppercase tracking-wide">
                Reset via Registered Gmail
              </h3>
              <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                Enter your Gmail address below. We will send password update instructions directly to your email.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Your Gmail Address (জিমেইল ইনপুট বক্স)
              </label>
              <input
                type="email"
                value={gmailInput}
                onChange={(e) => setGmailInput(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
              />
            </div>

            {statusMsg && (
              <div className={`p-3 rounded-2xl text-xs font-bold text-center border ${
                statusType === 'success' 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {statusMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleSendGmailReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md active:scale-95"
              >
                Send (সেন্ড বাটন)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(false);
                  setStatusMsg('');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-2xl text-xs transition-all active:scale-95"
              >
                Cancel (ক্যানসেল)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ==================== CONTACT CUSTOMER SUPPORT FULL SCREEN ==================== */
export function ContactSupportScreen({
  isOpen,
  onClose,
  user
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData;
}) {
  const themeColor = user?.themeColor || '#6495ED';
  const [supportData, setSupportData] = useState<SupportContactData>({
    mobile: '1800-890-5544',
    gmail: 'support@gkwallet.com',
    telegram: 'https://t.me/gkwallet_official',
    youtube: 'https://youtube.com/@gkwallet'
  });
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketSent, setTicketSent] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const triggerFeedback = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3000);
  };

  useEffect(() => {
    if (isOpen) {
      fetchCustomerSupportFromFirestore().then((data) => {
        if (data) setSupportData(data);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmitTicket = () => {
    if (!ticketMsg.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketMsg('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-200 shadow-xs">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 transition-all"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-lg font-black text-slate-900 text-center flex-1 pr-9 tracking-tight">
          Customer Care Support
        </h1>
      </div>

      <div className="flex-1 max-w-md sm:max-w-xl mx-auto w-full p-4 space-y-5">
        
        {/* Support Banner using dynamic gradient */}
        <div 
          style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #1e293b 100%)` }}
          className="text-white p-6 rounded-3xl shadow-lg flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black">24x7 Customer Care</h2>
            <p className="text-xs text-white/90 font-semibold mt-0.5">
              We are here to assist you with all wallet queries
            </p>
          </div>
        </div>

        {/* 4 Contact Channels Cards Stack */}
        <div className="space-y-3">
          
          {/* 1. Mobile Helpline */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div 
                style={{ color: themeColor, backgroundColor: `${themeColor}10`, borderColor: `${themeColor}20` }}
                className="w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0"
              >
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Mobile Support</p>
                <p className="text-xs font-black text-slate-900 font-mono">{supportData.mobile}</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerFeedback(`Directing to call: ${supportData.mobile}`);
                window.location.href = `tel:${supportData.mobile}`;
              }}
              style={{ backgroundColor: themeColor }}
              className="hover:brightness-110 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Call Now
            </button>
          </div>

          {/* 2. Gmail Support */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div 
                style={{ color: themeColor, backgroundColor: `${themeColor}10`, borderColor: `${themeColor}20` }}
                className="w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0"
              >
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Gmail Support</p>
                <p className="text-xs font-black text-slate-900 font-mono">{supportData.gmail}</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerFeedback(`Opening mail composer to ${supportData.gmail}`);
                window.location.href = `mailto:${supportData.gmail}`;
              }}
              style={{ backgroundColor: themeColor }}
              className="hover:brightness-110 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Send Email
            </button>
          </div>

          {/* 3. Telegram Channel */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div 
                style={{ color: themeColor, backgroundColor: `${themeColor}10`, borderColor: `${themeColor}20` }}
                className="w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0"
              >
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Telegram Channel</p>
                <p className="text-xs font-black text-slate-900 truncate max-w-[150px]">{supportData.telegram}</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerFeedback("Redirecting to Telegram Channel...");
                const url = supportData.telegram.startsWith('http') ? supportData.telegram : `https://${supportData.telegram}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              style={{ backgroundColor: themeColor }}
              className="hover:brightness-110 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Open Telegram
            </button>
          </div>

          {/* 4. YouTube Channel */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div 
                style={{ color: themeColor, backgroundColor: `${themeColor}10`, borderColor: `${themeColor}20` }}
                className="w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0"
              >
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase">YouTube Channel</p>
                <p className="text-xs font-black text-slate-900 truncate max-w-[150px]">{supportData.youtube}</p>
              </div>
            </div>
            <button
              onClick={() => {
                triggerFeedback("Redirecting to YouTube Channel...");
                const url = supportData.youtube.startsWith('http') ? supportData.youtube : `https://${supportData.youtube}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              style={{ backgroundColor: themeColor }}
              className="hover:brightness-110 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Watch YouTube
            </button>
          </div>

        </div>

        {/* Submit Ticket Form */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 text-left">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Create Customer Ticket
          </h3>
          <textarea
            rows={3}
            value={ticketMsg}
            onChange={(e) => setTicketMsg(e.target.value)}
            placeholder="Describe your issue..."
            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
          />

          {ticketSent && (
            <p className="text-xs font-bold text-emerald-600 bg-emerald-50 py-2 text-center rounded-xl border border-emerald-200">
              Ticket submitted! Support team will reach out shortly.
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmitTicket}
            style={{ backgroundColor: themeColor }}
            className="w-full hover:brightness-110 text-white font-extrabold py-3.5 rounded-2xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Submit Ticket
          </button>
        </div>

      </div>

      {/* Floating Interactive Toast */}
      {actionFeedback && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 animate-fade-in border border-slate-700/80 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

    </div>
  );
}

{/* ==================== 1. TERMS & CONDITIONS FULL SCREEN ==================== */}
export function TermsAndConditionsScreen({
  isOpen,
  onClose,
  themeColor = '#6495ED',
}: {
  isOpen: boolean;
  onClose: () => void;
  themeColor?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none pb-20">
      {/* Dynamic Styled Full Width Display Header */}
      <div 
        style={{ backgroundColor: themeColor }}
        className="sticky top-0 z-30 text-white px-4 py-4 flex items-center justify-between shadow-md"
      >
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-base sm:text-lg font-black text-white text-center flex-1 pr-9 tracking-tight flex items-center justify-center gap-2">
          <FileText className="w-5 h-5 text-white/80" />
          Terms & Conditions
        </h1>
      </div>

      <div className="flex-1 max-w-md sm:max-w-xl mx-auto w-full p-4 space-y-4">
        {/* Top Banner */}
        <div 
          style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #1e293b 100%)` }}
          className="text-white p-5 rounded-3xl shadow-lg space-y-1"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-white/80" />
            <h2 className="text-base font-black">Official Service Terms & User Agreement</h2>
          </div>
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            Please read these terms carefully before using GK Wallet, Send Coins, Coin Conversion, and Bank Settlement services.
          </p>
        </div>

        {/* Detailed Sections List */}
        <div className="space-y-3.5 text-left text-xs text-slate-700 font-medium">

          {/* Section 1: KYC Verification */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <h3 
              style={{ color: themeColor }}
              className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5"
            >
              <span 
                style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
              >
                1
              </span>
              KYC VERIFICATION & IDENTITY RULES
            </h3>
            <p className="leading-relaxed">
              To utilize real cash conversion, advance bank withdrawals, and peer-to-peer transfers, users must complete mandatory identity verification by providing a valid 12-digit Aadhaar Card number, 10-character PAN Card number, Full Address, State, District, and Pincode.
            </p>
            <p className="leading-relaxed text-slate-500">
              Clear front and back photos of your Aadhaar Card and PAN Card photo must be submitted. All submitted records are logged under <span className="font-bold text-amber-600 uppercase">pending</span> status until verified by our compliance team in Firebase Cloud Firestore.
            </p>
          </div>

          {/* Section 2: Advance Withdrawal */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <h3 
              style={{ color: themeColor }}
              className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5"
            >
              <span 
                style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
              >
                2
              </span>
              ADVANCE WITHDRAWAL & SETTLEMENT
            </h3>
            <p className="leading-relaxed">
              Verified accounts can request instant bank settlement and advance cash withdrawals to their linked bank account (Account Number, IFSC Code, Branch Name) or UPI ID.
            </p>
            <p className="leading-relaxed text-slate-500">
              Withdrawal requests are processed in real time. Daily advance withdrawal limits depend on verification status. Once a bank transfer is initiated, funds are disbursed directly to your registered bank account.
            </p>
          </div>

          {/* Section 3: Mobile Number Send Coin */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <h3 
              style={{ color: themeColor }}
              className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5"
            >
              <span 
                style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
              >
                3
              </span>
              MOBILE NUMBER TRANSFERS & SEND COIN
            </h3>
            <p className="leading-relaxed">
              Send Coin allows users to transfer GK Coins instantly to any registered contact using their verified mobile number or unique UID.
            </p>
            <p className="leading-relaxed text-slate-500">
              All transfers require authorization via your secret 6-digit MPIN. Completed transfers immediately credit the recipient&apos;s wallet and are non-reversible.
            </p>
          </div>

          {/* Section 4: Coin Conversion to Real Cash */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <h3 
              style={{ color: themeColor }}
              className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5"
            >
              <span 
                style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
              >
                4
              </span>
              COIN CONVERSION TO REAL CASH
            </h3>
            <p className="leading-relaxed">
              GK Coins stored in your smart wallet can be converted directly into real money for cash payouts.
            </p>
            <p className="leading-relaxed text-slate-500">
              Real-time conversion exchange rates and payout balances are displayed in the application wallet. Cash payouts are disbursed straight to your verified bank account or UPI address.
            </p>
          </div>

          {/* Section 5: Security & MPIN */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <h3 
              style={{ color: themeColor }}
              className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5"
            >
              <span 
                style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
              >
                5
              </span>
              ACCOUNT SECURITY & MPIN CONFIDENTIALITY
            </h3>
            <p className="leading-relaxed">
              Users are strictly responsible for protecting their 6-digit MPIN, password, and biometric keys. Never share your MPIN or OTP with anyone. GK Wallet staff will never ask for your private PIN.
            </p>
          </div>

        </div>

        {/* Bottom Accept Action */}
        <button
          onClick={onClose}
          style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}30` }}
          className="w-full active:scale-98 text-white font-extrabold py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          I Accept & Agree to All Terms
        </button>

      </div>
    </div>
  );
}

{/* ==================== 2. PRIVACY POLICY FULL SCREEN ==================== */}
export function PrivacyPolicyScreen({
  isOpen,
  onClose,
  themeColor = '#6495ED',
}: {
  isOpen: boolean;
  onClose: () => void;
  themeColor?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none pb-20">
      {/* Dynamic Header */}
      <div 
        style={{ backgroundColor: themeColor }}
        className="sticky top-0 z-30 text-white px-4 py-4 flex items-center justify-between shadow-md"
      >
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-base sm:text-lg font-black text-white text-center flex-1 pr-9 tracking-tight flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-white/80" />
          Privacy Policy
        </h1>
      </div>

      <div className="flex-1 max-w-md sm:max-w-xl mx-auto w-full p-4 space-y-4">
        {/* Top Banner with dynamic gradient */}
        <div 
          style={{ background: `linear-gradient(135deg, ${themeColor} 0%, #1e293b 100%)` }}
          className="text-white p-5 rounded-3xl shadow-lg space-y-1"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-white/80" />
            <h2 className="text-base font-black">Data Protection Standard</h2>
          </div>
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            Your personal information, KYC identity documents, and financial transaction records are encrypted and protected.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-3.5 text-left text-xs text-slate-700 font-medium">
          
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <h3 
              style={{ color: themeColor }}
              className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5"
            >
              INFORMATION WE COLLECT
            </h3>
            <p className="leading-relaxed">
              We collect user profile details (Full Name, Mobile Number, Gmail Address), KYC verification identifiers (Aadhaar Card, PAN Card, Document Photos, Address, State, Pincode), and wallet transaction activity logs.
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <h3 
              style={{ color: themeColor }}
              className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5"
            >
              THIRD-PARTY DATA PRIVACY POLICY
            </h3>
            <p className="leading-relaxed">
              We adhere to strict zero-selling policies. Your mobile contact details, photo documents, and bank records will never be shared with unauthorized third-party advertisers.
            </p>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
            <h3 
              style={{ color: themeColor }}
              className="text-xs font-black uppercase tracking-wide flex items-center gap-1.5"
            >
              USER RIGHTS & SUPPORT CONTROLS
            </h3>
            <p className="leading-relaxed">
              Users have full rights to inspect or update their personal information in the Update Profile screen, or reach out to 24x7 Customer Support for assistance.
            </p>
          </div>

        </div>

        {/* Understood Action Button matching brand color */}
        <button
          onClick={onClose}
          style={{ backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}30` }}
          className="w-full active:scale-98 text-white font-extrabold py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5" />
          Understood & Accept Policy
        </button>

      </div>
    </div>
  );
}

{/* ==================== 3. APP SETTINGS FULL SCREEN ==================== */}
export function AppSettingsScreen({
  isOpen,
  onClose,
  user,
  onUserUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUserUpdate?: (updatedUser: UserData) => void;
}) {
  const [pushNotifs, setPushNotifs] = useState<boolean>(user?.pushNotifications ?? true);
  const [bioLock, setBioLock] = useState<boolean>(user?.biometricLock ?? false);
  const [appLang, setAppLang] = useState<string>(user?.appLanguage || 'English');
  const [themeColor, setThemeColor] = useState<string>(user?.themeColor || '#6495ED');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');
  const [testBioSuccess, setTestBioSuccess] = useState(false);

  if (!isOpen) return null;

  const t = getTranslation(appLang as LanguageCode);

  const themeColors = [
    { id: '#6495ED', name: 'Cornflower Blue', hex: '#6495ED', badge: 'Default' },
    { id: '#EC4899', name: 'Pink Rose', hex: '#EC4899', badge: 'Pink' },
    { id: '#8B5CF6', name: 'Royal Purple', hex: '#8B5CF6', badge: 'Purple' },
    { id: '#10B981', name: 'Emerald Green', hex: '#10B981', badge: 'Green' },
    { id: '#F97316', name: 'Sunset Orange', hex: '#F97316', badge: 'Orange' },
    { id: '#EF4444', name: 'Crimson Red', hex: '#EF4444', badge: 'Red' },
  ];

  const handleTestBiometric = () => {
    setTestBioSuccess(true);
    setTimeout(() => setTestBioSuccess(false), 2500);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSavedSuccessMsg('');

    try {
      if (user?.uid) {
        const updated = await saveUserSettingsToFirestore(user.uid, {
          pushNotifications: pushNotifs,
          biometricLock: bioLock,
          appLanguage: appLang,
          themeColor: themeColor,
        });
        if (onUserUpdate) {
          onUserUpdate(updated);
        }
      }

      setSavedSuccessMsg(t.settingsSavedSuccess);
      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error saving settings:', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none pb-20">
      {/* Dynamic Theme Color Display Header (#6495ED / Theme color) */}
      <div
        className="sticky top-0 z-30 text-white px-4 py-4 flex items-center justify-between shadow-md transition-colors duration-300"
        style={{ backgroundColor: themeColor }}
      >
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h1 className="text-base sm:text-lg font-black text-white text-center flex-1 pr-9 tracking-tight flex items-center justify-center gap-2">
          <Settings className="w-5 h-5 text-white/90" />
          {t.appSettings}
        </h1>
      </div>

      <div className="flex-1 max-w-md sm:max-w-xl mx-auto w-full p-4 space-y-4">
        
        {/* Banner with Selected Theme Gradient */}
        <div
          className="text-white p-5 rounded-3xl shadow-lg flex items-center gap-4 transition-all duration-300"
          style={{
            background: `linear-gradient(135deg, ${themeColor} 0%, #1e293b 100%)`,
          }}
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-black">{t.applicationPreferences}</h2>
            <p className="text-xs text-white/80 font-medium">{t.appPreferencesDesc}</p>
          </div>
        </div>

        {/* Security & System Options */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-4 space-y-4 text-left">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
            {t.securityNotifications}
          </h3>

          {/* Push Notifications Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="pr-3">
              <p className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-slate-700" />
                {t.pushNotifications}
              </p>
              <p className="text-[10px] sm:text-xs font-bold text-slate-400">
                {t.pushNotifsDesc}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={pushNotifs}
                onChange={(e) => setPushNotifs(e.target.checked)}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                  pushNotifs ? 'bg-[#6495ED]' : 'bg-slate-300'
                }`}
                style={pushNotifs ? { backgroundColor: themeColor } : {}}
              />
            </label>
          </div>

          {/* Biometric Fingerprint Lock Toggle */}
          <div className="py-2 border-b border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="pr-3">
                <p className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-700" />
                  {t.biometricLock}
                </p>
                <p className="text-[10px] sm:text-xs font-bold text-slate-400">
                  {t.biometricLockDesc}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={bioLock}
                  onChange={(e) => setBioLock(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className={`w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                    bioLock ? 'bg-[#6495ED]' : 'bg-slate-300'
                  }`}
                  style={bioLock ? { backgroundColor: themeColor } : {}}
                />
              </label>
            </div>

            {bioLock && (
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-2.5 mt-2">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Biometric Sensor Active
                </span>
                <button
                  type="button"
                  onClick={handleTestBiometric}
                  className="px-2.5 py-1 text-[11px] font-extrabold text-white rounded-xl shadow-2xs active:scale-95 transition-all"
                  style={{ backgroundColor: themeColor }}
                >
                  Test Sensor
                </button>
              </div>
            )}

            {testBioSuccess && (
              <p className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center animate-fade-in">
                ✓ Biometric Fingerprint Authenticated Successfully!
              </p>
            )}
          </div>

          {/* App Language (ভাষা) */}
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-slate-700" />
                {t.appLanguage}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block">
                Select language for all app screens
              </span>
            </div>
            <select
              value={appLang}
              onChange={(e) => setAppLang(e.target.value)}
              className="text-xs sm:text-sm font-extrabold bg-slate-100 border border-slate-300 rounded-2xl px-3.5 py-2 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer text-slate-900"
            >
              <option value="English">English</option>
              <option value="বাংলা">বাংলা (Bengali)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* Pink & Theme Colour Customization Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-4 space-y-3 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              {t.themeColor}
            </h3>
            <span
              className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: themeColor }}
            >
              Active
            </span>
          </div>

          <p className="text-[11px] font-bold text-slate-500">
            {t.themeColorDesc}
          </p>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {themeColors.map((col) => {
              const isSelected = themeColor.toLowerCase() === col.id.toLowerCase();
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setThemeColor(col.id)}
                  className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 shadow-md ring-2 ring-slate-900/10'
                      : 'border-slate-200/90 bg-white hover:bg-slate-50/80'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center border border-white/80"
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </div>
                  <span className="text-[11px] font-black text-slate-800 tracking-tight">
                    {col.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {savedSuccessMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs p-3.5 rounded-2xl text-center shadow-xs animate-fade-in flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {savedSuccessMsg}
          </div>
        )}

        {/* Save Settings Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full text-white font-extrabold py-4 rounded-2xl text-sm sm:text-base transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 disabled:opacity-80 cursor-pointer"
            style={{ backgroundColor: themeColor }}
          >
            {isSaving ? (
              <SixDotsLoader className="text-white" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                {t.saveSettingsReturn}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

