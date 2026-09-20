import React from 'react';
import { BackgroundTheme } from '../../types';

interface CharacterStageProps {
  theme: BackgroundTheme;
  children: React.ReactNode;
  className?: string;
}

export const CharacterStage: React.FC<CharacterStageProps> = ({
  theme,
  children,
  className = '',
}) => {
  const getStageStyles = () => {
    switch (theme) {
      case 'cyber-lab':
        return {
          wrapper: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-cyan-950 border-cyan-500/30 text-cyan-200',
          floor: 'bg-cyan-900/30 border-t border-cyan-500/30',
          decor: (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
              <div className="absolute top-4 left-6 w-24 h-14 border border-cyan-400/40 rounded-lg p-1">
                <div className="h-1 bg-cyan-400 w-3/4 mb-1 rounded" />
                <div className="h-1 bg-cyan-400/50 w-1/2 mb-1 rounded" />
                <div className="h-1 bg-cyan-400/30 w-2/3 rounded" />
              </div>
              <div className="absolute top-8 right-8 w-16 h-16 rounded-full border border-teal-400/30 flex items-center justify-center animate-spin">
                <div className="w-10 h-10 border-t-2 border-teal-300 rounded-full" />
              </div>
            </div>
          ),
        };

      case 'sunny-park':
        return {
          wrapper: 'bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 border-emerald-400/30 text-emerald-900',
          floor: 'bg-gradient-to-r from-emerald-400 to-green-500 rounded-b-3xl',
          decor: (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Sun */}
              <div className="absolute top-4 right-8 w-14 h-14 rounded-full bg-amber-300/80 blur-[2px] shadow-[0_0_20px_#fde047]" />
              {/* Cloud */}
              <div className="absolute top-8 left-8 bg-white/80 rounded-full w-20 h-7" />
              <div className="absolute top-6 left-12 bg-white/80 rounded-full w-12 h-10" />
            </div>
          ),
        };

      case 'cosmic-space':
        return {
          wrapper: 'bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 border-purple-500/30 text-purple-200',
          floor: 'bg-indigo-950/80 border-t border-purple-500/30',
          decor: (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-6 left-10 text-xs text-yellow-200 animate-pulse">✦</div>
              <div className="absolute top-14 right-14 text-sm text-yellow-100 animate-pulse">★</div>
              <div className="absolute top-24 left-1/3 text-xs text-cyan-200">✦</div>
              <div className="absolute bottom-16 right-10 w-16 h-16 rounded-full bg-purple-500/20 blur-xl" />
            </div>
          ),
        };

      case 'sunset-studio':
        return {
          wrapper: 'bg-gradient-to-b from-rose-400 via-amber-300 to-orange-200 border-rose-300 text-rose-950',
          floor: 'bg-amber-800/20 border-t border-amber-500/40',
          decor: (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -bottom-2 inset-x-0 flex items-end justify-center gap-2 opacity-20">
                <div className="w-12 h-20 bg-slate-900 rounded-t-md" />
                <div className="w-16 h-28 bg-slate-900 rounded-t-md" />
                <div className="w-10 h-16 bg-slate-900 rounded-t-md" />
                <div className="w-14 h-24 bg-slate-900 rounded-t-md" />
              </div>
            </div>
          ),
        };

      case 'cozy-study':
      default:
        return {
          wrapper: 'bg-gradient-to-b from-amber-100/90 via-orange-50 to-amber-100/60 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 border-amber-200 dark:border-slate-800 text-slate-800 dark:text-slate-100',
          floor: 'bg-amber-200/40 dark:bg-slate-800/60 border-t border-amber-300/40 dark:border-slate-700/50',
          decor: (
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
              {/* Bookshelf lines */}
              <div className="absolute top-6 left-6 w-20 flex items-end gap-1">
                <div className="w-3 h-10 bg-amber-700 rounded-t" />
                <div className="w-3 h-12 bg-emerald-700 rounded-t" />
                <div className="w-4 h-8 bg-indigo-700 rounded-t" />
                <div className="w-3 h-11 bg-rose-700 rounded-t" />
              </div>
              <div className="absolute top-6 right-6 text-xl">🪴</div>
            </div>
          ),
        };
    }
  };

  const style = getStageStyles();

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border-2 shadow-inner transition-colors duration-500 flex flex-col justify-between ${style.wrapper} ${className}`}
    >
      {style.decor}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </div>
      {/* Floor base shadow */}
      <div className={`relative z-10 w-full h-8 ${style.floor}`} />
    </div>
  );
};
