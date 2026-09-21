import React from 'react';
import { CharacterConfig, CharacterState } from '../../types';

interface AnimatedCharacterProps {
  config: CharacterConfig;
  state?: CharacterState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  showAccessories?: boolean;
  animationsEnabled?: boolean;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  config,
  state = 'idle',
  size = 'lg',
  onClick,
  className = '',
  showAccessories = true,
  animationsEnabled = true,
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-56 h-56 md:w-64 md:h-64',
    xl: 'w-72 h-72 md:w-80 md:h-80',
  };

  const getAnimationClass = () => {
    if (!animationsEnabled) return '';
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
          <g className={`${animationsEnabled ? 'anim-zzz' : ''} select-none pointer-events-none`}>
            {/* Snot bubble for anime sleeping */}
            <circle cx="112" cy="98" r="8" fill="#bae6fd" opacity="0.75" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="145" y="45" fill="#818cf8" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Z</text>
            <text x="160" y="30" fill="#a5b4fc" fontSize="22" fontWeight="bold" fontFamily="sans-serif">Z</text>
            <text x="175" y="15" fill="#c7d2fe" fontSize="26" fontWeight="bold" fontFamily="sans-serif">z</text>
          </g>
        )}

        {state === 'worried' && (
          <g className={`${animationsEnabled ? 'anim-sweat' : ''} pointer-events-none`}>
            <path
              d="M 148 55 C 148 55, 142 65, 142 70 A 6 6 0 0 0 154 70 C 154 65, 148 55, 148 55 Z"
              fill="#38bdf8"
              opacity="0.9"
            />
          </g>
        )}

        {state === 'sad' && (
          <g className={`${animationsEnabled ? 'anim-sweat' : ''} pointer-events-none`}>
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
          <g className={`pointer-events-none ${animationsEnabled ? 'animate-pulse' : ''}`}>
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
  // 1. SHINCHAN (Shin-chan Nohara - Crayon Shin-chan)
  // ==========================================
  const renderShinchan = () => {
    const isWiggle = state === 'celebrating' || state === 'happy';

    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Ground Ambient Shadow */}
        <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.14)" />

        {/* Legs & White Socks */}
        <g>
          {/* Left Leg */}
          <rect x="76" y="146" width="14" height="24" rx="6" fill="#fde2c7" stroke="#18181b" strokeWidth="2.5" />
          <rect x="75" y="160" width="16" height="9" rx="2" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
          {/* Left Yellow Shoe */}
          <path d="M 68 172 C 68 166 84 166 96 172 C 98 178 94 185 78 185 C 68 185 68 178 68 172 Z" fill="#facc15" stroke="#18181b" strokeWidth="2.5" />
          <path d="M 69 181 Q 82 185 95 181" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right Leg */}
          <rect x="110" y="146" width="14" height="24" rx="6" fill="#fde2c7" stroke="#18181b" strokeWidth="2.5" />
          <rect x="109" y="160" width="16" height="9" rx="2" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
          {/* Right Yellow Shoe */}
          <path d="M 104 172 C 104 166 120 166 132 172 C 134 178 130 185 114 185 C 104 185 104 178 104 172 Z" fill="#facc15" stroke="#18181b" strokeWidth="2.5" />
          <path d="M 105 181 Q 118 185 131 181" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Yellow Shorts with leg openings */}
        <path
          d="M 66 124 L 134 124 C 136 135 134 152 126 152 L 105 152 L 100 142 L 95 152 L 74 152 C 66 152 64 135 66 124 Z"
          fill="#facc15"
          stroke="#18181b"
          strokeWidth="2.5"
        />
        {/* Shorts waistband & center fold */}
        <line x1="68" y1="128" x2="132" y2="128" stroke="#ca8a04" strokeWidth="1.5" />
        <line x1="100" y1="128" x2="100" y2="140" stroke="#ca8a04" strokeWidth="1.5" />

        {/* Red T-Shirt Body */}
        <path
          d="M 64 94 L 136 94 C 138 106 136 126 132 126 L 68 126 C 64 126 62 106 64 94 Z"
          fill="#ef4444"
          stroke="#18181b"
          strokeWidth="2.5"
        />
        {/* Yellow crew neck rim */}
        <path d="M 88 94 Q 100 100 112 94" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />

        {/* Arms */}
        {state === 'excited' ? (
          // Action Kamen Beam Pose
          <g>
            <path d="M 66 98 L 46 88 L 74 78" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 66 98 L 46 88 L 74 78" stroke="#fde2c7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 134 98 L 154 88 L 126 78" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 134 98 L 154 88 L 126 78" stroke="#fde2c7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Lightning beam spark */}
            <path d="M 100 74 L 95 62 L 105 60 L 98 46" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" fill="none" className="animate-pulse" />
          </g>
        ) : isWiggle ? (
          // Playful shimmy dancing arms
          <g>
            <path d="M 64 98 Q 44 90 50 76" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 64 98 Q 44 90 50 76" stroke="#fde2c7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="76" r="4.5" fill="#fde2c7" stroke="#18181b" strokeWidth="1.5" />

            <path d="M 136 98 Q 156 90 150 76" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 136 98 Q 156 90 150 76" stroke="#fde2c7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="150" cy="76" r="4.5" fill="#fde2c7" stroke="#18181b" strokeWidth="1.5" />
          </g>
        ) : (
          // Normal hands on sides
          <g>
            <path d="M 64 98 Q 50 114 54 128" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 64 98 Q 50 114 54 128" stroke="#fde2c7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="54" cy="128" r="4.5" fill="#fde2c7" stroke="#18181b" strokeWidth="1.5" />

            <path d="M 136 98 Q 150 114 146 128" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 136 98 Q 150 114 146 128" stroke="#fde2c7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="146" cy="128" r="4.5" fill="#fde2c7" stroke="#18181b" strokeWidth="1.5" />
          </g>
        )}

        {/* Sleeves overlay */}
        <path d="M 65 95 L 48 106 L 54 114 L 69 108 Z" fill="#ef4444" stroke="#18181b" strokeWidth="2" />
        <path d="M 135 95 L 152 106 L 146 114 L 131 108 Z" fill="#ef4444" stroke="#18181b" strokeWidth="2" />

        {/* Authentic Potato Head Silhouette (Single Smooth Bezier Path) */}
        <path
          d="M 146 76 C 148 50 134 32 100 32 C 72 32 50 44 42 60 C 28 68 22 84 26 98 C 32 114 52 122 76 122 C 104 122 138 114 144 88 C 146 84 146 80 146 76 Z"
          fill="#fde2c7"
          stroke="#18181b"
          strokeWidth="2.8"
        />

        {/* Right Ear with inner canal helix */}
        <path d="M 144 70 C 154 70 156 86 144 90" fill="#fde2c7" stroke="#18181b" strokeWidth="2.5" />
        <path d="M 147 75 Q 151 79 146 84" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />

        {/* Black Cropped Haircut (Clean Anime Contour) */}
        <path
          d="M 44 58 C 50 42 70 34 100 34 C 130 34 144 48 146 70 C 144 56 130 42 100 42 C 74 42 56 50 48 64 Z"
          fill="#18181b"
        />
        <path
          d="M 48 58 C 58 40 78 33 102 33 C 132 33 145 46 146 68 L 140 68 C 138 52 126 42 102 42 C 80 42 62 48 54 60 Z"
          fill="#09090b"
          stroke="#09090b"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Iconic Enormous Thick Curved Black Eyebrows */}
        <g>
          {state === 'worried' || state === 'sad' ? (
            <>
              <path d="M 54 64 C 64 68 80 64 90 56 C 86 60 74 66 56 65 Z" fill="#09090b" stroke="#09090b" strokeWidth="2" />
              <path d="M 104 56 C 114 64 130 68 140 64 C 130 66 118 60 106 56 Z" fill="#09090b" stroke="#09090b" strokeWidth="2" />
            </>
          ) : (
            <>
              {/* Left Eyebrow */}
              <path d="M 52 54 C 62 42 78 44 90 54 C 84 57 72 50 56 60 Z" fill="#09090b" stroke="#09090b" strokeWidth="2" strokeLinejoin="round" />
              {/* Right Eyebrow */}
              <path d="M 102 52 C 114 42 130 44 138 56 C 132 58 120 50 106 57 Z" fill="#09090b" stroke="#09090b" strokeWidth="2" strokeLinejoin="round" />
            </>
          )}
        </g>

        {/* Big Expressive Anime Eyes */}
        {state === 'sleeping' ? (
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 64 74 Q 74 82 84 74" />
            <path d="M 108 72 Q 118 80 128 72" />
          </g>
        ) : (
          <g className={animationsEnabled ? 'anim-blinking' : ''} style={{ transformOrigin: '100px 74px' }}>
            {/* Left Eye */}
            <ellipse cx="72" cy="74" rx="10.5" ry="12.5" fill="#ffffff" stroke="#18181b" strokeWidth="2.2" />
            <circle cx="74" cy="74" r="7" fill="#09090b" />
            <circle cx="72" cy="71" r="2.8" fill="#ffffff" />
            <circle cx="76" cy="77" r="1.2" fill="#ffffff" opacity="0.6" />

            {/* Right Eye */}
            <ellipse cx="114" cy="72" rx="10.5" ry="12.5" fill="#ffffff" stroke="#18181b" strokeWidth="2.2" />
            <circle cx="112" cy="72" r="7" fill="#09090b" />
            <circle cx="110" cy="69" r="2.8" fill="#ffffff" />
            <circle cx="114" cy="75" r="1.2" fill="#ffffff" opacity="0.6" />
          </g>
        )}

        {/* Rosy Anime Blush Circles */}
        <ellipse cx="44" cy="94" rx="9" ry="5.5" fill="#fb7185" opacity="0.65" />
        <ellipse cx="128" cy="88" rx="8" ry="5" fill="#fb7185" opacity="0.65" />

        {/* Iconic Sideways Bean Mouth */}
        {state === 'talking' ? (
          <g className={animationsEnabled ? 'anim-talking' : ''}>
            <ellipse cx="84" cy="94" rx="9" ry="7" fill="#ef4444" stroke="#18181b" strokeWidth="2" />
            <path d="M 78 96 Q 84 92 90 96" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        ) : state === 'happy' || isWiggle ? (
          <g>
            <path d="M 72 90 C 68 106 94 108 96 92 Z" fill="#ef4444" stroke="#18181b" strokeWidth="2" />
            <path d="M 76 98 Q 84 94 92 98 Q 84 105 76 98 Z" fill="#f472b6" />
          </g>
        ) : (
          <path d="M 74 92 Q 86 100 94 92" fill="none" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Chocobi Snack Box (Authentic Green Star Box) */}
        {state === 'celebrating' && (
          <g>
            <polygon points="144,102 166,96 166,132 144,138" fill="#15803d" stroke="#14532d" strokeWidth="1.5" />
            <polygon points="144,102 152,90 174,84 166,96" fill="#22c55e" stroke="#14532d" strokeWidth="1.5" />
            <text x="148" y="122" fontSize="11" fill="#facc15" fontWeight="black">★</text>
          </g>
        )}

        {renderAccessory(100, 74, 102)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // ==========================================
  // 2. DORAEMON (Fujiko F. Fujio)
  // ==========================================
  const renderDoraemon = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Ground Ambient Shadow */}
        <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.14)" />

        {/* Bamboo-Copter (Take-copter) */}
        <g>
          {/* Suction cup mount */}
          <ellipse cx="100" cy="20" rx="8" ry="3" fill="#eab308" stroke="#18181b" strokeWidth="1.5" />
          {/* Shaft */}
          <rect x="98.5" y="8" width="3" height="13" fill="#facc15" stroke="#18181b" strokeWidth="1" />
          {/* Rotor Blade */}
          <ellipse
            cx="100"
            cy="8"
            rx="28"
            ry="3.5"
            fill="#fde047"
            stroke="#18181b"
            strokeWidth="1.5"
            className={animationsEnabled ? 'animate-spin' : ''}
            style={{ transformOrigin: '100px 8px' }}
          />
        </g>

        {/* Large White Oval Feet */}
        <ellipse cx="78" cy="178" rx="20" ry="11" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
        <ellipse cx="122" cy="178" rx="20" ry="11" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />

        {/* Plump Blue Body */}
        <ellipse cx="100" cy="136" rx="48" ry="42" fill="#0284c7" stroke="#18181b" strokeWidth="2.5" />

        {/* Pure White Round Belly Patch */}
        <circle cx="100" cy="138" r="32" fill="#ffffff" stroke="#18181b" strokeWidth="2" />

        {/* Canonical 4D Pocket (Yojigen Pocket) */}
        <path d="M 78 138 L 122 138 C 122 158 78 158 78 138 Z" fill="#ffffff" stroke="#18181b" strokeWidth="2.2" />
        <line x1="78" y1="138" x2="122" y2="138" stroke="#18181b" strokeWidth="2" />

        {/* White Ball Hands (Cream-Puff Paws) */}
        <circle cx="46" cy="132" r="14" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
        <circle cx="154" cy="132" r="14" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />

        {/* Red Collar & Golden Jingle Bell */}
        <rect x="70" y="103" width="60" height="9" rx="4.5" fill="#ef4444" stroke="#18181b" strokeWidth="2" />
        <circle cx="100" cy="116" r="9" fill="#facc15" stroke="#18181b" strokeWidth="2" />
        <line x1="93" y1="113" x2="107" y2="113" stroke="#92400e" strokeWidth="1.5" />
        <circle cx="100" cy="116" r="2" fill="#78350f" />
        <line x1="100" y1="118" x2="100" y2="123" stroke="#78350f" strokeWidth="1.8" />

        {/* Big Spherical Blue Head */}
        <circle cx="100" cy="68" r="50" fill="#0284c7" stroke="#18181b" strokeWidth="2.5" />

        {/* White Face Mask */}
        <ellipse cx="100" cy="74" rx="42" ry="36" fill="#ffffff" stroke="#18181b" strokeWidth="2" />

        {/* Big Touching Oval Eyes */}
        <ellipse cx="88" cy="48" rx="11" ry="16" fill="#ffffff" stroke="#18181b" strokeWidth="2.2" />
        <ellipse cx="112" cy="48" rx="11" ry="16" fill="#ffffff" stroke="#18181b" strokeWidth="2.2" />

        {/* Eye Pupils with shine */}
        {state === 'sleeping' ? (
          <g stroke="#18181b" strokeWidth="2.5" strokeLinecap="round">
            <line x1="82" y1="48" x2="94" y2="48" />
            <line x1="106" y1="48" x2="118" y2="48" />
          </g>
        ) : state === 'happy' ? (
          <g stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M 81 48 Q 88 42 95 48" />
            <path d="M 105 48 Q 112 42 119 48" />
          </g>
        ) : (
          <g className={animationsEnabled ? 'anim-blinking' : ''} style={{ transformOrigin: '100px 48px' }}>
            <circle cx="92" cy="50" r="4.5" fill="#0f172a" />
            <circle cx="90" cy="48" r="1.8" fill="#ffffff" />
            <circle cx="108" cy="50" r="4.5" fill="#0f172a" />
            <circle cx="106" cy="48" r="1.8" fill="#ffffff" />
          </g>
        )}

        {/* Shiny Red Nose */}
        <circle cx="100" cy="62" r="7.5" fill="#ef4444" stroke="#18181b" strokeWidth="1.8" />
        <circle cx="97.5" cy="59.5" r="2.2" fill="#ffffff" />

        {/* Vertical Philtrum Line */}
        <line x1="100" y1="69.5" x2="100" y2="86" stroke="#18181b" strokeWidth="2.2" />

        {/* 6 Whiskers (3 on each side) */}
        <g stroke="#18181b" strokeWidth="2" strokeLinecap="round">
          <line x1="62" y1="68" x2="88" y2="72" />
          <line x1="60" y1="78" x2="88" y2="78" />
          <line x1="62" y1="88" x2="88" y2="84" />

          <line x1="112" y1="72" x2="138" y2="68" />
          <line x1="112" y1="78" x2="140" y2="78" />
          <line x1="112" y1="84" x2="138" y2="88" />
        </g>

        {/* Giant Iconic Doraemon Mouth */}
        {state === 'talking' ? (
          <g className={animationsEnabled ? 'anim-talking' : ''}>
            <ellipse cx="100" cy="94" rx="14" ry="10" fill="#dc2626" stroke="#18181b" strokeWidth="2.2" />
            <path d="M 92 98 Q 100 92 108 98" fill="none" stroke="#fb7185" strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : (
          <g>
            <path d="M 72 86 Q 100 114 128 86" fill="#dc2626" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 86 98 Q 93 92 100 96 Q 107 92 114 98 Q 100 109 86 98 Z" fill="#fb7185" />
          </g>
        )}

        {/* Dorayaki Pancake in hand if happy */}
        {state === 'happy' && (
          <g>
            <ellipse cx="156" cy="126" rx="13" ry="8" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
            <line x1="145" y1="126" x2="167" y2="126" stroke="#451a03" strokeWidth="2.5" />
          </g>
        )}

        {renderAccessory(100, 68, 104)}
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
        {/* Ground Ambient Shadow */}
        <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.14)" />

        {/* Lightning Bolt Tail */}
        <g>
          <path
            d="M 134 152 L 158 136 L 148 118 L 180 92 L 168 86 L 144 108 L 152 122 L 132 136 Z"
            fill="#facc15"
            stroke="#18181b"
            strokeWidth="2.5"
            strokeLinejoin="miter"
          />
          {/* Brown Base */}
          <path d="M 132 136 L 140 144 L 134 152 L 126 144 Z" fill="#78350f" stroke="#18181b" strokeWidth="1.5" />
        </g>

        {/* Flat Yellow Feet with 3 toe notches */}
        <g>
          <ellipse cx="78" cy="180" rx="16" ry="8" fill="#facc15" stroke="#18181b" strokeWidth="2.2" />
          <line x1="74" y1="178" x2="74" y2="186" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="80" y1="178" x2="80" y2="186" stroke="#ca8a04" strokeWidth="1.5" />

          <ellipse cx="122" cy="180" rx="16" ry="8" fill="#facc15" stroke="#18181b" strokeWidth="2.2" />
          <line x1="118" y1="178" x2="118" y2="186" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="124" y1="178" x2="124" y2="186" stroke="#ca8a04" strokeWidth="1.5" />
        </g>

        {/* Plump Pear-shaped Body */}
        <path
          d="M 68 118 C 56 128 54 168 74 176 C 90 180 110 180 126 176 C 146 168 144 128 132 118 Z"
          fill="#facc15"
          stroke="#18181b"
          strokeWidth="2.5"
        />

        {/* Chocolate Brown Back Stripes */}
        <path d="M 62 136 Q 74 132 86 136" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M 60 148 Q 74 144 88 148" stroke="#78350f" strokeWidth="4" strokeLinecap="round" fill="none" />

        {/* Short Forearms / Paws resting on belly */}
        <path d="M 78 126 C 74 136 84 146 92 142" stroke="#18181b" strokeWidth="2.2" fill="#facc15" strokeLinecap="round" />
        <path d="M 122 126 C 126 136 116 146 108 142" stroke="#18181b" strokeWidth="2.2" fill="#facc15" strokeLinecap="round" />

        {/* Long Pointed Ears with Diagonally Cut Jet-Black Tips */}
        {/* Left Ear */}
        <path d="M 68 54 C 44 26 36 6 34 2 C 54 12 74 38 80 50 Z" fill="#facc15" stroke="#18181b" strokeWidth="2.2" />
        <path d="M 34 2 C 40 5 44 9 40 14 C 36 10 34 5 34 2 Z" fill="#18181b" />
        {/* Right Ear */}
        <path d="M 132 54 C 156 26 164 6 166 2 C 146 12 126 38 120 50 Z" fill="#facc15" stroke="#18181b" strokeWidth="2.2" />
        <path d="M 166 2 C 160 5 156 9 160 14 C 164 10 166 5 166 2 Z" fill="#18181b" />

        {/* Chubby Head with Wide Cheeks */}
        <path
          d="M 62 76 C 54 94 62 116 78 118 C 92 120 108 120 122 118 C 138 116 146 94 138 76 C 130 56 70 56 62 76 Z"
          fill="#facc15"
          stroke="#18181b"
          strokeWidth="2.5"
        />

        {/* Circular Bright Red Electric Cheek Pouches */}
        <circle cx="68" cy="96" r="11" fill="#ef4444" stroke="#18181b" strokeWidth="1.5" />
        <circle cx="132" cy="96" r="11" fill="#ef4444" stroke="#18181b" strokeWidth="1.5" />

        {/* Electric Sparks when excited */}
        {state === 'excited' && (
          <g stroke="#eab308" strokeWidth="2.5" fill="none" className="animate-ping">
            <path d="M 52 90 L 44 94 L 50 98" />
            <path d="M 148 90 L 156 94 L 150 98" />
          </g>
        )}

        {/* Large Glossy Anime Eyes */}
        {state === 'sleeping' ? (
          <g stroke="#18181b" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M 74 78 Q 82 84 90 78" />
            <path d="M 110 78 Q 118 84 126 78" />
          </g>
        ) : (
          <g className={animationsEnabled ? 'anim-blinking' : ''} style={{ transformOrigin: '100px 78px' }}>
            {/* Left Eye */}
            <circle cx="82" cy="78" r="8" fill="#1e1b4b" stroke="#18181b" strokeWidth="1.5" />
            <circle cx="80" cy="76" r="3.2" fill="#ffffff" />
            <ellipse cx="84" cy="82" rx="2.5" ry="1.2" fill="#ca8a04" opacity="0.6" />

            {/* Right Eye */}
            <circle cx="118" cy="78" r="8" fill="#1e1b4b" stroke="#18181b" strokeWidth="1.5" />
            <circle cx="116" cy="76" r="3.2" fill="#ffffff" />
            <ellipse cx="120" cy="82" rx="2.5" ry="1.2" fill="#ca8a04" opacity="0.6" />
          </g>
        )}

        {/* Tiny Inverted Black Triangle Nose */}
        <polygon points="100,86 98,83 102,83" fill="#18181b" />

        {/* Adorable "ω" Cat Smile */}
        {state === 'talking' ? (
          <g className={animationsEnabled ? 'anim-talking' : ''}>
            <ellipse cx="100" cy="95" rx="7" ry="6" fill="#e11d48" stroke="#18181b" strokeWidth="1.8" />
            <path d="M 96 98 Q 100 94 104 98" fill="none" stroke="#fda4af" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ) : state === 'happy' ? (
          <g>
            <path d="M 92 90 Q 96 93 100 90 Q 104 93 108 90 C 108 102 92 102 92 90 Z" fill="#e11d48" stroke="#18181b" strokeWidth="1.8" />
            <path d="M 94 96 Q 100 92 106 96 Q 100 101 94 96 Z" fill="#fda4af" />
          </g>
        ) : (
          <path d="M 92 90 Q 96 94 100 90 Q 104 94 108 90" fill="none" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" />
        )}

        {renderAccessory(100, 78, 118)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // ==========================================
  // 4. LUFFY (Monkey D. Luffy - One Piece)
  // ==========================================
  const renderLuffy = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Ground Ambient Shadow */}
        <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.14)" />

        {/* Denim Blue Shorts with Fluffy White Cloud Cuffs */}
        <path
          d="M 72 136 L 128 136 C 130 148 128 160 124 160 L 105 160 L 100 152 L 95 160 L 76 160 C 72 160 70 148 72 136 Z"
          fill="#2563eb"
          stroke="#18181b"
          strokeWidth="2.5"
        />
        <ellipse cx="85" cy="160" rx="12" ry="4" fill="#ffffff" stroke="#18181b" strokeWidth="1.8" />
        <ellipse cx="115" cy="160" rx="12" ry="4" fill="#ffffff" stroke="#18181b" strokeWidth="1.8" />

        {/* Legs & Straw Sandals (Zōri) */}
        <rect x="79" y="162" width="12" height="18" fill="#fed7aa" stroke="#18181b" strokeWidth="2" />
        <rect x="109" y="162" width="12" height="18" fill="#fed7aa" stroke="#18181b" strokeWidth="2" />
        <ellipse cx="85" cy="180" rx="11" ry="4.5" fill="#ca8a04" stroke="#18181b" strokeWidth="1.8" />
        <ellipse cx="115" cy="180" rx="11" ry="4.5" fill="#ca8a04" stroke="#18181b" strokeWidth="1.8" />
        <path d="M 80 180 Q 85 177 90 180" stroke="#18181b" strokeWidth="2" fill="none" />
        <path d="M 110 180 Q 115 177 120 180" stroke="#18181b" strokeWidth="2" fill="none" />

        {/* Bare Toned Anime Chest & Torso */}
        <rect x="74" y="98" width="52" height="40" fill="#fed7aa" />
        {/* Collarbones */}
        <path d="M 82 106 Q 100 110 118 106" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />

        {/* Open Red Vest Flaps */}
        <path d="M 70 98 L 86 98 L 80 138 L 66 138 Z" fill="#ef4444" stroke="#18181b" strokeWidth="2.2" />
        <path d="M 130 98 L 114 98 L 120 138 L 134 138 Z" fill="#ef4444" stroke="#18181b" strokeWidth="2.2" />

        {/* Bright Golden Yellow Sash Belt */}
        <path d="M 70 134 L 130 134 L 128 142 L 72 142 Z" fill="#facc15" stroke="#18181b" strokeWidth="2" />
        {/* Hanging Knot */}
        <path d="M 124 140 L 132 154 L 126 156 L 120 142 Z" fill="#facc15" stroke="#18181b" strokeWidth="1.5" />

        {/* Arms */}
        <path d="M 68 102 Q 54 118 58 134" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 68 102 Q 54 118 58 134" stroke="#fed7aa" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M 132 102 Q 146 118 142 134" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M 132 102 Q 146 118 142 134" stroke="#fed7aa" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {/* Manga Meat on Bone (Ano Niku) */}
        {state === 'happy' && (
          <g>
            <rect x="136" y="122" width="28" height="18" rx="9" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.5" />
            <circle cx="134" cy="127" r="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="134" cy="135" r="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="166" cy="127" r="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="166" cy="135" r="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          </g>
        )}

        {/* Anime Head Contour */}
        <path d="M 74 68 C 72 90 84 102 100 102 C 116 102 128 90 126 68 Z" fill="#fed7aa" stroke="#18181b" strokeWidth="2.5" />
        <circle cx="72" cy="76" r="6" fill="#fed7aa" stroke="#18181b" strokeWidth="2" />
        <circle cx="128" cy="76" r="6" fill="#fed7aa" stroke="#18181b" strokeWidth="2" />

        {/* Spiky Jet-Black Anime Bangs */}
        <path
          d="M 68 70 L 64 56 L 74 60 L 80 48 L 90 58 L 100 46 L 110 58 L 120 48 L 126 60 L 136 56 L 132 70 Z"
          fill="#09090b"
          stroke="#09090b"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Authentic Mugiwara Straw Hat */}
        {/* Straw Crown Dome */}
        <ellipse cx="100" cy="42" rx="30" ry="20" fill="#f59e0b" stroke="#18181b" strokeWidth="2.5" />
        {/* Red Ribbon Band */}
        <path d="M 76 46 Q 100 50 124 46 L 124 53 Q 100 57 76 53 Z" fill="#ef4444" stroke="#18181b" strokeWidth="1.5" />
        {/* Wide Curved Straw Brim */}
        <ellipse cx="100" cy="54" rx="54" ry="14" fill="#f59e0b" stroke="#18181b" strokeWidth="2.5" />
        <ellipse cx="100" cy="54" rx="46" ry="11" fill="none" stroke="#d97706" strokeWidth="1.2" strokeDasharray="3 3" />

        {/* Eyes */}
        {state === 'sleeping' ? (
          <g stroke="#18181b" strokeWidth="2.5" strokeLinecap="round">
            <line x1="82" y1="74" x2="92" y2="74" />
            <line x1="108" y1="74" x2="118" y2="74" />
          </g>
        ) : (
          <g className={animationsEnabled ? 'anim-blinking' : ''} style={{ transformOrigin: '100px 74px' }}>
            <circle cx="86" cy="74" r="6" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
            <circle cx="87" cy="74" r="3.5" fill="#09090b" />
            <circle cx="85" cy="72" r="1.5" fill="#ffffff" />

            <circle cx="114" cy="74" r="6" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
            <circle cx="113" cy="74" r="3.5" fill="#09090b" />
            <circle cx="111" cy="72" r="1.5" fill="#ffffff" />
          </g>
        )}

        {/* Iconic Childhood Left Eye Scar (Two-Stitch Arc) */}
        <g stroke="#7c2d12" strokeWidth="1.8" strokeLinecap="round">
          <path d="M 82 82 Q 86 85 90 83" fill="none" />
          <line x1="84" y1="81" x2="84" y2="85" />
          <line x1="88" y1="81" x2="88" y2="85" />
        </g>

        {/* Giant Signature Toothy D-Grin */}
        {state === 'talking' ? (
          <ellipse cx="100" cy="88" rx="9" ry="6" fill="#ef4444" stroke="#18181b" strokeWidth="1.8" className={animationsEnabled ? 'anim-talking' : ''} />
        ) : (
          <g>
            <path d="M 80 86 Q 100 104 120 86 Z" fill="#ffffff" stroke="#18181b" strokeWidth="2.2" />
            <line x1="80" y1="86" x2="120" y2="86" stroke="#18181b" strokeWidth="1.8" />
            <line x1="92" y1="86" x2="92" y2="94" stroke="#18181b" strokeWidth="1.2" />
            <line x1="100" y1="86" x2="100" y2="96" stroke="#18181b" strokeWidth="1.2" />
            <line x1="108" y1="86" x2="108" y2="94" stroke="#18181b" strokeWidth="1.2" />
          </g>
        )}

        {renderAccessory(100, 74, 102)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // ==========================================
  // 5. NINJA HATTORI (Kanzo Hattori - Fujiko Fujio A)
  // ==========================================
  const renderHattori = () => {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Ground Ambient Shadow */}
        <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.14)" />

        {/* Ninja Katana (Sword strapped across back) */}
        <line x1="54" y1="58" x2="152" y2="156" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
        {/* Gold Square Handguard (Tsuba) */}
        <rect x="50" y="54" width="11" height="11" rx="1.5" fill="#facc15" stroke="#18181b" strokeWidth="1.5" transform="rotate(-45 50 54)" />
        {/* Wrapped Hilt */}
        <line x1="40" y1="44" x2="52" y2="56" stroke="#18181b" strokeWidth="5" strokeLinecap="round" />

        {/* Blue Ninja Pants with White Gaiters */}
        <path
          d="M 76 140 L 124 140 C 126 154 122 165 118 165 L 105 165 L 100 156 L 95 165 L 82 165 C 78 165 74 154 76 140 Z"
          fill="#1e40af"
          stroke="#18181b"
          strokeWidth="2.5"
        />
        <rect x="80" y="165" width="14" height="12" rx="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
        <rect x="106" y="165" width="14" height="12" rx="3" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
        <ellipse cx="87" cy="179" rx="10" ry="4.5" fill="#ca8a04" stroke="#18181b" strokeWidth="1.8" />
        <ellipse cx="113" cy="179" rx="10" ry="4.5" fill="#ca8a04" stroke="#18181b" strokeWidth="1.8" />

        {/* Blue Ninja Kimono Tunic */}
        <path
          d="M 68 104 L 132 104 C 136 118 134 140 128 140 L 72 140 C 66 140 64 118 68 104 Z"
          fill="#1e40af"
          stroke="#18181b"
          strokeWidth="2.5"
        />
        {/* White V-Neck undershirt */}
        <polygon points="100,118 90,104 110,104" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
        {/* Red Obi Sash */}
        <rect x="70" y="132" width="60" height="8" rx="2" fill="#ef4444" stroke="#18181b" strokeWidth="1.8" />

        {/* Hands in Secret Ninja Mudra ("Nin-nin!" Hand Seal) */}
        {state === 'excited' ? (
          <g>
            <path d="M 68 112 L 48 98" stroke="#18181b" strokeWidth="7" strokeLinecap="round" />
            <path d="M 68 112 L 48 98" stroke="#1e40af" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 132 112 L 156 94" stroke="#18181b" strokeWidth="7" strokeLinecap="round" />
            <path d="M 132 112 L 156 94" stroke="#1e40af" strokeWidth="4.5" strokeLinecap="round" />
            {/* Spinning Shuriken */}
            <polygon points="162,94 170,97 167,105 159,102" fill="#334155" className={animationsEnabled ? 'animate-spin' : ''} style={{ transformOrigin: '162px 99px' }} />
          </g>
        ) : (
          <g>
            <path d="M 68 112 Q 84 126 96 122" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 68 112 Q 84 126 96 122" stroke="#1e40af" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 132 112 Q 116 126 104 122" stroke="#18181b" strokeWidth="7" strokeLinecap="round" fill="none" />
            <path d="M 132 112 Q 116 126 104 122" stroke="#1e40af" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <rect x="94" y="116" width="12" height="14" rx="4" fill="#fed7aa" stroke="#18181b" strokeWidth="1.8" />
            <rect x="92" y="126" width="16" height="5" rx="2" fill="#ffffff" stroke="#18181b" strokeWidth="1.5" />
          </g>
        )}

        {/* Puffy Red Neck Cowl Scarf & Flowing Tails */}
        <ellipse cx="100" cy="104" rx="30" ry="10" fill="#ef4444" stroke="#18181b" strokeWidth="2.2" />
        <path d="M 124 106 Q 146 112 152 130 Q 140 126 126 114 Z" fill="#ef4444" stroke="#18181b" strokeWidth="2" />

        {/* Round Royal Blue Ninja Cowl (Zukin) */}
        <circle cx="100" cy="70" r="48" fill="#1e40af" stroke="#18181b" strokeWidth="2.5" />

        {/* Clean White Oval Face Opening */}
        <ellipse cx="100" cy="74" rx="36" ry="32" fill="#ffffff" stroke="#18181b" strokeWidth="2.2" />

        {/* White Forehead Headband with Red Crest */}
        <rect x="68" y="44" width="64" height="10" rx="3" fill="#ffffff" stroke="#18181b" strokeWidth="1.8" />
        <circle cx="100" cy="49" r="3.5" fill="#ef4444" />

        {/* Eyes */}
        {state === 'sleeping' ? (
          <g stroke="#18181b" strokeWidth="2.5" strokeLinecap="round">
            <line x1="82" y1="70" x2="94" y2="70" />
            <line x1="106" y1="70" x2="118" y2="70" />
          </g>
        ) : (
          <g className={animationsEnabled ? 'anim-blinking' : ''} style={{ transformOrigin: '100px 70px' }}>
            <ellipse cx="88" cy="70" rx="6" ry="7.5" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
            <circle cx="89" cy="70" r="4.5" fill="#09090b" />
            <circle cx="87" cy="68" r="1.8" fill="#ffffff" />

            <ellipse cx="112" cy="70" rx="6" ry="7.5" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
            <circle cx="111" cy="70" r="4.5" fill="#09090b" />
            <circle cx="109" cy="68" r="1.8" fill="#ffffff" />
          </g>
        )}

        {/* Authentic Concentric Red Spiral Whirlpool Cheeks 🌀 */}
        <g stroke="#ef4444" strokeWidth="2" fill="none" strokeLinecap="round">
          {/* Left Whirlpool */}
          <circle cx="74" cy="82" r="7" />
          <path d="M 74 78 A 4 4 0 0 1 77 82 A 3 3 0 0 1 74 85 A 2 2 0 0 1 73 82" />

          {/* Right Whirlpool */}
          <circle cx="126" cy="82" r="7" />
          <path d="M 126 78 A 4 4 0 0 1 129 82 A 3 3 0 0 1 126 85 A 2 2 0 0 1 125 82" />
        </g>

        {/* Straight / Smug Ninja Mouth */}
        {state === 'talking' ? (
          <ellipse cx="100" cy="86" rx="7" ry="5" fill="#ef4444" stroke="#18181b" strokeWidth="1.8" className={animationsEnabled ? 'anim-talking' : ''} />
        ) : (
          <line x1="94" y1="86" x2="106" y2="86" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {renderAccessory(100, 70, 104)}
        {renderStateOverlays()}
      </svg>
    );
  };

  // Helpers for original ToonMate mascots
  const renderEyes = (
    leftX: number,
    rightX: number,
    eyeY: number,
    radius: number,
    color = '#1e293b'
  ) => {
    if (state === 'sleeping') {
      return (
        <g stroke={color} strokeWidth="2.5" strokeLinecap="round">
          <line x1={leftX - radius} y1={eyeY} x2={leftX + radius} y2={eyeY} />
          <line x1={rightX - radius} y1={eyeY} x2={rightX + radius} y2={eyeY} />
        </g>
      );
    }
    return (
      <g className={animationsEnabled ? 'anim-blinking' : ''} style={{ transformOrigin: `100px ${eyeY}px` }}>
        <circle cx={leftX} cy={eyeY} r={radius} fill={color} />
        <circle cx={leftX - radius * 0.3} cy={eyeY - radius * 0.3} r={radius * 0.35} fill="#ffffff" />
        <circle cx={rightX} cy={eyeY} r={radius} fill={color} />
        <circle cx={rightX - radius * 0.3} cy={eyeY - radius * 0.3} r={radius * 0.35} fill="#ffffff" />
      </g>
    );
  };

  const renderMouth = (centerX: number, mouthY: number, strokeColor = '#1e293b') => {
    if (state === 'talking') {
      return (
        <ellipse
          cx={centerX}
          cy={mouthY}
          rx="6"
          ry="5"
          fill="#ef4444"
          stroke={strokeColor}
          strokeWidth="1.5"
          className={animationsEnabled ? 'anim-talking' : ''}
        />
      );
    }
    if (state === 'happy' || state === 'excited' || state === 'celebrating') {
      return (
        <path
          d={`M ${centerX - 7} ${mouthY - 2} Q ${centerX} ${mouthY + 7} ${centerX + 7} ${mouthY - 2} Z`}
          fill="#ef4444"
          stroke={strokeColor}
          strokeWidth="1.5"
        />
      );
    }
    return (
      <path
        d={`M ${centerX - 6} ${mouthY} Q ${centerX} ${mouthY + 4} ${centerX + 6} ${mouthY}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  };

  // ==========================================
  // ORIGINAL TOONMATE CHARACTERS
  // ==========================================

  // 1. PANDA (Bambu)
  const renderPanda = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Shadow */}
      <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />

      {/* Round Black Ears */}
      <circle cx="56" cy="54" r="22" fill="#18181b" stroke="#09090b" strokeWidth="2" />
      <circle cx="144" cy="54" r="22" fill="#18181b" stroke="#09090b" strokeWidth="2" />

      {/* White Body */}
      <ellipse cx="100" cy="142" rx="55" ry="46" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />
      <ellipse cx="100" cy="146" rx="36" ry="30" fill="#f8fafc" />

      {/* Black Arm Bands */}
      <path d="M 45 132 Q 60 120 75 136" stroke="#18181b" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M 155 132 Q 140 120 125 136" stroke="#18181b" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Head */}
      <circle cx="100" cy="92" r="50" fill="#ffffff" stroke="#18181b" strokeWidth="2.5" />

      {/* Iconic Panda Eye Patches */}
      <ellipse cx="78" cy="88" rx="14" ry="17" fill="#18181b" transform="rotate(-15 78 88)" />
      <ellipse cx="122" cy="88" rx="14" ry="17" fill="#18181b" transform="rotate(15 122 88)" />

      {/* Eyes inside patches */}
      {renderEyes(78, 122, 88, 5, '#ffffff')}

      {/* Snout Area */}
      <ellipse cx="100" cy="103" rx="14" ry="10" fill="#f1f5f9" />
      <polygon points="100,100 95,96 105,96" fill="#09090b" />
      {renderMouth(100, 107, '#18181b')}

      {/* Rosy Cheeks */}
      <ellipse cx="64" cy="104" rx="7" ry="4" fill="#fda4af" opacity="0.6" />
      <ellipse cx="136" cy="104" rx="7" ry="4" fill="#fda4af" opacity="0.6" />

      {renderAccessory(100, 88, 124)}
      {renderStateOverlays()}
    </svg>
  );

  // 2. ROBOT (Sparky)
  const renderRobot = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Shadow */}
      <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />

      {/* Antenna with pulsing light */}
      <line x1="100" y1="34" x2="100" y2="52" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="30" r="9" fill="#06b6d4" className={animationsEnabled ? 'animate-pulse' : ''} />

      {/* Body */}
      <rect x="58" y="120" width="84" height="60" rx="16" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
      {/* Chest screen / battery gauge */}
      <rect x="76" y="136" width="48" height="24" rx="6" fill="#0f172a" />
      <rect x="80" y="140" width="12" height="16" rx="2" fill="#22c55e" />
      <rect x="94" y="140" width="12" height="16" rx="2" fill="#22c55e" />
      <rect x="108" y="140" width="12" height="16" rx="2" fill="#38bdf8" />

      {/* Head */}
      <rect x="52" y="52" width="96" height="72" rx="20" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.5" />
      {/* Screen Visor */}
      <rect x="62" y="65" width="76" height="46" rx="12" fill="#0f172a" />

      {/* Digital Glowing Eyes */}
      {state === 'sleeping' ? (
        <g stroke="#38bdf8" strokeWidth="3" strokeLinecap="round">
          <line x1="72" y1="84" x2="88" y2="84" />
          <line x1="112" y1="84" x2="128" y2="84" />
        </g>
      ) : (
        <g className={animationsEnabled ? 'anim-blinking' : ''} style={{ transformOrigin: '100px 84px' }}>
          <circle cx="80" cy="84" r="6.5" fill="#38bdf8" />
          <circle cx="120" cy="84" r="6.5" fill="#38bdf8" />
          <circle cx="78" cy="82" r="2" fill="#ffffff" />
          <circle cx="118" cy="82" r="2" fill="#ffffff" />
        </g>
      )}

      {/* Mouth */}
      {state === 'talking' ? (
        <rect x="90" y="98" width="20" height="8" rx="2" fill="#38bdf8" className={animationsEnabled ? 'anim-talking' : ''} />
      ) : (
        <rect x="92" y="100" width="16" height="4" rx="2" fill="#38bdf8" />
      )}

      {renderAccessory(100, 84, 122)}
      {renderStateOverlays()}
    </svg>
  );

  // 3. CAT (Mochi)
  const renderCat = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Shadow */}
      <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />

      {/* Tail */}
      <path d="M 145 150 Q 185 140 175 110 Q 165 100 160 115" fill="none" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />

      {/* Ears */}
      <polygon points="56,38 78,74 46,72" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
      <polygon points="60,48 74,70 52,69" fill="#fbcfe8" />
      <polygon points="144,38 122,74 154,72" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
      <polygon points="140,48 126,70 148,69" fill="#fbcfe8" />

      {/* Body */}
      <ellipse cx="100" cy="142" rx="52" ry="44" fill="#fed7aa" stroke="#ea580c" strokeWidth="2.5" />
      <ellipse cx="100" cy="148" rx="34" ry="28" fill="#fff7ed" />

      {/* Head */}
      <circle cx="100" cy="92" r="48" fill="#fed7aa" stroke="#ea580c" strokeWidth="2.5" />

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

      {renderAccessory(100, 90, 125)}
      {renderStateOverlays()}
    </svg>
  );

  // 4. DOG (Barkley)
  const renderDog = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Shadow */}
      <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />

      {/* Floppy Ears */}
      <ellipse cx="50" cy="85" rx="16" ry="32" fill="#b45309" stroke="#78350f" strokeWidth="2" transform="rotate(15 50 85)" />
      <ellipse cx="150" cy="85" rx="16" ry="32" fill="#b45309" stroke="#78350f" strokeWidth="2" transform="rotate(-15 150 85)" />

      {/* Body */}
      <ellipse cx="100" cy="142" rx="54" ry="44" fill="#fcd34d" stroke="#b45309" strokeWidth="2.5" />
      <ellipse cx="100" cy="148" rx="34" ry="28" fill="#fef3c7" />

      {/* Head */}
      <circle cx="100" cy="90" r="48" fill="#fcd34d" stroke="#b45309" strokeWidth="2.5" />

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

      {renderAccessory(100, 86, 124)}
      {renderStateOverlays()}
    </svg>
  );

  // 5. FOX (Rusty)
  const renderFox = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Shadow */}
      <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />

      {/* Bushy Tail */}
      <path d="M 140 160 Q 190 145 185 100 Q 170 85 155 110 Z" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
      <path d="M 185 100 Q 170 85 160 98 Q 175 105 185 100 Z" fill="#ffffff" />

      {/* Pointy Ears */}
      <polygon points="52,28 78,68 44,66" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
      <polygon points="56,38 72,64 48,63" fill="#ffffff" />
      <polygon points="148,28 122,68 156,66" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
      <polygon points="144,38 128,64 152,63" fill="#ffffff" />

      {/* Body */}
      <ellipse cx="100" cy="144" rx="50" ry="42" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />
      <ellipse cx="100" cy="148" rx="30" ry="26" fill="#ffffff" />

      {/* Head */}
      <circle cx="100" cy="92" r="46" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />

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

      {renderAccessory(100, 88, 126)}
      {renderStateOverlays()}
    </svg>
  );

  // 6. SUPERHERO (Cosmo)
  const renderSuperhero = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
      {/* Shadow */}
      <ellipse cx="100" cy="188" rx="46" ry="8" fill="rgba(0,0,0,0.12)" />

      {/* Floating Cape background */}
      <path d="M 60 110 Q 30 150 40 180 Q 100 170 160 180 Q 170 150 140 110 Z" fill="#4f46e5" stroke="#3730a3" strokeWidth="2" />

      {/* Body (Hero suit) */}
      <ellipse cx="100" cy="144" rx="48" ry="42" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2.5" />
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

      {renderAccessory(100, 85, 122)}
      {renderStateOverlays()}
    </svg>
  );

  const renderCharacterSVG = () => {
    switch (config.type) {
      case 'panda':
        return renderPanda();
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
      case 'shinchan':
        return renderShinchan();
      case 'doraemon':
        return renderDoraemon();
      case 'pikachu':
        return renderPikachu();
      case 'luffy':
        return renderLuffy();
      case 'hattori':
        return renderHattori();
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
