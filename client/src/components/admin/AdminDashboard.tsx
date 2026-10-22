import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  FolderKanban,
  Cpu,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
 RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  portfolioApi,
  tokenStorage,
  type ApiProjectDto,
  type ApiSkillCategoryDto,
  type ApiGuestbookEntryDto,
  type ProjectUpsertPayload,
} from '../../services/portfolioApi';
import { HUSSEIN_DATA } from '../../data/portfolioFallback';

interface AdminDashboardProps {
  readonly onExitAdmin: () => void;
  readonly onDataMutated: () => Promise<void>;
}

type AdminTab = 'projects' | 'skills' | 'guestbook';

interface ProjectFormState {
  id?: string;
  name: string;
  role: string;
  period: string;
  type: string;
  imageUrl: string;
  secretArchitecture: string;
  schemaDiagram: string;
  description: string;
  liveUrl: string;
  deepDiveSpecsText: string;
  techStacksText: string;
}

const EMPTY_PROJECT_FORM: ProjectFormState = {
  name: '',
  role: '',
  period: '',
  type: '',
  imageUrl: '/assets/images/relic-medaura.png',
  secretArchitecture: '',
  schemaDiagram: '',
  description: '',
  liveUrl: '',
  deepDiveSpecsText: '',
  techStacksText: '',
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onDataMutated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Data States
  const [projects, setProjects] = useState<ApiProjectDto[]>([]);
  const [categories, setCategories] = useState<ApiSkillCategoryDto[]>([]);
  const [guestbook, setGuestbook] = useState<ApiGuestbookEntryDto[]>([]);

  // Project Form State
  const [projectForm, setProjectForm] =
    useState<ProjectFormState>(EMPTY_PROJECT_FORM);
  const [isEditingProject, setIsEditingProject] = useState<boolean>(false);

  // Skill Category Form State
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryRune, setCategoryRune] = useState<string>('⚡');

  // Skill Item Form State
  const [selectedCategoryIdForSkill, setSelectedCategoryIdForSkill] =
    useState<string>('');
  const [newSkillName, setNewSkillName] = useState<string>('');

  const showBanner = useCallback((type: 'success' | 'error', text: string) => {
    setStatusBanner({ type, text });
  }, []);

  const fetchAllAdminData = useCallback(async () => {
    try {
      const [projData, catData, gbData] = await Promise.all([
        portfolioApi.getProjects(),
        portfolioApi.getSkillCategories(),
        portfolioApi.getGuestbookEntries(),
      ]);
      setProjects(projData);
      setCategories(catData);
      setGuestbook(gbData);
      if (catData.length > 0 && !selectedCategoryIdForSkill) {
        setSelectedCategoryIdForSkill(catData[0].id);
      }
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to load data from API.'
      );
    }
  }, [selectedCategoryIdForSkill, showBanner]);

  useEffect(() => {
    const verifyToken = async () => {
      const existingToken = tokenStorage.get();
      if (!existingToken) {
        setAuthLoading(false);
        return;
      }
      try {
        const admin = await portfolioApi.getCurrentAdmin();
        setAdminEmail(admin.email);
        setIsAuthenticated(true);
        await fetchAllAdminData();
      } catch {
        tokenStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    void verifyToken();
  }, [fetchAllAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusBanner(null);
    try {
      await portfolioApi.login(loginEmail.trim(), loginPassword);
      const admin = await portfolioApi.getCurrentAdmin();
      setAdminEmail(admin.email);
      setIsAuthenticated(true);
      setLoginPassword('');
      await fetchAllAdminData();
      showBanner('success', 'Authenticated successfully via JWT.');
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Invalid login credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    portfolioApi.logout();
    setIsAuthenticated(false);
    setAdminEmail('');
  };

  const handleSeedInitialData = async () => {
    setIsSubmitting(true);
    setStatusBanner(null);
    try {
      for (const relic of HUSSEIN_DATA.relics) {
        const exists = projects.some(
          (p) => p.name.toLowerCase() === relic.name.toLowerCase()
        );
        if (!exists) {
          await portfolioApi.createProject({
            name: relic.name,
            role: relic.role,
            period: relic.period,
            type: relic.type,
            imageUrl: relic.imageUrl,
            secretArchitecture: relic.secretArchitecture,
            schemaDiagram: relic.schemaDiagram,
            description: relic.description,
            liveUrl: relic.liveUrl ?? null,
            deepDiveSpecs: [...relic.deepDiveSpecs],
            techStacks: [...relic.stack],
          });
        }
      }

      for (const rune of HUSSEIN_DATA.runes) {
        const existingCat = categories.find(
          (c) => c.name.toLowerCase() === rune.category.toLowerCase()
        );
        let targetCatId = existingCat?.id;

        if (!targetCatId) {
          const created = await portfolioApi.createSkillCategory(
            rune.category,
            rune.runeSymbol
          );
          targetCatId = created.id || created.Id;
        }

        if (targetCatId) {
          for (const skillName of rune.items) {
            await portfolioApi.createSkillItem(targetCatId, skillName);
          }
        }
      }

      await fetchAllAdminData();
      await onDataMutated();
      showBanner(
        'success',
        'Default portfolio projects and skills seeded to SQL Server!'
      );
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to seed initial data.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Project Handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusBanner(null);

    const payload: ProjectUpsertPayload = {
      id: projectForm.id,
      name: projectForm.name.trim(),
      role: projectForm.role.trim(),
      period: projectForm.period.trim(),
      type: projectForm.type.trim(),
      imageUrl: projectForm.imageUrl.trim(),
      secretArchitecture: projectForm.secretArchitecture.trim(),
      schemaDiagram: projectForm.schemaDiagram.trim(),
      description: projectForm.description.trim(),
      liveUrl: projectForm.liveUrl.trim() ? projectForm.liveUrl.trim() : null,
      deepDiveSpecs: projectForm.deepDiveSpecsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      techStacks: projectForm.techStacksText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isEditingProject && projectForm.id) {
        await portfolioApi.updateProject(projectForm.id, payload);
        showBanner('success', `Project "${payload.name}" updated.`);
      } else {
        await portfolioApi.createProject(payload);
        showBanner('success', `Project "${payload.name}" created.`);
      }
      setProjectForm(EMPTY_PROJECT_FORM);
      setIsEditingProject(false);
      await fetchAllAdminData();
      await onDataMutated();
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to save project.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProjectClick = (proj: ApiProjectDto) => {
    setIsEditingProject(true);
    setProjectForm({
      id: proj.id,
      name: proj.name,
      role: proj.role,
      period: proj.period,
      type: proj.type,
      imageUrl: proj.imageUrl,
      secretArchitecture: proj.secretArchitecture,
      schemaDiagram: proj.schemaDiagram,
      description: proj.description,
      liveUrl: proj.liveUrl || '',
      deepDiveSpecsText: (proj.deepDiveSpecs ?? []).join('\n'),
      techStacksText: (proj.techStacks ?? []).join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!window.confirm(`Soft-delete project "${name}"?`)) return;
    setIsSubmitting(true);
    try {
      await portfolioApi.deleteProject(id);
      showBanner('success', `Project "${name}" deleted.`);
      await fetchAllAdminData();
      await onDataMutated();
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to delete project.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skill Category & Item Handlers
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (categoryId) {
        await portfolioApi.updateSkillCategory(
          categoryId,
          categoryName.trim(),
          categoryRune.trim()
        );
        showBanner('success', 'Skill category updated.');
      } else {
        await portfolioApi.createSkillCategory(
          categoryName.trim(),
          categoryRune.trim()
        );
        showBanner('success', 'Skill category created.');
      }
      setCategoryId(null);
      setCategoryName('');
      setCategoryRune('⚡');
      await fetchAllAdminData();
      await onDataMutated();
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to save category.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete skill category "${name}"?`)) return;
    setIsSubmitting(true);
    try {
      await portfolioApi.deleteSkillCategory(id);
      showBanner('success', `Category "${name}" deleted.`);
      await fetchAllAdminData();
      await onDataMutated();
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to delete category.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSkillItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryIdForSkill || !newSkillName.trim()) return;
    setIsSubmitting(true);
    try {
      await portfolioApi.createSkillItem(
        selectedCategoryIdForSkill,
        newSkillName.trim()
      );
      setNewSkillName('');
      showBanner('success', 'Skill item added.');
      await fetchAllAdminData();
      await onDataMutated();
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to add skill item.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkillItem = async (id: string, name: string) => {
    setIsSubmitting(true);
    try {
      await portfolioApi.deleteSkillItem(id);
      showBanner('success', `Skill "${name}" removed.`);
      await fetchAllAdminData();
      await onDataMutated();
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to remove skill.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGuestbookEntry = async (id: string) => {
    setIsSubmitting(true);
    try {
      await portfolioApi.deleteGuestbookEntry(id);
      showBanner('success', 'Guestbook entry removed.');
      await fetchAllAdminData();
      await onDataMutated();
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to delete guestbook entry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="admin-cursor-zone flex min-h-screen items-center justify-center bg-[#060504] text-amber-200 font-code">
        Verifying Admin JWT Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-cursor-zone flex min-h-screen items-center justify-center bg-[#060504] p-6 text-[#e5dec9]">
        <div className="w-full max-w-md rounded-3xl border-2 border-amber-500/60 bg-[#0e0b08] p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/50 bg-amber-950/60">
                <Shield className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-amber-50">
                  ADMIN LOGIN
                </h1>
              </div>
            </div>
            <button
              type="button"
              onClick={onExitAdmin}
              className="rounded-xl border border-amber-800/60 bg-[#17120c] px-3 py-1.5 font-code text-xs text-amber-300 hover:border-amber-400"
            >
              Back
            </button>
          </div>

          {statusBanner && (
            <div
              className={`rounded-xl border p-3 font-code text-xs ${
                statusBanner.type === 'error'
                  ? 'border-red-500/50 bg-red-950/40 text-red-200'
                  : 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
              }`}
            >
              {statusBanner.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 font-code text-xs">
            <div className="space-y-1.5">
              <label className="block text-amber-300">Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@husseinportfolio.com"
                className="w-full rounded-xl border border-amber-900/60 bg-black px-3.5 py-2.5 text-amber-100 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-amber-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-amber-900/60 bg-black pl-3.5 pr-10 py-2.5 text-amber-100 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-amber-400/80 hover:text-amber-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 font-extrabold text-black hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="admin-cursor-zone min-h-screen bg-[#060504] text-[#e5dec9] pb-20">
      <header className="sticky top-0 z-50 border-b border-amber-900/40 bg-[#0b0907]/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-amber-400" />
            <div>
              <span className="font-code text-[10px] uppercase tracking-widest text-emerald-400 block">
                AUTHENTICATED: {adminEmail}
              </span>
              <h1 className="text-lg font-extrabold text-amber-100">
                PORTFOLIO CONTROL CENTER (CQRS + CLEAN ARCH)
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-code text-xs">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSeedInitialData}
              className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/60 bg-purple-950/50 px-3.5 py-2 font-bold text-purple-200 hover:bg-purple-900/70 transition disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4 text-purple-300" />
              <span>Seed Default Portfolio Data</span>
            </button>

            <button
              type="button"
              onClick={() => void fetchAllAdminData()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-800/60 bg-[#14100b] px-3 py-2 text-amber-200 hover:border-amber-400"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/60 bg-amber-500/15 px-3.5 py-2 font-bold text-amber-200 hover:bg-amber-500 hover:text-black transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>View Live Portfolio</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-800/60 bg-red-950/40 px-3.5 py-2 font-bold text-red-200 hover:border-red-500"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-8 space-y-8">
        {statusBanner && (
          <div
            className={`flex items-center justify-between rounded-2xl border p-4 font-code text-xs ${
              statusBanner.type === 'error'
                ? 'border-red-500/60 bg-red-950/40 text-red-200'
                : 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusBanner.type === 'error' ? (
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              )}
              <span>{statusBanner.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="underline opacity-75 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-3 border-b border-amber-900/40 pb-4 font-code text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-bold transition ${
              activeTab === 'projects'
                ? 'border-amber-400 bg-amber-500 text-black'
                : 'border-amber-900/50 bg-[#120e0a] text-amber-200 hover:border-amber-500'
            }`}
          >
            <FolderKanban className="h-4 w-4" />
            <span>PROJECTS ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-bold transition ${
              activeTab === 'skills'
                ? 'border-amber-400 bg-amber-500 text-black'
                : 'border-amber-900/50 bg-[#120e0a] text-amber-200 hover:border-amber-500'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>SKILL CATEGORIES ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guestbook')}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-bold transition ${
              activeTab === 'guestbook'
                ? 'border-amber-400 bg-amber-500 text-black'
                : 'border-amber-900/50 bg-[#120e0a] text-amber-200 hover:border-amber-500'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>GUESTBOOK ({guestbook.length})</span>
          </button>
        </div>

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveProject}
              className="lg:col-span-5 rounded-3xl border border-amber-700/50 bg-[#0e0b08] p-6 space-y-4 font-code text-xs h-fit"
            >
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                <h2 className="text-base font-extrabold text-amber-100">
                  {isEditingProject ? 'UPDATE PROJECT' : 'CREATE NEW PROJECT'}
                </h2>
                {isEditingProject && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProject(false);
                      setProjectForm(EMPTY_PROJECT_FORM);
                    }}
                    className="text-amber-400 underline"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-amber-300">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.name}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, name: e.target.value })
                    }
                    placeholder="MedAura"
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-amber-300">Role *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.role}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, role: e.target.value })
                    }
                    placeholder="Backend Architect"
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-amber-300">Period</label>
                  <input
                    type="text"
                    value={projectForm.period}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, period: e.target.value })
                    }
                    placeholder="2026"
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-amber-300">Project Type</label>
                  <input
                    type="text"
                    value={projectForm.type}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, type: e.target.value })
                    }
                    placeholder="Commercial Platform"
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-amber-300">Image Path / URL</label>
                  <input
                    type="text"
                    value={projectForm.imageUrl}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, imageUrl: e.target.value })
                    }
                    placeholder="/assets/images/relic-medaura.png"
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-amber-300">
                    Live URL (Absolute URI)
                  </label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, liveUrl: e.target.value })
                    }
                    placeholder="https://torostack.me/"
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-amber-300">
                  Secret Architecture Summary
                </label>
                <input
                  type="text"
                  value={projectForm.secretArchitecture}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      secretArchitecture: e.target.value,
                    })
                  }
                  placeholder="FFmpeg HLS + Device-Binding + Cloudflare R2"
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>

              <div>
                <label className="block mb-1 text-amber-300">
                  CQRS &amp; DB Pipeline Diagram
                </label>
                <input
                  type="text"
                  value={projectForm.schemaDiagram}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      schemaDiagram: e.target.value,
                    })
                  }
                  placeholder="[Client] -> [MediatR Command] -> [SQL Server]"
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>

              <div>
                <label className="block mb-1 text-amber-300">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detailed overview of the project..."
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>

              <div>
                <label className="block mb-1 text-amber-300">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={projectForm.techStacksText}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      techStacksText: e.target.value,
                    })
                  }
                  placeholder=".NET 9, ASP.NET Core, EF Core, SQL Server, SignalR"
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>

              <div>
                <label className="block mb-1 text-amber-300">
                  Deep Dive Specs (One bullet per line)
                </label>
                <textarea
                  rows={4}
                  value={projectForm.deepDiveSpecsText}
                  onChange={(e) =>
                    setProjectForm({
                      ...projectForm,
                      deepDiveSpecsText: e.target.value,
                    })
                  }
                  placeholder={
                    'Real-time seat reservation locks via SignalR.\nBuilt with Clean Architecture and MediatR.'
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-extrabold text-black hover:bg-amber-400 transition disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                <span>
                  {isEditingProject ? 'SAVE CHANGES' : 'CREATE PROJECT'}
                </span>
              </button>
            </form>

            <div className="lg:col-span-7 space-y-4">
              {projects.length === 0 ? (
                <div className="rounded-3xl border border-amber-900/40 bg-[#0e0b08] p-8 text-center font-code text-xs text-amber-300/80">
                  No projects in SQL Server yet. Click &quot;Seed Default Portfolio
                  Data&quot; in the top bar or create one using the form.
                </div>
              ) : (
                projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-2xl border border-amber-800/50 bg-[#0e0b08] p-5 flex flex-col justify-between gap-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="font-code text-xs text-amber-400">
                          {proj.role} • {proj.period}
                        </span>
                        <h3 className="text-xl font-extrabold text-amber-50">
                          {proj.name}
                        </h3>
                        <p className="font-code text-xs text-emerald-400">
                          {proj.type}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 font-code text-xs">
                        <button
                          type="button"
                          onClick={() => handleEditProjectClick(proj)}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-500/50 bg-amber-950/40 px-3 py-1.5 text-amber-200 hover:bg-amber-500 hover:text-black"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void handleDeleteProject(proj.id, proj.name)
                          }
                          className="inline-flex items-center gap-1 rounded-lg border border-red-600/50 bg-red-950/40 px-3 py-1.5 text-red-200 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#d8cebc]">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {(proj.techStacks ?? []).map((t) => (
                        <span
                          key={t}
                          className="rounded border border-amber-800/50 bg-black px-2 py-0.5 font-code text-[11px] text-amber-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6 font-code text-xs">
              <form
                onSubmit={handleSaveCategory}
                className="rounded-3xl border border-amber-700/50 bg-[#0e0b08] p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                  <h2 className="text-sm font-extrabold text-amber-100">
                    {categoryId ? 'UPDATE SKILL CATEGORY' : 'NEW SKILL CATEGORY'}
                  </h2>
                  {categoryId && (
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryId(null);
                        setCategoryName('');
                        setCategoryRune('⚡');
                      }}
                      className="text-amber-400 underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block mb-1 text-amber-300">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Backend Core"
                      className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-amber-300">Symbol</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={categoryRune}
                      onChange={(e) => setCategoryRune(e.target.value)}
                      placeholder="⚙️"
                      className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-amber-500 py-2.5 font-extrabold text-black hover:bg-amber-400"
                >
                  {categoryId ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
                </button>
              </form>

              <form
                onSubmit={handleAddSkillItem}
                className="rounded-3xl border border-amber-700/50 bg-[#0e0b08] p-6 space-y-4"
              >
                <h2 className="text-sm font-extrabold text-amber-100 border-b border-amber-900/40 pb-3">
                  ADD SKILL ITEM TO CATEGORY
                </h2>

                <div>
                  <label className="block mb-1 text-amber-300">
                    Select Category *
                  </label>
                  <select
                    required
                    value={selectedCategoryIdForSkill}
                    onChange={(e) =>
                      setSelectedCategoryIdForSkill(e.target.value)
                    }
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.runeSymbol} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-amber-300">Skill Name *</label>
                  <input
                    type="text"
                    required
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Hangfire"
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || categories.length === 0}
                  className="w-full rounded-xl bg-emerald-500 py-2.5 font-extrabold text-black hover:bg-emerald-400 disabled:opacity-50"
                >
                  ADD SKILL ITEM
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-amber-800/50 bg-[#0e0b08] p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.runeSymbol}</span>
                      <h3 className="font-bold text-amber-100">{cat.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 font-code text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryId(cat.id);
                          setCategoryName(cat.name);
                          setCategoryRune(cat.runeSymbol);
                        }}
                        className="rounded border border-amber-600/50 px-2 py-1 text-amber-300 hover:bg-amber-500 hover:text-black"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void handleDeleteCategory(cat.id, cat.name)
                        }
                        className="rounded border border-red-600/50 px-2 py-1 text-red-300 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(cat.skills ?? []).map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-700/40 bg-[#19130d] px-2.5 py-1 font-code text-xs text-amber-100"
                      >
                        <span>{item.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            void handleDeleteSkillItem(item.id, item.name)
                          }
                          className="text-red-400 hover:text-red-300 font-bold"
                          title="Delete skill"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guestbook' && (
          <div className="space-y-3">
            {guestbook.length === 0 ? (
              <div className="rounded-3xl border border-amber-900/40 bg-[#0e0b08] p-8 text-center font-code text-xs text-amber-300/80">
                No guestbook messages found in SQL Server.
              </div>
            ) : (
              guestbook.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-amber-800/40 bg-[#0e0b08] p-4 font-code text-xs"
                >
                  <div className="space-y-1">
                    <div className="text-amber-400 font-bold">
                      {entry.explorerName}{' '}
                      <span className="text-amber-200/70 font-normal">
                        ({entry.guildOrCompany || 'Visitor'})
                      </span>
                    </div>
                    <p className="text-amber-100">{entry.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDeleteGuestbookEntry(entry.id)}
                    className="shrink-0 inline-flex items-center gap-1 rounded-xl border border-red-600/50 bg-red-950/40 px-3 py-2 text-red-200 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;