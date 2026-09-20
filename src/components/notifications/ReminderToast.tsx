import React from 'react';
import { CharacterConfig } from '../../types';
import { ReminderAlert } from '../../services/reminderEngine';
import { AnimatedCharacter } from '../character/AnimatedCharacter';
import { audioService } from '../../services/audioService';
import {
  Bell,
  Clock,
  CheckCircle2,
  X,
  Volume2,
} from 'lucide-react';

interface ReminderToastProps {
  alert: ReminderAlert | null;
  character: CharacterConfig;
  onDismiss: () => void;
  onSnooze: (eventId: string, minutes: number) => void;
  onComplete: (eventId: string) => void;
  onSpeak: (text: string) => void;
}

export const ReminderToast: React.FC<ReminderToastProps> = ({
  alert,
  character,
  onDismiss,
  onSnooze,
  onComplete,
  onSpeak,
}) => {
  if (!alert) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-500 shadow-2xl p-4.5 rounded-3xl relative overflow-hidden">
        {/* Amber top alert ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

        <div className="flex items-start gap-3.5">
          {/* Animated Mascot Head */}
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-slate-800 border border-amber-300 shrink-0 flex items-center justify-center overflow-hidden">
            <AnimatedCharacter config={character} state="talking" size="sm" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400">
                <Bell className="w-3 h-3 animate-bounce" /> {character.name} Reminds You!
              </span>
              <button
                onClick={onDismiss}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Alert Message */}
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-snug">
              {alert.message}
            </p>

            {alert.event.notes && (
              <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                “{alert.event.notes}”
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  audioService.playPop();
                  onComplete(alert.event.id);
                  onDismiss();
                }}
                className="flex-1 cartoon-btn py-1.5 px-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Done</span>
              </button>

              <button
                onClick={() => {
                  audioService.playPop();
                  onSnooze(alert.event.id, 10);
                  onDismiss();
                }}
                className="cartoon-btn py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>+10m</span>
              </button>

              <button
                onClick={() => onSpeak(alert.message)}
                className="p-1.5 rounded-xl bg-amber-100 dark:bg-slate-800 hover:bg-amber-200 text-amber-700 dark:text-amber-400"
                title="Speak alert"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
