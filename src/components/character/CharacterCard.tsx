import React, { useState, useEffect } from 'react';
import {
  CharacterConfig,
  CharacterState,
  ScheduleEvent,
  UserProfile,
} from '../../types';
import { AnimatedCharacter } from './AnimatedCharacter';
import { CharacterBubble } from './CharacterBubble';
import { CharacterStage } from './CharacterStage';
import {
  formatFullDate,
  formatTimeDisplay,
  getCountdown,
  getEventStatus,
} from '../../utils/dateUtils';
import {
  getGreeting,
  getPokedReaction,
  getScheduleSummaryComment,
} from '../../utils/personalityUtils';
import { audioService } from '../../services/audioService';
import { speechService } from '../../services/speechService';
import {
  MessageCircle,
  PlusCircle,
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  Monitor,
  Play,
  Square,
} from 'lucide-react';

interface CharacterCardProps {
  character: CharacterConfig;
  profile: UserProfile;
  todayEvents: ScheduleEvent[];
  onOpenChat: () => void;
  onOpenAddEvent: () => void;
  onOpenDesktopPet: () => void;
  onToggleAnimations?: () => void;
  streakDays: number;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  profile,
  todayEvents,
  onOpenChat,
  onOpenAddEvent,
  onOpenDesktopPet,
  onToggleAnimations,
  streakDays,
}) => {
  const [characterState, setCharacterState] = useState<CharacterState>('idle');
  const [bubbleText, setBubbleText] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Live ticking clock (every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute schedule metrics
  const completedCount = todayEvents.filter(e => e.completed).length;
  const totalCount = todayEvents.length;
  const progressPercent = totalCount === 0 ? 100 : Math.round((completedCount / totalCount) * 100);

  // Find next upcoming or current event
  const activeEvent = todayEvents.find(
    e => !e.completed && getEventStatus(e.date, e.startTime, e.endTime, e.completed, currentTime) === 'in-progress'
  );

  const upcomingEvents = todayEvents
    .filter(e => !e.completed && getEventStatus(e.date, e.startTime, e.endTime, e.completed, currentTime) === 'upcoming')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const nextEvent = upcomingEvents[0] || null;

  // Derive character baseline emotional state from schedule
  useEffect(() => {
    if (isSpeaking) {
      setCharacterState('talking');
      return;
    }

    const hour = currentTime.getHours();

    // Late night sleeping state
    if ((hour >= 22 || hour < 5) && (completedCount === totalCount || totalCount === 0)) {
      setCharacterState('sleeping');
      setBubbleText("Shh... resting up for tomorrow's big adventures! 🌙💤");
      return;
    }

    // All tasks completed celebrating state
    if (totalCount > 0 && completedCount === totalCount) {
      setCharacterState('celebrating');
      setBubbleText("All tasks completed for today! You're a true superstar! 🏆🎉");
      return;
    }

    // Approaching event within 15 minutes: alert/worried state
    if (nextEvent) {
      const countdown = getCountdown(nextEvent.date, nextEvent.startTime, currentTime);
      if (countdown.totalSeconds <= 15 * 60 && countdown.totalSeconds > 0) {
        setCharacterState('worried');
        setBubbleText(`⚠️ Hey ${profile.name}! "${nextEvent.title}" starts in ${countdown.formatted}! Get ready! ⏰`);
        return;
      }
    }

    // In-progress event
    if (activeEvent) {
      setCharacterState('excited');
      setBubbleText(`Focus mode! Currently working on "${activeEvent.title}"! You've got this! 🚀`);
      return;
    }

    // Default friendly state & summary
    setCharacterState('happy');
    const greeting = getGreeting(profile.name, character.personality);
    const summary = getScheduleSummaryComment(
      totalCount,
      totalCount - completedCount,
      nextEvent,
      character.personality,
      profile.timeFormat
    );
    setBubbleText(`${greeting}\n\n${summary}`);
  }, [
    todayEvents,
    completedCount,
    totalCount,
    nextEvent?.id,
    activeEvent?.id,
    character.personality,
    profile.name,
    profile.timeFormat,
    isSpeaking,
  ]);

  // Handle character click (poke reaction)
  const handlePokeCharacter = () => {
    audioService.playPop();
    const reaction = getPokedReaction(character.name, character.personality, character.type);
    setCharacterState(reaction.state);
    setBubbleText(reaction.text);

    // Speak aloud if speech is enabled
    if (profile.speechEnabled) {
      speakMessage(reaction.text);
    } else {
      setTimeout(() => {
        setCharacterState('happy');
      }, 3500);
    }
  };

  const speakMessage = (text: string) => {
    audioService.playChime();
    speechService.speak(text, {
      voiceName: profile.speechVoice,
      rate: profile.speechSpeed,
      pitch: profile.speechPitch,
      volume: profile.speechVolume,
      enabled: profile.speechEnabled,
      onStart: () => {
        setIsSpeaking(true);
        setCharacterState('talking');
      },
      onEnd: () => {
        setIsSpeaking(false);
        setCharacterState('happy');
      },
    });
  };

  // Next event countdown data
  const nextCountdown = nextEvent
    ? getCountdown(nextEvent.date, nextEvent.startTime, currentTime)
    : null;

  return (
    <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/90 dark:border-slate-800 p-5 md:p-6 relative overflow-hidden shadow-xl">
      {/* Header Info: Date & Live Time */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>{character.name}</span>
            <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-indigo-950 dark:text-indigo-300">
              {character.personality}
            </span>
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {formatFullDate(currentTime)}
          </p>
        </div>

        {/* Live Clock & Streak Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40 text-xs md:text-sm font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streakDays} Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs md:text-sm font-bold font-mono">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>
              {currentTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: profile.timeFormat === '12h',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Character Stage & Speech Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center my-2">
        {/* Cartoon Character in Stage (Left / Center) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm relative">
            <CharacterStage theme={character.background} className="w-full h-72 md:h-80">
              <div className="flex flex-col items-center justify-center relative cursor-pointer group">
                <AnimatedCharacter
                  config={character}
                  state={characterState}
                  size="xl"
                  onClick={handlePokeCharacter}
                  animationsEnabled={profile.animationsEnabled !== false}
                />
                <span className="absolute -bottom-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Tap to poke me!
                </span>
              </div>
            </CharacterStage>

            {/* Quick Stop / Resume Animation Button */}
            {onToggleAnimations && (
              <button
                onClick={onToggleAnimations}
                className={`absolute top-3 right-3 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 backdrop-blur-md ${
                  profile.animationsEnabled !== false
                    ? 'bg-rose-500/90 hover:bg-rose-600 text-white border border-rose-400 hover:scale-105 active:scale-95'
                    : 'bg-emerald-500/90 hover:bg-emerald-600 text-white border border-emerald-400 hover:scale-105 active:scale-95'
                }`}
                title={
                  profile.animationsEnabled !== false
                    ? 'Stop character animations on screen'
                    : 'Resume character animations'
                }
              >
                {profile.animationsEnabled !== false ? (
                  <>
                    <Square className="w-3 h-3 fill-white" />
                    <span>🛑 Stop Animation</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-white" />
                    <span>▶ Play Animation</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Speech Bubble & Assistant Controls (Right) */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-4">
          <CharacterBubble
            message={bubbleText}
            badge={isSpeaking ? 'Speaking...' : undefined}
            onSpeak={() => speakMessage(bubbleText)}
            className="w-full"
          />

          {/* Quick Stats & Next Activity Card */}
          <div className="space-y-3">
            {/* Next Activity Ticker */}
            {nextEvent ? (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Next Activity
                  </span>
                  <span className="bg-amber-200/70 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full font-mono">
                    Starts in {nextCountdown?.formatted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-white text-base">
                    {nextEvent.title}
                  </h4>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {formatTimeDisplay(nextEvent.startTime, profile.timeFormat)}
                  </span>
                </div>
              </div>
            ) : activeEvent ? (
              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Happening Right Now
                  </span>
                  <span className="bg-indigo-200/70 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 px-2 py-0.5 rounded-full font-mono">
                    Until {formatTimeDisplay(activeEvent.endTime, profile.timeFormat)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-white text-base">
                    {activeEvent.title}
                  </h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">
                    In Progress
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {totalCount > 0
                      ? "You've conquered today's schedule!"
                      : 'No scheduled activities for today yet!'}
                  </span>
                </div>
              </div>
            )}

            {/* Today's Progress Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                <span>Today's Progress</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  {completedCount}/{totalCount} Completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Action Buttons: Chat & Add Event & Desktop Pet */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                onClick={onOpenChat}
                className="flex-1 cartoon-btn flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>

              <button
                onClick={onOpenDesktopPet}
                className="cartoon-btn flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-slate-800 text-amber-900 dark:text-amber-300 font-bold text-xs sm:text-sm border border-amber-300 dark:border-slate-700 shadow-sm"
                title="Pop out Real Desktop Walking Pet"
              >
                <Monitor className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">Desktop Pet</span>
                <span className="sm:hidden">Pet</span>
              </button>

              <button
                onClick={onOpenAddEvent}
                className="cartoon-btn flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-amber-500/25"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
