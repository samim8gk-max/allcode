'use client';

import React, { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import SignupScreen from '@/components/SignupScreen';
import LoginScreen from '@/components/LoginScreen';
import HomeScreen from '@/components/HomeScreen';
import { getCurrentUserFromFirestore, logoutUserFromSession, UserData } from '@/lib/firebase';
import { Smartphone, Monitor, Sparkles, LogOut, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#fff5f5', color: '#991b1b', fontFamily: 'system-ui, -apple-system, sans-serif', margin: '24px', borderRadius: '16px', border: '1px solid #fca5a5', maxWidth: '600px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Something went wrong inside GK Wallet:</h2>
          <p style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '12px' }}>A runtime error or hydration mismatch occurred. Click below to clear local storage and force-reload.</p>
          <pre style={{ fontSize: '12px', background: '#fff', padding: '16px', borderRadius: '12px', overflow: 'auto', border: '1px solid #fee2e2', maxHeight: '300px', lineHeight: '1.5' }}>
            {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
          </pre>
          <button 
            onClick={() => {
              try {
                localStorage.clear();
                window.location.reload();
              } catch (e) {
                window.location.reload();
              }
            }}
            style={{ marginTop: '16px', background: '#dc2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Clear Cache & Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'signup' | 'login' | 'home'>('splash');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
  }, []);

  // Default fallback user if session not found
  const fallbackUser: UserData = {
    uid: 'guest_user_9074',
    name: 'Sk Jiyaul',
    mobile: '9074363297',
    gmail: 'skjiyaul842@gmail.com',
    balance: '500',
    status: 'pending',
    account: 'active',
    registration_date: '19/08/2026',
    profile_picture: '',
    mpin: '111111',
    aadhaar: '',
    pancard: '',
  };

  // Load existing session on boot
  useEffect(() => {
    let mounted = true;
    async function checkSession() {
      try {
        const user = await getCurrentUserFromFirestore();
        if (mounted) {
          if (user) {
            setCurrentUser(user);
          } else {
            // Check if there is an active user in localStorage or default fallback
            const stored = typeof window !== 'undefined' ? localStorage.getItem('gk_current_user') : null;
            if (stored) {
              try {
                setCurrentUser(JSON.parse(stored));
              } catch {
                setCurrentUser(null);
              }
            }
          }
        }
      } catch (err) {
        console.warn('Session load note:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    checkSession();
    return () => { mounted = false; };
  }, []);

  const handleSignupSuccess = (user: UserData) => {
    setCurrentUser(user);
    setCurrentScreen('home');
  };

  const handleLoginSuccess = (user: UserData) => {
    setCurrentUser(user);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    logoutUserFromSession();
    setCurrentUser(null);
    setCurrentScreen('login');
  };

  if (!isMounted) {
    return (
      <div suppressHydrationWarning className="w-full h-screen bg-slate-900 flex items-center justify-center text-white font-sans p-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-sm font-semibold text-slate-300">Initializing GK Wallet...</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div suppressHydrationWarning className="w-full h-screen bg-slate-900 flex items-center justify-center text-white font-sans p-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-sm font-semibold text-slate-300">Loading GK Wallet...</span>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-900 font-sans flex flex-col items-center justify-between selection:bg-pink-500 selection:text-white">
      
      {/* Desktop Top Control Bar - Hidden on Mobile */}
      <header className="hidden md:flex w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-300 text-xs py-2 px-4 items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-white tracking-wide">GK Wallet</span>
          <span className="hidden sm:inline text-slate-400">| Smart Payments & Coin Transfer</span>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setCurrentScreen('splash')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              currentScreen === 'splash' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Splash
          </button>
          <button
            onClick={() => setCurrentScreen('signup')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              currentScreen === 'signup' ? 'bg-[#e91e63] text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Signup
          </button>
          <button
            onClick={() => setCurrentScreen('login')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              currentScreen === 'login' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                setCurrentScreen('home');
              } else {
                alert('Please Login or Signup first!');
                setCurrentScreen('login');
              }
            }}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              currentScreen === 'home' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Home
          </button>
        </div>

        {/* Device view switcher on larger desktop screens */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
              viewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile Device
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
              viewMode === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop Dashboard
          </button>
        </div>
      </header>

      {/* Main Container Frame */}
      <main className="w-full flex-1 flex items-center justify-center p-0 lg:p-6 overflow-hidden">
        {viewMode === 'mobile' ? (
          /* Mobile Phone Simulator Frame for Desktop Viewers */
          <div className="w-full lg:max-w-[420px] lg:h-[860px] lg:rounded-[48px] lg:border-[10px] lg:border-slate-800 lg:shadow-2xl lg:shadow-blue-500/10 bg-white overflow-hidden relative flex flex-col my-auto transition-all">
            {/* Phone Speaker Notch bar on top */}
            <div className="hidden lg:flex justify-center pt-2 pb-1 bg-white">
              <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-800" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto relative">
              {currentScreen === 'splash' && (
                <SplashScreen
                  onComplete={(user) => {
                    if (user) {
                      setCurrentUser(user);
                      setCurrentScreen('home');
                    } else {
                      setCurrentScreen('signup');
                    }
                  }}
                />
              )}

              {currentScreen === 'signup' && (
                <SignupScreen
                  onSignupSuccess={handleSignupSuccess}
                  onNavigateToLogin={() => setCurrentScreen('login')}
                />
              )}

              {currentScreen === 'login' && (
                <LoginScreen
                  onLoginSuccess={handleLoginSuccess}
                  onNavigateToSignup={() => setCurrentScreen('signup')}
                />
              )}

              {currentScreen === 'home' && (
                <HomeScreen
                  user={currentUser || fallbackUser}
                  onUserUpdate={(updated) => setCurrentUser(updated)}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </div>
        ) : (
          /* Responsive Desktop Layout */
          <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200">
            {currentScreen === 'splash' && (
              <SplashScreen
                onComplete={(user) => {
                  if (user) {
                    setCurrentUser(user);
                    setCurrentScreen('home');
                  } else {
                    setCurrentScreen('signup');
                  }
                }}
              />
            )}

            {currentScreen === 'signup' && (
              <SignupScreen
                onSignupSuccess={handleSignupSuccess}
                onNavigateToLogin={() => setCurrentScreen('login')}
              />
            )}

            {currentScreen === 'login' && (
              <LoginScreen
                onLoginSuccess={handleLoginSuccess}
                onNavigateToSignup={() => setCurrentScreen('signup')}
              />
            )}

            {currentScreen === 'home' && (
              <HomeScreen
                user={currentUser || fallbackUser}
                onUserUpdate={(updated) => setCurrentUser(updated)}
                onLogout={handleLogout}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full bg-slate-900 text-slate-500 text-[11px] py-2 text-center border-t border-slate-800">
        GK Wallet App &bull; Powered by Firebase Cloud Firestore &bull; Real-time Coin Transfer
      </footer>
    </div>
    </ErrorBoundary>
  );
}
