import React from 'react';
import { BackgroundTheme, CharacterConfig, CharacterState, OutfitType } from '../../types';

interface AnimatedCharacterProps {
  config: CharacterConfig;
  state?: CharacterState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  showAccessories?: boolean;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  config,
  state = 'idle',
  size = 'lg',
  onClick,
  className = '',
  showAccessories = true,
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-56 h-56 md:w-64 md:h-64',
    xl: 'w-72 h-72 md:w-80 md:h-80',
  };

  const getAnimationClass = () => {
    switch (state) {
      case 'idle':
        return 'anim-breathing';
      case 'happy':
        return 'anim-breathing hover:scale-105 transition-transform';
      case 'excited':
        return 'anim-excited';
      case 'celebrating':
        return 'anim-celebrate';
      case 'talking':
        return 'anim-breathing';
      case 'thinking':
        return 'anim-thinking';
      case 'sleeping':
        return 'opacity-90';
      case 'worried':
        return 'anim-soft-pulse';
      case 'sad':
        return 'translate-y-1';
      default:
        return 'anim-breathing';
    }
  };

  // Eyes rendering depending on state
  const renderEyes = (cx1: number, cx2: number, cy: number, r: number = 6, pupilColor = '#1e293b') => {
    if (state === 'sleeping') {
      return (
        <g stroke={pupilColor} strokeWidth="3" strokeLinecap="round" fill="none">
          <path d={`M ${cx1 - 6} ${cy} Q ${cx1} ${cy + 5} ${cx1 + 6} ${cy}`} />
          <path d={`M ${cx2 - 6} ${cy} Q ${cx2} ${cy + 5} ${cx2 + 6} ${cy}`} />
        </g>
      );
    }

    if (state === 'happy' || state === 'celebrating') {
      return (
        <g stroke={pupilColor} strokeWidth="3.5" strokeLinecap="round" fill="none">
          <path d={`M ${cx1 - 7} ${cy + 2} Q ${cx1} ${cy - 7} ${cx1 + 7} ${cy + 2}`} />
          <path d={`M ${cx2 - 7} ${cy + 2} Q ${cx2} ${cy - 7} ${cx2 + 7} ${cy + 2}`} />
        </g>
      );
    }

    if (state === 'excited') {
      // Starry eyes
      return (
        <g fill="#fbbf24" stroke="#d97706" strokeWidth="1">
          <path d={`M ${cx1} ${cy - 8} L ${cx1 + 3} ${cy - 2} L ${cx1 + 9} ${cy} L ${cx1 + 3} ${cy + 3} L ${cx1} ${cy + 9} L ${cx1 - 3} ${cy + 3} L ${cx1 - 9} ${cy} L ${cx1 - 3} ${cy - 2} Z`} />
          <path d={`M ${cx2} ${cy - 8} L ${cx2 + 3} ${cy - 2} L ${cx2 + 9} ${cy} L ${cx2 + 3} ${cy + 3} L ${cx2} ${cy + 9} L ${cx2 - 3} ${cy + 3} L ${cx2 - 9} ${cy} L ${cx2 - 3} ${cy - 2} Z`} />
        </g>
      );
    }

    if (state === 'worried') {
      return (
        <g>
          {/* Eyebrows angled inward */}
          <line x1={cx1 - 6} y1={cy - 10} x2={cx1 + 6} y2={cy - 6} stroke={pupilColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx2 - 6} y1={cy - 6} x2={cx2 + 6} y2={cy - 10} stroke={pupilColor} strokeWidth="2.5" strokeLinecap="round" />
          {/* Wide anxious pupils */}
          <ellipse cx={cx1} cy={cy} rx={r} ry={r + 1} fill={pupilColor} />
          <circle cx={cx1 - 2} cy={cy - 2} r={2} fill="#ffffff" />
          <ellipse cx={cx2} cy={cy} rx={r} ry={r + 1} fill={pupilColor} />
          <circle cx={cx2 - 2} cy={cy - 2} r={2} fill="#ffffff" />
        </g>
      );
    }

    if (state === 'sad') {
      return (
        <g>
          <line x1={cx1 - 6} y1={cy - 7} x2={cx1 + 6} y2={cy - 11} stroke={pupilColor} strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cx2 - 6} y1={cy - 11} x2={cx2 + 6} y2={cy - 7} stroke={pupilColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={cx1} cy={cy + 1} r={r} fill={pupilColor} />
          <circle cx={cx1 - 2} cy={cy - 1} r={2} fill="#ffffff" />
          <circle cx={cx2} cy={cy + 1} r={r} fill={pupilColor} />
          <circle cx={cx2 - 2} cy={cy - 1} r={2} fill="#ffffff" />
        </g>
      );
    }

    // Default with natural blinking animation
    return (
      <g className="anim-blinking" style={{ transformOrigin: `${(cx1 + cx2) / 2}px ${cy}px` }}>
        <circle cx={cx1} cy={cy} r={r} fill={pupilColor} />
        <circle cx={cx1 - 2} cy={cy - 2} r={2.5} fill="#ffffff" />
        <circle cx={cx2} cy={cy} r={r} fill={pupilColor} />
        <circle cx={cx2 - 2} cy={cy - 2} r={2.5} fill="#ffffff" />
      </g>
    );
  };

  // Mouth rendering
  const renderMouth = (cx: number, cy: number, strokeColor = '#1e293b') => {
    if (state === 'talking') {
      return (
        <ellipse
          cx={cx}
          cy={cy + 2}
          rx={6}
          ry={5}
          fill="#f43f5e"
          stroke={strokeColor}
          strokeWidth="2"
          className="anim-talking"
          style={{ transformOrigin: `${cx}px ${cy + 2}px` }}
        />
      );
    }

    if (state === 'celebrating' || state === 'excited') {
      return (
        <path
          d={`M ${cx - 9} ${cy - 2} Q ${cx} ${cy + 11} ${cx + 9} ${cy - 2} Z`}
          fill="#f43f5e"
          stroke={strokeColor}
          strokeWidth="2"
        />
      );
    }

    if (state === 'happy') {
      return (
        <path
          d={`M ${cx - 7} ${cy} Q ${cx} ${cy + 6} ${cx + 7} ${cy}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    }

    if (state === 'worried') {
      return (
        <path
          d={`M ${cx - 5} ${cy + 3} Q ${cx} ${cy} ${cx + 5} ${cy + 3}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    }

    if (state === 'sad') {
      return (
        <path
          d={`M ${cx - 6} ${cy + 4} Q ${cx} ${cy - 2} ${cx + 6} ${cy + 4}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      );
    }

    if (state === 'thinking') {
      return (
        <ellipse cx={cx + 3} cy={cy} rx={3} ry={2} fill="#334155" />
      );
    }

    // Idle
    return (
      <path
        d={`M ${cx - 5} ${cy} Q ${cx} ${cy + 3} ${cx + 5} ${cy}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  };

  // State extra overlays (sweat, zzz, tears, sparkles)
  const renderStateOverlays = () => {
    return (
      <>
        {state === 'sleeping' && (
          <g className="anim-zzz select-none pointer-events-none">
            <text x="145" y="45" fill="#818cf8" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Z</text>
            <text x="160" y="30" fill="#a5b4fc" fontSize="22" fontWeight="bold" fontFamily="sans-serif">Z</text>
            <text x="175" y="15" fill="#c7d2fe" fontSize="26" fontWeight="bold" fontFamily="sans-serif">z</text>
          </g>
        )}

        {state === 'worried' && (
          <g className="anim-sweat pointer-events-none">
            <path
              d="M 148 55 C 148 55, 142 65, 142 70 A 6 6 0 0 0 154 70 C 154 65, 148 55, 148 55 Z"
              fill="#38bdf8"
              opacity="0.85"
            />
          </g>
        )}

        {state === 'sad' && (
          <g className="anim-sweat pointer-events-none">
            <ellipse cx="78" cy="98" rx="2.5" ry="5" fill="#38bdf8" opacity="0.8" />
          </g>
        )}

        {state === 'thinking' && (
          <g className="pointer-events-none">
            <circle cx="150" cy="45" r="4" fill="#cbd5e1" />
            <circle cx="160" cy="35" r="6" fill="#cbd5e1" />
            <path
              d="M 170 30 Q 185 10 200 25 Q 215 25 210 40 Q 215 55 195 55 Q 180 60 170 45 Z"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            {/* Lightbulb in thought bubble */}
            <text x="183" y="42" fontSize="16">💡</text>
          </g>
        )}

        {(state === 'celebrating' || state === 'excited') && (
          <g className="pointer-events-none animate-pulse">
            <text x="30" y="40" fontSize="16">✨</text>
            <text x="170" y="35" fontSize="18">🎉</text>
            <text x="25" y="140" fontSize="14">⭐</text>
            <text x="175" y="130" fontSize="16">✨</text>
          </g>
        )}
      </>
    );
  };

  // Outfit / Accessory overlay
  const renderAccessory = (headX: number, headY: number, neckY: number) => {
    if (!showAccessories || config.outfit === 'none') return null;

    switch (config.outfit) {
      case 'glasses':
        return (
          <g stroke="#1e293b" strokeWidth="2.5" fill="none">
            <circle cx={headX - 16} cy={headY} r="12" fill="rgba(255,255,255,0.25)" />
            <circle cx={headX + 16} cy={headY} r="12" fill="rgba(255,255,255,0.25)" />
            <line x1={headX - 4} y1={headY} x2={headX + 4} y2={headY} />
            <line x1={headX - 28} y1={headY} x2={headX - 35} y2={headY - 2} />
            <line x1={headX + 28} y1={headY} x2={headX + 35} y2={headY - 2} />
          </g>
        );

      case 'hat':
        return (
          <g>
            {/* Party / Wizard cone hat */}
            <polygon
              points={`${headX},${headY - 55} ${headX - 28},${headY - 20} ${headX + 28},${headY - 20}`}
              fill="#ec4899"
              stroke="#be185d"
              strokeWidth="2"
            />
            <ellipse cx={headX} cy={headY - 20} rx="28" ry="6" fill="#f43f5e" />
            <circle cx={headX} cy={headY - 55} r="6" fill="#fbbf24" />
            {/* Hat stars */}
            <circle cx={headX - 6} cy={headY - 32} r="2.5" fill="#fef08a" />
            <circle cx={headX + 7} cy={headY - 27} r="3" fill="#fef08a" />
          </g>
        );

      case 'bowtie':
        return (
          <g>
            <polygon
              points={`${headX},${neckY} ${headX - 16},${neckY - 8} ${headX - 16},${neckY + 8}`}
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="1.5"
            />
            <polygon
              points={`${headX},${neckY} ${headX + 16},${neckY - 8} ${headX + 16},${neckY + 8}`}
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="1.5"
            />
            <circle cx={headX} cy={neckY} r="5" fill="#dc2626" />
          </g>
        );

      case 'cape':
        return (
          <g>
            <path
              d={`M ${headX - 35} ${neckY - 2} Q ${headX - 55} ${neckY + 45} ${headX - 45} ${neckY + 70} L ${headX + 45} ${neckY + 70} Q ${headX + 55} ${neckY + 45} ${headX + 35} ${neckY - 2} Z`}
              fill="#6366f1"
              stroke="#4338ca"
              strokeWidth="2"
              opacity="0.9"
            />
          </g>
        );

      case 'headphones':
        return (
          <g stroke="#0f172a" strokeWidth="3" fill="none">
            {/* Headband arch */}
            <path d={`M ${headX - 40} ${headY} A 40 40 0 0 1 ${headX + 40} ${headY}`} />
            {/* Ear cups */}
            <rect x={headX - 46} y={headY - 12} width="10" height="24" rx="5" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
            <rect x={headX + 36} y={headY - 12} width="10" height="24" rx="5" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
          </g>
        );

      case 'scarf':
        return (
          <g>
            <rect x={headX - 28} y={neckY - 6} width="56" height="14" rx="7" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
            <rect x={headX + 6} y={neckY + 4} width="14" height="28" rx="4" fill="#ea580c" />
            {/* Stripes */}
            <line x1={headX - 16} y1={neckY - 6} x2={headX - 16} y2={neckY + 8} stroke="#fed7aa" strokeWidth="2" />
            <line x1={headX + 2} y1={neckY - 6} x2={headX + 2} y2={neckY + 8} stroke="#fed7aa" strokeWidth="2" />
          </g>
        );

      default:
        return null;
    }
  };

  // 1. PANDA (Bambu)
  const renderPanda = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Ears */}
        <circle cx="58" cy="55" r="22" fill="#1e293b" />
        <circle cx="58" cy="55" r="13" fill="#475569" />
        <circle cx="142" cy="55" r="22" fill="#1e293b" />
        <circle cx="142" cy="55" r="13" fill="#475569" />

        {/* Body */}
        <ellipse cx="100" cy="140" rx="55" ry="46" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
        {/* Panda dark arms & vest */}
        <path d="M 50 120 C 35 135, 45 160, 65 155 C 60 140, 60 125, 50 120 Z" fill="#1e293b" />
        <path d="M 150 120 C 165 135, 155 160, 135 155 C 140 140, 140 125, 150 120 Z" fill="#1e293b" />
        <ellipse cx="100" cy="146" rx="36" ry="30" fill="#f8fafc" />

        {/* Head */}
        <circle cx="100" cy="92" r="50" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />

        {/* Eye Patches */}
        <ellipse cx="78" cy="88" rx="14" ry="17" fill="#1e293b" transform="rotate(-15 78 88)" />
        <ellipse cx="122" cy="88" rx="14" ry="17" fill="#1e293b" transform="rotate(15 122 88)" />

        {/* Eyes */}
        {renderEyes(78, 122, 88, 5, '#ffffff')}

        {/* Rosy Cheeks */}
        <ellipse cx="65" cy="105" rx="7" ry="4" fill="#fda4af" opacity="0.65" />
        <ellipse cx="135" cy="105" rx="7" ry="4" fill="#fda4af" opacity="0.65" />

        {/* Snout & Nose */}
        <ellipse cx="100" cy="102" rx="13" ry="9" fill="#f1f5f9" />
        <polygon points="100,99 95,95 105,95" fill="#0f172a" />
        {renderMouth(100, 108)}

        {/* Bamboo Leaf decoration */}
        <path d="M 132 40 Q 148 35 152 48 Q 140 46 132 40 Z" fill="#22c55e" />

        {/* Accessory */}
        {renderAccessory(100, 88, 124)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // 2. ROBOT (Sparky)
  const renderRobot = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Antenna */}
        <line x1="100" y1="35" x2="100" y2="52" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="32" r="9" fill={state === 'worried' ? '#ef4444' : '#06b6d4'} className="animate-pulse" />

        {/* Ears / Screws */}
        <rect x="42" y="78" width="10" height="22" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <rect x="148" y="78" width="10" height="22" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="2" />

        {/* Body */}
        <rect x="58" y="120" width="84" height="60" rx="16" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
        {/* Chest Display */}
        <rect x="72" y="132" width="56" height="34" rx="8" fill="#0f172a" />
        <line x1="78" y1="148" x2="122" y2="148" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="82" cy="140" r="3" fill="#38bdf8" />
        <circle cx="92" cy="140" r="3" fill="#f59e0b" />
        <circle cx="102" cy="140" r="3" fill="#ef4444" />

        {/* Head */}
        <rect x="52" y="52" width="96" height="72" rx="20" fill="#bae6fd" stroke="#0284c7" strokeWidth="3" />
        {/* Visor Screen */}
        <rect x="62" y="65" width="76" height="46" rx="12" fill="#0f172a" />

        {/* Robot Eyes (Cyan/Glowing) */}
        {state === 'sleeping' ? (
          <g stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
            <line x1="72" y1="84" x2="88" y2="84" />
            <line x1="112" y1="84" x2="128" y2="84" />
          </g>
        ) : (
          renderEyes(80, 120, 84, 7, '#38bdf8')
        )}

        {/* Mouth (Digital waveform or bar) */}
        {state === 'talking' ? (
          <rect x="90" y="98" width="20" height="8" rx="2" fill="#38bdf8" className="anim-talking" />
        ) : (
          <rect x="92" y="100" width="16" height="4" rx="2" fill="#38bdf8" />
        )}

        {/* Accessory */}
        {renderAccessory(100, 84, 122)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // 3. CAT (Mochi)
  const renderCat = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Tail */}
        <path d="M 145 150 Q 185 140 175 110 Q 165 100 160 115" fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />

        {/* Ears */}
        <polygon points="56,38 78,74 46,72" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
        <polygon points="60,48 74,70 52,69" fill="#fbcfe8" />
        <polygon points="144,38 122,74 154,72" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
        <polygon points="140,48 126,70 148,69" fill="#fbcfe8" />

        {/* Body */}
        <ellipse cx="100" cy="142" rx="52" ry="44" fill="#fed7aa" stroke="#ea580c" strokeWidth="3" />
        <ellipse cx="100" cy="148" rx="34" ry="28" fill="#fff7ed" />

        {/* Head */}
        <circle cx="100" cy="92" r="48" fill="#fed7aa" stroke="#ea580c" strokeWidth="3" />

        {/* Calico spot */}
        <path d="M 68 55 Q 85 58 80 75 Q 65 72 68 55 Z" fill="#ea580c" />

        {/* Whiskers */}
        <g stroke="#78350f" strokeWidth="2" strokeLinecap="round">
          <line x1="50" y1="98" x2="28" y2="94" />
          <line x1="50" y1="104" x2="26" y2="108" />
          <line x1="150" y1="98" x2="172" y2="94" />
          <line x1="150" y1="104" x2="174" y2="108" />
        </g>

        {/* Eyes */}
        {renderEyes(80, 120, 90, 6, '#78350f')}

        {/* Nose & Mouth */}
        <polygon points="100,101 96,97 104,97" fill="#f43f5e" />
        {renderMouth(100, 107, '#78350f')}

        {/* Cheeks */}
        <ellipse cx="68" cy="104" rx="6" ry="4" fill="#fda4af" opacity="0.6" />
        <ellipse cx="132" cy="104" rx="6" ry="4" fill="#fda4af" opacity="0.6" />

        {/* Accessory */}
        {renderAccessory(100, 90, 125)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // 4. DOG (Barkley)
  const renderDog = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Floppy Ears */}
        <ellipse cx="50" cy="85" rx="16" ry="32" fill="#b45309" stroke="#78350f" strokeWidth="2" transform="rotate(15 50 85)" />
        <ellipse cx="150" cy="85" rx="16" ry="32" fill="#b45309" stroke="#78350f" strokeWidth="2" transform="rotate(-15 150 85)" />

        {/* Body */}
        <ellipse cx="100" cy="142" rx="54" ry="44" fill="#fcd34d" stroke="#b45309" strokeWidth="3" />
        <ellipse cx="100" cy="148" rx="34" ry="28" fill="#fef3c7" />

        {/* Head */}
        <circle cx="100" cy="90" r="48" fill="#fcd34d" stroke="#b45309" strokeWidth="3" />

        {/* Eyes */}
        {renderEyes(80, 120, 86, 6, '#451a03')}

        {/* Big Snout */}
        <ellipse cx="100" cy="104" rx="22" ry="15" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
        <ellipse cx="100" cy="98" rx="10" ry="7" fill="#1e293b" />

        {/* Mouth with cute tongue if happy/excited */}
        {state === 'happy' || state === 'excited' || state === 'celebrating' ? (
          <g>
            <path d="M 94 107 Q 100 112 106 107" fill="none" stroke="#451a03" strokeWidth="2" />
            <path d="M 97 109 Q 100 119 105 117 Q 108 112 105 109 Z" fill="#f43f5e" />
          </g>
        ) : (
          renderMouth(100, 108, '#451a03')
        )}

        {/* Cheeks */}
        <ellipse cx="68" cy="102" rx="6" ry="4" fill="#fbcfe8" opacity="0.7" />
        <ellipse cx="132" cy="102" rx="6" ry="4" fill="#fbcfe8" opacity="0.7" />

        {/* Accessory */}
        {renderAccessory(100, 86, 124)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // 5. FOX (Rusty)
  const renderFox = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Bushy Tail */}
        <path d="M 140 160 Q 190 145 185 100 Q 170 85 155 110 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
        <path d="M 185 100 Q 170 85 160 98 Q 175 105 185 100 Z" fill="#ffffff" />

        {/* Pointy Ears */}
        <polygon points="52,28 78,68 44,66" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
        <polygon points="56,38 72,64 48,63" fill="#ffffff" />
        <polygon points="148,28 122,68 156,66" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
        <polygon points="144,38 128,64 152,63" fill="#ffffff" />

        {/* Body */}
        <ellipse cx="100" cy="144" rx="50" ry="42" fill="#ea580c" stroke="#c2410c" strokeWidth="3" />
        <ellipse cx="100" cy="148" rx="30" ry="26" fill="#ffffff" />

        {/* Head */}
        <circle cx="100" cy="92" r="46" fill="#ea580c" stroke="#c2410c" strokeWidth="3" />

        {/* White facial mask */}
        <path d="M 60 90 Q 75 118 100 118 Q 125 118 140 90 Q 100 98 60 90 Z" fill="#ffffff" />

        {/* Eyes */}
        {renderEyes(82, 118, 88, 5.5, '#431407')}

        {/* Black Nose */}
        <polygon points="100,107 95,102 105,102" fill="#0f172a" />
        {renderMouth(100, 112, '#431407')}

        {/* Cheeks */}
        <ellipse cx="68" cy="100" rx="5" ry="3" fill="#fda4af" opacity="0.6" />
        <ellipse cx="132" cy="100" rx="5" ry="3" fill="#fda4af" opacity="0.6" />

        {/* Accessory */}
        {renderAccessory(100, 88, 126)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // 6. SUPERHERO (Cosmo)
  const renderSuperhero = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Floating Cape background */}
        <path d="M 60 110 Q 30 150 40 180 Q 100 170 160 180 Q 170 150 140 110 Z" fill="#4f46e5" stroke="#3730a3" strokeWidth="2" />

        {/* Body (Hero suit) */}
        <ellipse cx="100" cy="144" rx="48" ry="42" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
        {/* Chest Star Emblem */}
        <circle cx="100" cy="144" r="16" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
        <polygon points="100,132 104,141 114,142 106,148 109,157 100,152 91,157 94,148 86,142 96,141" fill="#ffffff" />

        {/* Head */}
        <circle cx="100" cy="88" r="46" fill="#fed7aa" stroke="#f97316" strokeWidth="2.5" />
        {/* Hero Mask / Cowl */}
        <path d="M 58 72 Q 100 62 142 72 Q 146 95 130 98 Q 100 88 70 98 Q 54 95 58 72 Z" fill="#4f46e5" stroke="#3730a3" strokeWidth="2" />

        {/* Eyes inside mask */}
        {renderEyes(82, 118, 85, 5.5, '#ffffff')}

        {/* Mouth */}
        {renderMouth(100, 110, '#9a3412')}

        {/* Heroic Hair tuft */}
        <path d="M 85 45 Q 100 30 115 42 Q 125 45 120 54 Q 100 48 85 45 Z" fill="#1e1b4b" />

        {/* Accessory */}
        {renderAccessory(100, 85, 122)}
        {renderStateOverlays()}
      </svg>
    );
  };

  const renderCharacterSVG = () => {
    switch (config.type) {
      case 'robot':
        return renderRobot();
      case 'cat':
        return renderCat();
      case 'dog':
        return renderDog();
      case 'fox':
        return renderFox();
      case 'superhero':
        return renderSuperhero();
      case 'panda':
      default:
        return renderPanda();
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${getAnimationClass()} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      title={onClick ? `Click to interact with ${config.name}!` : config.name}
    >
      {renderCharacterSVG()}
    </div>
  );
};
