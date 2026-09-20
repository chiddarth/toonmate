import React from 'react';
import { CharacterConfig, ScheduleEvent, UserProfile } from '../../types';
import { AnimatedCharacter } from '../character/AnimatedCharacter';
import { audioService } from '../../services/audioService';
import { speechService } from '../../services/speechService';
import {
  X,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Flame,
  Volume2,
} from 'lucide-react';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterConfig;
  profile: UserProfile;
  todayEvents: ScheduleEvent[];
  streakDays: number;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({
  isOpen,
  onClose,
  character,
  profile,
  todayEvents,
  streakDays,
}) => {
  if (!isOpen) return null;

  const completed = todayEvents.filter(e => e.completed).length;
  const total = todayEvents.length;
  const missed = todayEvents.filter(e => !e.completed).length;
  const percent = total === 0 ? 100 : Math.round((completed / total) * 100);

  const getSummaryNarrative = () => {
    if (total === 0) {
      return `Hey ${profile.name}! You didn't have any scheduled tasks today. Hope you had a wonderfully peaceful and relaxing day! 🌙`;
    }

    if (percent === 100) {
      return `Hey ${profile.name}! Legendary work today! You completed ALL ${total} tasks (100%) and kept your ${streakDays}-day streak glowing bright! Rest easy tonight! 🌟🎉🌙`;
    }

    if (percent >= 70) {
      return `Hey ${profile.name}! Here's your day recap:\n\n✅ ${completed} tasks completed\n❌ ${missed} task${missed > 1 ? 's' : ''} left\n📊 ${percent}% completion\n🔥 ${streakDays}-day streak continues!\n\nGreat job! See you tomorrow! 🌙`;
    }

    return `Hey ${profile.name}! You finished ${completed} task${completed !== 1 ? 's' : ''} today. Tomorrow is a brand new sunrise with endless possibilities! Let's conquer it together! 🌙✨`;
  };

  const narrative = getSummaryNarrative();

  const handleSpeak = () => {
    audioService.playChime();
    speechService.speak(narrative, {
      voiceName: profile.speechVoice,
      rate: profile.speechSpeed,
      pitch: profile.speechPitch,
      volume: profile.speechVolume,
      enabled: true,
    });
  };

  const mascotState: 'celebrating' | 'happy' | 'idle' = percent >= 80 ? 'celebrating' : percent >= 50 ? 'happy' : 'idle';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌙</span>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              Today's Daily Summary
            </h3>
          </div>
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot & Speech */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-amber-50/60 dark:bg-slate-850 p-4 rounded-3xl border border-amber-200/70 dark:border-slate-800 mb-5">
          <div className="w-24 h-24 shrink-0 flex items-center justify-center">
            <AnimatedCharacter config={character} state={mascotState} size="md" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed">
              {narrative}
            </p>
            <button
              onClick={handleSpeak}
              className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen to {character.name}</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center">
            <div className="flex items-center justify-center text-emerald-600 mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-400">{completed}</p>
            <p className="text-[11px] font-bold text-slate-500">Completed</p>
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-center">
            <div className="flex items-center justify-center text-rose-600 mb-1">
              <AlertCircle className="w-4 h-4" />
            </div>
            <p className="text-xl font-extrabold text-rose-700 dark:text-rose-400">{missed}</p>
            <p className="text-[11px] font-bold text-slate-500">Unfinished</p>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 text-center">
            <div className="flex items-center justify-center text-indigo-600 mb-1">
              <BarChart3 className="w-4 h-4" />
            </div>
            <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400">{percent}%</p>
            <p className="text-[11px] font-bold text-slate-500">Rate</p>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 text-center">
            <div className="flex items-center justify-center text-orange-600 mb-1">
              <Flame className="w-4 h-4 fill-orange-500" />
            </div>
            <p className="text-xl font-extrabold text-orange-700 dark:text-orange-400">{streakDays}</p>
            <p className="text-[11px] font-bold text-slate-500">Day Streak</p>
          </div>
        </div>

        {/* Close / Action */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="w-full cartoon-btn py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md"
          >
            Goodnight & See You Tomorrow! 🌙
          </button>
        </div>
      </div>
    </div>
  );
};
