export type ChamberId = 'origin' | 'arsenal' | 'relics' | 'boss' | 'terminal';

export interface EducationInfo {
  readonly degree: string;
  readonly university: string;
  readonly grade: string;
}

export interface HeroProfile {
  readonly name: string;
  readonly title: string;
  readonly location: string;
  readonly email: string;
  readonly phone: string;
  readonly githubUrl: string;
  readonly linkedinUrl: string;
  readonly dungeonAvatar: string;
  readonly recruiterAvatar: string;
  readonly summary: string;
  readonly education: EducationInfo;
}

export interface ProjectRelic {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly period: string;
  readonly type: string;
  readonly imageUrl: string;
  readonly secretArchitecture: string;
  readonly schemaDiagram: string;
  readonly description: string;
  readonly deepDiveSpecs: readonly string[];
  readonly stack: readonly string[];
  readonly liveUrl?: string;
}

export interface SkillRune {
  readonly id: string;
  readonly category: string;
  readonly runeSymbol: string;
  readonly items: readonly string[];
}

export interface BossDefenseAction {
  readonly id: string;
  readonly label: string;
  readonly projectOrigin: string;
  readonly impactDescription: string;
  readonly damage: number;
}

export interface GuestbookEntry {
  readonly id: string;
  readonly explorerName: string;
  readonly guildOrCompany: string;
  readonly message: string;
  readonly timestamp: string;
}

export interface GhostExplorer {
  readonly id: string;
  readonly label: string;
  readonly topPercent: number;
  readonly leftPercent: number;
  readonly color: string;
}

export interface PortfolioData {
  readonly hero: HeroProfile;
  readonly relics: readonly ProjectRelic[];
  readonly runes: readonly SkillRune[];
  readonly bossActions: readonly BossDefenseAction[];
  readonly initialGuestbook: readonly GuestbookEntry[];
}