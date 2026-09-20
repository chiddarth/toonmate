import React, { useState } from 'react';
import { ScheduleEvent, UserProfile } from '../../types';
import {
  formatTimeDisplay,
  getTodayDateString,
} from '../../utils/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface CalendarViewProps {
  events: ScheduleEvent[];
  profile: UserProfile;
  onAddEventForDate: (dateStr: string) => void;
  onToggleComplete: (id: string) => void;
  onEditEvent: (event: ScheduleEvent) => void;
}

type CalendarMode = 'month' | 'week' | 'day';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  profile,
  onAddEventForDate,
  onToggleComplete,
  onEditEvent,
}) => {
  const [mode, setMode] = useState<CalendarMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getTodayDateString());

  const todayStr = getTodayDateString();

  // Navigation handlers
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (mode === 'month') {
      next.setMonth(next.getMonth() - 1);
    } else if (mode === 'week') {
      next.setDate(next.getDate() - 7);
    } else {
      next.setDate(next.getDate() - 1);
    }
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (mode === 'month') {
      next.setMonth(next.getMonth() + 1);
    } else if (mode === 'week') {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + 1);
    }
    setCurrentDate(next);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(todayStr);
  };

  // Format month and year title
  const monthYearTitle = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  // Events for selected date
  const selectedDateEvents = events
    .filter(e => e.date === selectedDateStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // --- MONTH VIEW LOGIC ---
  const renderMonthGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayIndex = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = lastDay.getDate();

    // Days from previous month to fill leading row
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const cells: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    for (let i = startDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, d);
      const mStr = String(prevDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      cells.push({
        dateStr: `${prevDate.getFullYear()}-${mStr}-${dStr}`,
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(i).padStart(2, '0');
      cells.push({
        dateStr: `${year}-${mStr}-${dStr}`,
        dayNum: i,
        isCurrentMonth: true,
      });
    }

    // Fill trailing row
    const totalCellsNeeded = Math.ceil(cells.length / 7) * 7;
    let nextMonthDay = 1;
    while (cells.length < totalCellsNeeded) {
      const nextDate = new Date(year, month + 1, nextMonthDay);
      const mStr = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dStr = String(nextMonthDay).padStart(2, '0');
      cells.push({
        dateStr: `${nextDate.getFullYear()}-${mStr}-${dStr}`,
        dayNum: nextMonthDay,
        isCurrentMonth: false,
      });
      nextMonthDay++;
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="space-y-2">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 dark:text-slate-400 py-1">
          {weekDays.map(w => (
            <div key={w}>{w}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5 md:gap-2">
          {cells.map(cell => {
            const isToday = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDateStr;
            const cellEvents = events.filter(e => e.date === cell.dateStr);

            return (
              <div
                key={cell.dateStr}
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`min-h-[72px] md:min-h-[85px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-400/40'
                    : isToday
                    ? 'border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : cell.isCurrentMonth
                    ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-300'
                    : 'border-transparent bg-slate-50/40 dark:bg-slate-900/30 opacity-45'
                }`}
              >
                {/* Day number & today marker */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isSelected
                        ? 'bg-amber-500 text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {cellEvents.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      {cellEvents.length}
                    </span>
                  )}
                </div>

                {/* Event previews in cell */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {cellEvents.slice(0, 2).map(ev => (
                    <div
                      key={ev.id}
                      className={`text-[10px] font-semibold truncate px-1.5 py-0.5 rounded-lg ${
                        ev.completed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 line-through'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {cellEvents.length > 2 && (
                    <div className="text-[9px] text-slate-400 font-bold px-1">
                      +{cellEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // --- WEEK VIEW LOGIC ---
  const renderWeekView = () => {
    // Determine the start of week (Sunday)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const days: { dateStr: string; dateObj: Date; dayName: string; dayNum: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const mStr = String(d.getMonth() + 1).padStart(2, '0');
      const dStr = String(d.getDate()).padStart(2, '0');
      days.push({
        dateStr: `${d.getFullYear()}-${mStr}-${dStr}`,
        dateObj: d,
        dayName: d.toLocaleDateString(undefined, { weekday: 'short' }),
        dayNum: d.getDate(),
      });
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {days.map(day => {
          const isToday = day.dateStr === todayStr;
          const isSelected = day.dateStr === selectedDateStr;
          const dayEvents = events
            .filter(e => e.date === day.dateStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={day.dateStr}
              onClick={() => setSelectedDateStr(day.dateStr)}
              className={`cartoon-card p-3 rounded-3xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 ring-2 ring-amber-400/40'
                  : isToday
                  ? 'border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{day.dayName}</p>
                  <p
                    className={`text-base font-extrabold ${
                      isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-white'
                    }`}
                  >
                    {day.dayNum}
                  </p>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    onAddEventForDate(day.dateStr);
                  }}
                  className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-slate-500 transition-colors"
                  title="Add event"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Day's Event List */}
              <div className="space-y-2 flex-1 min-h-[120px]">
                {dayEvents.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-4">No events</p>
                ) : (
                  dayEvents.map(ev => (
                    <div
                      key={ev.id}
                      onClick={e => {
                        e.stopPropagation();
                        onEditEvent(ev);
                      }}
                      className={`p-2 rounded-2xl text-xs font-bold border transition-all ${
                        ev.completed
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300 line-through'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                        <span>{formatTimeDisplay(ev.startTime, profile.timeFormat)}</span>
                        <span>{ev.category}</span>
                      </div>
                      <p className="truncate font-semibold">{ev.title}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // --- DAY VIEW LOGIC ---
  const renderDayView = () => {
    const dayDate = new Date(selectedDateStr + 'T00:00:00');
    const dayEvents = events
      .filter(e => e.date === selectedDateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Hours from 07:00 to 22:00
    const hours = Array.from({ length: 16 }, (_, i) => i + 7);

    return (
      <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              {dayDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <p className="text-xs text-slate-500">{dayEvents.length} activities scheduled</p>
          </div>

          <button
            onClick={() => onAddEventForDate(selectedDateStr)}
            className="cartoon-btn px-3 py-1.5 rounded-2xl bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to this Day</span>
          </button>
        </div>

        {/* Hourly schedule blocks */}
        <div className="space-y-2">
          {hours.map(hour => {
            const timeSlot24 = `${String(hour).padStart(2, '0')}:00`;
            const matchingEvents = dayEvents.filter(e => {
              const startH = parseInt(e.startTime.split(':')[0], 10);
              return startH === hour;
            });

            return (
              <div key={hour} className="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-800/60">
                <span className="w-16 font-mono text-xs font-bold text-slate-400 shrink-0">
                  {formatTimeDisplay(timeSlot24, profile.timeFormat)}
                </span>

                <div className="flex-1 space-y-2">
                  {matchingEvents.map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => onEditEvent(ev)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        ev.completed
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300 line-through'
                          : 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm">{ev.title}</span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                            {ev.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                          {formatTimeDisplay(ev.startTime, profile.timeFormat)} – {formatTimeDisplay(ev.endTime, profile.timeFormat)}
                        </p>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onToggleComplete(ev.id);
                        }}
                        className={`p-1.5 rounded-xl text-xs font-bold ${
                          ev.completed ? 'text-emerald-600 bg-emerald-100' : 'text-slate-500 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Top Bar */}
      <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Navigation & Month Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white min-w-[180px]">
              {monthYearTitle}
            </h2>

            <button
              onClick={handleNext}
              className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
            >
              Today
            </button>
          </div>

          {/* Mode Selector & Quick Add */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-2xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setMode('month')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  mode === 'month' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setMode('week')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  mode === 'week' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setMode('day')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  mode === 'day' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500'
                }`}
              >
                Day
              </button>
            </div>

            <button
              onClick={() => onAddEventForDate(selectedDateStr)}
              className="cartoon-btn flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Display */}
      {mode === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Month Calendar Grid (Left 8 cols) */}
          <div className="lg:col-span-8 cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-4 md:p-5 shadow-xl">
            {renderMonthGrid()}
          </div>

          {/* Selected Date Inspector (Right 4 cols) */}
          <div className="lg:col-span-4 cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">
                    {selectedDateStr === todayStr ? 'Today' : selectedDateStr}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={() => onAddEventForDate(selectedDateStr)}
                  className="p-2 rounded-2xl bg-amber-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-amber-700 dark:text-amber-400 transition-colors"
                  title="Add Event"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-2xl mb-1">🍃</p>
                    <p className="text-xs font-semibold">No activities on this date.</p>
                  </div>
                ) : (
                  selectedDateEvents.map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => onEditEvent(ev)}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-amber-400 transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeDisplay(ev.startTime, profile.timeFormat)}
                        </span>
                        <span className="font-sans px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {ev.category}
                        </span>
                      </div>
                      <h4
                        className={`text-sm font-bold text-slate-800 dark:text-white ${
                          ev.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {ev.title}
                      </h4>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onAddEventForDate(selectedDateStr)}
                className="w-full cartoon-btn py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Activity to {selectedDateStr}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'week' && renderWeekView()}
      {mode === 'day' && renderDayView()}
    </div>
  );
};
