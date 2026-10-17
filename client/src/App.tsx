import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Flame,
  Sparkles,
  ShieldAlert,
  Terminal,
  Cpu,
  Database,
  Award,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Eye,
  Swords,
  CheckCircle2,
  FileDown,
  Volume2,
  VolumeX,
  Users,
  Code2,
  Send,
  X,
  Trophy,
  KeyRound,
  Compass,
  Lock,
  Unlock,
  GitBranch,
  Share2,
} from 'lucide-react';
import { HUSSEIN_DATA } from './data/portfolioFallback';
import { TorchMask } from './components/canvas/TorchMask';
import { dungeonAudio } from './utils/dungeonAudio';
import type {
  ChamberId,
  ProjectRelic,
  GuestbookEntry,
  GhostExplorer,
} from './types/dungeon.types';

const ALL_CHAMBERS: readonly ChamberId[] = [
  'origin',
  'arsenal',
  'relics',
  'boss',
  'terminal',
];

const GHOST_EXPLORERS: readonly GhostExplorer[] = [
  {
    id: 'ghost-1',
    label: 'Explorer_402 (SignalR Sync)',
    topPercent: 28,
    leftPercent: 14,
    color: 'rgba(168, 85, 247, 0.35)',
  },
  {
    id: 'ghost-2',
    label: 'Recruiter_Node (Inspecting Relics)',
    topPercent: 58,
    leftPercent: 82,
    color: 'rgba(56, 189, 248, 0.35)',
  },
];

interface SmartImageProps {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly fallbackType?: 'boss' | 'relic' | 'avatar';
}

const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = '',
  fallbackType = 'relic',
}) => {
  const [attemptIndex, setAttemptIndex] = useState<number>(0);
  const [hasFailedAll, setHasFailedAll] = useState<boolean>(false);

  const candidatePaths = useMemo(() => {
    const baseWithoutExt = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    return [
      src,
      `${src}.jpg`,
      `${src}.png`,
      `${baseWithoutExt}.png`,
      `${baseWithoutExt}.jpg`,
      `${baseWithoutExt}.jpg.jpg`,
      `${baseWithoutExt}.png.png`,
    ];
  }, [src]);

  const handleImageError = useCallback(() => {
    setAttemptIndex((prev) => {
      if (prev + 1 < candidatePaths.length) {
        return prev + 1;
      }
      setHasFailedAll(true);
      return prev;
    });
  }, [candidatePaths.length]);

  if (hasFailedAll) {
    if (fallbackType === 'boss') {
      return (
        <div
          className={`flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0907] via-[#0d0605] to-black p-6 text-center ${className}`}
        >
          <ShieldAlert className="h-20 w-20 text-red-500 animate-pulse" />
          <span className="mt-3 font-code text-xs uppercase tracking-widest text-red-400">
            Obsidian Concurrency Golem
          </span>
        </div>
      );
    }
    return (
      <div
        className={`flex items-center justify-center bg-[#120f0c] text-amber-500 ${className}`}
      >
        <Flame className="h-12 w-12 animate-pulse" />
      </div>
    );
  }

  return (
    <img
      src={candidatePaths[attemptIndex]}
      alt={alt}
      onError={handleImageError}
      className={className}
    />
  );
};

interface FireIgnitionPerimeterProps {
  readonly isIgniting: boolean;
}

const FireIgnitionPerimeter: React.FC<FireIgnitionPerimeterProps> = ({
  isIgniting,
}) => {
  if (!isIgniting) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-50 overflow-hidden rounded-3xl"
    >
      <div className="fire-burst-overlay absolute inset-0 rounded-3xl" />
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fireSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          rx="4"
          ry="4"
          fill="none"
          stroke="url(#fireSweepGrad)"
          strokeWidth="2.8"
          pathLength="100"
          className="fire-stroke-anim"
        />
      </svg>
    </div>
  );
};

interface RealisticWallTorchProps {
  readonly chamberId: ChamberId;
  readonly chamberName: string;
  readonly isLit: boolean;
  readonly onIgnite: (id: ChamberId, name: string) => void;
}

const RealisticWallTorch: React.FC<RealisticWallTorchProps> = ({
  chamberId,
  chamberName,
  isLit,
  onIgnite,
}) => {
  const [customImgFailed, setCustomImgFailed] = useState<boolean>(false);

  const customTorchSrc = isLit
    ? '/assets/images/torch-lit.png'
    : '/assets/images/torch-unlit.png';

  return (
    <button
      type="button"
      onMouseEnter={() => onIgnite(chamberId, chamberName)}
      onClick={() => onIgnite(chamberId, chamberName)}
      className={`group relative z-40 flex items-center gap-4 rounded-2xl border-2 px-5 py-2.5 font-code text-xs transition-all duration-500 ${
        isLit
          ? 'border-purple-400/80 bg-gradient-to-r from-purple-950/70 via-[#1f1408] to-amber-950/70 text-amber-100 shadow-[0_0_40px_rgba(168,85,247,0.45)]'
          : 'border-amber-600/50 bg-[#14100c] text-amber-300/90 shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:border-amber-400 hover:scale-105'
      }`}
    >
      <div className="relative flex h-14 w-12 shrink-0 items-center justify-center">
        {isLit && (
          <span className="absolute -top-1 h-9 w-9 rounded-full bg-purple-500/50 blur-md animate-pulse" />
        )}

        {!customImgFailed ? (
          <img
            src={customTorchSrc}
            alt={isLit ? 'Lit Torch' : 'Unlit Torch'}
            onError={() => setCustomImgFailed(true)}
            className="h-14 w-12 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.85)]"
          />
        ) : (
          <svg
            viewBox="0 0 64 88"
            className="h-14 w-12 overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="50%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#290f02" />
              </linearGradient>
              <linearGradient id="ironGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#52525b" />
                <stop offset="50%" stopColor="#a1a1aa" />
                <stop offset="100%" stopColor="#27272a" />
              </linearGradient>
            </defs>

            {/* .NET Purple / Cyan / Amber Checkpoint Flame */}
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
              fill="url(#ironGrad)"
              stroke="#fbbf24"
              strokeWidth="1.2"
            />
            <rect
              x="24"
              y="62"
              width="16"
              height="5"
              rx="2"
              fill="url(#ironGrad)"
            />
            <path
              d="M25 53H39L35 83C35 85 33.5 86 32 86C30.5 86 29 85 29 83L25 53Z"
              fill="url(#woodGrad)"
              stroke="#92400e"
              strokeWidth="1"
            />
          </svg>
        )}
      </div>

      <div className="text-left">
        <span className="block text-[10px] uppercase tracking-widest text-purple-300">
          {isLit ? '🔥 .NET CHECKPOINT LIT' : '🕯️ UNLIT WALL TORCH'}
        </span>
        <span className="font-bold text-xs sm:text-sm">
          {isLit
            ? `${chamberName} Illuminated`
            : 'Bring Torch Cursor Here to Ignite'}
        </span>
      </div>
    </button>
  );
};

export const App: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLumosActive, setIsLumosActive] = useState<boolean>(false);
  const [isArcaneVision, setIsArcaneVision] = useState<boolean>(false);

  const [litChambers, setLitChambers] = useState<ReadonlySet<ChamberId>>(
    () => new Set<ChamberId>(['origin'])
  );
  const [ignitingChambers, setIgnitingChambers] = useState<
    ReadonlySet<ChamberId>
  >(() => new Set<ChamberId>());

  const [achievementToast, setAchievementToast] = useState<string | null>(null);
  const [selectedRelic, setSelectedRelic] = useState<ProjectRelic | null>(null);

  const [bossHp, setBossHp] = useState<number>(100);
  const [combatLog, setCombatLog] = useState<readonly string[]>([
    'WARNING: The High-Traffic Concurrency Golem guards the Summoning Vault!',
  ]);
  const [usedActions, setUsedActions] = useState<ReadonlySet<string>>(
    () => new Set<string>()
  );

  const [selectedEndpoint, setSelectedEndpoint] = useState<string>(
    'GET /api/hussein/skills'
  );
  const [sqlPuzzleSolved, setSqlPuzzleSolved] = useState<boolean>(false);

  const [guestbook, setGuestbook] = useState<readonly GuestbookEntry[]>(
    HUSSEIN_DATA.initialGuestbook
  );
  const [explorerName, setExplorerName] = useState<string>('');
  const [explorerGuild, setExplorerGuild] = useState<string>('');
  const [explorerMessage, setExplorerMessage] = useState<string>('');

  const [visitorQueryName, setVisitorQueryName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return (
      params.get('name') ||
      params.get('visitor') ||
      params.get('company') ||
      params.get('recruiter')
    );
  });

  const triggerToast = useCallback((message: string) => {
    setAchievementToast(message);
  }, []);

  useEffect(() => {
    if (!achievementToast) return;
    const timer = window.setTimeout(() => {
      setAchievementToast(null);
    }, 3800);
    return () => window.clearTimeout(timer);
  }, [achievementToast]);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      dungeonAudio.playRuneCollect();
      setIsArcaneVision((prev) => {
        const next = !prev;
        triggerToast(
          next
            ? 'Arcane UV Vision Activated: CQRS & DB Schemas Revealed!'
            : 'Standard Torch Flame Restored'
        );
        return next;
      });
    };

    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, [triggerToast]);

  const igniteChamber = useCallback(
    (chamberId: ChamberId, chamberName: string) => {
      setLitChambers((prev) => {
        if (prev.has(chamberId)) return prev;

        dungeonAudio.playTorchIgnite();

        setIgnitingChambers((prevIgniting) => {
          const nextIgniting = new Set(prevIgniting);
          nextIgniting.add(chamberId);
          return nextIgniting;
        });

        window.setTimeout(() => {
          setIgnitingChambers((prevIgniting) => {
            const nextIgniting = new Set(prevIgniting);
            nextIgniting.delete(chamberId);
            return nextIgniting;
          });
        }, 1500);

        const updated = new Set(prev);
        updated.add(chamberId);

        const achievementMessages: Record<ChamberId, string> = {
          origin: 'Discovered the Origin Scroll & EELU Honors Talisman!',
          arsenal: 'Secret of Clean Architecture & .NET 9 Runes Discovered!',
          relics: 'Explored 4 of 4 Legendary Enterprise Projects!',
          boss: 'Entered the High-Traffic Concurrency Boss Lair!',
          terminal: 'Unlocked the Final Secret Contact Gate & Rune Terminal!',
        };

        if (updated.size === ALL_CHAMBERS.length) {
          dungeonAudio.playQuestComplete();
          triggerToast(
            'MASTER EXPLORER: All 5 Chambers Lit & Final Secret Gate Opened!'
          );
        } else {
          triggerToast(
            `${achievementMessages[chamberId]} (${updated.size}/${ALL_CHAMBERS.length})`
          );
        }
        return updated;
      });
    },
    [triggerToast]
  );

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      dungeonAudio.setMuted(next);
      return next;
    });
  }, []);

  const handleCastLumos = useCallback(() => {
    dungeonAudio.playTorchIgnite();
    setIsLumosActive((prev) => {
      const next = !prev;
      if (next) {
        setLitChambers(new Set(ALL_CHAMBERS));
        triggerToast('LUMOS MAXIMA: Recruiter Full-Visibility Mode Active!');
      } else {
        setLitChambers(new Set<ChamberId>(['origin']));
        triggerToast('Returned to Dungeon Torch Exploration Mode');
      }
      return next;
    });
  }, [triggerToast]);

  const handleSimulateQueryLink = useCallback(() => {
    dungeonAudio.playRuneCollect();
    const sampleVisitor = 'Microsoft Engineering Vanguard';
    const url = new URL(window.location.href);
    url.searchParams.set('company', sampleVisitor);
    window.history.pushState({}, '', url.toString());
    setVisitorQueryName(sampleVisitor);
    triggerToast('URL Query Bound: ?company=Microsoft+Engineering+Vanguard');
  }, [triggerToast]);

  const handleBossAttack = useCallback(
    (actionId: string, label: string, impact: string, damage: number) => {
      if (usedActions.has(actionId) || bossHp <= 0) return;

      dungeonAudio.playBossStrike();
      const nextHp = Math.max(0, bossHp - damage);
      setUsedActions((prev) => new Set(prev).add(actionId));
      setBossHp(nextHp);
      setCombatLog((prev) => [
        ...prev,
        `DEPLOYED [${label}]: ${impact} (-${damage}% Boss HP)`,
      ]);

      if (nextHp <= 0) {
        dungeonAudio.playQuestComplete();
        igniteChamber('terminal', 'The Summoning Vault');
        triggerToast(
          'BOSS VANQUISHED! The Secret Contact Gate is Now Open!'
        );
      }
    },
    [bossHp, usedActions, igniteChamber, triggerToast]
  );

  const handleExecuteSqlRune = useCallback(() => {
    if (sqlPuzzleSolved) return;
    dungeonAudio.playQuestComplete();
    setSqlPuzzleSolved(true);
    triggerToast(
      'ANCIENT SQL RUNE EXECUTED: Unlocked Secret System Metrics!'
    );
  }, [sqlPuzzleSolved, triggerToast]);

  const handleSignGuestbook = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!explorerName.trim() || !explorerMessage.trim()) return;

      dungeonAudio.playRuneCollect();
      const newEntry: GuestbookEntry = {
        id: `gb-${Date.now()}`,
        explorerName: explorerName.trim(),
        guildOrCompany: explorerGuild.trim() || 'Independent Explorer',
        message: explorerMessage.trim(),
        timestamp: 'Just now (MediatR CQRS + SignalR Broadcast)',
      };

      setGuestbook((prev) => [newEntry, ...prev]);
      setExplorerName('');
      setExplorerGuild('');
      setExplorerMessage('');
      triggerToast(
        'CQRS COMMAND EXECUTED: Your name is etched in the Hall of Fame!'
      );
    },
    [explorerName, explorerGuild, explorerMessage, triggerToast]
  );

  const terminalPayload = useMemo(() => {
    if (selectedEndpoint === 'GET /api/hussein/skills') {
      return JSON.stringify(
        {
          status: 200,
          responseTimeMs: 1.4,
          cachedBy: 'Redis Distributed Cache (HIT)',
          coreStack: ['.NET 9', 'ASP.NET Core Web API', 'EF Core', 'C#'],
          architecture: ['Clean Architecture', 'CQRS (MediatR)', 'SOLID', 'DDD'],
          realtimeAndCloud: ['SignalR', 'SQL Server', 'Redis', 'Azure', 'Cloudflare R2'],
        },
        null,
        2
      );
    }
    if (selectedEndpoint === 'POST /api/contact') {
      return JSON.stringify(
        {
          status: 201,
          responseTimeMs: 2.1,
          cqrsHandler: 'CreateContactTransmissionCommandHandler',
          signalrHub: 'Notification Dispatched to Hussein Mohamed',
          directCoordinates: {
            email: HUSSEIN_DATA.hero.email,
            phone: HUSSEIN_DATA.hero.phone,
            location: HUSSEIN_DATA.hero.location,
          },
        },
        null,
        2
      );
    }
    return JSON.stringify(
      {
        status: 200,
        responseTimeMs: 1.1,
        cachedBy: 'Redis Distributed Cache (HIT)',
        degree: HUSSEIN_DATA.hero.education.degree,
        university: HUSSEIN_DATA.hero.education.university,
        honors: HUSSEIN_DATA.hero.education.grade,
        projectsCount: 4,
      },
      null,
      2
    );
  }, [selectedEndpoint]);

  const isChamberLit = (id: ChamberId): boolean =>
    isLumosActive || litChambers.has(id);

  const isSecretGateUnlocked =
    isLumosActive || litChambers.size >= 4 || bossHp <= 0 || litChambers.has('terminal');

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-[#e5dec9] selection:bg-amber-500 selection:text-black">
      {/* Torch Darkness Mask & Handheld Torch Cursor */}
      <TorchMask
        isLumosActive={isLumosActive}
        isArcaneVision={isArcaneVision}
      />

      {/* Simulated Real-Time SignalR Ghost Explorers */}
      {!isLumosActive &&
        GHOST_EXPLORERS.map((ghost) => (
          <div
            key={ghost.id}
            style={{
              top: `${ghost.topPercent}%`,
              left: `${ghost.leftPercent}%`,
            }}
            className="ghost-explorer pointer-events-none fixed z-20 hidden lg:flex items-center gap-2"
          >
            <div
              className="h-5 w-5 rounded-full blur-sm"
              style={{ backgroundColor: ghost.color }}
            />
            <span className="rounded border border-amber-900/40 bg-black/70 px-2 py-0.5 font-code text-[10px] text-amber-200/60">
              {ghost.label}
            </span>
          </div>
        ))}

      {/* Achievement Unlocked Floating Toast */}
      {achievementToast && (
        <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-2xl border-2 border-amber-400 bg-[#14100b]/95 px-5 py-3.5 shadow-[0_0_40px_rgba(245,158,11,0.5)]">
          <Trophy className="h-5 w-5 text-amber-400 shrink-0 animate-bounce" />
          <span className="font-code text-xs font-bold text-amber-100">
            {achievementToast}
          </span>
        </div>
      )}

      {/* Top Sticky Dungeon HUD */}
      <header className="sticky top-0 z-40 w-full border-b border-amber-900/40 bg-[#080604]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/50 bg-amber-950/50">
              <Flame className="h-5 w-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <span className="font-code text-[10px] uppercase tracking-widest text-amber-500 block">
                THE ARCHITECTURE DUNGEON
              </span>
              <h1 className="text-sm sm:text-base font-extrabold text-amber-100">
                {HUSSEIN_DATA.hero.name} — .NET 9 Backend
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 rounded-full border border-emerald-800/50 bg-emerald-950/30 px-3 py-1 font-code text-xs text-emerald-300">
              <Users className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>SignalR Live: 3 Explorers in Cave</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-full border border-amber-800/50 bg-[#14100b] px-3.5 py-1 font-code text-xs text-amber-200">
              <span>Checkpoints Lit:</span>
              <span className="font-bold text-amber-400">
                {litChambers.size} / {ALL_CHAMBERS.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsArcaneVision((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-code text-xs font-semibold transition ${
                isArcaneVision
                  ? 'border-sky-400 bg-sky-950/80 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.35)]'
                  : 'border-amber-800/50 bg-[#14100b] text-amber-200/80 hover:border-amber-500'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>UV Schemas (Right-Click)</span>
            </button>

            <button
              type="button"
              onClick={handleCastLumos}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-1.5 font-code text-xs font-extrabold transition ${
                isLumosActive
                  ? 'border-amber-300 bg-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.6)]'
                  : 'border-amber-500/60 bg-amber-600/20 text-amber-200 hover:bg-amber-600/35'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {isLumosActive ? 'Return to Torch Mode' : 'Cast Lumos (HR Mode)'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-amber-800/50 bg-[#14100b] text-amber-300 hover:border-amber-500"
              title={isMuted ? 'Unmute Ambient Fire & SFX' : 'Mute Audio'}
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

      {/* =====================================================================
          CHAMBER I: THE ORIGIN SCROLL & DYNAMIC QUERY BINDING BANNER
         ===================================================================== */}
      <section className="relative w-full border-b border-amber-900/30 py-16 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Dynamic URL Query Binding Banner (?company=... or ?name=...) */}
          <div className="relative z-35 mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-amber-500/60 bg-gradient-to-r from-[#1c1309] via-[#120d07] to-[#1c1309] px-6 py-4 shadow-[0_0_35px_rgba(245,158,11,0.25)]">
            <div className="flex items-center gap-3">
              <Compass className="h-6 w-6 text-amber-400 shrink-0 animate-spin" />
              <div>
                <span className="font-code text-[10px] uppercase tracking-widest text-amber-400 block">
                  DYNAMIC QUERY BINDING ACTIVE (?company=... | ?name=...)
                </span>
                <p className="font-dungeon text-sm sm:text-base font-bold text-amber-50">
                  {visitorQueryName ? (
                    <>
                      Welcome, vanguard of{' '}
                      <span className="text-amber-400 underline">
                        {visitorQueryName}
                      </span>
                      , to Hussein Mohamed&apos;s Architecture Dungeon! Ready for the expedition?
                    </>
                  ) : (
                    <>
                      Welcome, Adventurer! Are you ready to explore Hussein Mohamed&apos;s Architecture Dungeon?
                    </>
                  )}
                </p>
              </div>
            </div>

            {!visitorQueryName && (
              <button
                type="button"
                onClick={handleSimulateQueryLink}
                className="rounded-xl border border-amber-400/60 bg-amber-500/15 px-3.5 py-1.5 font-code text-xs font-semibold text-amber-300 hover:bg-amber-500 hover:text-black transition"
              >
                Simulate Custom HR Link (?company=...)
              </button>
            )}
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-35">
              <span className="font-code text-xs uppercase tracking-widest text-amber-500">
                CHAMBER I • THE ENTRANCE SANCTUM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                THE ORIGIN SCROLL &amp; ACADEMIC TALISMAN
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="origin"
              chamberName="The Origin Scroll"
              isLit={isChamberLit('origin')}
              onIgnite={igniteChamber}
            />
          </div>

          <div
            className={`relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center rounded-3xl border border-amber-500/50 bg-[#0d0a07]/95 p-8 sm:p-12 ${
              isChamberLit('origin')
                ? 'chamber-illuminated'
                : 'chamber-dark-shroud'
            }`}
          >
            <FireIgnitionPerimeter
              isIgniting={ignitingChambers.has('origin')}
            />

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/60 px-3.5 py-1 font-code text-xs text-purple-200">
                <span>⚡ .NET 9 | Clean Architecture | CQRS | SignalR</span>
              </div>

              <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-amber-50">
                {HUSSEIN_DATA.hero.name}
              </h3>

              <p className="text-base sm:text-lg leading-relaxed text-[#dfd5c1]">
                {HUSSEIN_DATA.hero.summary}
              </p>

              <div className="rounded-2xl border border-amber-700/40 bg-[#14100b] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 text-amber-400">
                    <Award className="h-6 w-6 shrink-0" />
                    <div>
                      <span className="font-code text-[10px] uppercase tracking-widest text-amber-500 block">
                        THE GRADUATION TALISMAN
                      </span>
                      <h4 className="font-dungeon text-base font-bold text-amber-100">
                        {HUSSEIN_DATA.hero.education.degree}
                      </h4>
                    </div>
                  </div>
                  <span className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 px-3 py-1 font-code text-xs font-bold text-emerald-300">
                    {HUSSEIN_DATA.hero.education.grade}
                  </span>
                </div>
                <p className="mt-2 font-code text-xs text-amber-200/70">
                  {HUSSEIN_DATA.hero.education.university} •{' '}
                  {HUSSEIN_DATA.hero.location}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="/Hussein_Mohamed_.NET_CV.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 font-code text-xs font-extrabold text-black shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:from-amber-400 hover:to-amber-500 transition"
                >
                  <FileDown className="h-4 w-4" />
                  <span>DOWNLOAD OFFICIAL CV (.PDF)</span>
                </a>
                <a
                  href={`mailto:${HUSSEIN_DATA.hero.email}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-amber-700/60 bg-[#18130d] px-6 py-3.5 font-code text-xs font-bold text-amber-200 hover:border-amber-400 transition"
                >
                  <Mail className="h-4 w-4 text-amber-400" />
                  <span>{HUSSEIN_DATA.hero.email}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative h-88 w-76 overflow-hidden rounded-3xl border-2 border-amber-500/60 bg-black shadow-[0_0_60px_rgba(217,119,6,0.25)]">
                <SmartImage
                  src={
                    isLumosActive
                      ? HUSSEIN_DATA.hero.recruiterAvatar
                      : HUSSEIN_DATA.hero.dungeonAvatar
                  }
                  alt={HUSSEIN_DATA.hero.name}
                  fallbackType="avatar"
                  className={`h-full w-full object-cover object-top transition-all duration-700 ${
                    isLumosActive
                      ? 'scale-100 brightness-95'
                      : 'scale-110 dungeon-portrait-filter'
                  }`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-center">
                  <span className="font-code text-xs font-bold text-amber-400">
                    {isLumosActive
                      ? 'Recruiter Daylight Portrait'
                      : 'Guardian of the Backend Architecture'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CHAMBER II: THE ARSENAL OF RUNES (TECHNICAL SKILLS)
         ===================================================================== */}
      <section className="relative w-full border-b border-amber-900/30 py-20 px-6 bg-[#070604]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-35">
              <span className="font-code text-xs uppercase tracking-widest text-amber-500">
                CHAMBER II • THE RUNE FORGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                THE ARSENAL OF POWER RUNES (SKILLS)
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="arsenal"
              chamberName="The Arsenal of Runes"
              isLit={isChamberLit('arsenal')}
              onIgnite={igniteChamber}
            />
          </div>

          <div
            className={`relative rounded-3xl border border-amber-600/40 bg-[#0b0907]/95 p-8 ${
              isChamberLit('arsenal')
                ? 'chamber-illuminated'
                : 'chamber-dark-shroud'
            }`}
          >
            <FireIgnitionPerimeter
              isIgniting={ignitingChambers.has('arsenal')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {HUSSEIN_DATA.runes.map((rune) => (
                <div
                  key={rune.id}
                  className="rounded-2xl border border-amber-800/40 bg-gradient-to-b from-[#15110c] to-[#0a0806] p-6 shadow-xl hover:border-purple-500/70 transition"
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
                        className="rounded-lg border border-amber-700/40 bg-[#1d1710] px-3 py-1.5 font-code text-xs text-amber-100 shadow-inner"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CHAMBER III: HALL OF RELICS (EXPERIENCE & PROJECTS)
         ===================================================================== */}
      <section className="relative w-full border-b border-amber-900/30 py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-35">
              <span className="font-code text-xs uppercase tracking-widest text-amber-500">
                CHAMBER III • ENTERPRISE ARTIFACTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                THE HALL OF GRAND RELICS (EXPERIENCE &amp; PROJECTS)
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="relics"
              chamberName="The Hall of Relics"
              isLit={isChamberLit('relics')}
              onIgnite={igniteChamber}
            />
          </div>

          <div
            className={`relative rounded-3xl border border-amber-600/40 bg-[#0b0907]/95 p-8 ${
              isChamberLit('relics')
                ? 'chamber-illuminated'
                : 'chamber-dark-shroud'
            }`}
          >
            <FireIgnitionPerimeter
              isIgniting={ignitingChambers.has('relics')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {HUSSEIN_DATA.relics.map((relic) => (
                <article
                  key={relic.id}
                  className="group flex flex-col justify-between rounded-2xl border-2 border-amber-800/45 bg-gradient-to-br from-[#16120c] via-[#0d0a07] to-[#070504] p-7 shadow-2xl transition hover:border-amber-400"
                >
                  <div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-black p-1.5 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                        <SmartImage
                          src={relic.imageUrl}
                          alt={relic.name}
                          fallbackType="relic"
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
                        />
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-code text-[9px] text-amber-300 border border-amber-600/40">
                          {isChamberLit('relics') ? 'UNLOCKED' : 'SEALED'}
                        </span>
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

                    {/* UV / Magic Mode: Ancient Hieroglyphic CQRS & DB Schema Blueprint */}
                    {isArcaneVision && (
                      <div className="mb-4 rounded-xl border border-sky-400/60 bg-sky-950/40 p-3.5 font-code text-xs text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.2)] space-y-2">
                        <div>
                          <span className="font-bold text-sky-400">
                            [UV ARCANE BLUEPRINT]:{' '}
                          </span>
                          {relic.secretArchitecture}
                        </div>
                        <div className="rounded border border-sky-500/30 bg-black/60 p-2 text-[11px] text-cyan-300 overflow-x-auto">
                          <span className="text-purple-400 font-bold">
                            SCHEMA FLOW:{' '}
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
                        onClick={() => {
                          dungeonAudio.playRuneCollect();
                          setSelectedRelic(relic);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-500/20 px-4 py-2 font-code text-xs font-bold text-amber-200 hover:bg-amber-500 hover:text-black transition"
                      >
                        <Code2 className="h-4 w-4" />
                        <span>UNLOCK RELIC SPECS</span>
                      </button>

                      {relic.liveUrl && (
                        <a
                          href={relic.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-code text-xs text-amber-400 hover:underline"
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
          </div>
        </div>
      </section>

      {/* =====================================================================
          CHAMBER IV: THE TECHNICAL BOSS FIGHT (CONCURRENCY GOLEM)
         ===================================================================== */}
      <section className="relative w-full border-b border-red-900/40 py-20 px-6 bg-gradient-to-b from-[#0c0605] to-[#070504]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-35">
              <span className="font-code text-xs uppercase tracking-widest text-red-400">
                CHAMBER IV • THE GUARDIAN ENCOUNTER
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                BOSS FIGHT: THE HIGH-TRAFFIC CONCURRENCY GOLEM
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="boss"
              chamberName="The Boss Arena"
              isLit={isChamberLit('boss')}
              onIgnite={igniteChamber}
            />
          </div>

          <div
            className={`relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-3xl border border-red-700/50 bg-[#0e0807]/95 p-8 ${
              isChamberLit('boss')
                ? 'chamber-illuminated'
                : 'chamber-dark-shroud'
            }`}
          >
            <FireIgnitionPerimeter
              isIgniting={ignitingChambers.has('boss')}
            />

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border-2 border-red-600/50 bg-black shadow-[0_0_60px_rgba(220,38,38,0.25)]">
                <SmartImage
                  src="/assets/images/boss-golem.jpg"
                  alt="High-Traffic Concurrency Golem"
                  fallbackType="boss"
                  className={`h-92 w-full object-cover object-top transition duration-700 ${
                    bossHp <= 0 ? 'grayscale opacity-30 scale-95' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/90 to-transparent p-5">
                  <div className="mb-2 flex items-center justify-between font-code text-xs">
                    <span className="font-bold text-red-400 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      {bossHp > 0 ? 'BOTTLENECK ACTIVE' : 'GOLEM VANQUISHED'}
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
                The Golem guards the Secret Contact Gate! Deploy Hussein&apos;s production-proven backend countermeasures to defeat it and unseal Chamber V:
              </p>

              <div className="space-y-3">
                {HUSSEIN_DATA.bossActions.map((action) => {
                  const isUsed = usedActions.has(action.id);
                  return (
                    <button
                      key={action.id}
                      type="button"
                      disabled={isUsed || bossHp <= 0}
                      onClick={() =>
                        handleBossAttack(
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
          </div>
        </div>
      </section>

      {/* =====================================================================
          CHAMBER V: THE FINAL SECRET GATE, RUNE TERMINAL, SQL PUZZLE & GUESTBOOK
         ===================================================================== */}
      <section className="relative w-full py-20 px-6 bg-[#060504]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="relative z-35">
              <div className="flex items-center gap-2">
                {isSecretGateUnlocked ? (
                  <Unlock className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Lock className="h-4 w-4 text-amber-500" />
                )}
                <span className="font-code text-xs uppercase tracking-widest text-emerald-400">
                  CHAMBER V • THE FINAL SECRET GATE
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                RUNE API TERMINAL, SQL PUZZLE &amp; HALL OF FAME
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="terminal"
              chamberName="The Secret Contact Gate"
              isLit={isChamberLit('terminal')}
              onIgnite={igniteChamber}
            />
          </div>

          <div
            className={`relative rounded-3xl border border-amber-600/40 bg-[#0b0907]/95 p-8 space-y-10 ${
              isChamberLit('terminal')
                ? 'chamber-illuminated'
                : 'chamber-dark-shroud'
            }`}
          >
            <FireIgnitionPerimeter
              isIgniting={ignitingChambers.has('terminal')}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Interactive Rune Swagger Terminal (with GET /api/hussein/skills & POST /api/contact) */}
              <div className="lg:col-span-7 rounded-2xl border border-amber-800/50 bg-[#0d0a07] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                  <div className="flex items-center gap-2 font-code text-xs text-emerald-400">
                    <Terminal className="h-4 w-4" />
                    <span>THE RUNE TERMINAL (SWAGGER STONE SIMULATOR)</span>
                  </div>
                  <span className="font-code text-[11px] text-amber-400">
                    REDIS CACHE: &lt; 10ms
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    'GET /api/hussein/skills',
                    'POST /api/contact',
                    'GET /api/hussein/education',
                  ].map((endpoint) => (
                    <button
                      key={endpoint}
                      type="button"
                      onClick={() => {
                        dungeonAudio.playRuneCollect();
                        setSelectedEndpoint(endpoint);
                      }}
                      className={`rounded-lg border px-3 py-1.5 font-code text-xs transition ${
                        selectedEndpoint === endpoint
                          ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200'
                          : 'border-amber-900/40 bg-black text-amber-200/70 hover:border-amber-600'
                      }`}
                    >
                      {endpoint}
                    </button>
                  ))}
                </div>

                <pre className="overflow-x-auto rounded-2xl border border-amber-950 bg-[#050403] p-4 font-code text-xs text-emerald-300">
                  {terminalPayload}
                </pre>
              </div>

              {/* Ancient SQL Rune Puzzle */}
              <div className="lg:col-span-5 rounded-2xl border border-amber-800/50 bg-[#0d0a07] p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-code text-xs text-amber-400">
                    <KeyRound className="h-4 w-4" />
                    <span>ANCIENT SQL SERVER RUNE PUZZLE</span>
                  </div>
                  <p className="text-xs text-[#cfc5b2]">
                    Execute the engraved T-SQL query below to unlock Hussein&apos;s hidden production metrics:
                  </p>
                  <pre className="rounded-xl border border-amber-900/50 bg-black p-3 font-code text-xs text-amber-300 overflow-x-auto">
                    {`SELECT TOP 1 Developer, GPA, ConcurrencyModel\nFROM dbo.GrandArchitects WITH (NOLOCK)\nWHERE Stack = '.NET 9' AND Honors = 1;`}
                  </pre>

                  {sqlPuzzleSolved && (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 font-code text-xs text-emerald-200 space-y-1">
                      <div className="font-bold text-emerald-400">
                        ✔ 1 ROW RETURNED (0.4ms):
                      </div>
                      <div>• Architect: Hussein Mohamed (GPA 3.64/4.0)</div>
                      <div>• Production Uptime: 99.98% across 4 Ecosystems</div>
                      <div>• Zero Race-Condition Oversells Recorded</div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleExecuteSqlRune}
                  className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 py-3 font-code text-xs font-extrabold text-black hover:from-amber-500 hover:to-amber-400 transition"
                >
                  {sqlPuzzleSolved
                    ? '✔ ANCIENT QUERY EXECUTED'
                    : 'EXECUTE ANCIENT SQL QUERY'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Hall of Fame Guestbook */}
              <div className="lg:col-span-7 rounded-2xl border border-amber-800/50 bg-[#0d0a07] p-6 space-y-4">
                <h3 className="text-lg font-bold text-amber-100">
                  HALL OF FAME WALL (ETCH YOUR NAME VIA MEDIATR CQRS)
                </h3>
                <form
                  onSubmit={handleSignGuestbook}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <input
                    type="text"
                    required
                    value={explorerName}
                    onChange={(e) => setExplorerName(e.target.value)}
                    placeholder="Your Name (e.g., Ahmed - Tech Lead)"
                    className="rounded-xl border border-amber-900/60 bg-black px-3.5 py-2 font-code text-xs text-amber-100 placeholder-amber-700 focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={explorerGuild}
                    onChange={(e) => setExplorerGuild(e.target.value)}
                    placeholder="Company / Guild"
                    className="rounded-xl border border-amber-900/60 bg-black px-3.5 py-2 font-code text-xs text-amber-100 placeholder-amber-700 focus:border-amber-400 focus:outline-none"
                  />
                  <div className="sm:col-span-2 flex gap-2">
                    <input
                      type="text"
                      required
                      value={explorerMessage}
                      onChange={(e) => setExplorerMessage(e.target.value)}
                      placeholder="Etch a note on the stone wall..."
                      className="flex-1 rounded-xl border border-amber-900/60 bg-black px-3.5 py-2 font-code text-xs text-amber-100 placeholder-amber-700 focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 font-code text-xs font-extrabold text-black hover:bg-amber-400"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>ETCH</span>
                    </button>
                  </div>
                </form>

                <div className="max-h-44 overflow-y-auto space-y-2.5 pr-1 pt-2">
                  {guestbook.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-amber-950 bg-black/80 p-3 font-code text-xs"
                    >
                      <div className="flex items-center justify-between text-amber-400">
                        <strong>
                          {entry.explorerName} ({entry.guildOrCompany})
                        </strong>
                        <span className="text-[10px] opacity-60">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-amber-100/90">{entry.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Summoning Coordinates (Email, Phone, GitHub, LinkedIn, CV PDF) */}
              <div className="lg:col-span-5 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-[#17120c] to-[#0b0906] p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Database className="h-5 w-5" />
                    <h3 className="text-xl font-extrabold text-amber-50">
                      SUMMONING COORDINATES
                    </h3>
                  </div>
                  <p className="text-sm text-[#d5cbb8]">
                    Ready to build scalable .NET 9 APIs, Clean Architecture systems, and real-time SignalR hubs for your team.
                  </p>

                  <div className="space-y-2.5 pt-1 font-code text-xs">
                    <a
                      href={`mailto:${HUSSEIN_DATA.hero.email}`}
                      className="flex items-center gap-3 rounded-xl border border-amber-800/50 bg-black/70 p-3 text-amber-200 hover:border-amber-400"
                    >
                      <Mail className="h-4 w-4 text-amber-400" />
                      <span>{HUSSEIN_DATA.hero.email}</span>
                    </a>
                    <a
                      href={`tel:${HUSSEIN_DATA.hero.phone}`}
                      className="flex items-center gap-3 rounded-xl border border-amber-800/50 bg-black/70 p-3 text-amber-200 hover:border-amber-400"
                    >
                      <Phone className="h-4 w-4 text-amber-400" />
                      <span>{HUSSEIN_DATA.hero.phone}</span>
                    </a>
                    <div className="flex items-center gap-3 rounded-xl border border-amber-800/50 bg-black/70 p-3 text-amber-200">
                      <MapPin className="h-4 w-4 text-amber-400" />
                      <span>{HUSSEIN_DATA.hero.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <a
                        href={HUSSEIN_DATA.hero.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-amber-800/50 bg-black/80 py-2.5 text-amber-200 hover:border-amber-400"
                      >
                        <GitBranch className="h-4 w-4 text-amber-400" />
                        <span>GitHub</span>
                      </a>
                      <a
                        href={HUSSEIN_DATA.hero.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-amber-800/50 bg-black/80 py-2.5 text-amber-200 hover:border-amber-400"
                      >
                        <Share2 className="h-4 w-4 text-amber-400" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-900/50 flex flex-col gap-2.5">
                  <a
                    href="/Hussein_Mohamed_.NET_CV.pdf"
                    download
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 font-code text-xs font-extrabold text-black hover:bg-amber-400 transition"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>DOWNLOAD OFFICIAL CV (.PDF)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relic Deep-Dive Modal (z-[100], while Torch Cursor is z-[9999] so it never disappears!) */}
      {selectedRelic && (
        <div
          onClick={() => setSelectedRelic(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full rounded-3xl border-2 border-amber-500 bg-[#0e0b08] p-6 sm:p-8 shadow-[0_0_90px_rgba(245,158,11,0.3)]"
          >
            <button
              type="button"
              onClick={() => setSelectedRelic(null)}
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-lg border border-amber-700 bg-[#1a140e] text-amber-300 hover:border-amber-400"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-amber-900/50 pb-4 mb-5">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-amber-500/50 bg-black p-1">
                <SmartImage
                  src={selectedRelic.imageUrl}
                  alt={selectedRelic.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="font-code text-xs text-amber-400">
                  {selectedRelic.role} • {selectedRelic.period}
                </span>
                <h3 className="text-2xl font-extrabold text-amber-50">
                  {selectedRelic.name}
                </h3>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="rounded-xl border border-sky-500/40 bg-sky-950/30 p-3.5 font-code text-xs text-sky-200 space-y-2">
                <div>
                  <strong className="text-sky-400">SECRET ARCHITECTURE: </strong>
                  {selectedRelic.secretArchitecture}
                </div>
                <div className="rounded border border-sky-500/30 bg-black/70 p-2.5 text-[11px] text-cyan-300 overflow-x-auto">
                  <strong className="text-purple-400">CQRS &amp; DB PIPELINE: </strong>
                  {selectedRelic.schemaDiagram}
                </div>
              </div>

              <ul className="space-y-2 text-sm text-[#dfd5c1]">
                {selectedRelic.deepDiveSpecs.map((spec, i) => (
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

            <div className="mt-6 flex justify-end border-t border-amber-900/50 pt-4">
              <button
                type="button"
                onClick={() => setSelectedRelic(null)}
                className="rounded-xl bg-amber-500 px-5 py-2.5 font-code text-xs font-extrabold text-black hover:bg-amber-400"
              >
                SEAL RELIC SCROLL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;