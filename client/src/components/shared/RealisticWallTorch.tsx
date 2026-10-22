import React, { useState } from 'react';
import type { ChamberId } from '../../types/dungeon.types';

interface RealisticWallTorchProps {
  readonly chamberId: ChamberId;
  readonly chamberName: string;
  readonly isLit: boolean;
  readonly onIgnite: (id: ChamberId, name: string) => void;
}

export const RealisticWallTorch: React.FC<RealisticWallTorchProps> = React.memo(
  ({ chamberId, chamberName, isLit, onIgnite }) => {
    const [customImgFailed, setCustomImgFailed] = useState<boolean>(false);

    const customTorchSrc = isLit
      ? '/assets/images/torch-lit.png'
      : '/assets/images/torch-unlit.png';

    return (
      <button
        type="button"
        onMouseEnter={() => {
          if (!isLit) onIgnite(chamberId, chamberName);
        }}
        onClick={() => onIgnite(chamberId, chamberName)}
        className={`group relative z-40 flex items-center gap-4 rounded-2xl border-2 px-5 py-2.5 font-code text-xs transition-colors duration-300 ${
          isLit
            ? 'border-purple-400/80 bg-gradient-to-r from-purple-950/70 via-[#1f1408] to-amber-950/70 text-amber-100'
            : 'border-amber-600/50 bg-[#14100c] text-amber-300/90 hover:border-amber-400'
        }`}
      >
        <div className="relative flex h-14 w-12 shrink-0 items-center justify-center">
          {!customImgFailed ? (
            <img
              src={customTorchSrc}
              alt={isLit ? 'Lit Torch' : 'Unlit Torch'}
              onError={() => setCustomImgFailed(true)}
              className="h-14 w-12 object-contain"
            />
          ) : (
            <svg
              viewBox="0 0 64 88"
              className="h-14 w-12 overflow-visible"
              fill="none"
            >
              {isLit && (
                <g className="flame-animated">
                  <path
                    d="M32 2C32 2 50 16 46 32C43 42 36 45 32 45C28 45 21 42 18 32C14 16 32 2 32 2Z"
                    fill="#9333ea"
                    fillOpacity="0.9"
                  />
                  <path
                    d="M32 9C32 9 45 20 42 32C40 39 35 43 32 43C29 43 24 39 22 32C19 20 32 9 32 9Z"
                    fill="#38bdf8"
                  />
                  <path
                    d="M32 18C32 18 39 25 37 33C36 38 34 41 32 41C30 41 28 38 27 33C25 25 32 18 32 18Z"
                    fill="#fef08a"
                  />
                </g>
              )}
              <ellipse
                cx="32"
                cy="43"
                rx="11"
                ry="4"
                fill={isLit ? '#a855f7' : '#27272a'}
              />
              <path
                d="M19 43H45L41 53H23L19 43Z"
                fill="#71717a"
                stroke="#fbbf24"
                strokeWidth="1.2"
              />
              <rect
                x="24"
                y="62"
                width="16"
                height="5"
                rx="2"
                fill="#52525b"
              />
              <path
                d="M25 53H39L35 83C35 85 33.5 86 32 86C30.5 86 29 85 29 83L25 53Z"
                fill="#451a03"
                stroke="#92400e"
                strokeWidth="1"
              />
            </svg>
          )}
        </div>

        <div className="text-left">
          <span className="block text-[10px] uppercase tracking-widest text-purple-300">
            {isLit ? '⚡ .NET CHECKPOINT LIT' : '🕯️ UNLIT WALL TORCH'}
          </span>
          <span className="font-bold text-xs sm:text-sm">
            {isLit
              ? `${chamberName} Illuminated`
              : 'Bring Torch Cursor Here to Ignite'}
          </span>
        </div>
      </button>
    );
  }
);