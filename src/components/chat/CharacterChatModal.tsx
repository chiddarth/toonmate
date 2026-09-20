import React, { useState, useEffect, useRef } from 'react';
import {
  CharacterConfig,
  ChatMessage,
  ScheduleEvent,
  UserProfile,
} from '../../types';
import { AnimatedCharacter } from '../character/AnimatedCharacter';
import { generateAssistantChatResponse } from '../../utils/personalityUtils';
import { audioService } from '../../services/audioService';
import { speechService } from '../../services/speechService';
import {
  X,
  Send,
  Volume2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface CharacterChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterConfig;
  profile: UserProfile;
  todayEvents: ScheduleEvent[];
  allEvents: ScheduleEvent[];
  onAddEventRequested: () => void;
}

const QUICK_QUESTIONS = [
  'What do I have today?',
  'When is my next class?',
  'What should I do next?',
  'Did I complete my tasks?',
  'What do I have tomorrow?',
  'Tell me a joke! 🤪',
  'Give me motivation! 🔥',
];

export const CharacterChatModal: React.FC<CharacterChatModalProps> = ({
  isOpen,
  onClose,
  character,
  profile,
  todayEvents,
  allEvents,
  onAddEventRequested,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'character',
      text: `Hi ${profile.name}! 👋 I'm ${character.name}. Ask me anything about your schedule or tasks!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [characterAnimState, setCharacterAnimState] = useState<'idle' | 'happy' | 'talking' | 'thinking'>('happy');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    audioService.playPop();

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setCharacterAnimState('thinking');

    setTimeout(() => {
      const response = generateAssistantChatResponse(
        text,
        todayEvents,
        allEvents,
        character,
        profile.name,
        profile.timeFormat
      );

      const charMsg: ChatMessage = {
        id: 'char_' + Date.now(),
        sender: 'character',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggestion: response.actionSuggestion,
      };

      setMessages(prev => [...prev, charMsg]);
      setCharacterAnimState('talking');
      audioService.playChime();

      if (profile.speechEnabled) {
        speechService.speak(response.text, {
          voiceName: profile.speechVoice,
          rate: profile.speechSpeed,
          pitch: profile.speechPitch,
          volume: profile.speechVolume,
          enabled: profile.speechEnabled,
          onStart: () => setCharacterAnimState('talking'),
          onEnd: () => setCharacterAnimState('happy'),
        });
      } else {
        setTimeout(() => setCharacterAnimState('happy'), 2000);
      }
    }, 450);
  };

  const handleSpeakMessage = (text: string) => {
    audioService.playPop();
    speechService.speak(text, {
      voiceName: profile.speechVoice,
      rate: profile.speechSpeed,
      pitch: profile.speechPitch,
      volume: profile.speechVolume,
      enabled: true,
      onStart: () => setCharacterAnimState('talking'),
      onEnd: () => setCharacterAnimState('happy'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/60 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-200/50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-amber-300/60">
              <AnimatedCharacter config={character} state={characterAnimState} size="sm" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-1.5">
                <span>{character.name}</span>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {character.personality} Assistant
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online & knows your schedule
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map(msg => {
            const isChar = msg.sender === 'character';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[88%] ${
                  isChar ? 'mr-auto items-start' : 'ml-auto flex-row-reverse items-end'
                }`}
              >
                {/* Character Avatar */}
                {isChar && (
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-1 border border-amber-300/50">
                    <AnimatedCharacter config={character} state={characterAnimState} size="sm" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-3.5 rounded-3xl text-xs md:text-sm font-semibold shadow-sm leading-relaxed ${
                    isChar
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-sm border border-slate-200 dark:border-slate-700'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-sm shadow-amber-500/20'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Suggestion CTA button inside bubble */}
                  {msg.actionSuggestion === 'add_event' && (
                    <button
                      onClick={() => {
                        onClose();
                        onAddEventRequested();
                      }}
                      className="mt-2.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Add Activity Now</span>
                    </button>
                  )}

                  <div className="flex items-center justify-between gap-3 mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-700/50 text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {isChar && (
                      <button
                        onClick={() => handleSpeakMessage(msg.text)}
                        className="p-1 hover:text-amber-500 transition-colors"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
            <HelpCircle className="w-3 h-3" /> Ask:
          </span>
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="cartoon-btn shrink-0 text-xs font-bold px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask ${character.name} about your schedule...`}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="cartoon-btn p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
