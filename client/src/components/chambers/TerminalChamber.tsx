import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Unlock,
  Lock,
  Terminal,
  KeyRound,
  Send,
  Database,
  Mail,
  Phone,
  MapPin,
  GitBranch,
  Share2,
  FileDown,
  Trash2,
  Edit3,
  X,
} from 'lucide-react';
import type {
  HeroProfile,
  GuestbookEntry,
  ChamberId,
} from '../../types/dungeon.types';
import { RealisticWallTorch } from '../shared/RealisticWallTorch';
import { ElectricBorder } from '../ElectricBorder';
import { dungeonAudio } from '../../utils/dungeonAudio';
import { downloadOfficialCvPdf } from '../../utils/downloadCv';

interface TerminalChamberProps {
  readonly hero: HeroProfile;
  readonly initialGuestbook: readonly GuestbookEntry[];
  readonly ownedEntryIds?: ReadonlySet<string>;
  readonly onSubmitGuestbookEntry?: (
    explorerName: string,
    guildOrCompany: string,
    message: string
  ) => Promise<void>;
  readonly onUpdateOwnGuestbookEntry?: (
    id: string,
    explorerName: string,
    guildOrCompany: string,
    message: string
  ) => Promise<void>;
  readonly onDeleteOwnGuestbookEntry?: (id: string) => Promise<void>;
  readonly isLit: boolean;
  readonly isIgniting: boolean;
  readonly isSecretGateUnlocked: boolean;
  readonly onIgnite: (id: ChamberId, name: string) => void;
  readonly onToast: (msg: string) => void;
}

export const TerminalChamber: React.FC<TerminalChamberProps> = React.memo(
  ({
    hero,
    initialGuestbook,
    ownedEntryIds,
    onSubmitGuestbookEntry,
    onUpdateOwnGuestbookEntry,
    onDeleteOwnGuestbookEntry,
    isLit,
    isIgniting,
    isSecretGateUnlocked,
    onIgnite,
    onToast,
  }) => {
    const [selectedEndpoint, setSelectedEndpoint] = useState<string>(
      'GET /api/hussein/skills'
    );
    const [sqlPuzzleSolved, setSqlPuzzleSolved] = useState<boolean>(false);
    const [guestbook, setGuestbook] =
      useState<readonly GuestbookEntry[]>(initialGuestbook);
    const [explorerName, setExplorerName] = useState<string>('');
    const [explorerGuild, setExplorerGuild] = useState<string>('');
    const [explorerMessage, setExplorerMessage] = useState<string>('');
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);

    useEffect(() => {
      setGuestbook(initialGuestbook);
    }, [initialGuestbook]);

    const handleExecuteSqlRune = useCallback(() => {
      if (sqlPuzzleSolved) return;
      dungeonAudio.playQuestComplete();
      setSqlPuzzleSolved(true);
      onToast('SQL QUERY EXECUTED: Unlocked Production Metrics!');
    }, [sqlPuzzleSolved, onToast]);

    const handleCancelEdit = useCallback(() => {
      setEditingEntryId(null);
      setExplorerName('');
      setExplorerGuild('');
      setExplorerMessage('');
    }, []);

    const handleSignGuestbook = useCallback(
      async (event: React.FormEvent) => {
        event.preventDefault();
        if (!explorerName.trim() || !explorerMessage.trim() || isSending)
          return;

        dungeonAudio.playRuneCollect();
        const nameClean = explorerName.trim();
        const guildClean = explorerGuild.trim() || 'Visitor';
        const messageClean = explorerMessage.trim();

        setIsSending(true);
        try {
          if (editingEntryId && onUpdateOwnGuestbookEntry) {
            await onUpdateOwnGuestbookEntry(
              editingEntryId,
              nameClean,
              guildClean,
              messageClean
            );
            setEditingEntryId(null);
            setExplorerName('');
            setExplorerGuild('');
            setExplorerMessage('');
            onToast('Your message has been updated!');
            return;
          }

          if (onSubmitGuestbookEntry) {
            await onSubmitGuestbookEntry(nameClean, guildClean, messageClean);
            setExplorerName('');
            setExplorerGuild('');
            setExplorerMessage('');
            onToast('Message added to Guestbook!');
            return;
          }

          const newEntry: GuestbookEntry = {
            id: `gb-${Date.now()}`,
            explorerName: nameClean,
            guildOrCompany: guildClean,
            message: messageClean,
            timestamp: 'Just now',
          };

          setGuestbook((prev) => [newEntry, ...prev]);
          setExplorerName('');
          setExplorerGuild('');
          setExplorerMessage('');
          onToast('Message added to Guestbook!');
        } catch (err) {
          onToast(
            err instanceof Error
              ? err.message
              : 'Failed to process guestbook message.'
          );
        } finally {
          setIsSending(false);
        }
      },
      [
        explorerName,
        explorerGuild,
        explorerMessage,
        isSending,
        editingEntryId,
        onUpdateOwnGuestbookEntry,
        onSubmitGuestbookEntry,
        onToast,
      ]
    );

    const terminalPayload = useMemo(() => {
      if (selectedEndpoint === 'GET /api/hussein/skills') {
        return JSON.stringify(
          {
            status: 200,
            responseTimeMs: 1.4,
            cachedBy: 'Redis Distributed Cache (HIT)',
            coreStack: ['.NET 9', 'ASP.NET Core Web API', 'EF Core', 'C#'],
            architecture: [
              'Clean Architecture',
              'CQRS (MediatR)',
              'SOLID',
              'DDD',
            ],
            realtimeAndCloud: [
              'SignalR',
              'SQL Server',
              'Redis',
              'Azure',
              'Cloudflare R2',
            ],
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
              email: hero.email,
              phone: hero.phone,
              github: hero.githubUrl,
              linkedin: hero.linkedinUrl,
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
          degree: hero.education.degree,
          university: hero.education.university,
          honors: hero.education.grade,
          projectsCount: 4,
        },
        null,
        2
      );
    }, [selectedEndpoint, hero]);

    return (
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
                  SECTION V
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                API TERMINAL &amp; CONTACT
              </h2>
            </div>
            <RealisticWallTorch
              chamberId="terminal"
              chamberName="API Terminal & Contact"
              isLit={isLit}
              onIgnite={onIgnite}
            />
          </div>

          <ElectricBorder
            color="#f97316"
            borderRadius={24}
            active={isIgniting}
            className={`chamber-surface rounded-3xl border border-amber-600/40 bg-[#0b0907] p-8 space-y-10 ${
              isLit ? 'chamber-surface-lit' : 'chamber-surface-unlit'
            }`}
          >
            <div
              className="chamber-shroud-overlay"
              style={{ opacity: isLit ? 0 : 1 }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 rounded-2xl border border-amber-800/50 bg-[#0d0a07] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                  <div className="flex items-center gap-2 font-code text-xs text-emerald-400">
                    <Terminal className="h-4 w-4" />
                    <span>SWAGGER API SIMULATOR</span>
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

              <div className="lg:col-span-5 rounded-2xl border border-amber-800/50 bg-[#0d0a07] p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 font-code text-xs text-amber-400">
                    <KeyRound className="h-4 w-4" />
                    <span>SQL SERVER QUERY RUNNER</span>
                  </div>
                  <p className="text-xs text-[#cfc5b2]">
                    Execute the T-SQL query below to inspect Hussein&apos;s
                    production metrics:
                  </p>
                  <pre className="rounded-xl border border-amber-900/50 bg-black p-3 font-code text-xs text-amber-300 overflow-x-auto">
                    {`SELECT TOP 1 Developer, GPA, ConcurrencyModel\nFROM dbo.Architects WITH (NOLOCK)\nWHERE Stack = '.NET 9' AND Honors = 1;`}
                  </pre>

                  {sqlPuzzleSolved && (
                    <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 font-code text-xs text-emerald-200 space-y-1">
                      <div className="font-bold text-emerald-400">
                        ✔ 1 ROW RETURNED (0.4ms):
                      </div>
                      <div>• Developer: Hussein Mohamed (GPA 3.64/4.0)</div>
                      <div>• Production Uptime: 99.98% across 4 Projects</div>
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
                    ? '✔ SQL QUERY EXECUTED'
                    : 'EXECUTE SQL QUERY'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 rounded-2xl border border-amber-800/50 bg-[#0d0a07] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-amber-100">
                    GUESTBOOK
                  </h3>
                  {editingEntryId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center gap-1 font-code text-xs text-amber-400 hover:underline"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form
                  onSubmit={handleSignGuestbook}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={explorerName}
                    onChange={(e) => setExplorerName(e.target.value)}
                    placeholder="Your Name (e.g., Ahmed - Tech Lead)"
                    className="rounded-xl border border-amber-900/60 bg-black px-3.5 py-2 font-code text-xs text-amber-100 placeholder-amber-700 focus:border-amber-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    maxLength={150}
                    value={explorerGuild}
                    onChange={(e) => setExplorerGuild(e.target.value)}
                    placeholder="Company"
                    className="rounded-xl border border-amber-900/60 bg-black px-3.5 py-2 font-code text-xs text-amber-100 placeholder-amber-700 focus:border-amber-400 focus:outline-none"
                  />
                  <div className="sm:col-span-2 flex gap-2">
                    <input
                      type="text"
                      required
                      maxLength={1000}
                      value={explorerMessage}
                      onChange={(e) => setExplorerMessage(e.target.value)}
                      placeholder="Leave a message or feedback..."
                      className="flex-1 rounded-xl border border-amber-900/60 bg-black px-3.5 py-2 font-code text-xs text-amber-100 placeholder-amber-700 focus:border-amber-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isSending}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 font-code text-xs font-extrabold text-black hover:bg-amber-400 disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>
                        {isSending
                          ? '...'
                          : editingEntryId
                            ? 'UPDATE'
                            : 'SEND'}
                      </span>
                    </button>
                  </div>
                </form>

                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 pt-2">
                  {guestbook.length === 0 ? (
                    <div className="rounded-xl border border-amber-950/60 bg-black/50 p-4 text-center font-code text-xs text-amber-300/60">
                      Be the first to leave a message in the Guestbook!
                    </div>
                  ) : (
                    guestbook.map((entry) => {
                      const isMine = ownedEntryIds?.has(entry.id) ?? false;
                      return (
                        <div
                          key={entry.id}
                          className="rounded-xl border border-amber-950 bg-black/80 p-3 font-code text-xs"
                        >
                          <div className="flex items-center justify-between gap-2 text-amber-400">
                            <strong>
                              {entry.explorerName} ({entry.guildOrCompany})
                            </strong>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] opacity-60">
                                {entry.timestamp}
                              </span>
                              {isMine && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingEntryId(entry.id);
                                      setExplorerName(entry.explorerName);
                                      setExplorerGuild(entry.guildOrCompany);
                                      setExplorerMessage(entry.message);
                                    }}
                                    className="inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-950/40 px-2 py-0.5 text-[10px] text-amber-300 hover:bg-amber-500 hover:text-black transition"
                                    title="Edit your message"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                    <span>Edit</span>
                                  </button>
                                  {onDeleteOwnGuestbookEntry && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        void onDeleteOwnGuestbookEntry(entry.id)
                                      }
                                      className="inline-flex items-center gap-1 rounded border border-red-500/40 bg-red-950/40 px-2 py-0.5 text-[10px] text-red-300 hover:bg-red-600 hover:text-white transition"
                                      title="Delete your message"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      <span>Delete</span>
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="mt-1 text-amber-100/90">
                            {entry.message}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-[#17120c] to-[#0b0906] p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Database className="h-5 w-5" />
                    <h3 className="text-xl font-extrabold text-amber-50">
                      CONTACT INFORMATION
                    </h3>
                  </div>
                  <p className="text-sm text-[#d5cbb8]">
                    Ready to build scalable .NET 9 APIs, Clean Architecture
                    systems, and real-time SignalR hubs for your team.
                  </p>

                  <div className="space-y-2.5 pt-1 font-code text-xs">
                    <a
                      href={`mailto:${hero.email}`}
                      className="flex items-center gap-3 rounded-xl border border-amber-800/50 bg-black/70 p-3 text-amber-200 hover:border-amber-400"
                    >
                      <Mail className="h-4 w-4 text-amber-400" />
                      <span>{hero.email}</span>
                    </a>
                    <a
                      href={`tel:${hero.phone}`}
                      className="flex items-center gap-3 rounded-xl border border-amber-800/50 bg-black/70 p-3 text-amber-200 hover:border-amber-400"
                    >
                      <Phone className="h-4 w-4 text-amber-400" />
                      <span>{hero.phone}</span>
                    </a>
                    <div className="flex items-center gap-3 rounded-xl border border-amber-800/50 bg-black/70 p-3 text-amber-200">
                      <MapPin className="h-4 w-4 text-amber-400" />
                      <span>{hero.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <a
                        href={hero.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl border border-amber-800/50 bg-black/80 py-2.5 text-amber-200 hover:border-amber-400"
                      >
                        <GitBranch className="h-4 w-4 text-amber-400" />
                        <span>GitHub</span>
                      </a>
                      <a
                        href={hero.linkedinUrl}
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
                  <button
                    type="button"
                    onClick={() => void downloadOfficialCvPdf(onToast, hero.cvFileUrl)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 font-code text-xs font-extrabold text-black hover:bg-amber-400 transition"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>DOWNLOAD OFFICIAL CV (.PDF)</span>
                  </button>
                </div>
              </div>
            </div>
          </ElectricBorder>
        </div>
      </section>
    );
  }
);