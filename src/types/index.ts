export type CharacterType = 
  | 'panda' 
  | 'robot' 
  | 'cat' 
  | 'dog' 
  | 'fox' 
  | 'superhero' 
  | 'shinchan' 
  | 'doraemon' 
  | 'pikachu' 
  | 'luffy' 
  | 'hattori';

export type CharacterState = 
  | 'idle' 
  | 'happy' 
  | 'sleeping' 
  | 'talking' 
  | 'excited' 
  | 'worried' 
  | 'celebrating' 
  | 'sad' 
  | 'thinking';

export type CharacterPersonality = 'friendly' | 'funny' | 'motivational' | 'calm' | 'energetic';

export type OutfitType = 'none' | 'glasses' | 'hat' | 'bowtie' | 'cape' | 'headphones' | 'scarf';

export type BackgroundTheme = 'cozy-study' | 'cyber-lab' | 'sunny-park' | 'cosmic-space' | 'sunset-studio';

export interface CharacterConfig {
  id: string;
  name: string;
  type: CharacterType;
  personality: CharacterPersonality;
  outfit: OutfitType;
  background: BackgroundTheme;
}

export type EventCategory = 
  | 'College' 
  | 'Work' 
  | 'Meeting' 
  | 'Study' 
  | 'Exercise' 
  | 'Personal' 
  | 'Other';

export type EventPriority = 'low' | 'medium' | 'high';

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h format internally)
  endTime: string; // HH:mm
  category: EventCategory;
  priority: EventPriority;
  reminderMinutes: number; // 0, 5, 10, 15, 30, 60, custom
  notes?: string;
  completed: boolean;
  completedAt?: string;
  missed?: boolean;
  remindedSteps?: number[]; // list of minutes triggered, e.g. [30, 10, 0]
}

export type NotificationType = 'reminder' | 'completed' | 'missed' | 'achievement' | 'summary' | 'info';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  eventId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  totalCompleted: number;
  totalMissed: number;
}

export interface UserProfile {
  name: string;
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  speechEnabled: boolean;
  speechVoice: string;
  speechSpeed: number; // 0.8 to 1.5
  speechPitch: number; // 0.8 to 1.5
  speechVolume: number; // 0 to 1
  defaultReminderMinutes: number;
  animationsEnabled: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'character';
  text: string;
  timestamp: string;
  actionSuggestion?: string;
}

export type NavigationTab = 
  | 'home' 
  | 'calendar' 
  | 'schedule' 
  | 'character' 
  | 'progress' 
  | 'notifications' 
  | 'settings';
