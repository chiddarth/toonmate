import React, { useState, useRef, useEffect } from 'react';
import { CharacterConfig, NavigationTab, UserProfile } from '../../types';
import { AuthUser } from '../../types/auth';
import { AnimatedCharacter } from '../character/AnimatedCharacter';
import { audioService } from '../../services/audioService';
import {
  Bell,
  Volume2,
  VolumeX,
  Plus,
  Moon,
  Sun,
  Monitor,
  Play,
  Square,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  character: CharacterConfig;
  profile: UserProfile;
  unreadNotifsCount: number;
  onOpenNotifications: () => void;
  onOpenAddEvent: () => void;
  onOpenDailySummary: () => void;
  onOpenDesktopPet: () => void;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onToggleAnimations?: () => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  character,
  profile,
  unreadNotifsCount,
  onOpenNotifications,
  onOpenAddEvent,
  onOpenDailySummary,
  onOpenDesktopPet,
  onToggleSound,
  onToggleTheme,
  onToggleAnimations,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b-2 border-amber-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 dark:bg-slate-800 border-2 border-amber-300 dark:border-indigo-800 flex items-center justify-center overflow-hidden shadow-sm">
            <AnimatedCharacter
              config={character}
              state="happy"
              size="sm"
              animationsEnabled={profile.animationsEnabled !== false}
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>ToonMate</span>
              <span className="text-[10px] sm:text-xs font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs">
                AI Companion
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-semibold hidden sm:block">
              {character.name} is by your side
            </p>
          </div>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Pet Launcher Button */}
          <button
            onClick={onOpenDesktopPet}
            className="cartoon-btn hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100 dark:bg-slate-800 hover:bg-amber-200 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-slate-700 shadow-xs"
            title="Open Desktop Window Companion"
          >
            <Monitor className="w-4 h-4 text-amber-600" />
            <span>Desktop Pet 🪟</span>
          </button>

          {/* Daily Review Quick Button */}
          <button
            onClick={onOpenDailySummary}
            className="cartoon-btn hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800"
            title="End-of-day Summary"
          >
            <span>🌙</span>
            <span>Review Day</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              audioService.playPop();
              onToggleSound();
            }}
            className={`p-2 sm:p-2.5 rounded-2xl border transition-all ${
              profile.soundEnabled
                ? 'bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-slate-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title={profile.soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Animation Stop / Play Toggle */}
          {onToggleAnimations && (
            <button
              onClick={() => {
                audioService.playPop();
                onToggleAnimations();
              }}
              className={`p-2 sm:p-2.5 rounded-2xl border transition-all ${
                profile.animationsEnabled !== false
                  ? 'bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-slate-700'
                  : 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-slate-700'
              }`}
              title={
                profile.animationsEnabled !== false
                  ? 'Stop character screen animation'
                  : 'Play character screen animation'
              }
            >
              {profile.animationsEnabled !== false ? (
                <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              )}
            </button>
          )}

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={() => {
              audioService.playPop();
              onToggleTheme();
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Toggle theme"
          >
            {profile.theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => {
              audioService.playPop();
              onOpenNotifications();
            }}
            className="relative p-2 sm:p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Notification Center"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Add Event Action Button */}
          <button
            onClick={() => {
              audioService.playPop();
              onOpenAddEvent();
            }}
            className="cartoon-btn flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* User Account / Auth Dropdown */}
          <div className="relative" ref={userMenuRef}>
            {currentUser ? (
              <button
                onClick={() => {
                  audioService.playPop();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
                className="cartoon-btn flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-amber-50 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-750 text-slate-800 dark:text-white border-2 border-amber-300 dark:border-slate-700 shadow-xs transition-all"
                title="Your Account"
              >
                <span className="text-lg leading-none">{currentUser.avatar || '🐼'}</span>
                <span className="text-xs font-bold hidden md:inline max-w-[85px] truncate">
                  {currentUser.name}
                </span>
              </button>
            ) : (
              <button
                onClick={() => {
                  audioService.playPop();
                  onOpenAuthModal('login');
                }}
                className="cartoon-btn flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-extrabold shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

            {/* User Dropdown Menu */}
            {isUserMenuOpen && currentUser && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-slate-800 border-2 border-amber-300 dark:border-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {currentUser.avatar || '🐼'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-sm text-slate-800 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      @{currentUser.username}
                    </p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      audioService.playPop();
                      setIsUserMenuOpen(false);
                      onOpenAuthModal('login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-amber-500" />
                    <span>Switch / Log In Another User</span>
                  </button>

                  <button
                    onClick={() => {
                      audioService.playPop();
                      setIsUserMenuOpen(false);
                      onOpenAuthModal('register');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-indigo-500" />
                    <span>Register New Account</span>
                  </button>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                    <button
                      onClick={() => {
                        audioService.playPop();
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
