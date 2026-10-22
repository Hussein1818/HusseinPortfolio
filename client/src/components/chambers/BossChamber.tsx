import React from 'react';
import { ShieldAlert, CheckCircle2, Swords } from 'lucide-react';
import type { BossDefenseAction, ChamberId } from '../../types/dungeon.types';
import { RealisticWallTorch } from '../shared/RealisticWallTorch';
import { SmartImage } from '../shared/SmartImage';
import { ElectricBorder } from '../ElectricBorder';

interface BossChamberProps {
  readonly bossActions: readonly BossDefenseAction[];
  readonly bossHp: number;
  readonly usedActions: ReadonlySet<string>;
  readonly combatLog: readonly string[];
  readonly isLit: boolean;
  readonly isIgniting: boolean;
  readonly onIgnite: (id: ChamberId, name: string) => void;
  readonly onAttack: (
    actionId: string,
    label: string,
    impact: string,
    damage: number
  ) => void;
}

export const BossChamber: React.FC<BossChamberProps> = React.memo(
  ({
    bossActions,
    bossHp,
    usedActions,
    combatLog,
    isLit,
    isIgniting,
    onIgnite,
    onAttack,
  }) => {
    return (
      <section className="relative w-full border-b border-red-900/40 py-20 px-6 bg-gradient-to-b from-[#0c0605] to-[#070504]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-35">
              <span className="font-code text-xs uppercase tracking-widest text-red-400">
                SECTION IV • SYSTEM DESIGN CHALLENGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                HIGH-TRAFFIC CONCURRENCY CHALLENGE
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="boss"
              chamberName="System Design Challenge"
              isLit={isLit}
              onIgnite={onIgnite}
            />
          </div>

          <ElectricBorder
            color="#f97316"
            borderRadius={24}
            active={isIgniting}
            className={`chamber-surface rounded-3xl border border-red-700/50 bg-[#0e0807] p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
              isLit ? 'chamber-surface-lit' : 'chamber-surface-unlit'
            }`}
          >
            <div
              className="chamber-shroud-overlay"
              style={{ opacity: isLit ? 0 : 1 }}
            />

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border-2 border-red-600/50 bg-black">
                <SmartImage
                  src="/assets/images/boss-golem.jpg"
                  alt="High-Traffic Concurrency Golem"
                  fallbackType="boss"
                  className={`h-92 w-full object-cover object-top transition duration-500 ${
                    bossHp <= 0 ? 'grayscale opacity-30 scale-95' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-5">
                  <div className="mb-2 flex items-center justify-between font-code text-xs">
                    <span className="font-bold text-red-400 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      {bossHp > 0 ? 'BOTTLENECK ACTIVE' : 'CHALLENGE SOLVED'}
                    </span>
                    <span className="text-amber-300">{bossHp}% HP</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-red-950">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500"
                      style={{ width: `${bossHp}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <p className="text-sm sm:text-base text-[#dfd5c1]">
                Deploy Hussein&apos;s production-proven backend countermeasures below to resolve the server bottleneck and unlock the Contact Section:
              </p>

              <div className="space-y-3">
                {bossActions.map((action) => {
                  const isUsed = usedActions.has(action.id);
                  return (
                    <button
                      key={action.id}
                      type="button"
                      disabled={isUsed || bossHp <= 0}
                      onClick={() =>
                        onAttack(
                          action.id,
                          action.label,
                          action.impactDescription,
                          action.damage
                        )
                      }
                      className={`w-full flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
                        isUsed
                          ? 'border-emerald-700/40 bg-emerald-950/20 opacity-60'
                          : 'border-amber-800/50 bg-[#140d0a] hover:border-red-400'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="font-code text-xs text-amber-400">
                          [{action.projectOrigin}]
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-amber-50">
                          {action.label}
                        </h3>
                        <p className="text-xs text-[#c2b8a3]">
                          {action.impactDescription}
                        </p>
                      </div>
                      <div className="shrink-0 font-code text-xs">
                        {isUsed ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="h-4 w-4" /> DEPLOYED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-1.5 text-red-200 font-bold">
                            <Swords className="h-3.5 w-3.5" /> -{action.damage}% HP
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-xl border border-red-950 bg-black/90 p-4 font-code text-xs text-amber-200 space-y-1">
                {combatLog.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-red-500">&gt;</span>
                    <span>{entry}</span>
                  </div>
                ))}
              </div>
            </div>
          </ElectricBorder>
        </div>
      </section>
    );
  }
);