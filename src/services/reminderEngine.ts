import { AppNotification, ScheduleEvent } from '../types';
import { getCurrentMinutes, getTodayDateString, getTimeMinutes } from '../utils/dateUtils';
import { audioService } from './audioService';
import { storageService } from './storageService';

export interface ReminderAlert {
  event: ScheduleEvent;
  minutesLeft: number;
  message: string;
  isStartingNow: boolean;
}

type ReminderCallback = (alert: ReminderAlert) => void;

class ReminderEngine {
  private intervalId: number | null = null;
  private listeners: Set<ReminderCallback> = new Set();
  private lastCheckedMinute: number = -1;

  start() {
    if (this.intervalId !== null) return;
    this.checkReminders();
    this.intervalId = window.setInterval(() => {
      this.checkReminders();
    }, 4000);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  subscribe(cb: ReminderCallback) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  checkReminders() {
    const now = new Date();
    const todayStr = getTodayDateString();
    const currentMins = getCurrentMinutes(now);

    const events = storageService.getEvents();
    let eventsModified = false;

    events.forEach(event => {
      if (event.completed || event.date !== todayStr) return;

      const startMins = getTimeMinutes(event.startTime);
      const endMins = getTimeMinutes(event.endTime);
      const diffMins = startMins - currentMins;

      // Track missed tasks if passed endTime
      if (currentMins > endMins && !event.missed) {
        event.missed = true;
        eventsModified = true;
        storageService.addNotification({
          title: `Task Missed: ${event.title}`,
          message: `Your scheduled activity "${event.title}" ended at ${event.endTime}. Don't worry, let's reschedule!`,
          type: 'missed',
          eventId: event.id,
        });
      }

      if (diffMins < 0) return; // already past start time

      const remindedSteps = event.remindedSteps || [];

      // Check tiered reminders:
      // 1. Configured custom reminder (e.g. 30m or 15m)
      // 2. 10 minutes warning
      // 3. 0 minutes (starting now)
      const targetsToCheck = [
        { mins: event.reminderMinutes, label: `${event.reminderMinutes} minutes` },
        { mins: 10, label: '10 minutes' },
        { mins: 0, label: 'now' },
      ];

      for (const target of targetsToCheck) {
        if (target.mins < 0) continue;

        // Trigger if current remaining minutes is within [target.mins, target.mins - 1]
        // and hasn't been fired yet for this step
        if (diffMins <= target.mins && diffMins > target.mins - 2 && !remindedSteps.includes(target.mins)) {
          remindedSteps.push(target.mins);
          event.remindedSteps = remindedSteps;
          eventsModified = true;

          let message = '';
          const isStarting = target.mins === 0 || diffMins === 0;

          if (isStarting) {
            message = `It's time for your ${event.title}! 🚀`;
          } else if (target.mins === 10) {
            message = `Only 10 minutes left for ${event.title}! Get ready. ⏰`;
          } else {
            message = `⚠️ Your ${event.title} starts in ${diffMins} minutes!`;
          }

          // Trigger audio chime
          audioService.playChime();

          // Save notification
          storageService.addNotification({
            title: `Reminder: ${event.title}`,
            message,
            type: 'reminder',
            eventId: event.id,
          });

          // Dispatch to UI listeners
          const alertData: ReminderAlert = {
            event,
            minutesLeft: diffMins,
            message,
            isStartingNow: isStarting,
          };
          this.listeners.forEach(cb => cb(alertData));
          break;
        }
      }
    });

    if (eventsModified) {
      storageService.saveEvents(events);
    }
  }
}

export const reminderEngine = new ReminderEngine();
