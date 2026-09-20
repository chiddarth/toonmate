import React, { useState, useEffect, useCallback } from 'react';
import {
  Achievement,
  AppNotification,
  CharacterConfig,
  NavigationTab,
  ScheduleEvent,
  UserProfile,
  UserProgress,
} from './types';
import { storageService } from './services/storageService';
import { audioService } from './services/audioService';
import { speechService } from './services/speechService';
import { reminderEngine, ReminderAlert } from './services/reminderEngine';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { CharacterCard } from './components/character/CharacterCard';
import { TodayTimeline } from './components/timeline/TodayTimeline';
import { ScheduleView } from './components/schedule/ScheduleView';
import { CalendarView } from './components/calendar/CalendarView';
import { WardrobeCustomizer } from './components/character/WardrobeCustomizer';
import { ProgressView } from './components/progress/ProgressView';
import { SettingsView } from './components/settings/SettingsView';
import { EventModal } from './components/schedule/EventModal';
import { CharacterChatModal } from './components/chat/CharacterChatModal';
import { DailySummaryModal } from './components/summary/DailySummaryModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ReminderToast } from './components/notifications/ReminderToast';
import { addMinutesToTime, getTodayDateString } from './utils/dateUtils';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  // --- STATE ---
  const [events, setEvents] = useState<ScheduleEvent[]>(() => storageService.getEvents());
  const [character, setCharacter] = useState<CharacterConfig>(() => storageService.getCharacter());
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [progress, setProgress] = useState<UserProgress>(() => storageService.getProgress());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storageService.getAchievements());
  const [notifications, setNotifications] = useState<AppNotification[]>(() => storageService.getNotifications());

  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [modalDefaultDate, setModalDefaultDate] = useState<string | undefined>(undefined);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDailySummaryOpen, setIsDailySummaryOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [activeAlert, setActiveAlert] = useState<ReminderAlert | null>(null);

  // Sync theme on HTML root
  useEffect(() => {
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.theme]);

  // Audio & Speech init
  useEffect(() => {
    audioService.setSoundEnabled(profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Initialize reminder engine and subscribe to alert notifications
  useEffect(() => {
    reminderEngine.start();
    const unsubscribe = reminderEngine.subscribe((alert: ReminderAlert) => {
      setActiveAlert(alert);
      setNotifications(storageService.getNotifications());

      if (profile.speechEnabled) {
        speechService.speak(alert.message, {
          voiceName: profile.speechVoice,
          rate: profile.speechSpeed,
          pitch: profile.speechPitch,
          volume: profile.speechVolume,
          enabled: true,
        });
      }
    });

    return () => {
      unsubscribe();
      reminderEngine.stop();
    };
  }, [profile]);

  // Achievement Check helper
  const checkAchievements = useCallback((allEventsList: ScheduleEvent[], updatedProgress: UserProgress) => {
    const achs = storageService.getAchievements();
    let updated = false;

    // 1. First Task Completed
    if (updatedProgress.totalCompleted >= 1) {
      const ach = achs.find(a => a.id === 'ach-first-task');
      if (ach && !ach.unlocked) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        ach.progress = 1;
        updated = true;
        triggerAchievementUnlock(ach);
      }
    }

    // 2. 10 Tasks Completed
    const ach10 = achs.find(a => a.id === 'ach-10-tasks');
    if (ach10) {
      ach10.progress = Math.min(ach10.maxProgress, updatedProgress.totalCompleted);
      if (updatedProgress.totalCompleted >= 10 && !ach10.unlocked) {
        ach10.unlocked = true;
        ach10.unlockedAt = new Date().toISOString();
        updated = true;
        triggerAchievementUnlock(ach10);
      }
    }

    // 3. 3-Day Streak
    const achStreak = achs.find(a => a.id === 'ach-streak-3');
    if (achStreak) {
      achStreak.progress = Math.min(achStreak.maxProgress, updatedProgress.streakDays);
      if (updatedProgress.streakDays >= 3 && !achStreak.unlocked) {
        achStreak.unlocked = true;
        achStreak.unlockedAt = new Date().toISOString();
        updated = true;
        triggerAchievementUnlock(achStreak);
      }
    }

    // 4. Perfect Day
    const today = getTodayDateString();
    const todayList = allEventsList.filter(e => e.date === today);
    if (todayList.length > 0 && todayList.every(e => e.completed)) {
      const achPerf = achs.find(a => a.id === 'ach-perfect-day');
      if (achPerf && !achPerf.unlocked) {
        achPerf.unlocked = true;
        achPerf.unlockedAt = new Date().toISOString();
        achPerf.progress = achPerf.maxProgress;
        updated = true;
        triggerAchievementUnlock(achPerf);
      }
    }

    if (updated) {
      storageService.saveAchievements(achs);
      setAchievements([...achs]);
    }
  }, []);

  const triggerAchievementUnlock = (ach: Achievement) => {
    audioService.playAchievement();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ec4899', '#6366f1', '#10b981'],
    });

    const notif = storageService.addNotification({
      title: `🏆 Achievement Unlocked: ${ach.title}!`,
      message: `${ach.description} (+100 Bonus XP!)`,
      type: 'achievement',
    });

    const newProg = storageService.addXP(100);
    setProgress({ ...newProg });
    setNotifications(prev => [notif, ...prev]);

    if (profile.speechEnabled) {
      speechService.speak(`Hooray! You unlocked an achievement: ${ach.title}!`, {
        voiceName: profile.speechVoice,
        rate: profile.speechSpeed,
        pitch: profile.speechPitch,
        volume: profile.speechVolume,
      });
    }
  };

  // --- CRUD HANDLERS ---
  const handleSaveEvent = (
    data: Omit<ScheduleEvent, 'id' | 'completed' | 'completedAt'> & { id?: string }
  ) => {
    let updatedList: ScheduleEvent[];
    if (data.id) {
      // Edit
      storageService.updateEvent(data.id, data);
      updatedList = storageService.getEvents();
    } else {
      // Create
      storageService.createEvent({
        ...data,
        completed: false,
      });
      updatedList = storageService.getEvents();
    }
    setEvents(updatedList);
  };

  const handleDeleteEvent = (id: string) => {
    audioService.playPop();
    storageService.deleteEvent(id);
    setEvents(storageService.getEvents());
  };

  const handleToggleComplete = (id: string) => {
    const { event, xpGained } = storageService.toggleCompleteEvent(id);
    if (!event) return;

    const updatedEvents = storageService.getEvents();
    const updatedProg = storageService.getProgress();
    setEvents(updatedEvents);
    setProgress(updatedProg);

    if (event.completed) {
      // Add completed notification
      const notif = storageService.addNotification({
        title: `Task Completed: ${event.title}`,
        message: `Great job finishing "${event.title}"! You earned +${xpGained} XP.`,
        type: 'completed',
        eventId: event.id,
      });
      setNotifications(prev => [notif, ...prev]);

      // Check achievements
      checkAchievements(updatedEvents, updatedProg);
    }
  };

  const handleReschedule = (id: string, minutes: number) => {
    audioService.playPop();
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    const newStart = addMinutesToTime(ev.startTime, minutes);
    const newEnd = addMinutesToTime(ev.endTime, minutes);

    storageService.updateEvent(id, {
      startTime: newStart,
      endTime: newEnd,
      missed: false,
      remindedSteps: [],
    });
    setEvents(storageService.getEvents());
  };

  const handleRescheduleTomorrow = (id: string) => {
    audioService.playPop();
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const tomStr = `${tom.getFullYear()}-${String(tom.getMonth() + 1).padStart(2, '0')}-${String(tom.getDate()).padStart(2, '0')}`;

    storageService.updateEvent(id, {
      date: tomStr,
      missed: false,
      remindedSteps: [],
    });
    setEvents(storageService.getEvents());
  };

  // --- CHARACTER & PROFILE ---
  const handleSaveCharacter = (newConfig: CharacterConfig) => {
    storageService.saveCharacter(newConfig);
    setCharacter(newConfig);
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    storageService.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const handleToggleSound = () => {
    const newVal = !profile.soundEnabled;
    const updated = { ...profile, soundEnabled: newVal };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleToggleTheme = () => {
    const newTheme = profile.theme === 'dark' ? 'light' : 'dark';
    const updated: UserProfile = { ...profile, theme: newTheme };
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  // --- DATA IMPORT / EXPORT ---
  const handleExportData = () => {
    audioService.playPop();
    const jsonStr = storageService.exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `toonmate_backup_${getTodayDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string): boolean => {
    const success = storageService.importDataJson(jsonStr);
    if (success) {
      setEvents(storageService.getEvents());
      setCharacter(storageService.getCharacter());
      setProfile(storageService.getProfile());
      setProgress(storageService.getProgress());
      setAchievements(storageService.getAchievements());
      setNotifications(storageService.getNotifications());
    }
    return success;
  };

  const handleResetDemoData = () => {
    audioService.playPop();
    storageService.resetAllData();
    setEvents(storageService.getEvents());
    setCharacter(storageService.getCharacter());
    setProfile(storageService.getProfile());
    setProgress(storageService.getProgress());
    setAchievements(storageService.getAchievements());
    setNotifications(storageService.getNotifications());
    alert('Reset to initial demo activities complete!');
  };

  // --- NOTIFICATIONS ---
  const handleMarkNotifRead = (id: string) => {
    storageService.markNotificationRead(id);
    setNotifications(storageService.getNotifications());
  };

  const handleMarkAllNotifsRead = () => {
    storageService.markAllNotificationsRead();
    setNotifications(storageService.getNotifications());
  };

  const handleClearAllNotifs = () => {
    storageService.clearNotifications();
    setNotifications([]);
  };

  // Today's events filter
  const todayStr = getTodayDateString();
  const todayEvents = events.filter(e => e.date === todayStr);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200 pb-20 md:pb-10 font-['Nunito']">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        character={character}
        profile={profile}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenAddEvent={() => {
          setEditingEvent(null);
          setModalDefaultDate(getTodayDateString());
          setIsEventModalOpen(true);
        }}
        onOpenDailySummary={() => setIsDailySummaryOpen(true)}
        onToggleSound={handleToggleSound}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-5 sm:pt-6 space-y-6 flex-1">
        {/* Navigation Tabs (Desktop / Tablet) */}
        <div className="hidden md:block">
          <Navigation
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            unreadNotifsCount={unreadNotifsCount}
          />
        </div>

        {/* Dynamic View Content */}
        {currentTab === 'home' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Col: Mascot Stage Card */}
            <div className="lg:col-span-6 space-y-6">
              <CharacterCard
                character={character}
                profile={profile}
                todayEvents={todayEvents}
                onOpenChat={() => setIsChatOpen(true)}
                onOpenAddEvent={() => {
                  setEditingEvent(null);
                  setModalDefaultDate(getTodayDateString());
                  setIsEventModalOpen(true);
                }}
                streakDays={progress.streakDays}
              />
            </div>

            {/* Right Col: Today's Timeline */}
            <div className="lg:col-span-6 space-y-6">
              <TodayTimeline
                events={todayEvents}
                profile={profile}
                onToggleComplete={handleToggleComplete}
                onEdit={ev => {
                  setEditingEvent(ev);
                  setIsEventModalOpen(true);
                }}
                onDelete={handleDeleteEvent}
                onReschedule={handleReschedule}
                onRescheduleTomorrow={handleRescheduleTomorrow}
                onAddEvent={() => {
                  setEditingEvent(null);
                  setModalDefaultDate(getTodayDateString());
                  setIsEventModalOpen(true);
                }}
              />
            </div>
          </div>
        )}

        {currentTab === 'calendar' && (
          <CalendarView
            events={events}
            profile={profile}
            onAddEventForDate={dateStr => {
              setEditingEvent(null);
              setModalDefaultDate(dateStr);
              setIsEventModalOpen(true);
            }}
            onToggleComplete={handleToggleComplete}
            onEditEvent={ev => {
              setEditingEvent(ev);
              setIsEventModalOpen(true);
            }}
          />
        )}

        {currentTab === 'schedule' && (
          <ScheduleView
            events={events}
            profile={profile}
            onToggleComplete={handleToggleComplete}
            onEdit={ev => {
              setEditingEvent(ev);
              setIsEventModalOpen(true);
            }}
            onDelete={handleDeleteEvent}
            onReschedule={handleReschedule}
            onRescheduleTomorrow={handleRescheduleTomorrow}
            onAddEvent={() => {
              setEditingEvent(null);
              setModalDefaultDate(getTodayDateString());
              setIsEventModalOpen(true);
            }}
          />
        )}

        {currentTab === 'character' && (
          <WardrobeCustomizer
            character={character}
            onSave={handleSaveCharacter}
            onSpeakPreview={text => {
              speechService.speak(text, {
                voiceName: profile.speechVoice,
                rate: profile.speechSpeed,
                pitch: profile.speechPitch,
                volume: profile.speechVolume,
                enabled: profile.speechEnabled,
              });
            }}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            progress={progress}
            achievements={achievements}
            todayEvents={todayEvents}
            allEvents={events}
            character={character}
          />
        )}

        {currentTab === 'notifications' && (
          <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  🔔 Notifications & Activity Log
                </h2>
                <p className="text-xs text-slate-500">
                  {notifications.length} total recorded notifications
                </p>
              </div>

              {notifications.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-bold">
                  <button
                    onClick={handleMarkAllNotifsRead}
                    className="px-3 py-1.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={handleClearAllNotifs}
                    className="px-3 py-1.5 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <p className="text-3xl mb-2">🔔</p>
                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">
                    No notifications yet
                  </h4>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkNotifRead(n.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      n.read
                        ? 'bg-slate-50/70 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 opacity-70'
                        : 'bg-white dark:bg-slate-800 border-amber-300 dark:border-slate-700 shadow-sm ring-1 ring-amber-400/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                        {n.title}
                      </h4>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {currentTab === 'settings' && (
          <SettingsView
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onExportData={handleExportData}
            onImportData={handleImportData}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddEvent={() => {
          setEditingEvent(null);
          setModalDefaultDate(getTodayDateString());
          setIsEventModalOpen(true);
        }}
      />

      {/* --- MODALS & DRAWERS --- */}

      {/* Add / Edit Event Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        initialEvent={editingEvent}
        defaultDate={modalDefaultDate}
      />

      {/* Interactive Mascot Chat Assistant */}
      <CharacterChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        character={character}
        profile={profile}
        todayEvents={todayEvents}
        allEvents={events}
        onAddEventRequested={() => {
          setEditingEvent(null);
          setModalDefaultDate(getTodayDateString());
          setIsEventModalOpen(true);
        }}
      />

      {/* Daily Summary Modal */}
      <DailySummaryModal
        isOpen={isDailySummaryOpen}
        onClose={() => setIsDailySummaryOpen(false)}
        character={character}
        profile={profile}
        todayEvents={todayEvents}
        streakDays={progress.streakDays}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotifRead}
        onMarkAllRead={handleMarkAllNotifsRead}
        onClearAll={handleClearAllNotifs}
      />

      {/* Real-time Reminder Alert Toast */}
      <ReminderToast
        alert={activeAlert}
        character={character}
        onDismiss={() => setActiveAlert(null)}
        onSnooze={handleReschedule}
        onComplete={handleToggleComplete}
        onSpeak={text => {
          speechService.speak(text, {
            voiceName: profile.speechVoice,
            rate: profile.speechSpeed,
            pitch: profile.speechPitch,
            volume: profile.speechVolume,
            enabled: true,
          });
        }}
      />
    </div>
  );
};

export default App;
