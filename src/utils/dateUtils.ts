export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const todayStr = getTodayDateString();

  if (dateStr === todayStr) return 'Today';
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  if (dateStr === tomorrowStr) return 'Tomorrow';

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const formatFullDate = (date: Date = new Date()): string => {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTimeDisplay = (time24: string, format: '12h' | '24h' = '12h'): string => {
  if (!time24) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (format === '24h') {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

export const getTimeMinutes = (time24: string): number => {
  if (!time24) return 0;
  const [h, m] = time24.split(':').map(Number);
  return h * 60 + m;
};

export const getCurrentMinutes = (now: Date = new Date()): number => {
  return now.getHours() * 60 + now.getMinutes();
};

export const getEventStatus = (
  eventDate: string,
  startTime: string,
  endTime: string,
  completed: boolean,
  now: Date = new Date()
): 'completed' | 'in-progress' | 'missed' | 'upcoming' => {
  if (completed) return 'completed';

  const todayStr = getTodayDateString();
  if (eventDate < todayStr) return 'missed';
  if (eventDate > todayStr) return 'upcoming';

  const currentMins = getCurrentMinutes(now);
  const startMins = getTimeMinutes(startTime);
  const endMins = getTimeMinutes(endTime);

  if (currentMins < startMins) return 'upcoming';
  if (currentMins >= startMins && currentMins <= endMins) return 'in-progress';
  return 'missed';
};

export const getCountdown = (targetDateStr: string, targetTimeStr: string, now: Date = new Date()): {
  totalSeconds: number;
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  isPast: boolean;
} => {
  const [y, m, d] = targetDateStr.split('-').map(Number);
  const [hours, minutes] = targetTimeStr.split(':').map(Number);
  const targetDate = new Date(y, m - 1, d, hours, minutes, 0);

  const diffMs = targetDate.getTime() - now.getTime();
  const totalSeconds = Math.floor(diffMs / 1000);

  if (totalSeconds <= 0) {
    return {
      totalSeconds: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formatted: 'Starting now',
      isPast: true
    };
  }

  const h = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  let formatted = '';
  if (h > 0) {
    formatted = `${h}h ${mins}m ${s}s`;
  } else if (mins > 0) {
    formatted = `${mins}m ${s}s`;
  } else {
    formatted = `${s}s`;
  }

  return {
    totalSeconds,
    hours: h,
    minutes: mins,
    seconds: s,
    formatted,
    isPast: false
  };
};

export const addMinutesToTime = (time24: string, minutesToAdd: number): string => {
  const totalMins = (getTimeMinutes(time24) + minutesToAdd) % (24 * 60);
  const newH = Math.floor(totalMins / 60);
  const newM = totalMins % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};
