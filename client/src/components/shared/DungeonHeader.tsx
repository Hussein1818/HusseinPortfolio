import React from 'react';
import {
  Flame,
  Users,
  Eye,
  Sun,
  Volume2,
  VolumeX,
  HelpCircle,
  Shield,
} from 'lucide-react';

interface DungeonHeaderProps {
  readonly heroName: string;
  readonly litCount: number;
  readonly totalChambers: number;
  readonly activeExplorersCount?: number;
  readonly isArcaneVision: boolean;
  readonly isLumosActive: boolean;
  readonly isMuted: boolean;
  readonly onToggleArcane: () => void;
  readonly onCastLumos: () => void;
  readonly onToggleMute: () => void;
  readonly onOpenGuide: () => void;
  readonly onOpenAdmin?: () => void;
}

export const DungeonHeader: React.FC<DungeonHeaderProps> = React.memo(
  ({
    heroName,
    litCount,
    totalChambers,
    activeExplorersCount = 1,
    isArcaneVision,
    isLumosActive,
    isMuted,
    onToggleArcane,
    onCastLumos,
    onToggleMute,
    onOpenGuide,
    onOpenAdmin,
  }) => {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-amber-900/40 bg-[#080604]/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/50 bg-amber-950/50">
              <Flame className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <span className="font-code text-[10px] uppercase tracking-widest text-amber-500 block">
                INTERACTIVE BACKEND PORTFOLIO
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-amber-100">
                {heroName} — .NET 9 Developer
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-emerald-800/50 bg-emerald-950/30 px-3 py-1 font-code text-xs text-emerald-300">
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                SignalR Live: {activeExplorersCount}{' '}
                {activeExplorersCount === 1 ? 'Visitor' : 'Visitors'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-amber-800/50 bg-[#14100b] px-3.5 py-1 font-code text-xs text-amber-200">
              <span>Torches Lit:</span>
              <span className="font-bold text-amber-400">
                {litCount} / {totalChambers}
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleArcane}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-code text-xs font-semibold transition ${
                isArcaneVision
                  ? 'border-sky-400 bg-sky-950/80 text-sky-200'
                  : 'border-amber-800/50 bg-[#14100b] text-amber-200/80 hover:border-amber-500'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Architecture View</span>
            </button>

            <button
              type="button"
              onClick={onCastLumos}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-1.5 font-code text-xs font-extrabold transition ${
                isLumosActive
                  ? 'border-amber-300 bg-amber-500 text-black'
                  : 'border-amber-500/60 bg-amber-600/20 text-amber-200 hover:bg-amber-600/35'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
              <span>
                {isLumosActive
                  ? 'Enable Torch Mode'
                  : 'Full Light View (Skip Game)'}
              </span>
            </button>

            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-800/50 bg-[#14100b] text-amber-300 hover:border-amber-500"
                title="Admin Control Center"
              >
                <Shield className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenGuide}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-800/50 bg-[#14100b] text-amber-300 hover:border-amber-500"
              title="How to Explore"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-800/50 bg-[#14100b] text-amber-300 hover:border-amber-500"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>
    );
  }
);