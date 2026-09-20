import React, { useState, useEffect } from 'react';
import { EventCategory, EventPriority, ScheduleEvent } from '../../types';
import { getTodayDateString } from '../../utils/dateUtils';
import { audioService } from '../../services/audioService';
import {
  X,
  Calendar,
  Clock,
  Tag,
  AlertTriangle,
  Bell,
  AlignLeft,
  Check,
} from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<ScheduleEvent, 'id' | 'completed' | 'completedAt'> & { id?: string }) => void;
  initialEvent?: ScheduleEvent | null;
  defaultDate?: string;
}

const CATEGORIES: { name: EventCategory; emoji: string; color: string }[] = [
  { name: 'College', emoji: '🎓', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { name: 'Work', emoji: '💼', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { name: 'Meeting', emoji: '🤝', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { name: 'Study', emoji: '📚', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { name: 'Exercise', emoji: '🏃', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { name: 'Personal', emoji: '🧘', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { name: 'Other', emoji: '✨', color: 'bg-slate-100 text-slate-800 border-slate-300' },
];

const PRIORITIES: { value: EventPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40' },
  { value: 'medium', label: 'Medium', color: 'text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/40' },
  { value: 'high', label: 'High', color: 'text-rose-600 border-rose-300 bg-rose-50 dark:bg-rose-950/40' },
];

const REMINDER_OPTIONS = [
  { value: 0, label: 'At start time' },
  { value: 5, label: '5 minutes before' },
  { value: 10, label: '10 minutes before' },
  { value: 15, label: '15 minutes before' },
  { value: 30, label: '30 minutes before' },
  { value: 60, label: '1 hour before' },
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent,
  defaultDate,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayDateString());
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [category, setCategory] = useState<EventCategory>('College');
  const [priority, setPriority] = useState<EventPriority>('medium');
  const [reminderMinutes, setReminderMinutes] = useState<number>(15);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDate(initialEvent.date);
      setStartTime(initialEvent.startTime);
      setEndTime(initialEvent.endTime);
      setCategory(initialEvent.category);
      setPriority(initialEvent.priority);
      setReminderMinutes(initialEvent.reminderMinutes ?? 15);
      setNotes(initialEvent.notes || '');
    } else {
      setTitle('');
      setDate(defaultDate || getTodayDateString());
      setStartTime('10:00');
      setEndTime('11:00');
      setCategory('College');
      setPriority('medium');
      setReminderMinutes(15);
      setNotes('');
    }
    setErrors({});
  }, [initialEvent, defaultDate, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Please enter an event title';
    }
    if (!date) {
      newErrors.date = 'Please pick a date';
    }
    if (!startTime) {
      newErrors.startTime = 'Please specify a start time';
    }
    if (!endTime) {
      newErrors.endTime = 'Please specify an end time';
    } else if (startTime && endTime < startTime) {
      newErrors.endTime = 'End time cannot be earlier than start time';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      audioService.playAlert();
      return;
    }

    audioService.playPop();
    onSave({
      id: initialEvent?.id,
      title: title.trim(),
      date,
      startTime,
      endTime,
      category,
      priority,
      reminderMinutes,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/50 dark:bg-slate-850">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>{initialEvent ? '✏️ Edit Activity' : '✨ Add New Activity'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Activity Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Java Class, Project Review, Gym Session..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-2xl border ${
                errors.title
                  ? 'border-rose-500 ring-2 ring-rose-200'
                  : 'border-slate-300 dark:border-slate-700'
              } bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* Date & Times Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" /> Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" /> End Time *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className={`w-full px-3 py-2 rounded-2xl border ${
                  errors.endTime
                    ? 'border-rose-500 ring-2 ring-rose-200'
                    : 'border-slate-300 dark:border-slate-700'
                } bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
            </div>
          </div>
          {errors.endTime && (
            <p className="text-xs text-rose-500 -mt-2 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> {errors.endTime}
            </p>
          )}

          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-500" /> Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => {
                const isSelected = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PRIORITIES.map(p => {
                const isSelected = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`py-2 px-3 rounded-2xl text-xs font-bold border text-center transition-all ${
                      isSelected
                        ? `${p.color} border-2 font-extrabold shadow-sm ring-2 ring-amber-400/40 scale-102`
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reminder Offset */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-indigo-500" /> Cartoon Character Reminder
            </label>
            <select
              value={reminderMinutes}
              onChange={e => setReminderMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {REMINDER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-slate-500" /> Notes & Details
            </label>
            <textarea
              rows={3}
              placeholder="Add links, classroom details, study chapters, or meeting goals..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cartoon-btn px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{initialEvent ? 'Save Changes' : 'Create Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
