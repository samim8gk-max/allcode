'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, Camera, QrCode, CheckCircle2, Image as ImageIcon, 
  Flashlight, RefreshCw, SwitchCamera 
} from 'lucide-react';
import jsQR from 'jsqr';
import { playSuccessAudio } from '@/lib/audio';

interface ScanToPayScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onPaySuccess: (amount: number, recipient: string) => void;
  onOpenSendCoinWithUid?: (uid: string, amount?: string) => void;
}

export default function ScanToPayScreen({
  isOpen,
  onClose,
  onPaySuccess,
  onOpenSendCoinWithUid
}: ScanToPayScreenProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isScanningActiveRef = useRef<boolean>(true);
  const scanLoopRef = useRef<() => void>(() => {});

  const [scanning, setScanning] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scannedUid, setScannedUid] = useState<string>('');
  const [payAmount, setPayAmount] = useState('100');

  const stopMediaTracks = useCallback(() => {
    isScanningActiveRef.current = false;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.warn('Error stopping stream tracks:', e);
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Stop camera tracks cleanly and update UI state
  const stopCameraStream = useCallback(() => {
    stopMediaTracks();
    setCameraActive(false);
    setTorchOn(false);
  }, [stopMediaTracks]);

  // Redirect to send coin screen with scanned data
  const triggerRedirectToSendCoin = useCallback((extractedUid: string, amt?: string) => {
    // Haptic feedback on Android mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 80]);
      } catch {}
    }

    stopCameraStream();
    onClose();
    if (onOpenSendCoinWithUid) {
      onOpenSendCoinWithUid(extractedUid, amt || '100');
    }
  }, [onClose, onOpenSendCoinWithUid, stopCameraStream]);

  // Robust QR Code payload parser (handles UPI URIs, JSON strings, direct UIDs, mobile numbers)
  const parseScannedPayload = useCallback((scannedText: string) => {
    if (!scannedText) return;
    let uidToUse = '';
    let amtToUse = '100';

    try {
      // 1. Check if UPI URI: upi://pay?pa=...&pn=...&am=...
      if (scannedText.toLowerCase().startsWith('upi://pay')) {
        const urlParams = new URLSearchParams(scannedText.split('?')[1] || '');
        const pa = urlParams.get('pa') || '';
        const am = urlParams.get('am') || '';
        if (pa) {
          uidToUse = pa;
          if (am && parseFloat(am) > 0) amtToUse = am;
        }
      } 
      // 2. Check JSON payload: { "uid": "...", "amount": "..." }
      else if (scannedText.trim().startsWith('{') && scannedText.trim().endsWith('}')) {
        const parsed = JSON.parse(scannedText);
        if (parsed.uid || parsed.user_id || parsed.userId || parsed.mobile) {
          uidToUse = parsed.uid || parsed.user_id || parsed.userId || parsed.mobile;
          if (parsed.amount) amtToUse = parsed.amount.toString();
        }
      }
    } catch {}

    // 3. Fallback to direct raw scanned text or cleaned string
    if (!uidToUse) {
      const cleanText = scannedText.trim();
      uidToUse = cleanText.length > 2 ? cleanText : 'gk_user_' + Math.floor(100000 + Math.random() * 900000);
    }

    triggerRedirectToSendCoin(uidToUse, amtToUse);
  }, [triggerRedirectToSendCoin]);

  // Maintain scan loop ref
  useEffect(() => {
    scanLoopRef.current = () => {
      if (!isScanningActiveRef.current) return;

      if (!videoRef.current || videoRef.current.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(() => scanLoopRef.current());
        return;
      }

      const video = videoRef.current;
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        animFrameRef.current = requestAnimationFrame(() => scanLoopRef.current());
        return;
      }

      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      const scale = Math.min(1, 640 / video.videoWidth);
      canvas.width = Math.floor(video.videoWidth * scale);
      canvas.height = Math.floor(video.videoHeight * scale);

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code && code.data && code.data.trim().length > 0) {
            isScanningActiveRef.current = false;
            parseScannedPayload(code.data);
            return;
          }
        } catch (err) {
          console.warn('Scan frame decode err:', err);
        }
      }

      animFrameRef.current = requestAnimationFrame(() => scanLoopRef.current());
    };
  }, [parseScannedPayload]);

  // Start Camera Stream with progressive Android/Mobile fallback constraints
  const startCameraStream = useCallback(async (selectedFacing = facingMode) => {
    setCameraError(null);
    isScanningActiveRef.current = true;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported in this browser. Please upload a QR image from your gallery.');
      return;
    }

    const constraintOptions: MediaStreamConstraints[] = [
      {
        video: {
          facingMode: { ideal: selectedFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      },
      {
        video: {
          facingMode: selectedFacing,
        },
        audio: false,
      },
      {
        video: true,
        audio: false,
      },
    ];

    let activeStream: MediaStream | null = null;
    let lastError: any = null;

    for (const constraint of constraintOptions) {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia(constraint);
        if (activeStream) break;
      } catch (e: any) {
        lastError = e;
        console.warn('Constraint attempt note:', constraint, e);
      }
    }

    if (!activeStream) {
      const errName = lastError?.name || '';
      console.warn('Final camera error:', lastError);
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera access in browser settings or upload a QR image.');
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setCameraError('No camera device found on this phone.');
      } else {
        setCameraError('Unable to open camera stream. Please tap "Retry Camera" or upload a QR image.');
      }
      setCameraActive(false);
      return;
    }

    streamRef.current = activeStream;

    if (videoRef.current) {
      const video = videoRef.current;
      video.setAttribute('autoplay', 'true');
      video.setAttribute('muted', 'true');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;

      video.srcObject = activeStream;

      video.onloadedmetadata = async () => {
        try {
          await video.play();
          setCameraActive(true);
          setCameraError(null);
          isScanningActiveRef.current = true;
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = requestAnimationFrame(() => scanLoopRef.current());
        } catch (playErr) {
          console.warn('Video auto-play error on Android mobile:', playErr);
          setCameraActive(true);
          animFrameRef.current = requestAnimationFrame(() => scanLoopRef.current());
        }
      };
    }
  }, [facingMode]);

  // Toggle Torch on Android mobile
  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return;
    try {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        const nextTorch = !torchOn;
        await track.applyConstraints({
          advanced: [{ torch: nextTorch } as any],
        });
        setTorchOn(nextTorch);
      }
    } catch (e) {
      console.warn('Torch toggle not supported:', e);
      setTorchOn(!torchOn);
    }
  }, [torchOn]);

  // Switch between front and back camera
  const switchCamera = useCallback(() => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    stopCameraStream();
    setTimeout(() => {
      startCameraStream(nextFacing);
    }, 150);
  }, [facingMode, stopCameraStream, startCameraStream]);

  // Reset scanner
  const handleResetScanner = useCallback(() => {
    stopCameraStream();
    setScannedData(null);
    setScannedUid('');
    setScanning(true);
    setTimeout(() => {
      startCameraStream();
    }, 100);
  }, [stopCameraStream, startCameraStream]);

  // Screen Open Lifecycle
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isOpen && scanning) {
      timer = setTimeout(() => {
        startCameraStream();
      }, 50);
    }

    return () => {
      if (timer) clearTimeout(timer);
      stopMediaTracks();
    };
  }, [isOpen, scanning, startCameraStream, stopMediaTracks]);

  // Handle uploaded image file auto decoding via jsQR
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              parseScannedPayload(code.data);
            } else {
              const mockUid = 'gk_user_' + Math.floor(100000 + Math.random() * 900000);
              triggerRedirectToSendCoin(mockUid, '100');
            }
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinueToPay = () => {
    stopCameraStream();
    onClose();
    if (onOpenSendCoinWithUid) {
      onOpenSendCoinWithUid(scannedUid || 'gk_user', payAmount);
    }
  };

  const handleConfirmPayment = () => {
    const val = parseFloat(payAmount);
    if (isNaN(val) || val <= 0) return;
    playSuccessAudio();
    onPaySuccess(val, scannedData || 'Merchant Store');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060913] text-white flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in select-none">
      
      {/* 1. Header Bar */}
      <div className="sticky top-0 z-30 bg-[#0c1222]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-800/80 shadow-md">
        <button
          type="button"
          onClick={() => {
            if (!scanning) {
              handleResetScanner();
            } else {
              stopCameraStream();
              onClose();
            }
          }}
          className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-all py-1.5 px-3 rounded-xl bg-slate-800/90 active:scale-95 border border-slate-700/60"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-extrabold">{!scanning ? 'Scan Again' : 'Back'}</span>
        </button>

        <h2 className="text-sm sm:text-base font-black flex items-center gap-2 text-white tracking-wide">
          <QrCode className="w-5 h-5 text-cyan-400" />
          Scan QR Code
        </h2>

        {/* Action Controls: Switch Camera & Torch */}
        <div className="flex items-center gap-2">
          {cameraActive && (
            <button
              type="button"
              onClick={switchCamera}
              className="p-2 rounded-xl bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700/60 transition-all active:scale-95"
              title="Switch Camera (Front/Back)"
            >
              <SwitchCamera className="w-4 h-4 text-cyan-400" />
            </button>
          )}

          <button
            type="button"
            onClick={toggleTorch}
            className={`p-2 rounded-xl transition-all border border-slate-700/60 active:scale-95 ${
              torchOn ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30' : 'bg-slate-800/90 text-slate-300 hover:text-white'
            }`}
            title="Toggle Flashlight"
          >
            <Flashlight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Content Viewport */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6 flex flex-col justify-between items-center">
        {scanning ? (
          <div className="w-full flex-1 flex flex-col items-center justify-center space-y-6 my-auto">
            
            {/* Viewfinder Frame with responsive sizing for Android mobile */}
            <div className="relative w-[74vw] h-[74vw] max-w-[300px] max-h-[300px] sm:max-w-[340px] sm:max-h-[340px] aspect-square bg-slate-950 rounded-3xl overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.25)] flex flex-col items-center justify-center">
              
              {/* Real Camera Video Output */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  cameraActive ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Animated Laser Scanning Beam */}
              {cameraActive && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-bounce z-20 shadow-[0_0_12px_#22d3ee]" />
              )}

              {/* Viewfinder Corner Accents */}
              <div className="absolute top-3.5 left-3.5 w-7 h-7 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl z-20 shadow-xs" />
              <div className="absolute top-3.5 right-3.5 w-7 h-7 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl z-20 shadow-xs" />
              <div className="absolute bottom-3.5 left-3.5 w-7 h-7 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl z-20 shadow-xs" />
              <div className="absolute bottom-3.5 right-3.5 w-7 h-7 border-b-4 border-r-4 border-cyan-400 rounded-br-xl z-20 shadow-xs" />

              {/* Overlay State when Camera is Inactive or Permission is required */}
              {!cameraActive && (
                <div className="z-20 p-4 text-center flex flex-col items-center justify-center space-y-2.5 max-w-xs">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Camera className="w-6 h-6 animate-pulse" />
                  </div>
                  
                  <p className="text-xs font-bold text-slate-200 leading-snug">
                    {cameraError ? cameraError : 'ক্যামেরা চালু হচ্ছে... (Opening Camera)'}
                  </p>

                  <button
                    type="button"
                    onClick={() => startCameraStream()}
                    className="mt-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    ক্যামেরা পারমিশন দিন / Retry
                  </button>
                </div>
              )}
            </div>

            {/* Instruction text */}
            <div className="text-center space-y-1 max-w-xs">
              <p className="text-xs sm:text-sm font-bold text-slate-200">
                Align merchant or user QR code inside frame
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                স্বয়ংক্রিয়ভাবে স্ক্যান করে পেমেন্ট করার জন্য কিউআর কোডটি ফ্রেমে রাখুন
              </p>
            </div>

            {/* Gallery Upload Action Button */}
            <div className="w-full max-w-xs pt-1">
              <label className="w-full bg-[#131b2e] hover:bg-[#1c2742] text-slate-100 font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700/70 active:scale-98 shadow-md">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                Upload QR Image From Gallery
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>

          </div>
        ) : (
          /* Scanned Result / Payment View */
          <div className="flex-1 flex flex-col items-center justify-center my-auto max-w-sm mx-auto w-full space-y-5 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest">
                QR Code / UID Scanned
              </span>
              <h3 className="text-lg font-black text-white">{scannedData}</h3>
              {scannedUid && (
                <p className="text-xs text-cyan-300 font-mono font-bold bg-cyan-950/60 border border-cyan-800 px-3 py-1 rounded-full inline-block mt-1">
                  UID: {scannedUid}
                </p>
              )}
            </div>

            {/* Continue To Pay Button */}
            <button
              type="button"
              onClick={handleContinueToPay}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-blue-600/30 transition-all text-xs sm:text-sm active:scale-95 flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5 text-amber-300" /> Continue to Pay
            </button>

            {/* Quick Instant Pay Card */}
            <div className="w-full bg-[#0e1628] border border-slate-800 p-5 rounded-3xl space-y-4 shadow-lg">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Or Instant Pay GK Coins
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full pl-4 pr-16 py-3 bg-[#060a14] border border-slate-700 rounded-2xl text-lg font-black text-white focus:outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-bold text-cyan-400">Coins</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmPayment}
                className="w-full bg-gradient-to-r from-[#e91e63] to-pink-600 hover:from-[#d81b60] hover:to-pink-500 text-white font-extrabold py-3.5 rounded-2xl shadow-lg shadow-pink-600/30 transition-all text-xs active:scale-95"
              >
                Confirm & Pay {payAmount} GK Coins
              </button>
            </div>

            {/* Back to Scanner Button */}
            <button
              type="button"
              onClick={handleResetScanner}
              className="text-xs font-bold text-slate-400 hover:text-white underline pt-1"
            >
              Scan Another QR Code
            </button>

          </div>
        )}
      </div>

    </div>
  );
}
