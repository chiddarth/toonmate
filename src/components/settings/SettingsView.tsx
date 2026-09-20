import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { speechService } from '../../services/speechService';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import {
  Settings,
  Volume2,
  VolumeX,
  Clock,
  Sun,
  Moon,
  User,
  Bell,
  Download,
  Upload,
  RotateCcw,
  Check,
  Play,
} from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  onSaveProfile: (newProfile: UserProfile) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onSaveProfile,
  onExportData,
  onImportData,
  onResetDemoData,
}) => {
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(profile);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [saveToast, setSaveToast] = useState(false);
  const [importError, setImportError] = useState('');

  useEffect(() => {
    setCurrentProfile(profile);
  }, [profile]);

  useEffect(() => {
    const list = speechService.getVoices();
    setVoices(list);
  }, []);

  const handleToggleSound = () => {
    const newVal = !currentProfile.soundEnabled;
    const updated = { ...currentProfile, soundEnabled: newVal };
    setCurrentProfile(updated);
    audioService.setSoundEnabled(newVal);
    onSaveProfile(updated);
    if (newVal) audioService.playPop();
  };

  const handleToggleSpeech = () => {
    const newVal = !currentProfile.speechEnabled;
    const updated = { ...currentProfile, speechEnabled: newVal };
    setCurrentProfile(updated);
    onSaveProfile(updated);
    if (newVal) {
      speechService.speak("Voice alerts enabled!", {
        rate: currentProfile.speechSpeed,
        pitch: currentProfile.speechPitch,
        volume: currentProfile.speechVolume,
      });
    } else {
      speechService.stop();
    }
  };

  const handleTestVoice = () => {
    audioService.playPop();
    speechService.speak(
      `Hello ${currentProfile.name}! Your cartoon assistant is ready to speak reminders!`,
      {
        voiceName: currentProfile.speechVoice,
        rate: currentProfile.speechSpeed,
        pitch: currentProfile.speechPitch,
        volume: currentProfile.speechVolume,
        enabled: true,
      }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playAchievement();
    confetti({ particleCount: 50, spread: 60 });
    onSaveProfile(currentProfile);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      const success = onImportData(content);
      if (success) {
        audioService.playSuccess();
        alert('Data successfully imported!');
      } else {
        setImportError('Invalid JSON format for ToonMate data.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-amber-500" />
              <span>Application Settings</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Customize voice speech synthesis, profile details, theme, and data
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
            <button
              onClick={handleSave}
              className="cartoon-btn px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Profile & Appearance */}
        <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <User className="w-4 h-4 text-indigo-500" />
            <span>Profile & Appearance</span>
          </h3>

          {/* User Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Your Name (as greeted by character)
            </label>
            <input
              type="text"
              value={currentProfile.name}
              onChange={e => setCurrentProfile({ ...currentProfile, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Time Format */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Time Display Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  const updated = { ...currentProfile, timeFormat: '12h' as const };
                  setCurrentProfile(updated);
                  onSaveProfile(updated);
                }}
                className={`py-2.5 px-4 rounded-2xl border-2 text-xs font-bold transition-all ${
                  currentProfile.timeFormat === '12h'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                12-Hour (e.g. 2:00 PM)
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = { ...currentProfile, timeFormat: '24h' as const };
                  setCurrentProfile(updated);
                  onSaveProfile(updated);
                }}
                className={`py-2.5 px-4 rounded-2xl border-2 text-xs font-bold transition-all ${
                  currentProfile.timeFormat === '24h'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                24-Hour (e.g. 14:00)
              </button>
            </div>
          </div>

          {/* Theme selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              App Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  const updated = { ...currentProfile, theme: 'light' as const };
                  setCurrentProfile(updated);
                  onSaveProfile(updated);
                }}
                className={`py-2 px-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  currentProfile.theme === 'light'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/40'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Playful Light</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const updated = { ...currentProfile, theme: 'dark' as const };
                  setCurrentProfile(updated);
                  onSaveProfile(updated);
                }}
                className={`py-2 px-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  currentProfile.theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400/40'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Cosmic Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Voice & Text-to-Speech Settings */}
        <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Volume2 className="w-4 h-4 text-rose-500" />
            <span>Cartoon Voice & Sound Effects</span>
          </h3>

          {/* Sound & Speech Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-between transition-all ${
                currentProfile.soundEnabled
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {currentProfile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                Sound Chimes
              </span>
              <span>{currentProfile.soundEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleSpeech}
              className={`p-3 rounded-2xl border-2 text-xs font-bold flex items-center justify-between transition-all ${
                currentProfile.speechEnabled
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> Speech (TTS)
              </span>
              <span>{currentProfile.speechEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Voice Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Synthesizer Voice
            </label>
            <select
              value={currentProfile.speechVoice}
              onChange={e => setCurrentProfile({ ...currentProfile, speechVoice: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
            >
              <option value="">Browser Default Voice</option>
              {voices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Speed & Pitch Sliders */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                <span>Speed</span>
                <span>{currentProfile.speechSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.1"
                value={currentProfile.speechSpeed}
                onChange={e => setCurrentProfile({ ...currentProfile, speechSpeed: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                <span>Pitch</span>
                <span>{currentProfile.speechPitch}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.5"
                step="0.05"
                value={currentProfile.speechPitch}
                onChange={e => setCurrentProfile({ ...currentProfile, speechPitch: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Test Voice Button */}
          <button
            type="button"
            onClick={handleTestVoice}
            className="w-full cartoon-btn py-2 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-amber-500" />
            <span>Test Character Speech Audio</span>
          </button>
        </div>

        {/* 3. Smart Reminder Defaults */}
        <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Reminder Preferences</span>
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Default Advance Warning
            </label>
            <select
              value={currentProfile.defaultReminderMinutes}
              onChange={e => setCurrentProfile({ ...currentProfile, defaultReminderMinutes: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs md:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value={0}>At Start Time</option>
              <option value={5}>5 minutes before</option>
              <option value={10}>10 minutes before</option>
              <option value={15}>15 minutes before</option>
              <option value={30}>30 minutes before</option>
              <option value={60}>1 hour before</option>
            </select>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            The cartoon companion will pop up, alert with chimes, and vocalize warnings before any scheduled activity.
          </p>
        </div>

        {/* 4. Data Management & Reset */}
        <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Data Management & Backup</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onExportData}
              className="cartoon-btn p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <label className="cartoon-btn p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>

          {importError && (
            <p className="text-xs text-rose-500 font-bold">{importError}</p>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all activities, character, and settings back to default demo data?')) {
                  onResetDemoData();
                }
              }}
              className="w-full cartoon-btn py-2 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:hover:bg-rose-900 dark:text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
