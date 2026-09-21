import React, { useState } from 'react';
import { AuthUser } from '../../types/auth';
import { CharacterConfig, CharacterType } from '../../types';
import { authService } from '../../services/authService';
import { audioService } from '../../services/audioService';
import { AnimatedCharacter } from '../character/AnimatedCharacter';
import confetti from 'canvas-confetti';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  ShieldCheck,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
  character: CharacterConfig;
}

const STARTER_CHARACTERS: { type: CharacterType; name: string; emoji: string }[] = [
  { type: 'panda', name: 'Bambu', emoji: '🐼' },
  { type: 'robot', name: 'Sparky', emoji: '🤖' },
  { type: 'cat', name: 'Mochi', emoji: '🐱' },
  { type: 'dog', name: 'Barkley', emoji: '🐶' },
  { type: 'fox', name: 'Rusty', emoji: '🦊' },
  { type: 'superhero', name: 'Cosmo', emoji: '🦸' },
  { type: 'shinchan', name: 'Shinchan', emoji: '👦' },
  { type: 'doraemon', name: 'Doraemon', emoji: '🐱' },
  { type: 'pikachu', name: 'Pikachu', emoji: '⚡' },
  { type: 'luffy', name: 'Luffy', emoji: '🍖' },
  { type: 'hattori', name: 'Hattori', emoji: '🥷' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onAuthSuccess,
  character,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isTypingPassword, setIsTypingPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCharacter, setRegCharacter] = useState<CharacterType>(character.type || 'panda');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    audioService.playPop();

    const res = authService.login({
      usernameOrEmail: loginIdentifier,
      password: loginPassword,
      rememberMe,
    });

    if (!res.success) {
      audioService.playAlert();
      setErrorMsg(res.error || 'Failed to login');
      return;
    }

    if (res.user) {
      audioService.playAchievement();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
      setSuccessMsg(`Welcome back, ${res.user.name}! 👋`);
      setTimeout(() => {
        onAuthSuccess(res.user!);
        onClose();
      }, 700);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    audioService.playPop();

    const res = authService.register({
      name: regName,
      username: regUsername,
      email: regEmail,
      password: regPassword,
      confirmPassword: regConfirmPassword,
      favoriteCharacter: regCharacter,
    });

    if (!res.success) {
      audioService.playAlert();
      setErrorMsg(res.error || 'Failed to register account');
      return;
    }

    if (res.user) {
      audioService.playAchievement();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setSuccessMsg(`Account created! Welcome to ToonMate, ${res.user.name}! 🎉`);
      setTimeout(() => {
        onAuthSuccess(res.user!);
        onClose();
      }, 800);
    }
  };

  const handleQuickDemo = () => {
    audioService.playPop();
    setLoginIdentifier('chidd');
    setLoginPassword('password123');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="relative bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center overflow-hidden shadow-inner">
              <AnimatedCharacter
                config={{ ...character, type: mode === 'register' ? regCharacter : character.type }}
                state={isTypingPassword ? 'sleeping' : errorMsg ? 'worried' : 'excited'}
                size="sm"
              />
            </div>
            <div>
              <h3 className="text-xl font-black flex items-center gap-1.5 leading-tight">
                <span>ToonMate Account</span>
                <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
              </h3>
              <p className="text-xs text-amber-100 font-medium">
                {mode === 'login'
                  ? 'Sign in to access your synchronized schedule & pet'
                  : 'Register your account to save your companion & tasks'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playPop();
              onClose();
            }}
            className="p-2 rounded-2xl hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              audioService.playPop();
              setMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-200/80 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioService.playPop();
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-200/80 dark:border-slate-700'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Mascot Reaction Quote */}
        <div className="px-6 pt-3 pb-1">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200/60 dark:border-slate-700">
            <span>{isTypingPassword ? '🙈' : '💬'}</span>
            <span className="truncate">
              {isTypingPassword
                ? "I'm looking away so your password stays 100% secret!"
                : mode === 'login'
                ? `Hi! Ready to conquer today's checklist?`
                : `Pick a favorite buddy to join your schedule adventure!`}
            </span>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mx-6 mt-2 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body with Scroll */}
        <div className="p-6 overflow-y-auto space-y-4">
          {mode === 'login' ? (
            /* --- LOGIN FORM --- */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username or Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="Enter your username or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickDemo}
                    className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Use Demo Login (chidd)
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onFocus={() => setIsTypingPassword(true)}
                    onBlur={() => setIsTypingPassword(false)}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Demo Info */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 font-semibold">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="cartoon-btn w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 mt-2"
              >
                <span>Sign In to ToonMate</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMsg(null);
                    }}
                    className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Create an account here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            /* --- REGISTRATION FORM --- */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Chiddarth"
                    className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Username & Email in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value)}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Password (min 6)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onFocus={() => setIsTypingPassword(true)}
                      onBlur={() => setIsTypingPassword(false)}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regConfirmPassword}
                      onFocus={() => setIsTypingPassword(true)}
                      onBlur={() => setIsTypingPassword(false)}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Starter Companion Selection */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Choose Your Starter Companion</span>
                  <span className="text-amber-500 text-[11px] font-bold">
                    {STARTER_CHARACTERS.find(c => c.type === regCharacter)?.name}
                  </span>
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {STARTER_CHARACTERS.map(c => (
                    <button
                      key={c.type}
                      type="button"
                      onClick={() => {
                        audioService.playPop();
                        setRegCharacter(c.type);
                      }}
                      className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                        regCharacter === c.type
                          ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-500 scale-110 shadow-sm'
                          : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title={c.name}
                    >
                      <span className="text-xl">{c.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="cartoon-btn w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 mt-3"
              >
                <span>Complete Registration</span>
                <Check className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg(null);
                    }}
                    className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Log in here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
