import React from 'react';
import { Achievement, CharacterConfig, ScheduleEvent, UserProgress } from '../../types';
import { AnimatedCharacter } from '../character/AnimatedCharacter';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  Zap,
  Target,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react';

interface ProgressViewProps {
  progress: UserProgress;
  achievements: Achievement[];
  todayEvents: ScheduleEvent[];
  allEvents: ScheduleEvent[];
  character: CharacterConfig;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  achievements,
  todayEvents,
  allEvents,
  character,
}) => {
  const completedToday = todayEvents.filter(e => e.completed).length;
  const totalToday = todayEvents.length;
  const dailyPercent = totalToday === 0 ? 100 : Math.round((completedToday / totalToday) * 100);

  // Weekly completion calculation
  const past7DaysEvents = allEvents.filter(e => {
    const diff = (Date.now() - new Date(e.date).getTime()) / (1000 * 3600 * 24);
    return diff >= 0 && diff <= 7;
  });
  const weeklyCompleted = past7DaysEvents.filter(e => e.completed).length;
  const weeklyTotal = past7DaysEvents.length;
  const weeklyPercent = weeklyTotal === 0 ? 100 : Math.round((weeklyCompleted / weeklyTotal) * 100);

  // Level progress
  const currentLevelBaseXP = (progress.level - 1) * 300;
  const xpInCurrentLevel = Math.max(0, progress.xp - currentLevelBaseXP);
  const xpNeededForNextLevel = 300;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100));

  const handleCelebrateAchievement = (ach: Achievement) => {
    if (!ach.unlocked) return;
    audioService.playAchievement();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Level & Mascot Celebration */}
      <div className="cartoon-card bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-600 p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" /> Level {progress.level} Scheduler
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              Keep Going, Champion! 🌟
            </h2>
            <p className="text-xs md:text-sm text-white/90 leading-relaxed font-semibold">
              Every completed class, review, and personal milestone earns XP, powers up your streak, and keeps {character.name} cheering!
            </p>

            {/* XP Progress Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-white/90 mb-1 font-mono">
                <span>XP: {progress.xp}</span>
                <span>Next Level: {xpInCurrentLevel}/{xpNeededForNextLevel} XP ({levelProgressPercent}%)</span>
              </div>
              <div className="w-full bg-black/20 backdrop-blur-md h-3.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-yellow-300 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cheering Mascot */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border-2 border-white/40 shadow-inner">
              <AnimatedCharacter config={character} state="celebrating" size="md" />
            </div>
            <span className="text-xs font-extrabold mt-2 text-yellow-200">
              {character.name} is proud of you!
            </span>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Completion */}
        <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-4.5 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-2">
            <span>Today's Completion</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
            {dailyPercent}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {completedToday} of {totalToday} tasks finished
          </p>
        </div>

        {/* Weekly Completion */}
        <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-4.5 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-2">
            <span>Weekly Average</span>
            <Calendar className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
            {weeklyPercent}%
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {weeklyCompleted} completed in last 7 days
          </p>
        </div>

        {/* Current Streak */}
        <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-4.5 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-2">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-orange-600 dark:text-orange-400">
            {progress.streakDays} Days 🔥
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Consistent momentum
          </p>
        </div>

        {/* All-time Completed */}
        <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-4.5 shadow-md">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-2">
            <span>Total Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {progress.totalCompleted || 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Lifetime accomplishments
          </p>
        </div>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Achievements & Trophies</span>
            </h3>
            <p className="text-xs text-slate-500">
              {achievements.filter(a => a.unlocked).length} of {achievements.length} badges unlocked
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(ach => {
            const isUnlocked = ach.unlocked;

            return (
              <div
                key={ach.id}
                onClick={() => handleCelebrateAchievement(ach)}
                className={`cartoon-card p-4 rounded-3xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'border-amber-300 dark:border-slate-700 bg-amber-50/40 dark:bg-slate-800/60 cursor-pointer hover:scale-102 hover:border-amber-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 opacity-55'
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm border ${
                    isUnlocked
                      ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300'
                      : 'bg-slate-200 dark:bg-slate-800 border-slate-300 text-slate-400'
                  }`}
                >
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">
                      {ach.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-200/60 dark:bg-amber-950 px-2 py-0.2 rounded-full">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mb-2">
                    {ach.description}
                  </p>

                  {/* Progress Meter */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isUnlocked ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
