import type {
  ProjectRelic,
  SkillRune,
  GuestbookEntry,
} from '../types/dungeon.types';

const RAW_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  'https://localhost:7148';

export const API_ORIGIN = RAW_BASE_URL.replace(/\/+$/, '');
const API_V1 = `${API_ORIGIN}/api/v1`;
const TOKEN_STORAGE_KEY = 'hussein_portfolio_admin_jwt';

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

export function formatRelativeTimestamp(isoDate?: string): string {
  if (!isoDate) return 'Just now';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Just now';

  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
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

export function mapGuestbookDtoToEntry(dto: ApiGuestbookEntryDto): GuestbookEntry {
  return {
    id: dto.id,
    explorerName: dto.explorerName,
    guildOrCompany: dto.guildOrCompany || 'Visitor',
    message: dto.message,
    timestamp: formatRelativeTimestamp(dto.createdAt),
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
    if (response.status === 401) {
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
  // Auth
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

  // Projects
  async getProjects(): Promise<ApiProjectDto[]> {
    return requestJson<ApiProjectDto[]>('/projects', { method: 'GET' });
  },

  async createProject(payload: ProjectUpsertPayload): Promise<string> {
    return requestJson<string>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateProject(id: string, payload: ProjectUpsertPayload): Promise<void> {
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

  // Skills (Categories & Items)
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

  // Guestbook
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

  async deleteGuestbookEntry(id: string): Promise<void> {
    await requestJson(`/guestbook/${id}`, {
      method: 'DELETE',
    });
  },
};