import React, { useState } from 'react';
import { CharacterConfig, ScheduleEvent } from '../../types';
import { AnimatedCharacter } from './AnimatedCharacter';
import { audioService } from '../../services/audioService';
import {
  Monitor,
  X,
  Sparkles,
  ExternalLink,
  Terminal,
  Flame,
} from 'lucide-react';

interface DesktopCompanionLauncherProps {
  character: CharacterConfig;
  todayEvents: ScheduleEvent[];
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopCompanionLauncher: React.FC<DesktopCompanionLauncherProps> = ({
  character,
  todayEvents,
  isOpen,
  onClose,
}) => {
  const [pipActive, setPipActive] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  if (!isOpen) return null;

  const incompleteTasks = todayEvents.filter(e => !e.completed);

  // Modern W3C Document Picture-in-Picture API
  const handleLaunchPiP = async () => {
    audioService.playPop();
    try {
      // Check for Document Picture-in-Picture support
      const winWithPiP = window as unknown as {
        documentPictureInPicture?: {
          requestWindow: (options: { width: number; height: number }) => Promise<Window>;
        };
      };

      let pipWindow: Window | null = null;

      if (winWithPiP.documentPictureInPicture) {
        pipWindow = await winWithPiP.documentPictureInPicture.requestWindow({
          width: 320,
          height: 380,
        });
      } else {
        // Fallback to floating popup window
        pipWindow = window.open(
          '',
          'ToonMateDesktopPet',
          'width=320,height=380,menubar=no,toolbar=no,location=no,status=no,resizable=yes'
        );
      }

      if (!pipWindow) {
        alert('Could not open desktop floating window. Please check your browser popup permissions.');
        return;
      }

      setPipActive(true);

      // Copy stylesheet links and fonts to the PiP window
      const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'));
      styleLinks.forEach(el => {
        pipWindow?.document.head.appendChild(el.cloneNode(true));
      });

      // Write styled HTML inside the floating OS window
      pipWindow.document.body.className = 'bg-amber-50 dark:bg-slate-950 text-slate-800 dark:text-white p-4 font-sans m-0 overflow-hidden flex flex-col items-center justify-between h-full select-none';
      
      const charQuotes: Record<string, string> = {
        shinchan: "Oho! Don't slack off! I'm watching you from your desktop! 😜",
        doraemon: "Anywhere Door won't save you if you miss your schedule! 🐱🚪",
        pikachu: "Pika-chuuu! Zap that procrastination right now! ⚡",
        luffy: "Finish your tasks so we can eat MEAT! Shishishi! 🍖",
        hattori: "Nin-nin! Punctuality is the greatest ninja art! 🥷",
      };

      const quote = charQuotes[character.type] || "I'm on your desktop! Finish your tasks! 👀";

      pipWindow.document.body.innerHTML = `
        <div style="font-family: system-ui, sans-serif; text-align: center; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; height: 100vh; padding: 12px; box-sizing: border-box; background: linear-gradient(to bottom, #fffbeb, #fef3c7);">
          <div style="background: white; border: 2px solid #f59e0b; border-radius: 16px; padding: 8px 12px; font-size: 11px; font-weight: bold; color: #1e293b; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); width: 90%; animation: bounce 2s infinite;">
            <p style="margin: 0 0 4px 0;">${quote}</p>
            <span style="color: #ea580c; font-size: 10px;">⚠️ ${incompleteTasks.length} task(s) remaining today!</span>
          </div>

          <div id="pet-container" style="cursor: pointer; transform-origin: center; animation: walk 3s ease-in-out infinite;">
            <div style="font-size: 80px; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.15));">
              ${character.type === 'shinchan' ? '👦' : character.type === 'doraemon' ? '🐱' : character.type === 'pikachu' ? '⚡' : character.type === 'luffy' ? '🍖' : '🥷'}
            </div>
            <p style="margin: 0; font-size: 12px; font-weight: 800; color: #78350f;">${character.name}</p>
          </div>

          <button id="go-btn" style="width: 100%; padding: 10px; background: #f59e0b; color: white; border: none; border-radius: 14px; font-weight: bold; font-size: 12px; cursor: pointer; box-shadow: 0 4px 10px rgba(245,158,11,0.4); display: flex; align-items: center; justify-content: center; gap: 6px;">
            <span>🚀 Focus ToonMate Tab</span>
          </button>
        </div>
      `;

      const goBtn = pipWindow.document.getElementById('go-btn');
      const petContainer = pipWindow.document.getElementById('pet-container');

      const focusTab = () => {
        window.focus();
        audioService.playSuccess();
      };

      if (goBtn) goBtn.onclick = focusTab;
      if (petContainer) petContainer.onclick = focusTab;

      pipWindow.onpagehide = () => {
        setPipActive(false);
      };
    } catch (err) {
      console.warn('PiP launch error', err);
      alert('Your browser does not support Document Picture-in-Picture. You can run the native desktop companion instead with: npm run desktop');
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npm run desktop');
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-100 dark:bg-slate-800 text-amber-600">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span>Real Desktop Window Companion</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                  Always On Top
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Let {character.name} appear over any desktop app and disturb you until you finish your tasks!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot Spotlight */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-850 dark:to-slate-800 p-4 rounded-3xl border border-amber-200/80 dark:border-slate-700 mb-5">
          <div className="w-24 h-24 shrink-0 flex items-center justify-center">
            <AnimatedCharacter config={character} state="excited" size="md" />
          </div>
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span>{character.name} Desktop Roamer</span>
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When enabled, {character.name} walks directly on your real Windows screen, floats on top of Word, YouTube, games, or your IDE, and nags you until you navigate to your tasks!
            </p>
          </div>
        </div>

        {/* 2 Launch Options */}
        <div className="space-y-4 mb-6">
          {/* Option 1: Instant Browser Floating Window (0 install) */}
          <div className="p-4 rounded-2xl border-2 border-amber-300/80 dark:border-slate-700 bg-amber-50/40 dark:bg-slate-850/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-700 dark:text-amber-400">
                <Sparkles className="w-3 h-3" /> Option 1: Instant Floating Desktop Window
              </span>
              <p className="text-xs text-slate-500">
                Uses Picture-in-Picture to float {character.name} outside the browser over all desktop windows.
              </p>
            </div>

            <button
              onClick={handleLaunchPiP}
              className="cartoon-btn px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shrink-0 flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{pipActive ? 'Re-dock Window' : 'Pop Out Desktop Pet'}</span>
            </button>
          </div>

          {/* Option 2: Native Windows Transparent Shimeji */}
          <div className="p-4 rounded-2xl border-2 border-indigo-200 dark:border-slate-700 bg-indigo-50/40 dark:bg-slate-850/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-700 dark:text-indigo-400">
                <Terminal className="w-3.5 h-3.5" /> Option 2: Native Transparent Windows Shimeji
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                Full Desktop Freedom
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Run this command in your project terminal to launch a 100% frameless, transparent pet that physically walks across your Windows desktop and taskbar:
            </p>

            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs">
              <code>npm run desktop</code>
              <button
                onClick={handleCopyCommand}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-sans font-bold transition-colors"
              >
                {copyFeedback ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="cartoon-btn px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
