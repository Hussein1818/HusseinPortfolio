import React from 'react';
import { Cpu } from 'lucide-react';
import type { SkillRune, ChamberId } from '../../types/dungeon.types';
import { RealisticWallTorch } from '../shared/RealisticWallTorch';
import { ElectricBorder } from '../ElectricBorder';

interface ArsenalChamberProps {
  readonly runes: readonly SkillRune[];
  readonly isLit: boolean;
  readonly isIgniting: boolean;
  readonly onIgnite: (id: ChamberId, name: string) => void;
}

export const ArsenalChamber: React.FC<ArsenalChamberProps> = React.memo(
  ({ runes, isLit, isIgniting, onIgnite }) => {
    return (
      <section className="relative w-full border-b border-amber-900/30 py-20 px-6 bg-[#070604]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-35">
              <span className="font-code text-xs uppercase tracking-widest text-amber-500">
                SECTION II
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                SKILLS
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="arsenal"
              chamberName="Skills"
              isLit={isLit}
              onIgnite={onIgnite}
            />
          </div>

          <ElectricBorder
            color="#f97316"
            borderRadius={24}
            active={isIgniting}
            className={`chamber-surface rounded-3xl border border-amber-600/40 bg-[#0b0907] p-8 ${
              isLit ? 'chamber-surface-lit' : 'chamber-surface-unlit'
            }`}
          >
            <div
              className="chamber-shroud-overlay"
              style={{ opacity: isLit ? 0 : 1 }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {runes.map((rune) => (
                <div
                  key={rune.id}
                  className="rounded-2xl border border-amber-800/40 bg-gradient-to-b from-[#15110c] to-[#0a0806] p-6 hover:border-purple-500/70 transition"
                >
                  <div className="mb-5 flex items-center justify-between border-b border-amber-900/40 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Cpu className="h-5 w-5 text-amber-400" />
                      <h3 className="font-dungeon text-sm font-bold text-amber-100">
                        {rune.category}
                      </h3>
                    </div>
                    <span className="text-xl">{rune.runeSymbol}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rune.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-amber-700/40 bg-[#1d1710] px-3 py-1.5 font-code text-xs text-amber-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ElectricBorder>
        </div>
      </section>
    );
  }
);