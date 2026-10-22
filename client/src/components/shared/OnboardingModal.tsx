import React from 'react';
import { Flame, Sun, Eye, MousePointerClick } from 'lucide-react';

interface OnboardingModalProps {
  readonly isOpen: boolean;
  readonly onStartExploration: () => void;
  readonly onSkipToFullLight: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = React.memo(
  ({ isOpen, onStartExploration, onSkipToFullLight }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
        <div className="relative max-w-lg w-full rounded-3xl border-2 border-amber-500/80 bg-[#0e0b08] p-7 sm:p-8 text-center shadow-[0_0_80px_rgba(245,158,11,0.35)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/60 bg-amber-950/60 shadow-[0_0_30px_rgba(245,158,11,0.4)]">
            <Flame className="h-9 w-9 text-amber-400 animate-pulse" />
          </div>

          <span className="font-code text-xs uppercase tracking-widest text-amber-400">
            INTERACTIVE .NET BACKEND PORTFOLIO
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-amber-50">
            HOW TO EXPLORE THIS PORTFOLIO
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-[#d8cebc]">
            Welcome to Hussein Mohamed&apos;s interactive portfolio. Your cursor is a{' '}
            <strong className="text-amber-300">live torch</strong> inside a dark cave:
          </p>

          <div className="mt-5 space-y-2.5 text-left font-code text-xs text-amber-100">
            <div className="flex items-center gap-3 rounded-xl border border-amber-900/50 bg-[#16110c] p-3">
              <Flame className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                <strong>1. Ignite Sections:</strong> Move your torch over the wall torch next to any section to spark electricity and light it permanently.
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-amber-900/50 bg-[#16110c] p-3">
              <Eye className="h-4 w-4 text-sky-400 shrink-0" />
              <span>
                <strong>2. Right-Click Anywhere:</strong> Toggle UV Blueprint Mode to inspect hidden CQRS &amp; DB schemas.
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-amber-900/50 bg-[#16110c] p-3">
              <MousePointerClick className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>3. In a Hurry?</strong> Click &quot;Full Light View&quot; anytime in the top bar to reveal the entire portfolio instantly.
              </span>
            </div>
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onStartExploration}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3.5 font-code text-xs font-extrabold text-black shadow-lg hover:from-amber-400 hover:to-amber-500 transition"
            >
              <Flame className="h-4 w-4 fill-black" />
              <span>START TORCH EXPLORATION</span>
            </button>

            <button
              type="button"
              onClick={onSkipToFullLight}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-600/60 bg-[#1a140e] px-4 py-3.5 font-code text-xs font-bold text-amber-200 hover:border-amber-400 transition"
            >
              <Sun className="h-4 w-4 text-amber-400" />
              <span>SKIP GAME (FULL VIEW)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
);