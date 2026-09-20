import React, { useState } from 'react';
import { CharacterConfig, ScheduleEvent, UserProfile } from '../../types';
import {
  formatTimeDisplay,
  getCountdown,
  getEventStatus,
} from '../../utils/dateUtils';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  RotateCw,
  Plus,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface TodayTimelineProps {
  events: ScheduleEvent[];
  profile: UserProfile;
  onToggleComplete: (id: string) => void;
  onEdit: (event: ScheduleEvent) => void;
  onDelete: (id: string) => void;
  onReschedule: (id: string, minutes: number) => void;
  onRescheduleTomorrow: (id: string) => void;
  onAddEvent: () => void;
}

export const TodayTimeline: React.FC<TodayTimelineProps> = ({
  events,
  profile,
  onToggleComplete,
  onEdit,
  onDelete,
  onReschedule,
  onRescheduleTomorrow,
  onAddEvent,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const now = new Date();

  // Sort chronologically by startTime
  const sortedEvents = [...events].sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleComplete = (e: React.MouseEvent, event: ScheduleEvent) => {
    e.stopPropagation();
    if (!event.completed) {
      audioService.playSuccess();
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
      });
    } else {
      audioService.playPop();
    }
    onToggleComplete(event.id);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'College':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'Work':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900';
      case 'Meeting':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'Study':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'Exercise':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'Personal':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-900';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200">High</span>;
      case 'medium':
        return <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200">Med</span>;
      default:
        return <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200">Low</span>;
    }
  };

  return (
    <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <span>📅 Today's Timeline</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Chronological overview of today's schedule
          </p>
        </div>

        <button
          onClick={onAddEvent}
          className="cartoon-btn flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-10 px-4 bg-amber-50/40 dark:bg-slate-800/40 rounded-3xl border border-dashed border-amber-200 dark:border-slate-700">
          <p className="text-3xl mb-2">🎉</p>
          <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base">No tasks for today!</h4>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Your schedule is clean and peaceful. Click "Add Task" to schedule a class, workout, or study session!
          </p>
          <button
            onClick={onAddEvent}
            className="cartoon-btn px-4 py-2 rounded-2xl bg-amber-500 text-white text-xs font-bold shadow-md hover:bg-amber-600"
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-indigo-400 before:to-slate-300 dark:before:to-slate-700">
          {sortedEvents.map((event) => {
            const status = getEventStatus(event.date, event.startTime, event.endTime, event.completed, now);
            const countdown = getCountdown(event.date, event.startTime, now);

            // Node marker styling
            let nodeIcon = <Circle className="w-3 h-3 text-slate-400 fill-white" />;
            let cardStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40';

            if (status === 'completed') {
              nodeIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />;
              cardStyle = 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 opacity-80';
            } else if (status === 'in-progress') {
              nodeIcon = (
                <div className="w-3.5 h-3.5 rounded-full bg-indigo-600 ring-4 ring-indigo-200 dark:ring-indigo-900 animate-pulse" />
              );
              cardStyle = 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/50 shadow-md ring-1 ring-indigo-400/30';
            } else if (status === 'missed') {
              nodeIcon = <AlertCircle className="w-4 h-4 text-rose-500 fill-rose-100" />;
              cardStyle = 'border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20';
            } else {
              // upcoming
              nodeIcon = <Clock className="w-3.5 h-3.5 text-amber-500" />;
              cardStyle = 'border-amber-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-amber-400';
            }

            return (
              <div key={event.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-6 md:-left-8 top-3.5 -translate-x-1/2 flex items-center justify-center bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-sm">
                  {nodeIcon}
                </div>

                {/* Timeline Card */}
                <div className={`p-4 rounded-2xl border transition-all ${cardStyle}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    {/* Time & Title */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs md:text-sm font-bold text-indigo-700 dark:text-indigo-400">
                        {formatTimeDisplay(event.startTime, profile.timeFormat)} – {formatTimeDisplay(event.endTime, profile.timeFormat)}
                      </span>

                      {/* Status badge */}
                      {status === 'completed' && (
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ✓ Completed
                        </span>
                      )}
                      {status === 'in-progress' && (
                        <span className="text-[11px] font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          ● Happening Now
                        </span>
                      )}
                      {status === 'missed' && (
                        <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ⚠️ Missed
                        </span>
                      )}
                      {status === 'upcoming' && (
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                          (in {countdown.formatted})
                        </span>
                      )}
                    </div>

                    {/* Category & Priority */}
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(event.category)} flex items-center gap-1`}>
                        <Tag className="w-3 h-3" />
                        {event.category}
                      </span>
                      {getPriorityBadge(event.priority)}

                      {/* Options menu button */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === event.id ? null : event.id)}
                          className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === event.id && (
                          <div className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 animate-in fade-in zoom-in-95 text-xs font-semibold">
                            <button
                              onClick={() => {
                                onEdit(event);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Edit Activity</span>
                            </button>
                            <button
                              onClick={() => {
                                onReschedule(event.id, 30);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                            >
                              <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                              <span>Reschedule (+30 min)</span>
                            </button>
                            <button
                              onClick={() => {
                                onRescheduleTomorrow(event.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                            >
                              <RotateCw className="w-3.5 h-3.5 text-purple-500" />
                              <span>Move to Tomorrow</span>
                            </button>
                            <hr className="my-1 border-slate-100 dark:border-slate-700" />
                            <button
                              onClick={() => {
                                onDelete(event.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-rose-600 dark:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Title & Notes */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4
                        className={`text-base font-bold text-slate-800 dark:text-white ${
                          event.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {event.title}
                      </h4>
                      {event.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {event.notes}
                        </p>
                      )}
                    </div>

                    {/* Quick Complete Toggle Button */}
                    <button
                      onClick={e => handleComplete(e, event)}
                      className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        event.completed
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                          : 'bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-slate-200 hover:bg-amber-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{event.completed ? 'Done' : 'Mark Done'}</span>
                    </button>
                  </div>

                  {/* Quick Reschedule option if missed */}
                  {status === 'missed' && !event.completed && (
                    <div className="mt-3 pt-2.5 border-t border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs">
                      <span className="text-rose-600 dark:text-rose-400 font-semibold">
                        Don't stress! Missed tasks can be easily rescheduled:
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onReschedule(event.id, 30)}
                          className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold"
                        >
                          +30m
                        </button>
                        <button
                          onClick={() => onRescheduleTomorrow(event.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold"
                        >
                          Tomorrow
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
