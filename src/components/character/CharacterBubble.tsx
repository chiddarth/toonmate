import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';

interface CharacterBubbleProps {
  message: string;
  isThought?: boolean;
  onSpeak?: () => void;
  className?: string;
  badge?: string;
}

export const CharacterBubble: React.FC<CharacterBubbleProps> = ({
  message,
  isThought = false,
  onSpeak,
  className = '',
  badge,
}) => {
  if (!message) return null;

  return (
    <div
      className={`relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-4 rounded-3xl border-2 border-amber-200/80 dark:border-indigo-900/60 shadow-lg text-slate-800 dark:text-slate-100 max-w-md anim-floating ${className}`}
    >
      {badge && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
          <Sparkles className="w-3 h-3" />
          {badge}
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <p className="text-sm md:text-base font-semibold leading-relaxed whitespace-pre-line font-['Nunito']">
          {message}
        </p>
        {onSpeak && (
          <button
            onClick={onSpeak}
            className="shrink-0 p-1.5 rounded-xl hover:bg-amber-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 transition-colors"
            title="Read aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bubble pointer tail */}
      {isThought ? (
        <div className="absolute -bottom-3 left-10 flex gap-1">
          <div className="w-3 h-3 rounded-full bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-indigo-900/60" />
          <div className="w-2 h-2 rounded-full bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-indigo-900/60 -mb-2" />
        </div>
      ) : (
        <div className="absolute -bottom-3 left-10 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white dark:border-t-slate-900 drop-shadow-sm" />
      )}
    </div>
  );
};
