'use client';

import React, { useState } from 'react';
import { X, QrCode, Camera, CheckCircle2, Sparkles } from 'lucide-react';
import { playSuccessAudio } from '@/lib/audio';

interface ScanToPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaySuccess: (amount: number, recipient: string) => void;
}

export default function ScanToPayModal({ isOpen, onClose, onPaySuccess }: ScanToPayModalProps) {
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState('20');

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(false);
    setScannedData('Merchant: GK Store (9876543210)');
  };

  const handleConfirmPayment = () => {
    const val = parseFloat(payAmount);
    if (isNaN(val) || val <= 0) return;
    playSuccessAudio();
    onPaySuccess(val, 'GK Merchant Store');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pb-3 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center justify-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600" />
            Scan to Pay
          </h3>
          <p className="text-xs text-slate-500">Scan merchant QR code to transfer GK Coins</p>
        </div>

        {scanning ? (
          <div className="my-6 space-y-4">
            <div className="relative w-48 h-48 mx-auto bg-slate-900 rounded-2xl flex flex-col items-center justify-center overflow-hidden border-2 border-blue-500 shadow-xl">
              <Camera className="w-10 h-10 text-blue-400 animate-pulse mb-2" />
              <p className="text-[11px] text-blue-200 font-medium">Scanning QR Code automatically...</p>
              {/* Animated Scan Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce" />
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Align QR code inside camera frame to auto-scan merchant details
            </p>
          </div>
        ) : (
          <div className="my-6 space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {scannedData}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 text-left">
                Enter Amount to Pay
              </label>
              <input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleConfirmPayment}
              className="w-full bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold py-3 rounded-2xl shadow-lg transition-all text-xs"
            >
              Pay {payAmount} GK Coins
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
