import React from 'react';
import {
  Award,
  FileDown,
  Mail,
  GitBranch,
  Share2,
} from 'lucide-react';
import type { HeroProfile, ChamberId } from '../../types/dungeon.types';
import { RealisticWallTorch } from '../shared/RealisticWallTorch';
import { SmartImage } from '../shared/SmartImage';
import { ElectricBorder } from '../ElectricBorder';
import { downloadOfficialCvPdf } from '../../utils/downloadCv';

interface OriginChamberProps {
  readonly hero: HeroProfile;
  readonly isLit: boolean;
  readonly isIgniting: boolean;
  readonly isLumosActive: boolean;
  readonly onIgnite: (id: ChamberId, name: string) => void;
  readonly onToast: (msg: string) => void;
}

export const OriginChamber: React.FC<OriginChamberProps> = React.memo(
  ({
    hero,
    isLit,
    isIgniting,
    isLumosActive,
    onIgnite,
    onToast,
  }) => {
    return (
      <section className="relative w-full border-b border-amber-900/30 py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-35">
              <span className="font-code text-xs uppercase tracking-widest text-amber-500">
                SECTION I
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                ABOUT &amp; EDUCATION
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="origin"
              chamberName="About & Education"
              isLit={isLit}
              onIgnite={onIgnite}
            />
          </div>

          <ElectricBorder
            color="#f97316"
            borderRadius={24}
            active={isIgniting}
            className={`chamber-surface rounded-3xl border border-amber-500/50 bg-[#0d0a07] p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
              isLit ? 'chamber-surface-lit' : 'chamber-surface-unlit'
            }`}
          >
            <div
              className="chamber-shroud-overlay"
              style={{ opacity: isLit ? 0 : 1 }}
            />

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/60 px-3.5 py-1 font-code text-xs text-purple-200">
                <span>⚡ .NET 9 | Clean Architecture | CQRS | SignalR</span>
              </div>

              <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-amber-50">
                {hero.name}
              </h3>

              <p className="text-base sm:text-lg leading-relaxed text-[#dfd5c1]">
                {hero.summary}
              </p>

              <div className="rounded-2xl border border-amber-700/40 bg-[#14100b] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 text-amber-400">
                    <Award className="h-6 w-6 shrink-0" />
                    <div>
                      <span className="font-code text-[10px] uppercase tracking-widest text-amber-500 block">
                        EDUCATION
                      </span>
                      <h4 className="font-dungeon text-base font-bold text-amber-100">
                        {hero.education.degree}
                      </h4>
                    </div>
                  </div>
                  <span className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 font-code text-xs font-bold text-emerald-300">
                    {hero.education.grade}
                  </span>
                </div>
                <p className="mt-2 font-code text-xs text-amber-200/70">
                  {hero.education.university} • {hero.location}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => void downloadOfficialCvPdf(onToast, hero.cvFileUrl)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 font-code text-xs font-extrabold text-black hover:from-amber-400 hover:to-amber-500 transition"
                >
                  <FileDown className="h-4 w-4" />
                  <span>DOWNLOAD CV (.PDF)</span>
                </button>
                <a
                  href={hero.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-700/60 bg-[#18130d] px-4 py-3 font-code text-xs font-bold text-amber-200 hover:border-amber-400 transition"
                >
                  <GitBranch className="h-4 w-4 text-amber-400" />
                  <span>GitHub</span>
                </a>
                <a
                  href={hero.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-700/60 bg-[#18130d] px-4 py-3 font-code text-xs font-bold text-amber-200 hover:border-amber-400 transition"
                >
                  <Share2 className="h-4 w-4 text-amber-400" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={`mailto:${hero.email}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-700/60 bg-[#18130d] px-4 py-3 font-code text-xs font-bold text-amber-200 hover:border-amber-400 transition"
                >
                  <Mail className="h-4 w-4 text-amber-400" />
                  <span>{hero.email}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative h-88 w-76 overflow-hidden rounded-3xl border-2 border-amber-500/60 bg-black">
                <SmartImage
                  src={
                    isLumosActive ? hero.recruiterAvatar : hero.dungeonAvatar
                  }
                  alt={hero.name}
                  fallbackType="avatar"
                  className={`h-full w-full object-cover object-top transition-transform duration-500 ${
                    isLumosActive
                      ? 'scale-100'
                      : 'scale-110 dungeon-portrait-filter'
                  }`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-center">
                  <span className="font-code text-xs font-bold text-amber-400">
                    {hero.title}
                  </span>
                </div>
              </div>
            </div>
          </ElectricBorder>
        </div>
      </section>
    );
  }
);