import React, { useState } from 'react';
import {
  BackgroundTheme,
  CharacterConfig,
  CharacterPersonality,
  CharacterType,
  OutfitType,
} from '../../types';
import { AnimatedCharacter } from './AnimatedCharacter';
import { CharacterStage } from './CharacterStage';
import { CharacterBubble } from './CharacterBubble';
import { audioService } from '../../services/audioService';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Smile,
  Zap,
  Check,
} from 'lucide-react';

interface WardrobeCustomizerProps {
  character: CharacterConfig;
  onSave: (newConfig: CharacterConfig) => void;
  onSpeakPreview?: (text: string) => void;
}

const CHARACTERS: { type: CharacterType; defaultName: string; emoji: string; desc: string }[] = [
  { type: 'shinchan', defaultName: 'Shinchan', emoji: '👦', desc: 'Cheeky, hilarious, action-kamen loving boy with wiggling eyebrows' },
  { type: 'doraemon', defaultName: 'Doraemon', emoji: '🐱', desc: '22nd-century robotic cat with magical 4D gadgets and dorayaki' },
  { type: 'pikachu', defaultName: 'Pikachu', emoji: '⚡', desc: 'Electric mouse Pokemon charging your schedule with 100k volts' },
  { type: 'luffy', defaultName: 'Luffy', emoji: '🍖', desc: 'Straw Hat captain determined to be King of Productivity' },
  { type: 'hattori', defaultName: 'Hattori', emoji: '🥷', desc: 'Disciplined ninja master with punctuality jutsu and swirling cheeks' },
  { type: 'panda', defaultName: 'Bambu', emoji: '🐼', desc: 'Chill, cuddly, and friendly panda companion' },
  { type: 'robot', defaultName: 'Sparky', emoji: '🤖', desc: 'High-tech organizer with glowing digital sensors' },
];

const OUTFITS: { id: OutfitType; name: string; emoji: string }[] = [
  { id: 'none', name: 'Original', emoji: '✨' },
  { id: 'bowtie', name: 'Red Bowtie', emoji: '🎀' },
  { id: 'glasses', name: 'Smart Glasses', emoji: '👓' },
  { id: 'hat', name: 'Party Cone', emoji: '🎉' },
  { id: 'headphones', name: 'DJ Headset', emoji: '🎧' },
  { id: 'cape', name: 'Hero Cape', emoji: '🦸' },
  { id: 'scarf', name: 'Cozy Scarf', emoji: '🧣' },
];

const BACKGROUNDS: { id: BackgroundTheme; name: string; emoji: string; desc: string }[] = [
  { id: 'cozy-study', name: 'Cozy Study', emoji: '📚', desc: 'Warm bookshelves & soothing room' },
  { id: 'cyber-lab', name: 'Cyber Lab', emoji: '🔬', desc: 'Futuristic holograms & neon vibes' },
  { id: 'sunny-park', name: 'Sunny Park', emoji: '🌳', desc: 'Fresh green hills & blue skies' },
  { id: 'cosmic-space', name: 'Cosmic Space', emoji: '🌌', desc: 'Twinkling stars & galactic nebulas' },
  { id: 'sunset-studio', name: 'Sunset Studio', emoji: '🌆', desc: 'Warm golden hour & skyline loft' },
];

const PERSONALITIES: { id: CharacterPersonality; name: string; emoji: string; quote: string }[] = [
  {
    id: 'friendly',
    name: 'Friendly',
    emoji: '😊',
    quote: "“I'm always cheering for you! Let's make today wonderfully bright together!”",
  },
  {
    id: 'funny',
    name: 'Funny',
    emoji: '🤪',
    quote: "“Tasks before snacks! ...Wait, can we schedule snack time right now?!”",
  },
  {
    id: 'motivational',
    name: 'Motivational',
    emoji: '🔥',
    quote: "“Discipline is your superpower! Today we forge victories from every goal!”",
  },
  {
    id: 'calm',
    name: 'Calm',
    emoji: '🍃',
    quote: "“Breathe in peace, exhale tension. We will accomplish everything effortlessly.”",
  },
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    quote: "“1000% HYPED! Let's blast through today's checklist like a rocket ship!”",
  },
];

export const WardrobeCustomizer: React.FC<WardrobeCustomizerProps> = ({
  character,
  onSave,
  onSpeakPreview,
}) => {
  const [config, setConfig] = useState<CharacterConfig>(character);
  const [previewState, setPreviewState] = useState<'idle' | 'happy' | 'excited' | 'celebrating'>('happy');
  const [savedToast, setSavedToast] = useState(false);

  const handleSelectType = (type: CharacterType) => {
    audioService.playPop();
    const match = CHARACTERS.find(c => c.type === type);
    setConfig(prev => ({
      ...prev,
      type,
      name: prev.name === character.name ? (match?.defaultName || prev.name) : prev.name,
    }));
    setPreviewState('excited');
    setTimeout(() => setPreviewState('happy'), 1200);
  };

  const handleSelectOutfit = (outfit: OutfitType) => {
    audioService.playPop();
    setConfig(prev => ({ ...prev, outfit }));
    setPreviewState('happy');
  };

  const handleSelectBackground = (background: BackgroundTheme) => {
    audioService.playPop();
    setConfig(prev => ({ ...prev, background }));
  };

  const handleSelectPersonality = (personality: CharacterPersonality) => {
    audioService.playPop();
    setConfig(prev => ({ ...prev, personality }));
    setPreviewState('excited');
    const p = PERSONALITIES.find(item => item.id === personality);
    if (p && onSpeakPreview) {
      onSpeakPreview(p.quote);
    }
  };

  const handleSave = () => {
    audioService.playAchievement();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSave(config);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const activePersonalityObj = PERSONALITIES.find(p => p.id === config.personality);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span>🤖 Character Studio & Wardrobe</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
              Customize your companion's species, style, habitat, and personality
            </p>
          </div>

          <div className="flex items-center gap-3">
            {savedToast && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full animate-in fade-in flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Changes Applied!
              </span>
            )}

            <button
              onClick={handleSave}
              className="cartoon-btn px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Companion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Interactive Companion Stage (Left 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl sticky top-20">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
              Live Stage Preview
            </h3>

            <CharacterStage theme={config.background} className="w-full h-80">
              <div className="flex flex-col items-center justify-center">
                <AnimatedCharacter
                  config={config}
                  state={previewState}
                  size="xl"
                  onClick={() => {
                    audioService.playPop();
                    setPreviewState(previewState === 'excited' ? 'celebrating' : 'excited');
                  }}
                />
              </div>
            </CharacterStage>

            {/* Live Personality Speech Preview Bubble */}
            <div className="mt-4">
              <CharacterBubble
                message={activePersonalityObj?.quote || ''}
                badge={config.personality.toUpperCase()}
                onSpeak={() => {
                  if (activePersonalityObj && onSpeakPreview) {
                    onSpeakPreview(activePersonalityObj.quote);
                  }
                }}
              />
            </div>

            {/* Companion Name Editor */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                Companion Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={e => setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Customization Options (Right 7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Character Species */}
          <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Choose Your Cartoon Companion</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CHARACTERS.map(c => {
                const isSelected = config.type === c.type;
                return (
                  <button
                    key={c.type}
                    type="button"
                    onClick={() => handleSelectType(c.type)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-400/40 scale-102'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-amber-300'
                    }`}
                  >
                    <div className="text-3xl mb-1">{c.emoji}</div>
                    <p className="font-bold text-sm text-slate-800 dark:text-white">{c.defaultName}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{c.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Personality */}
          <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Smile className="w-4 h-4 text-indigo-500" />
              <span>Companion Personality</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERSONALITIES.map(p => {
                const isSelected = config.personality === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPersonality(p.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 ring-2 ring-indigo-400/40'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-white mb-1">
                      <span>{p.emoji}</span>
                      <span>{p.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-2">
                      {p.quote}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Outfits & Accessories */}
          <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-rose-500" />
              <span>Wardrobe & Accessories</span>
            </h3>

            <div className="flex flex-wrap gap-2.5">
              {OUTFITS.map(out => {
                const isSelected = config.outfit === out.id;
                return (
                  <button
                    key={out.id}
                    type="button"
                    onClick={() => handleSelectOutfit(out.id)}
                    className={`px-4 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{out.emoji}</span>
                    <span>{out.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Room Environment */}
          <div className="cartoon-card bg-white dark:bg-slate-900 border-2 border-amber-200/80 dark:border-slate-800 p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-500" />
              <span>Habitat & Room Scenery</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BACKGROUNDS.map(bg => {
                const isSelected = config.background === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => handleSelectBackground(bg.id)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-400/40'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-white">
                      <span>{bg.emoji}</span>
                      <span>{bg.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{bg.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
