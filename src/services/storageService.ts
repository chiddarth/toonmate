import {
  Achievement,
  AppNotification,
  CharacterConfig,
  ScheduleEvent,
  UserProfile,
  UserProgress,
} from '../types';
import { getTodayDateString } from '../utils/dateUtils';
import {
  getInitialEvents,
  initialAchievements,
  initialCharacter,
  initialProfile,
  initialProgress,
} from '../utils/demoData';

const STORAGE_KEYS = {
  EVENTS: 'toonmate_events_v1',
  CHARACTER: 'toonmate_character_v1',
  PROFILE: 'toonmate_profile_v1',
  PROGRESS: 'toonmate_progress_v1',
  ACHIEVEMENTS: 'toonmate_achievements_v1',
  NOTIFICATIONS: 'toonmate_notifications_v1',
};

class StorageService {
  // --- EVENTS ---
  getEvents(): ScheduleEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      const initial = getInitialEvents();
      this.saveEvents(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return getInitialEvents();
    }
  }

  saveEvents(events: ScheduleEvent[]): void {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }

  createEvent(event: Omit<ScheduleEvent, 'id'>): ScheduleEvent {
    const events = this.getEvents();
    const newEvent: ScheduleEvent = {
      ...event,
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    };
    events.push(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<ScheduleEvent>): ScheduleEvent | null {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;
    const updated = { ...events[index], ...updates };
    events[index] = updated;
    this.saveEvents(events);
    return updated;
  }

  deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filtered = events.filter(e => e.id !== id);
    if (filtered.length !== events.length) {
      this.saveEvents(filtered);
      return true;
    }
    return false;
  }

  getTodayEvents(): ScheduleEvent[] {
    const today = getTodayDateString();
    return this.getEvents().filter(e => e.date === today);
  }

  getUpcomingEvents(): ScheduleEvent[] {
    const today = getTodayDateString();
    return this.getEvents().filter(e => e.date >= today && !e.completed);
  }

  toggleCompleteEvent(id: string): { event: ScheduleEvent | null; xpGained: number } {
    const events = this.getEvents();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return { event: null, xpGained: 0 };

    const event = events[index];
    const newCompleted = !event.completed;
    event.completed = newCompleted;
    event.completedAt = newCompleted ? new Date().toISOString() : undefined;
    this.saveEvents(events);

    let xp = 0;
    if (newCompleted) {
      xp = event.priority === 'high' ? 80 : event.priority === 'medium' ? 50 : 30;
      this.addXP(xp);
      this.incrementTotalCompleted();
    }

    return { event, xpGained: xp };
  }

  // --- CHARACTER ---
  getCharacter(): CharacterConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.CHARACTER);
    if (!raw) {
      this.saveCharacter(initialCharacter);
      return initialCharacter;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialCharacter;
    }
  }

  saveCharacter(character: CharacterConfig): void {
    localStorage.setItem(STORAGE_KEYS.CHARACTER, JSON.stringify(character));
  }

  // --- USER PROFILE ---
  getProfile(): UserProfile {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      this.saveProfile(initialProfile);
      return initialProfile;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialProfile;
    }
  }

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // --- USER PROGRESS & XP ---
  getProgress(): UserProgress {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) {
      this.saveProgress(initialProgress);
      return initialProgress;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialProgress;
    }
  }

  saveProgress(progress: UserProgress): void {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }

  addXP(amount: number): UserProgress {
    const prog = this.getProgress();
    prog.xp += amount;
    // Every 300 XP = 1 Level
    prog.level = Math.floor(prog.xp / 300) + 1;
    this.saveProgress(prog);
    return prog;
  }

  incrementTotalCompleted(): void {
    const prog = this.getProgress();
    prog.totalCompleted = (prog.totalCompleted || 0) + 1;
    const today = getTodayDateString();
    if (prog.lastActiveDate !== today) {
      prog.streakDays = (prog.streakDays || 0) + 1;
      prog.lastActiveDate = today;
    }
    this.saveProgress(prog);
  }

  // --- ACHIEVEMENTS ---
  getAchievements(): Achievement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!raw) {
      this.saveAchievements(initialAchievements);
      return initialAchievements;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialAchievements;
    }
  }

  saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  unlockAchievement(id: string): Achievement | null {
    const list = this.getAchievements();
    const item = list.find(a => a.id === id);
    if (item && !item.unlocked) {
      item.unlocked = true;
      item.unlockedAt = new Date().toISOString();
      item.progress = item.maxProgress;
      this.saveAchievements(list);
      return item;
    }
    return null;
  }

  // --- NOTIFICATIONS ---
  getNotifications(): AppNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      const initial: AppNotification[] = [
        {
          id: 'notif-1',
          title: 'Welcome to ToonMate! 🎉',
          message: 'Your cartoon virtual companion is ready to help you manage your day.',
          type: 'info',
          timestamp: new Date().toISOString(),
          read: false,
        },
      ];
      this.saveNotifications(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  saveNotifications(notifications: AppNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): AppNotification {
    const list = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      read: false,
    };
    list.unshift(newNotif);
    // Keep max 50
    this.saveNotifications(list.slice(0, 50));
    return newNotif;
  }

  markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      this.saveNotifications(list);
    }
  }

  markAllNotificationsRead(): void {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    this.saveNotifications(list);
  }

  clearNotifications(): void {
    this.saveNotifications([]);
  }

  // --- RESET & EXPORT ---
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.CHARACTER);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    this.saveEvents(getInitialEvents());
    this.saveCharacter(initialCharacter);
    this.saveProfile(initialProfile);
    this.saveProgress(initialProgress);
    this.saveAchievements(initialAchievements);
  }

  exportDataJson(): string {
    const data = {
      events: this.getEvents(),
      character: this.getCharacter(),
      profile: this.getProfile(),
      progress: this.getProgress(),
      achievements: this.getAchievements(),
      notifications: this.getNotifications(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importDataJson(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.events) this.saveEvents(data.events);
      if (data.character) this.saveCharacter(data.character);
      if (data.profile) this.saveProfile(data.profile);
      if (data.progress) this.saveProgress(data.progress);
      if (data.achievements) this.saveAchievements(data.achievements);
      if (data.notifications) this.saveNotifications(data.notifications);
      return true;
    } catch {
      return false;
    }
  }
}

export const storageService = new StorageService();
