import React from 'react';
import { NavigationTab } from '../../types';
import { audioService } from '../../services/audioService';
import {
  Home,
  Calendar,
  ClipboardList,
  Sparkles,
  Plus,
} from 'lucide-react';

interface MobileBottomBarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onOpenAddEvent: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddEvent,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t-2 border-amber-200/80 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl">
      {/* Home */}
      <button
        onClick={() => {
          audioService.playPop();
          onSelectTab('home');
        }}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          currentTab === 'home'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      {/* Calendar */}
      <button
        onClick={() => {
          audioService.playPop();
          onSelectTab('calendar');
        }}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          currentTab === 'calendar'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Calendar className="w-5 h-5" />
        <span>Calendar</span>
      </button>

      {/* Big Center Add Event Button */}
      <button
        onClick={() => {
          audioService.playPop();
          onOpenAddEvent();
        }}
        className="cartoon-btn -mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-white dark:ring-slate-900"
        title="Add Event"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* Schedule */}
      <button
        onClick={() => {
          audioService.playPop();
          onSelectTab('schedule');
        }}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          currentTab === 'schedule'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        <span>Schedule</span>
      </button>

      {/* Character */}
      <button
        onClick={() => {
          audioService.playPop();
          onSelectTab('character');
        }}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
          currentTab === 'character'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span>Character</span>
      </button>
    </div>
  );
};
