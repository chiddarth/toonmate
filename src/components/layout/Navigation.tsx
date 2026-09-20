import React from 'react';
import { NavigationTab } from '../../types';
import { audioService } from '../../services/audioService';
import {
  Home,
  Calendar,
  ClipboardList,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react';

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  unreadNotifsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  unreadNotifsCount,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'character', label: 'My Character', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 className="w-4 h-4" /> },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <div className="relative">
          <Bell className="w-4 h-4" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </div>
      ),
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <nav className="flex items-center gap-1.5 p-1.5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 shadow-sm overflow-x-auto scrollbar-none">
      {tabs.map(tab => {
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              audioService.playPop();
              onSelectTab(tab.id);
            }}
            className={`cartoon-btn flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-102'
                : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
