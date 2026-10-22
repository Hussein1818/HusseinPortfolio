import React from 'react';
import { Code2, ExternalLink } from 'lucide-react';
import type { ProjectRelic, ChamberId } from '../../types/dungeon.types';
import { RealisticWallTorch } from '../shared/RealisticWallTorch';
import { SmartImage } from '../shared/SmartImage';
import { ElectricBorder } from '../ElectricBorder';

interface RelicsChamberProps {
  readonly relics: readonly ProjectRelic[];
  readonly isLit: boolean;
  readonly isIgniting: boolean;
  readonly isArcaneVision: boolean;
  readonly onIgnite: (id: ChamberId, name: string) => void;
  readonly onSelectRelic: (relic: ProjectRelic) => void;
}

export const RelicsChamber: React.FC<RelicsChamberProps> = React.memo(
  ({
    relics,
    isLit,
    isIgniting,
    isArcaneVision,
    onIgnite,
    onSelectRelic,
  }) => {
    return (
      <section className="relative w-full border-b border-amber-900/30 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-35">
              <span className="font-code text-xs uppercase tracking-widest text-amber-500">
                SECTION III
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                EXPERIENCE &amp; PROJECTS
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="relics"
              chamberName="Experience & Projects"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relics.map((relic) => (
                <article
                  key={relic.id}
                  className="group flex flex-col justify-between rounded-2xl border-2 border-amber-800/45 bg-gradient-to-br from-[#16120c] via-[#0d0a07] to-[#070504] p-7 transition hover:border-amber-400"
                >
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-black p-1.5">
                        <SmartImage
                          src={relic.imageUrl}
                          alt={relic.name}
                          fallbackType="relic"
                          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="font-code text-xs text-amber-400">
                          {relic.role} • {relic.period}
                        </span>
                        <h3 className="text-2xl font-extrabold text-amber-50">
                          {relic.name}
                        </h3>
                        <p className="font-code text-xs text-emerald-400">
                          {relic.type}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-[#d8cebc] mb-4">
                      {relic.description}
                    </p>

                    {isArcaneVision && (
                      <div className="mb-4 rounded-xl border border-sky-400/60 bg-sky-950/40 p-3.5 font-code text-xs text-sky-200 space-y-2">
                        <div>
                          <span className="font-bold text-sky-400">
                            [ARCHITECTURE]:{' '}
                          </span>
                          {relic.secretArchitecture}
                        </div>
                        <div className="rounded border border-sky-500/30 bg-black/60 p-2 text-[11px] text-cyan-300 overflow-x-auto">
                          <span className="text-purple-400 font-bold">
                            PIPELINE:{' '}
                          </span>
                          {relic.schemaDiagram}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-amber-900/40">
                    <div className="flex flex-wrap gap-1.5">
                      {relic.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-amber-900/50 bg-[#17130e] px-2.5 py-1 font-code text-[11px] text-amber-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => onSelectRelic(relic)}
                        className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-500/20 px-4 py-2 font-code text-xs font-bold text-amber-200 hover:bg-amber-500 hover:text-black transition"
                      >
                        <Code2 className="h-4 w-4" />
                        <span>PROJECT SPECS</span>
                      </button>

                      {relic.liveUrl && (
                        <a
                          href={relic.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/40 px-3 py-1.5 font-code text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ElectricBorder>
        </div>
      </section>
    );
  }
);