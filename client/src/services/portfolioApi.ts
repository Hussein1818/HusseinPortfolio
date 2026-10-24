import type {
  HeroProfile,
  ProjectRelic,
  SkillRune,
  BossDefenseAction,
  GuestbookEntry,
} from '../types/dungeon.types';

const RAW_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'https://hussein-portfolio.runasp.net';

export const API_ORIGIN = RAW_BASE_URL.replace(/\/+$/, '');
const API_V1 = `${API_ORIGIN}/api/v1`;
const TOKEN_STORAGE_KEY = 'hussein_portfolio_admin_jwt';
const GUESTBOOK_TOKENS_KEY = 'hussein_portfolio_my_gb_tokens';

export interface ApiPortfolioProfileDto {
  readonly id?: string;
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
  readonly educationDegree: string;
  readonly educationUniversity: string;
  readonly educationGrade: string;
  readonly cvFileUrl?: string | null;
}

export interface ApiBossActionDto {
  readonly id: string;
  readonly label: string;
  readonly projectOrigin: string;
  readonly impactDescription: string;
  readonly damage: number;
}

export function mapProfileDtoToHero(
  dto: ApiPortfolioProfileDto
): HeroProfile & { readonly cvFileUrl?: string } {
  return {
    name: dto.name,
    title: dto.title,
    location: dto.location,
    email: dto.email,
    phone: dto.phone,
    githubUrl: dto.githubUrl,
    linkedinUrl: dto.linkedinUrl,
    dungeonAvatar: dto.dungeonAvatar || '/assets/images/hussein-dungeon.jpg',
    recruiterAvatar: dto.recruiterAvatar || '/assets/images/hussein-hr.png',
    summary: dto.summary,
    education: {
      degree: dto.educationDegree,
      university: dto.educationUniversity,
      grade: dto.educationGrade,
    },
    cvFileUrl: dto.cvFileUrl ?? undefined,
  };
}

export function mapBossActionDto(dto: ApiBossActionDto): BossDefenseAction {
  return {
    id: dto.id,
    label: dto.label,
    projectOrigin: dto.projectOrigin,
    impactDescription: dto.impactDescription,
    damage: dto.damage,
  };
}
export interface ApiProjectDto {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly period: string;
  readonly type: string;
  readonly imageUrl: string;
  readonly secretArchitecture: string;
  readonly schemaDiagram: string;
  readonly description: string;
  readonly liveUrl?: string | null;
  readonly deepDiveSpecs: readonly string[];
  readonly techStacks: readonly string[];
}

export interface ProjectUpsertPayload {
  readonly id?: string;
  readonly name: string;
  readonly role: string;
  readonly period: string;
  readonly type: string;
  readonly imageUrl: string;
  readonly secretArchitecture: string;
  readonly schemaDiagram: string;
  readonly description: string;
  readonly liveUrl?: string | null;
  readonly deepDiveSpecs: readonly string[];
  readonly techStacks: readonly string[];
}

export interface ApiSkillItemDto {
  readonly id: string;
  readonly skillCategoryId: string;
  readonly name: string;
}

export interface ApiSkillCategoryDto {
  readonly id: string;
  readonly name: string;
  readonly runeSymbol: string;
  readonly skills: readonly ApiSkillItemDto[];
}

export interface ApiGuestbookEntryDto {
  readonly id: string;
  readonly explorerName: string;
  readonly guildOrCompany: string;
  readonly message: string;
  readonly createdAt: string;
  readonly updatedAt?: string | null;
  readonly authorToken?: string | null;
}

export interface CurrentAdminUserDto {
  readonly id: string;
  readonly email: string;
  readonly role: string;
}

interface ValidationErrorItem {
  readonly PropertyName?: string;
  readonly ErrorMessage?: string;
  readonly propertyName?: string;
  readonly errorMessage?: string;
}

interface ApiErrorPayload {
  readonly Message?: string;
  readonly message?: string;
  readonly Errors?: readonly ValidationErrorItem[];
  readonly errors?: readonly ValidationErrorItem[];
}

export const tokenStorage = {
  get(): string | null {
    if (typeof window === 'undefined') return null;
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
  },
  set(token: string): void {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clear(): void {
    if (typeof window === 'undefined') return;
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};

export const guestbookOwnership = {
  getMap(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = window.localStorage.getItem(GUESTBOOK_TOKENS_KEY);
      return raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      return {};
    }
  },
  saveToken(entryId: string, authorToken: string): void {
    if (typeof window === 'undefined' || !entryId || !authorToken) return;
    const current = this.getMap();
    current[entryId] = authorToken;
    window.localStorage.setItem(GUESTBOOK_TOKENS_KEY, JSON.stringify(current));
  },
  getToken(entryId: string): string | null {
    return this.getMap()[entryId] ?? null;
  },
  removeToken(entryId: string): void {
    if (typeof window === 'undefined') return;
    const current = this.getMap();
    delete current[entryId];
    window.localStorage.setItem(GUESTBOOK_TOKENS_KEY, JSON.stringify(current));
  },
};

export function formatRelativeTimestamp(isoDate?: string): string {
  if (!isoDate) return 'Just now';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Just now';

  const diffSeconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000)
  );
  if (diffSeconds < 60) return 'Just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function mapProjectDtoToRelic(dto: ApiProjectDto): ProjectRelic {
  return {
    id: dto.id,
    name: dto.name,
    role: dto.role,
    period: dto.period,
    type: dto.type,
    imageUrl: dto.imageUrl || '/assets/images/relic-medaura.png',
    secretArchitecture: dto.secretArchitecture,
    schemaDiagram: dto.schemaDiagram,
    description: dto.description,
    deepDiveSpecs: dto.deepDiveSpecs ?? [],
    stack: dto.techStacks ?? [],
    liveUrl: dto.liveUrl ?? undefined,
  };
}

export function mapCategoryDtoToRune(dto: ApiSkillCategoryDto): SkillRune {
  return {
    id: dto.id,
    category: dto.name,
    runeSymbol: dto.runeSymbol || '⚡',
    items: (dto.skills ?? []).map((s) => s.name),
  };
}

export function mapGuestbookDtoToEntry(
  dto: ApiGuestbookEntryDto
): GuestbookEntry {
  const baseTime = formatRelativeTimestamp(dto.updatedAt || dto.createdAt);
  return {
    id: dto.id,
    explorerName: dto.explorerName,
    guildOrCompany: dto.guildOrCompany || 'Visitor',
    message: dto.message,
    timestamp: dto.updatedAt ? `${baseTime} (edited)` : baseTime,
  };
}

async function requestJson<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenStorage.get();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_V1}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 429) {
    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    if (response.status === 401 && !headers.has('X-Author-Token')) {
      tokenStorage.clear();
    }
    const errPayload = data as ApiErrorPayload | null;
    const validationList = errPayload?.Errors || errPayload?.errors;
    if (Array.isArray(validationList) && validationList.length > 0) {
      const combined = validationList
        .map((e) => e.ErrorMessage || e.errorMessage)
        .filter(Boolean)
        .join(' | ');
      if (combined) throw new Error(combined);
    }
    const msg =
      errPayload?.Message ||
      errPayload?.message ||
      `Request failed with status ${response.status}`;
    throw new Error(msg);
  }

  return data as T;
}

export const portfolioApi = {
  async login(email: string, password: string): Promise<string> {
    const res = await requestJson<{ token?: string; Token?: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    const jwt = res.token || res.Token || '';
    if (!jwt) throw new Error('Authentication token was not returned.');
    tokenStorage.set(jwt);
    return jwt;
  },

  async getCurrentAdmin(): Promise<CurrentAdminUserDto> {
    return requestJson<CurrentAdminUserDto>('/auth/me', { method: 'GET' });
  },

  logout(): void {
    tokenStorage.clear();
  },

  async getProjects(): Promise<ApiProjectDto[]> {
    return requestJson<ApiProjectDto[]>('/projects', { method: 'GET' });
  },

  async createProject(payload: ProjectUpsertPayload): Promise<string> {
    return requestJson<string>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateProject(
    id: string,
    payload: ProjectUpsertPayload
  ): Promise<void> {
    await requestJson(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...payload, id }),
    });
  },

  async deleteProject(id: string): Promise<void> {
    await requestJson(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  async getSkillCategories(): Promise<ApiSkillCategoryDto[]> {
    return requestJson<ApiSkillCategoryDto[]>('/skills/categories', {
      method: 'GET',
    });
  },

  async createSkillCategory(
    name: string,
    runeSymbol: string
  ): Promise<{ id?: string; Id?: string }> {
    return requestJson<{ id?: string; Id?: string }>('/skills/categories', {
      method: 'POST',
      body: JSON.stringify({ name, runeSymbol }),
    });
  },

  async updateSkillCategory(
    id: string,
    name: string,
    runeSymbol: string
  ): Promise<void> {
    await requestJson(`/skills/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, name, runeSymbol }),
    });
  },

  async deleteSkillCategory(id: string): Promise<void> {
    await requestJson(`/skills/categories/${id}`, {
      method: 'DELETE',
    });
  },

  async createSkillItem(
    skillCategoryId: string,
    name: string
  ): Promise<{ id?: string; Id?: string }> {
    return requestJson<{ id?: string; Id?: string }>('/skills/items', {
      method: 'POST',
      body: JSON.stringify({ skillCategoryId, name }),
    });
  },

  async updateSkillItem(
    id: string,
    skillCategoryId: string,
    name: string
  ): Promise<void> {
    await requestJson(`/skills/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ id, skillCategoryId, name }),
    });
  },

  async deleteSkillItem(id: string): Promise<void> {
    await requestJson(`/skills/items/${id}`, {
      method: 'DELETE',
    });
  },

  async getGuestbookEntries(): Promise<ApiGuestbookEntryDto[]> {
    return requestJson<ApiGuestbookEntryDto[]>('/guestbook', {
      method: 'GET',
    });
  },

  async createGuestbookEntry(
    explorerName: string,
    guildOrCompany: string,
    message: string
  ): Promise<ApiGuestbookEntryDto> {
    return requestJson<ApiGuestbookEntryDto>('/guestbook', {
      method: 'POST',
      body: JSON.stringify({ explorerName, guildOrCompany, message }),
    });
  },

  async updateGuestbookEntry(
    id: string,
    explorerName: string,
    guildOrCompany: string,
    message: string,
    authorToken?: string | null
  ): Promise<ApiGuestbookEntryDto> {
    const headers: Record<string, string> = {};
    if (authorToken) {
      headers['X-Author-Token'] = authorToken;
    }
    return requestJson<ApiGuestbookEntryDto>(`/guestbook/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ explorerName, guildOrCompany, message }),
    });
  },

  async deleteGuestbookEntry(
    id: string,
    authorToken?: string | null
  ): Promise<void> {
    const headers: Record<string, string> = {};
    if (authorToken) {
      headers['X-Author-Token'] = authorToken;
    }
    await requestJson(`/guestbook/${id}`, {
      method: 'DELETE',
      headers,
    });
  },
  // Profile & Hero Settings
  async getProfile(): Promise<ApiPortfolioProfileDto> {
    return requestJson<ApiPortfolioProfileDto>('/profile', { method: 'GET' });
  },

  async updateProfile(
    payload: ApiPortfolioProfileDto
  ): Promise<ApiPortfolioProfileDto> {
    return requestJson<ApiPortfolioProfileDto>('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // System Design Challenge Actions
  async getBossActions(): Promise<ApiBossActionDto[]> {
    return requestJson<ApiBossActionDto[]>('/challenge', { method: 'GET' });
  },

  async createBossAction(
    payload: Omit<ApiBossActionDto, 'id'>
  ): Promise<{ id?: string; Id?: string }> {
    return requestJson<{ id?: string; Id?: string }>('/challenge', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateBossAction(
    id: string,
    payload: ApiBossActionDto
  ): Promise<void> {
    await requestJson(`/challenge/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteBossAction(id: string): Promise<void> {
    await requestJson(`/challenge/${id}`, {
      method: 'DELETE',
    });
  },
};