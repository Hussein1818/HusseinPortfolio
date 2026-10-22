import React from 'react';
import { X, CheckCircle2, ExternalLink } from 'lucide-react';
import type { ProjectRelic } from '../../types/dungeon.types';
import { SmartImage } from './SmartImage';

interface RelicModalProps {
  readonly relic: ProjectRelic | null;
  readonly onClose: () => void;
}

export const RelicModal: React.FC<RelicModalProps> = React.memo(
  ({ relic, onClose }) => {
    if (!relic) return null;

    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full rounded-3xl border-2 border-amber-500 bg-[#0e0b08] p-6 sm:p-8 shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-lg border border-amber-700 bg-[#1a140e] text-amber-300 hover:border-amber-400"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4 border-b border-amber-900/50 pb-4 mb-5">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-amber-500/50 bg-black p-1">
              <SmartImage
                src={relic.imageUrl}
                alt={relic.name}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-code text-xs text-amber-400">
                {relic.role} • {relic.period}
              </span>
              <h3 className="text-2xl font-extrabold text-amber-50">
                {relic.name}
              </h3>
            </div>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="rounded-xl border border-sky-500/40 bg-sky-950/30 p-3.5 font-code text-xs text-sky-200 space-y-2">
              <div>
                <strong className="text-sky-400">SECRET ARCHITECTURE: </strong>
                {relic.secretArchitecture}
              </div>
              <div className="rounded border border-sky-500/30 bg-black/70 p-2.5 text-[11px] text-cyan-300 overflow-x-auto">
                <strong className="text-purple-400">CQRS &amp; DB PIPELINE: </strong>
                {relic.schemaDiagram}
              </div>
            </div>

            <ul className="space-y-2 text-sm text-[#dfd5c1]">
              {relic.deepDiveSpecs.map((spec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 rounded-lg border border-amber-950 bg-[#14100b] p-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-900/50 pt-4">
            {relic.liveUrl && (
              <a
                href={relic.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-500/20 px-4 py-2.5 font-code text-xs font-bold text-amber-200 hover:bg-amber-500 hover:text-black transition"
              >
                <span>OPEN LIVE PRODUCTION LINK</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-amber-500 px-5 py-2.5 font-code text-xs font-extrabold text-black hover:bg-amber-400"
            >
              SEAL RELIC SCROLL
            </button>
          </div>
        </div>
      </div>
    );
  }
);