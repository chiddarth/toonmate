import React, { useState } from 'react';
import { EventCategory, EventPriority, ScheduleEvent, UserProfile } from '../../types';
import {
  formatDisplayDate,
  formatTimeDisplay,
  getEventStatus,
  getTodayDateString,
} from '../../utils/dateUtils';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import {
  Search,
  Plus,
  Tag,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  RotateCw,
} from 'lucide-react';

interface ScheduleViewProps {
  events: ScheduleEvent[];
  profile: UserProfile;
  onToggleComplete: (id: string) => void;
  onEdit: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
  onReschedule: (id: string, minutes: number) => void;
  onRescheduleTomorrow: (id: string) => void;
  onAddEvent: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  events,
  profile,
  onToggleComplete,
  onEdit,
  onDelete,
  onReschedule,
  onRescheduleTomorrow,
  onAddEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const now = new Date();
  const todayStr = getTodayDateString();

  // Filtering
  const filteredEvents = events.filter(e => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchNotes = e.notes?.toLowerCase().includes(q);
      const matchCat = e.category.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchCat) return false;
    }
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (priorityFilter !== 'all' && e.priority !== priorityFilter) return false;
    if (statusFilter === 'active' && e.completed) return false;
    if (statusFilter === 'completed' && !e.completed) return false;
    return true;
  });

  // Group events by Date
  const groupedEvents: { [date: string]: ScheduleEvent[] } = {};
  filteredEvents
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .forEach(e => {
      if (!groupedEvents[e.date]) groupedEvents[e.date] = [];
      groupedEvents[e.date].push(e);
    });

  const sortedDates = Object.keys(groupedEvents);

  const handleComplete = (event: ScheduleEvent) => {
    if (!event.completed) {
      audioService.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      audioService.playPop();
    }
    onToggleComplete(event.id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span>📋 Schedule Master</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Manage, filter, and organize all your upcoming and past activities
            </p>
          </div>

          <button
            onClick={onAddEvent}
            className="cartoon-btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, notes, or category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {/* Status filters */}
            <div className="flex rounded-2xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  statusFilter === 'active'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                Completed
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Categories</option>
              <option value="College">🎓 College</option>
              <option value="Work">💼 Work</option>
              <option value="Meeting">🤝 Meeting</option>
              <option value="Study">📚 Study</option>
              <option value="Exercise">🏃 Exercise</option>
              <option value="Personal">🧘 Personal</option>
              <option value="Other">✨ Other</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grouped by Date */}
      {sortedDates.length === 0 ? (
        <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-10 text-center rounded-3xl">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No matching activities found</h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Try adjusting your search terms or filters to see more events.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setPriorityFilter('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(dateStr => {
            const isToday = dateStr === todayStr;
            const dateEvents = groupedEvents[dateStr];

            return (
              <div key={dateStr} className="space-y-3">
                {/* Date Header Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs md:text-sm font-extrabold px-3 py-1 rounded-2xl border ${
                      isToday
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {formatDisplayDate(dateStr)} ({dateStr})
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {dateEvents.length} event{dateEvents.length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Event Cards in Date Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {dateEvents.map(event => {
                    const status = getEventStatus(event.date, event.startTime, event.endTime, event.completed, now);

                    return (
                      <div
                        key={event.id}
                        className={`cartoon-card p-4.5 rounded-3xl border-2 transition-all ${
                          event.completed
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/60 opacity-80'
                            : status === 'in-progress'
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-md ring-1 ring-indigo-400/30'
                            : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          {/* Time & Category */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatTimeDisplay(event.startTime, profile.timeFormat)} – {formatTimeDisplay(event.endTime, profile.timeFormat)}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5 text-amber-500" />
                              {event.category}
                            </span>
                          </div>

                          {/* Priority Badge */}
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              event.priority === 'high'
                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                : event.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                            }`}
                          >
                            {event.priority}
                          </span>
                        </div>

                        {/* Title & Notes */}
                        <div className="mb-3">
                          <h4
                            className={`text-base font-bold text-slate-800 dark:text-white ${
                              event.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                            }`}
                          >
                            {event.title}
                          </h4>
                          {event.notes && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {event.notes}
                            </p>
                          )}
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleComplete(event)}
                            className={`cartoon-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                              event.completed
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{event.completed ? 'Completed' : 'Mark Done'}</span>
                          </button>

                          <div className="flex items-center gap-1 text-slate-400">
                            <button
                              onClick={() => onReschedule(event.id, 30)}
                              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 transition-colors"
                              title="Reschedule +30 min"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onRescheduleTomorrow(event.id)}
                              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-500 transition-colors text-[10px] font-bold"
                              title="Move to Tomorrow"
                            >
                              +1d
                            </button>
                            <button
                              onClick={() => onEdit(event)}
                              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(event.id)}
                              className="p-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
