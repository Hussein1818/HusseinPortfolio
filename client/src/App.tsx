import React, { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { Trophy } from 'lucide-react';
import { HUSSEIN_DATA } from './data/portfolioFallback';
import { TorchMask } from './components/canvas/TorchMask';
import { DungeonHeader } from './components/shared/DungeonHeader';
import { RelicModal } from './components/shared/RelicModal';
import { OnboardingModal } from './components/shared/OnboardingModal';
import { OriginChamber } from './components/chambers/OriginChamber';
import { ArsenalChamber } from './components/chambers/ArsenalChamber';
import { RelicsChamber } from './components/chambers/RelicsChamber';
import { BossChamber } from './components/chambers/BossChamber';
import { TerminalChamber } from './components/chambers/TerminalChamber';
import { dungeonAudio } from './utils/dungeonAudio';
import {
  portfolioApi,
  mapProjectDtoToRelic,
  mapCategoryDtoToRune,
  mapGuestbookDtoToEntry,
} from './services/portfolioApi';
import { createPortfolioHubConnection } from './services/signalrService';
import type {
  ChamberId,
  ProjectRelic,
  SkillRune,
  GuestbookEntry,
  GhostExplorer,
} from './types/dungeon.types';

const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

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
    label: 'Visitor_402 (SignalR Sync)',
    topPercent: 28,
    leftPercent: 14,
    color: 'rgba(168, 85, 247, 0.35)',
  },
  {
    id: 'ghost-2',
    label: 'Recruiter_Node (Viewing Projects)',
    topPercent: 58,
    leftPercent: 82,
    color: 'rgba(56, 189, 248, 0.35)',
  },
];

function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return (
    window.location.hash === '#admin' ||
    window.location.pathname.startsWith('/admin') ||
    params.get('admin') === '1'
  );
}

export const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState<boolean>(checkIsAdminRoute);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLumosActive, setIsLumosActive] = useState<boolean>(false);
  const [isArcaneVision, setIsArcaneVision] = useState<boolean>(false);

  // Live API Data with Instant Static Fallback
  const [relics, setRelics] = useState<readonly ProjectRelic[]>(
    HUSSEIN_DATA.relics
  );
  const [runes, setRunes] = useState<readonly SkillRune[]>(HUSSEIN_DATA.runes);
  const [guestbookEntries, setGuestbookEntries] = useState<
    readonly GuestbookEntry[]
  >(HUSSEIN_DATA.initialGuestbook);
  const [activeExplorersCount, setActiveExplorersCount] = useState<number>(3);

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
    'WARNING: High-Traffic Bottleneck detected! Deploy Hussein’s architectures below:',
  ]);
  const [usedActions, setUsedActions] = useState<ReadonlySet<string>>(
    () => new Set<string>()
  );

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

  const syncLivePortfolioData = useCallback(async () => {
    try {
      const [projDtos, catDtos, gbDtos] = await Promise.all([
        portfolioApi.getProjects(),
        portfolioApi.getSkillCategories(),
        portfolioApi.getGuestbookEntries(),
      ]);

      if (Array.isArray(projDtos) && projDtos.length > 0) {
        setRelics(projDtos.map(mapProjectDtoToRelic));
      }
      if (Array.isArray(catDtos) && catDtos.length > 0) {
        setRunes(catDtos.map(mapCategoryDtoToRune));
      }
      if (Array.isArray(gbDtos) && gbDtos.length > 0) {
        setGuestbookEntries(gbDtos.map(mapGuestbookDtoToEntry));
      }
    } catch {
      // Fallback data remains active when API is unreachable
    }
  }, []);

  useEffect(() => {
    void syncLivePortfolioData();

    const hub = createPortfolioHubConnection({
      onActiveExplorersUpdated: (count) => {
        setActiveExplorersCount(count);
      },
      onReceiveGuestbookEntry: (newEntry) => {
        setGuestbookEntries((prev) => {
          if (prev.some((e) => e.id === newEntry.id)) return prev;
          return [newEntry, ...prev];
        });
      },
    });

    void hub.start();
    return () => {
      void hub.stop();
    };
  }, [syncLivePortfolioData]);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(checkIsAdminRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!achievementToast) return;
    const timer = window.setTimeout(() => {
      setAchievementToast(null);
    }, 3500);
    return () => window.clearTimeout(timer);
  }, [achievementToast]);

  useEffect(() => {
    if (isAdminView) return;
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
      dungeonAudio.playRuneCollect();
      setIsArcaneVision((prev) => {
        const next = !prev;
        triggerToast(
          next
            ? 'Architecture Blueprint View Enabled!'
            : 'Standard View Restored'
        );
        return next;
      });
    };

    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, [isAdminView, triggerToast]);

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
        }, 2400);

        const updated = new Set(prev);
        updated.add(chamberId);

        if (updated.size === ALL_CHAMBERS.length) {
          dungeonAudio.playQuestComplete();
          triggerToast('All 5 Portfolio Sections Illuminated!');
        } else {
          triggerToast(
            `Unlocked: ${chamberName} (${updated.size}/${ALL_CHAMBERS.length})`
          );
        }
        return updated;
      });
    },
    [triggerToast]
  );

  const handleStartExploration = useCallback(() => {
    dungeonAudio.playTorchIgnite();
    setShowOnboarding(false);
    setIgnitingChambers(new Set<ChamberId>(['origin']));
    window.setTimeout(() => {
      setIgnitingChambers(new Set<ChamberId>());
    }, 2400);
  }, []);

  const handleSkipToFullLight = useCallback(() => {
    dungeonAudio.playQuestComplete();
    setShowOnboarding(false);
    setIsLumosActive(true);
    setLitChambers(new Set(ALL_CHAMBERS));
    triggerToast('Full Light View Enabled — All Sections Visible!');
  }, [triggerToast]);

  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      dungeonAudio.setMuted(next);
      return next;
    });
  }, []);

  const handleToggleArcane = useCallback(() => {
    dungeonAudio.playRuneCollect();
    setIsArcaneVision((prev) => !prev);
  }, []);

  const handleCastLumos = useCallback(() => {
    dungeonAudio.playTorchIgnite();
    setIsLumosActive((prev) => {
      const next = !prev;
      if (next) {
        setLitChambers(new Set(ALL_CHAMBERS));
        triggerToast('Full Light View Active!');
      } else {
        setLitChambers(new Set<ChamberId>(['origin']));
        triggerToast('Torch Exploration Mode Enabled');
      }
      return next;
    });
  }, [triggerToast]);

  const handleSimulateQueryLink = useCallback(() => {
    dungeonAudio.playRuneCollect();
    const sampleVisitor = 'Tech Lead & Engineering Team';
    const url = new URL(window.location.href);
    url.searchParams.set('name', sampleVisitor);
    window.history.pushState({}, '', url.toString());
    setVisitorQueryName(sampleVisitor);
    triggerToast('Custom URL Parameter Active: ?name=Tech+Lead');
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
        `DEPLOYED [${label}]: ${impact} (-${damage}% Bottleneck)`,
      ]);

      if (nextHp <= 0) {
        dungeonAudio.playQuestComplete();
        igniteChamber('terminal', 'API Terminal & Contact');
        triggerToast('Challenge Solved! Contact Section Unlocked!');
      }
    },
    [bossHp, usedActions, igniteChamber, triggerToast]
  );

  const handleSelectRelic = useCallback((relic: ProjectRelic) => {
    dungeonAudio.playRuneCollect();
    setSelectedRelic(relic);
  }, []);

  const handleCloseRelic = useCallback(() => {
    setSelectedRelic(null);
  }, []);

  const handleSubmitGuestbookEntry = useCallback(
    async (explorerName: string, guildOrCompany: string, message: string) => {
      const createdDto = await portfolioApi.createGuestbookEntry(
        explorerName,
        guildOrCompany,
        message
      );
      const mapped = mapGuestbookDtoToEntry(createdDto);
      setGuestbookEntries((prev) => {
        if (prev.some((e) => e.id === mapped.id)) return prev;
        return [mapped, ...prev];
      });
    },
    []
  );

  const handleOpenAdmin = useCallback(() => {
    window.location.hash = 'admin';
    setIsAdminView(true);
  }, []);

  const handleExitAdmin = useCallback(() => {
    window.history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search
    );
    setIsAdminView(false);
  }, []);

  if (isAdminView) {
    return (
      <Suspense
        fallback={
          <div className="admin-cursor-zone flex min-h-screen items-center justify-center bg-[#060504] font-code text-xs text-amber-300">
            Loading Admin Control Center...
          </div>
        }
      >
        <AdminDashboard
          onExitAdmin={handleExitAdmin}
          onDataMutated={syncLivePortfolioData}
        />
      </Suspense>
    );
  }

  const isChamberLit = (id: ChamberId): boolean =>
    isLumosActive || litChambers.has(id);

  const isSecretGateUnlocked =
    isLumosActive ||
    litChambers.size >= 4 ||
    bossHp <= 0 ||
    litChambers.has('terminal');

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-[#e5dec9] selection:bg-amber-500 selection:text-black">
      <TorchMask
        isLumosActive={isLumosActive}
        isArcaneVision={isArcaneVision}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onStartExploration={handleStartExploration}
        onSkipToFullLight={handleSkipToFullLight}
      />

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

      {achievementToast && (
        <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-2xl border-2 border-amber-400 bg-[#14100b] px-5 py-3.5 shadow-2xl">
          <Trophy className="h-5 w-5 text-amber-400 shrink-0 animate-bounce" />
          <span className="font-code text-xs font-bold text-amber-100">
            {achievementToast}
          </span>
        </div>
      )}

      <DungeonHeader
        heroName={HUSSEIN_DATA.hero.name}
        litCount={litChambers.size}
        totalChambers={ALL_CHAMBERS.length}
        activeExplorersCount={activeExplorersCount}
        isArcaneVision={isArcaneVision}
        isLumosActive={isLumosActive}
        isMuted={isMuted}
        onToggleArcane={handleToggleArcane}
        onCastLumos={handleCastLumos}
        onToggleMute={handleToggleMute}
        onOpenGuide={() => setShowOnboarding(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      <OriginChamber
        hero={HUSSEIN_DATA.hero}
        isLit={isChamberLit('origin')}
        isIgniting={ignitingChambers.has('origin')}
        isLumosActive={isLumosActive}
        onIgnite={igniteChamber}
        onToast={triggerToast}
      />

      <ArsenalChamber
        runes={runes}
        isLit={isChamberLit('arsenal')}
        isIgniting={ignitingChambers.has('arsenal')}
        onIgnite={igniteChamber}
      />

      <RelicsChamber
        relics={relics}
        isLit={isChamberLit('relics')}
        isIgniting={ignitingChambers.has('relics')}
        isArcaneVision={isArcaneVision}
        onIgnite={igniteChamber}
        onSelectRelic={handleSelectRelic}
      />

      <BossChamber
        bossActions={HUSSEIN_DATA.bossActions}
        bossHp={bossHp}
        usedActions={usedActions}
        combatLog={combatLog}
        isLit={isChamberLit('boss')}
        isIgniting={ignitingChambers.has('boss')}
        onIgnite={igniteChamber}
        onAttack={handleBossAttack}
      />

      <TerminalChamber
        hero={HUSSEIN_DATA.hero}
        initialGuestbook={guestbookEntries}
        onSubmitGuestbookEntry={handleSubmitGuestbookEntry}
        isLit={isChamberLit('terminal')}
        isIgniting={ignitingChambers.has('terminal')}
        isSecretGateUnlocked={isSecretGateUnlocked}
        onIgnite={igniteChamber}
        onToast={triggerToast}
      />

      <RelicModal relic={selectedRelic} onClose={handleCloseRelic} />
    </div>
  );
};

export default App;