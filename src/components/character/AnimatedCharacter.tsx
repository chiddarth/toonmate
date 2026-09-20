import React from 'react';
import { CharacterConfig, CharacterState } from '../../types';

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

  // State extra overlays (sweat, zzz, tears, sparkles)
  const renderStateOverlays = () => {
    return (
      <>
        {state === 'sleeping' && (
          <g className="anim-zzz select-none pointer-events-none">
            {/* Snot bubble for anime sleeping */}
            <circle cx="112" cy="98" r="8" fill="#bae6fd" opacity="0.75" stroke="#38bdf8" strokeWidth="1.5" />
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
              opacity="0.9"
            />
          </g>
        )}

        {state === 'sad' && (
          <g className="anim-sweat pointer-events-none">
            <ellipse cx="80" cy="100" rx="3" ry="6" fill="#38bdf8" opacity="0.85" />
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
            <text x="183" y="42" fontSize="16">💡</text>
          </g>
        )}

        {(state === 'celebrating' || state === 'excited') && (
          <g className="pointer-events-none animate-pulse">
            <text x="30" y="35" fontSize="18">✨</text>
            <text x="165" y="30" fontSize="20">🎉</text>
            <text x="25" y="145" fontSize="16">⭐</text>
            <text x="175" y="135" fontSize="18">✨</text>
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
            <circle cx={headX - 16} cy={headY} r="11" fill="rgba(255,255,255,0.25)" />
            <circle cx={headX + 16} cy={headY} r="11" fill="rgba(255,255,255,0.25)" />
            <line x1={headX - 5} y1={headY} x2={headX + 5} y2={headY} />
            <line x1={headX - 27} y1={headY} x2={headX - 34} y2={headY - 2} />
            <line x1={headX + 27} y1={headY} x2={headX + 34} y2={headY - 2} />
          </g>
        );

      case 'hat':
        return (
          <g>
            <polygon
              points={`${headX},${headY - 55} ${headX - 26},${headY - 22} ${headX + 26},${headY - 22}`}
              fill="#ec4899"
              stroke="#be185d"
              strokeWidth="2"
            />
            <ellipse cx={headX} cy={headY - 22} rx="26" ry="5" fill="#f43f5e" />
            <circle cx={headX} cy={headY - 55} r="6" fill="#fbbf24" />
            <circle cx={headX - 6} cy={headY - 35} r="2.5" fill="#fef08a" />
            <circle cx={headX + 7} cy={headY - 29} r="3" fill="#fef08a" />
          </g>
        );

      case 'bowtie':
        return (
          <g>
            <polygon
              points={`${headX},${neckY} ${headX - 15},${neckY - 7} ${headX - 15},${neckY + 7}`}
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="1.5"
            />
            <polygon
              points={`${headX},${neckY} ${headX + 15},${neckY - 7} ${headX + 15},${neckY + 7}`}
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="1.5"
            />
            <circle cx={headX} cy={neckY} r="4.5" fill="#dc2626" />
          </g>
        );

      case 'cape':
        return (
          <g>
            <path
              d={`M ${headX - 32} ${neckY - 2} Q ${headX - 52} ${neckY + 45} ${headX - 42} ${neckY + 70} L ${headX + 42} ${neckY + 70} Q ${headX + 52} ${neckY + 45} ${headX + 32} ${neckY - 2} Z`}
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="2"
              opacity="0.95"
            />
          </g>
        );

      case 'headphones':
        return (
          <g stroke="#0f172a" strokeWidth="3" fill="none">
            <path d={`M ${headX - 38} ${headY} A 38 38 0 0 1 ${headX + 38} ${headY}`} />
            <rect x={headX - 44} y={headY - 10} width="10" height="22" rx="5" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
            <rect x={headX + 34} y={headY - 10} width="10" height="22" rx="5" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
          </g>
        );

      case 'scarf':
        return (
          <g>
            <rect x={headX - 26} y={neckY - 5} width="52" height="12" rx="6" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
            <rect x={headX + 6} y={neckY + 5} width="12" height="24" rx="4" fill="#ea580c" />
            <line x1={headX - 14} y1={neckY - 5} x2={headX - 14} y2={neckY + 7} stroke="#fed7aa" strokeWidth="2" />
            <line x1={headX + 2} y1={neckY - 5} x2={headX + 2} y2={neckY + 7} stroke="#fed7aa" strokeWidth="2" />
          </g>
        );

      default:
        return null;
    }
  };

  // ==========================================
  // 1. SHINCHAN (Shin-chan Nohara)
  // ==========================================
  const renderShinchan = () => {
    const isWiggle = state === 'celebrating' || state === 'happy';

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="45" ry="8" fill="rgba(0,0,0,0.12)" />

        {/* Legs & Shoes */}
        <rect x="80" y="152" width="12" height="24" fill="#fed7aa" rx="4" />
        <rect x="108" y="152" width="12" height="24" fill="#fed7aa" rx="4" />
        {/* Yellow Shoes */}
        <ellipse cx="86" cy="178" rx="10" ry="7" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
        <ellipse cx="114" cy="178" rx="10" ry="7" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />

        {/* Yellow Shorts */}
        <path d="M 72 135 L 128 135 L 125 156 L 104 156 L 100 148 L 96 156 L 75 156 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />

        {/* Red Shirt Body */}
        <rect x="70" y="105" width="60" height="34" rx="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="2.5" />

        {/* Arms */}
        {state === 'excited' ? (
          // Action Kamen Beam Pose (arms forward crossed)
          <g>
            <path d="M 72 110 L 50 95 L 75 88" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 128 110 L 150 95 L 125 88" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />
            {/* Action Kamen Lightning */}
            <path d="M 100 80 L 96 70 L 104 68 L 98 55" stroke="#facc15" strokeWidth="3" fill="none" className="animate-pulse" />
          </g>
        ) : isWiggle ? (
          // Playful dancing arms
          <g>
            <path d="M 72 112 Q 52 100 58 85" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 128 112 Q 148 100 142 85" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />
          </g>
        ) : (
          <g>
            <path d="M 72 112 Q 60 125 64 140" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 128 112 Q 140 125 136 140" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Shinchan's iconic potato-shaped head */}
        <ellipse cx="100" cy="74" rx="46" ry="38" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
        {/* Left chubby cheek bump */}
        <ellipse cx="60" cy="80" rx="14" ry="16" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
        {/* Fill cheek seam */}
        <circle cx="68" cy="78" r="12" fill="#fed7aa" />

        {/* Black cropped hair */}
        <path d="M 58 64 Q 100 36 144 60 Q 148 40 134 32 Q 95 24 64 36 Q 52 46 58 64 Z" fill="#0f172a" />
        <ellipse cx="100" cy="42" rx="36" ry="12" fill="#0f172a" />

        {/* Big iconic curved thick eyebrows */}
        <g fill="#0f172a">
          {state === 'worried' ? (
            <>
              <path d="M 68 56 Q 80 64 92 60 Q 80 58 68 56 Z" />
              <path d="M 108 60 Q 120 64 132 56 Q 120 58 108 60 Z" />
            </>
          ) : (
            <>
              <path d="M 66 52 Q 80 42 94 50 Q 80 46 66 52 Z" />
              <path d="M 106 50 Q 120 42 134 52 Q 120 46 106 50 Z" />
            </>
          )}
        </g>

        {/* Eyes */}
        {state === 'sleeping' ? (
          <g stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 72 68 Q 80 73 88 68" />
            <path d="M 112 68 Q 120 73 128 68" />
          </g>
        ) : state === 'excited' ? (
          <g fill="#facc15" stroke="#ca8a04" strokeWidth="1">
            <circle cx="80" cy="68" r="7" fill="#0f172a" />
            <circle cx="78" cy="66" r="2.5" fill="#ffffff" />
            <circle cx="120" cy="68" r="7" fill="#0f172a" />
            <circle cx="118" cy="66" r="2.5" fill="#ffffff" />
          </g>
        ) : (
          <g className="anim-blinking" style={{ transformOrigin: '100px 68px' }}>
            <ellipse cx="80" cy="68" rx="6" ry="7" fill="#0f172a" />
            <circle cx="78" cy="66" r="2.5" fill="#ffffff" />
            <ellipse cx="120" cy="68" rx="6" ry="7" fill="#0f172a" />
            <circle cx="118" cy="66" r="2.5" fill="#ffffff" />
          </g>
        )}

        {/* Rosy Cheeks */}
        <ellipse cx="64" cy="82" rx="7" ry="4" fill="#fda4af" opacity="0.8" />
        <ellipse cx="132" cy="80" rx="7" ry="4" fill="#fda4af" opacity="0.8" />

        {/* Mouth */}
        {state === 'talking' ? (
          <ellipse cx="98" cy="86" rx="6" ry="5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" className="anim-talking" />
        ) : state === 'happy' || isWiggle ? (
          <path d="M 90 82 Q 98 94 108 82 Z" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" />
        ) : (
          <path d="M 92 84 Q 100 89 106 84" fill="none" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Chocobi Snack Box if celebrating */}
        {state === 'celebrating' && (
          <g>
            <polygon points="142,105 162,100 162,130 142,135" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />
            <text x="146" y="122" fontSize="9" fill="#ffffff" fontWeight="bold">⭐</text>
          </g>
        )}

        {renderAccessory(100, 68, 104)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // ==========================================
  // 2. DORAEMON
  // ==========================================
  const renderDoraemon = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />

        {/* Bamboo-Copter (Take-copter) on top of head */}
        <g>
          <rect x="98" y="24" width="4" height="14" fill="#ca8a04" />
          <ellipse cx="100" cy="24" rx="28" ry="4" fill="#facc15" stroke="#a16207" strokeWidth="1.5" className="animate-spin" style={{ transformOrigin: '100px 24px' }} />
        </g>

        {/* Feet (white ovals) */}
        <ellipse cx="80" cy="178" rx="18" ry="9" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
        <ellipse cx="120" cy="178" rx="18" ry="9" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />

        {/* Blue Body */}
        <ellipse cx="100" cy="138" rx="48" ry="42" fill="#0284c7" stroke="#0369a1" strokeWidth="2.5" />

        {/* White Belly */}
        <circle cx="100" cy="140" r="32" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />

        {/* 4D Pocket (Yojigen Pocket) */}
        <path d="M 80 142 L 120 142 A 20 20 0 0 1 80 142 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />

        {/* Hands (round white paws) */}
        <circle cx="48" cy="136" r="12" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
        <circle cx="152" cy="136" r="12" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />

        {/* Red Collar & Golden Bell */}
        <rect x="74" y="104" width="52" height="8" rx="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
        <circle cx="100" cy="114" r="8" fill="#facc15" stroke="#a16207" strokeWidth="1.5" />
        <circle cx="100" cy="115" r="2.5" fill="#78350f" />
        <line x1="94" y1="112" x2="106" y2="112" stroke="#78350f" strokeWidth="1" />

        {/* Blue Head */}
        <circle cx="100" cy="74" r="48" fill="#0284c7" stroke="#0369a1" strokeWidth="2.5" />

        {/* White Face Area */}
        <ellipse cx="100" cy="80" rx="40" ry="34" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />

        {/* Big Oval Eyes */}
        <ellipse cx="88" cy="56" rx="10" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
        <ellipse cx="112" cy="56" rx="10" ry="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />

        {/* Eye Pupils */}
        {state === 'sleeping' ? (
          <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
            <line x1="82" y1="58" x2="94" y2="58" />
            <line x1="106" y1="58" x2="118" y2="58" />
          </g>
        ) : state === 'worried' ? (
          <g>
            <circle cx="90" cy="58" r="4" fill="#0f172a" />
            <circle cx="110" cy="58" r="4" fill="#0f172a" />
          </g>
        ) : (
          <g className="anim-blinking" style={{ transformOrigin: '100px 56px' }}>
            <circle cx="90" cy="56" r="3.5" fill="#0f172a" />
            <circle cx="110" cy="56" r="3.5" fill="#0f172a" />
          </g>
        )}

        {/* Red Nose */}
        <circle cx="100" cy="68" r="6.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
        <circle cx="98" cy="66" r="2" fill="#ffffff" />
        {/* Nose center vertical line */}
        <line x1="100" y1="74" x2="100" y2="92" stroke="#0f172a" strokeWidth="2" />

        {/* Whiskers (3 on each side) */}
        <g stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round">
          <line x1="66" y1="76" x2="90" y2="79" />
          <line x1="64" y1="84" x2="90" y2="84" />
          <line x1="66" y1="92" x2="90" y2="89" />

          <line x1="110" y1="79" x2="134" y2="76" />
          <line x1="110" y1="84" x2="136" y2="84" />
          <line x1="110" y1="89" x2="134" y2="92" />
        </g>

        {/* Mouth */}
        {state === 'talking' ? (
          <ellipse cx="100" cy="94" rx="12" ry="8" fill="#ef4444" stroke="#0f172a" strokeWidth="2" className="anim-talking" />
        ) : (
          <path d="M 80 92 Q 100 110 120 92" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Dorayaki Pancake in hand if happy */}
        {state === 'happy' && (
          <g>
            <ellipse cx="154" cy="130" rx="12" ry="7" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <line x1="144" y1="130" x2="164" y2="130" stroke="#451a03" strokeWidth="2" />
          </g>
        )}

        {renderAccessory(100, 68, 106)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // ==========================================
  // 3. PIKACHU (Pokemon)
  // ==========================================
  const renderPikachu = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="44" ry="8" fill="rgba(0,0,0,0.12)" />

        {/* Lightning Tail */}
        <path
          d="M 135 150 L 160 135 L 148 115 L 180 90 L 168 85 L 145 105 L 152 120 Z"
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="2"
        />
        {/* Brown tail base */}
        <path d="M 135 150 L 145 142 L 140 135 L 132 142 Z" fill="#92400e" />

        {/* Ears */}
        {/* Left Ear */}
        <path d="M 68 56 Q 40 24 35 6 Q 58 14 78 48 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
        <path d="M 35 6 Q 44 4 48 10 L 40 18 Q 36 12 35 6 Z" fill="#0f172a" />
        {/* Right Ear */}
        <path d="M 132 56 Q 160 24 165 6 Q 142 14 122 48 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
        <path d="M 165 6 Q 156 4 152 10 L 160 18 Q 164 12 165 6 Z" fill="#0f172a" />

        {/* Body */}
        <ellipse cx="100" cy="142" rx="46" ry="40" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />

        {/* Brown stripes on back (subtle side view) */}
        <path d="M 60 135 Q 70 132 80 135" stroke="#92400e" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 58 145 Q 70 142 80 145" stroke="#92400e" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Feet */}
        <ellipse cx="80" cy="180" rx="14" ry="7" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
        <ellipse cx="120" cy="180" rx="14" ry="7" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />

        {/* Arms */}
        <ellipse cx="80" cy="140" rx="8" ry="14" fill="#facc15" stroke="#ca8a04" strokeWidth="2" transform="rotate(15 80 140)" />
        <ellipse cx="120" cy="140" rx="8" ry="14" fill="#facc15" stroke="#ca8a04" strokeWidth="2" transform="rotate(-15 120 140)" />

        {/* Head */}
        <circle cx="100" cy="84" r="44" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />

        {/* Red Cheek Pouches (Iconic!) */}
        <circle cx="66" cy="96" r="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
        <circle cx="134" cy="96" r="10" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />

        {/* Electric Sparks from cheeks if excited */}
        {state === 'excited' && (
          <g stroke="#eab308" strokeWidth="2" fill="none" className="animate-ping">
            <path d="M 54 90 L 46 94 L 52 98" />
            <path d="M 146 90 L 154 94 L 148 98" />
          </g>
        )}

        {/* Eyes */}
        {state === 'sleeping' ? (
          <g stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 76 80 Q 82 85 88 80" />
            <path d="M 112 80 Q 118 85 124 80" />
          </g>
        ) : (
          <g className="anim-blinking" style={{ transformOrigin: '100px 80px' }}>
            <circle cx="82" cy="80" r="7" fill="#1e293b" />
            <circle cx="80" cy="78" r="2.8" fill="#ffffff" />
            <circle cx="118" cy="80" r="7" fill="#1e293b" />
            <circle cx="116" cy="78" r="2.8" fill="#ffffff" />
          </g>
        )}

        {/* Tiny Nose */}
        <polygon points="100,88 98,85 102,85" fill="#1e293b" />

        {/* Cat-like Mouth */}
        {state === 'talking' ? (
          <ellipse cx="100" cy="98" rx="6" ry="5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" className="anim-talking" />
        ) : (
          <path d="M 94 94 Q 97 97 100 94 Q 103 97 106 94" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        )}

        {renderAccessory(100, 80, 118)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // ==========================================
  // 4. LUFFY (One Piece)
  // ==========================================
  const renderLuffy = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="44" ry="8" fill="rgba(0,0,0,0.12)" />

        {/* Blue Shorts & White Fur Cuff */}
        <path d="M 74 140 L 126 140 L 122 160 L 104 160 L 100 152 L 96 160 L 78 160 Z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="76" y="157" width="18" height="4" rx="2" fill="#ffffff" />
        <rect x="106" y="157" width="18" height="4" rx="2" fill="#ffffff" />

        {/* Legs & Sandals */}
        <rect x="80" y="160" width="10" height="18" fill="#fed7aa" />
        <rect x="110" y="160" width="10" height="18" fill="#fed7aa" />
        <ellipse cx="85" cy="178" rx="10" ry="4" fill="#78350f" />
        <ellipse cx="115" cy="178" rx="10" ry="4" fill="#78350f" />

        {/* Open Red Vest & Bare Chest with X-scar */}
        <rect x="72" y="104" width="56" height="38" rx="6" fill="#fed7aa" />
        {/* Red Vest Sides */}
        <path d="M 70 104 L 84 104 L 80 142 L 68 142 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
        <path d="M 130 104 L 116 104 L 120 142 L 132 142 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
        {/* Yellow Sash Belt */}
        <rect x="74" y="136" width="52" height="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />

        {/* Arms */}
        <path d="M 70 108 Q 56 122 62 138" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M 130 108 Q 144 122 138 138" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Giant Meat on a Bone if happy */}
        {state === 'happy' && (
          <g>
            <rect x="135" y="125" width="28" height="18" rx="9" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.5" />
            {/* Bone ends */}
            <circle cx="133" cy="130" r="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <circle cx="133" cy="138" r="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <circle cx="165" cy="130" r="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <circle cx="165" cy="138" r="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
          </g>
        )}

        {/* Head */}
        <circle cx="100" cy="74" r="38" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />

        {/* Black Spiky Hair */}
        <path d="M 64 68 Q 60 48 76 42 Q 95 38 108 42 Q 128 44 136 62 Q 134 50 120 40 Q 98 32 74 42 Z" fill="#0f172a" />

        {/* Iconic Straw Hat (Mugiwara) */}
        {/* Hat Crown */}
        <ellipse cx="100" cy="44" rx="30" ry="18" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
        {/* Red Ribbon Band */}
        <path d="M 72 48 Q 100 52 128 48 L 128 54 Q 100 58 72 54 Z" fill="#ef4444" />
        {/* Hat Wide Brim */}
        <ellipse cx="100" cy="54" rx="52" ry="12" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />

        {/* Eyes */}
        {state === 'sleeping' ? (
          <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
            <line x1="84" y1="74" x2="94" y2="74" />
            <line x1="106" y1="74" x2="116" y2="74" />
          </g>
        ) : (
          <g className="anim-blinking" style={{ transformOrigin: '100px 74px' }}>
            <circle cx="88" cy="74" r="5" fill="#0f172a" />
            <circle cx="86" cy="72" r="1.8" fill="#ffffff" />
            <circle cx="112" cy="74" r="5" fill="#0f172a" />
            <circle cx="110" cy="72" r="1.8" fill="#ffffff" />
          </g>
        )}

        {/* Iconic Left Eye Scar (curved stitch) */}
        <g stroke="#7c2d12" strokeWidth="1.5" strokeLinecap="round">
          <path d="M 84 82 Q 88 85 92 83" fill="none" />
          <line x1="86" y1="81" x2="86" y2="85" />
          <line x1="90" y1="81" x2="90" y2="85" />
        </g>

        {/* Big Signature Toothy D-Grin */}
        {state === 'talking' ? (
          <ellipse cx="100" cy="88" rx="8" ry="6" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" className="anim-talking" />
        ) : (
          <g>
            <path d="M 82 86 Q 100 102 118 86 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <line x1="82" y1="86" x2="118" y2="86" stroke="#0f172a" strokeWidth="1.5" />
            <line x1="94" y1="86" x2="94" y2="92" stroke="#0f172a" strokeWidth="1" />
            <line x1="100" y1="86" x2="100" y2="94" stroke="#0f172a" strokeWidth="1" />
            <line x1="106" y1="86" x2="106" y2="92" stroke="#0f172a" strokeWidth="1" />
          </g>
        )}

        {renderAccessory(100, 74, 104)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // ==========================================
  // 5. NINJA HATTORI (Kanzo Hattori)
  // ==========================================
  const renderHattori = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Shadow */}
        <ellipse cx="100" cy="188" rx="44" ry="8" fill="rgba(0,0,0,0.12)" />

        {/* Ninja Sword on back */}
        <line x1="58" y1="65" x2="148" y2="155" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
        <rect x="52" y="60" width="10" height="8" rx="2" fill="#facc15" transform="rotate(-45 52 60)" />

        {/* Blue Ninja Pants & Gaiters */}
        <path d="M 76 142 L 124 142 L 120 165 L 104 165 L 100 156 L 96 165 L 80 165 Z" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2" />
        <rect x="80" y="165" width="12" height="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" rx="2" />
        <rect x="108" y="165" width="12" height="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" rx="2" />
        {/* Straw Ninja Sandals */}
        <ellipse cx="86" cy="178" rx="9" ry="4" fill="#a16207" />
        <ellipse cx="114" cy="178" rx="9" ry="4" fill="#a16207" />

        {/* Blue Robe Body */}
        <rect x="70" y="106" width="60" height="38" rx="10" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2.5" />
        {/* Red Belt */}
        <rect x="72" y="136" width="56" height="6" fill="#ef4444" />

        {/* Hands in Ninja Seal (Ninpo) or Arms */}
        {state === 'excited' ? (
          // Shuriken throw pose
          <g>
            <path d="M 72 114 L 50 100" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" />
            <path d="M 128 114 L 155 95" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" />
            {/* Spinning Ninja Shuriken */}
            <polygon points="160,95 168,98 165,106 157,103" fill="#475569" className="animate-spin" style={{ transformOrigin: '160px 100px' }} />
          </g>
        ) : (
          <g>
            {/* Hands joined together in classic Ninpo hand sign */}
            <path d="M 72 115 Q 86 128 96 125" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" fill="none" />
            <path d="M 128 115 Q 114 128 104 125" stroke="#1d4ed8" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="100" cy="125" r="7" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
          </g>
        )}

        {/* Red Cowl / Scarf around neck */}
        <ellipse cx="100" cy="106" rx="26" ry="7" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
        <rect x="85" y="106" width="8" height="18" rx="3" fill="#dc2626" />

        {/* Head inside Blue Ninja Cowl */}
        <circle cx="100" cy="74" r="44" fill="#1d4ed8" stroke="#1e40af" strokeWidth="2.5" />

        {/* White Face Opening */}
        <ellipse cx="100" cy="76" rx="32" ry="28" fill="#ffffff" stroke="#1e40af" strokeWidth="2" />

        {/* White Headband with Ninja Emblem */}
        <rect x="70" y="44" width="60" height="8" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="100" cy="48" r="3" fill="#ef4444" />

        {/* Eyes (Round and determined) */}
        {state === 'sleeping' ? (
          <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round">
            <line x1="84" y1="70" x2="94" y2="70" />
            <line x1="106" y1="70" x2="116" y2="70" />
          </g>
        ) : (
          <g className="anim-blinking" style={{ transformOrigin: '100px 70px' }}>
            <circle cx="88" cy="70" r="5" fill="#0f172a" />
            <circle cx="86" cy="68" r="1.8" fill="#ffffff" />
            <circle cx="112" cy="70" r="5" fill="#0f172a" />
            <circle cx="110" cy="68" r="1.8" fill="#ffffff" />
          </g>
        )}

        {/* Iconic Whirlpool / Swirl Cheeks (Naruto Swirl) 🌀 */}
        <g stroke="#ef4444" strokeWidth="1.5" fill="none">
          <circle cx="76" cy="84" r="6" />
          <path d="M 76 81 A 3 3 0 0 1 79 84 A 3 3 0 0 1 76 87" />
          <circle cx="124" cy="84" r="6" />
          <path d="M 124 81 A 3 3 0 0 1 127 84 A 3 3 0 0 1 124 87" />
        </g>

        {/* Small straight mouth */}
        {state === 'talking' ? (
          <ellipse cx="100" cy="86" rx="6" ry="5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1.5" className="anim-talking" />
        ) : (
          <line x1="94" y1="86" x2="106" y2="86" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {renderAccessory(100, 70, 106)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // Bonus: Panda & Robot
  const renderPanda = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      <circle cx="58" cy="55" r="22" fill="#1e293b" />
      <circle cx="142" cy="55" r="22" fill="#1e293b" />
      <ellipse cx="100" cy="140" rx="55" ry="46" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
      <ellipse cx="100" cy="146" rx="36" ry="30" fill="#f8fafc" />
      <circle cx="100" cy="92" r="50" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
      <ellipse cx="78" cy="88" rx="14" ry="17" fill="#1e293b" transform="rotate(-15 78 88)" />
      <ellipse cx="122" cy="88" rx="14" ry="17" fill="#1e293b" transform="rotate(15 122 88)" />
      <circle cx="78" cy="88" r="5" fill="#ffffff" />
      <circle cx="122" cy="88" r="5" fill="#ffffff" />
      <ellipse cx="100" cy="102" rx="13" ry="9" fill="#f1f5f9" />
      <polygon points="100,99 95,95 105,95" fill="#0f172a" />
      <path d="M 94 106 Q 100 110 106 106" fill="none" stroke="#0f172a" strokeWidth="2" />
      {renderAccessory(100, 88, 124)}
      {renderStateOverlays()}
    </svg>
  );

  const renderRobot = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      <line x1="100" y1="35" x2="100" y2="52" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="32" r="9" fill="#06b6d4" className="animate-pulse" />
      <rect x="58" y="120" width="84" height="60" rx="16" fill="#38bdf8" stroke="#0284c7" strokeWidth="3" />
      <rect x="52" y="52" width="96" height="72" rx="20" fill="#bae6fd" stroke="#0284c7" strokeWidth="3" />
      <rect x="62" y="65" width="76" height="46" rx="12" fill="#0f172a" />
      <circle cx="80" cy="84" r="6" fill="#38bdf8" />
      <circle cx="120" cy="84" r="6" fill="#38bdf8" />
      <rect x="92" y="100" width="16" height="4" rx="2" fill="#38bdf8" />
      {renderAccessory(100, 84, 122)}
      {renderStateOverlays()}
    </svg>
  );

  const renderCharacterSVG = () => {
    switch (config.type) {
      case 'doraemon':
        return renderDoraemon();
      case 'pikachu':
        return renderPikachu();
      case 'luffy':
        return renderLuffy();
      case 'hattori':
        return renderHattori();
      case 'panda':
        return renderPanda();
      case 'robot':
        return renderRobot();
      case 'shinchan':
      default:
        return renderShinchan();
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
