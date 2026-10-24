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
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  UserCheck,
  Swords,
  FileText,
} from 'lucide-react';
import {
  portfolioApi,
  tokenStorage,
  type ApiPortfolioProfileDto,
  type ApiProjectDto,
  type ApiSkillCategoryDto,
  type ApiBossActionDto,
  type ApiGuestbookEntryDto,
  type ProjectUpsertPayload,
} from '../../services/portfolioApi';
import { HUSSEIN_DATA } from '../../data/portfolioFallback';

interface AdminDashboardProps {
  readonly onExitAdmin: () => void;
  readonly onDataMutated: () => Promise<void>;
}

type AdminTab = 'profile' | 'projects' | 'skills' | 'challenge' | 'guestbook';

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
  imageUrl: '',
  secretArchitecture: '',
  schemaDiagram: '',
  description: '',
  liveUrl: '',
  deepDiveSpecsText: '',
  techStacksText: '',
};

const DEFAULT_PROFILE_FORM: ApiPortfolioProfileDto = {
  name: HUSSEIN_DATA.hero.name,
  title: HUSSEIN_DATA.hero.title,
  location: HUSSEIN_DATA.hero.location,
  email: HUSSEIN_DATA.hero.email,
  phone: HUSSEIN_DATA.hero.phone,
  githubUrl: HUSSEIN_DATA.hero.githubUrl,
  linkedinUrl: HUSSEIN_DATA.hero.linkedinUrl,
  dungeonAvatar: HUSSEIN_DATA.hero.dungeonAvatar,
  recruiterAvatar: HUSSEIN_DATA.hero.recruiterAvatar,
  summary: HUSSEIN_DATA.hero.summary,
  educationDegree: HUSSEIN_DATA.hero.education.degree,
  educationUniversity: HUSSEIN_DATA.hero.education.university,
  educationGrade: HUSSEIN_DATA.hero.education.grade,
  cvFileUrl: '',
};

async function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image file.'));
      img.onload = () => {
        const maxDim = 900;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function readPdfFileToDataUrl(file: File): Promise<string> {
  if (file.size > 4 * 1024 * 1024) {
    throw new Error('PDF file size must be under 4 MB.');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read PDF file.'));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

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

  // Portfolio Entities State
  const [profileForm, setProfileForm] =
    useState<ApiPortfolioProfileDto>(DEFAULT_PROFILE_FORM);
  const [projects, setProjects] = useState<ApiProjectDto[]>([]);
  const [categories, setCategories] = useState<ApiSkillCategoryDto[]>([]);
  const [bossActions, setBossActions] = useState<ApiBossActionDto[]>([]);
  const [guestbook, setGuestbook] = useState<ApiGuestbookEntryDto[]>([]);

  // Project Form State
  const [projectForm, setProjectForm] =
    useState<ProjectFormState>(EMPTY_PROJECT_FORM);
  const [isEditingProject, setIsEditingProject] = useState<boolean>(false);

  // Skill Category & Item Form State
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryRune, setCategoryRune] = useState<string>('⚡');
  const [selectedCategoryIdForSkill, setSelectedCategoryIdForSkill] =
    useState<string>('');
  const [newSkillName, setNewSkillName] = useState<string>('');

  // Challenge Action Form State
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [actionLabel, setActionLabel] = useState<string>('');
  const [actionOrigin, setActionOrigin] = useState<string>('');
  const [actionImpact, setActionImpact] = useState<string>('');
  const [actionDamage, setActionDamage] = useState<number>(35);

  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => {
      document.body.classList.remove('admin-mode');
    };
  }, []);

  const showBanner = useCallback((type: 'success' | 'error', text: string) => {
    setStatusBanner({ type, text });
  }, []);

  const fetchAllAdminData = useCallback(async () => {
    try {
      const [profData, projData, catData, actData, gbData] = await Promise.all([
        portfolioApi.getProfile().catch(() => null),
        portfolioApi.getProjects(),
        portfolioApi.getSkillCategories(),
        portfolioApi.getBossActions().catch(() => []),
        portfolioApi.getGuestbookEntries(),
      ]);

      if (profData) {
        setProfileForm(profData);
      }
      setProjects(projData);
      setCategories(catData);
      setBossActions(actData);
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
      showBanner('success', 'Logged in successfully.');
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

  // Profile Handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusBanner(null);
    try {
      const updated = await portfolioApi.updateProfile(profileForm);
      setProfileForm(updated);
      await onDataMutated();
      showBanner('success', 'Profile, avatars, and CV updated successfully!');
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to update profile.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Project Handlers
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.imageUrl.trim()) {
      showBanner('error', 'Please upload a project image first.');
      return;
    }

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
    if (!window.confirm(`Delete project "${name}"?`)) return;
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

  // Skill Handlers
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

  // Challenge Action Handlers
  const handleSaveBossAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingActionId) {
        await portfolioApi.updateBossAction(editingActionId, {
          id: editingActionId,
          label: actionLabel.trim(),
          projectOrigin: actionOrigin.trim(),
          impactDescription: actionImpact.trim(),
          damage: Number(actionDamage),
        });
        showBanner('success', 'Challenge countermeasure updated.');
      } else {
        await portfolioApi.createBossAction({
          label: actionLabel.trim(),
          projectOrigin: actionOrigin.trim(),
          impactDescription: actionImpact.trim(),
          damage: Number(actionDamage),
        });
        showBanner('success', 'Challenge countermeasure created.');
      }
      setEditingActionId(null);
      setActionLabel('');
      setActionOrigin('');
      setActionImpact('');
      setActionDamage(35);
      await fetchAllAdminData();
      await onDataMutated();
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to save challenge action.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBossAction = async (id: string, label: string) => {
    if (!window.confirm(`Delete countermeasure "${label}"?`)) return;
    setIsSubmitting(true);
    try {
      await portfolioApi.deleteBossAction(id);
      showBanner('success', 'Challenge countermeasure deleted.');
      await fetchAllAdminData();
      await onDataMutated();
    } catch (err) {
      showBanner(
        'error',
        err instanceof Error ? err.message : 'Failed to delete action.'
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
        Loading...
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
                autoComplete="username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-amber-900/60 bg-black px-3.5 py-2.5 text-amber-100 placeholder-amber-700/50 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-amber-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-amber-900/60 bg-black pl-3.5 pr-10 py-2.5 text-amber-100 placeholder-amber-700/50 focus:border-amber-400 focus:outline-none"
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
                ADMIN: {adminEmail}
              </span>
              <h1 className="text-lg font-extrabold text-amber-100">
                PORTFOLIO CONTROL DASHBOARD
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-code text-xs">
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
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-bold transition ${
              activeTab === 'profile'
                ? 'border-amber-400 bg-amber-500 text-black'
                : 'border-amber-900/50 bg-[#120e0a] text-amber-200 hover:border-amber-500'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>PROFILE, AVATARS &amp; CV</span>
          </button>

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
            <span>SKILLS ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('challenge')}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-bold transition ${
              activeTab === 'challenge'
                ? 'border-amber-400 bg-amber-500 text-black'
                : 'border-amber-900/50 bg-[#120e0a] text-amber-200 hover:border-amber-500'
            }`}
          >
            <Swords className="h-4 w-4" />
            <span>SYSTEM CHALLENGE ({bossActions.length})</span>
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

        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-amber-700/50 bg-[#0e0b08] p-6 sm:p-8 space-y-6 font-code text-xs"
          >
            <h2 className="text-base font-extrabold text-amber-100 border-b border-amber-900/40 pb-3">
              EDIT HERO PROFILE, AVATARS, EDUCATION &amp; CV
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-amber-800/50 bg-black/60 p-4 space-y-3">
                <label className="block font-bold text-amber-300">
                  Explorer Avatar (Torch Mode &amp; Header Logo)
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={profileForm.dungeonAvatar}
                    alt="Explorer Avatar"
                    className="h-20 w-20 rounded-2xl border-2 border-amber-500 object-cover object-top bg-black shrink-0"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-amber-500/60 bg-amber-950/40 px-3.5 py-2.5 text-amber-200 hover:bg-amber-500 hover:text-black transition">
                    <Upload className="h-4 w-4" />
                    <span>Upload Explorer Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const dataUrl = await compressImageFileToDataUrl(file);
                          setProfileForm((prev) => ({
                            ...prev,
                            dungeonAvatar: dataUrl,
                          }));
                        } catch (err) {
                          showBanner(
                            'error',
                            err instanceof Error
                              ? err.message
                              : 'Upload failed.'
                          );
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-800/50 bg-black/60 p-4 space-y-3">
                <label className="block font-bold text-amber-300">
                  Recruiter Avatar (Full Light Mode)
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={profileForm.recruiterAvatar}
                    alt="Recruiter Avatar"
                    className="h-20 w-20 rounded-2xl border-2 border-amber-500 object-cover object-top bg-black shrink-0"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-amber-500/60 bg-amber-950/40 px-3.5 py-2.5 text-amber-200 hover:bg-amber-500 hover:text-black transition">
                    <Upload className="h-4 w-4" />
                    <span>Upload Standard Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const dataUrl = await compressImageFileToDataUrl(file);
                          setProfileForm((prev) => ({
                            ...prev,
                            recruiterAvatar: dataUrl,
                          }));
                        } catch (err) {
                          showBanner(
                            'error',
                            err instanceof Error
                              ? err.message
                              : 'Upload failed.'
                          );
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-800/50 bg-black/60 p-4 space-y-3">
                <label className="block font-bold text-amber-300">
                  Official CV (.PDF File Upload)
                </label>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/60 bg-emerald-950/40 px-3.5 py-2.5 text-emerald-200 hover:bg-emerald-500 hover:text-black transition">
                    <FileText className="h-4 w-4" />
                    <span>Upload CV (.PDF)</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const pdfDataUrl = await readPdfFileToDataUrl(file);
                          setProfileForm((prev) => ({
                            ...prev,
                            cvFileUrl: pdfDataUrl,
                          }));
                          showBanner(
                            'success',
                            `PDF "${file.name}" attached. Click SAVE PROFILE CHANGES below.`
                          );
                        } catch (err) {
                          showBanner(
                            'error',
                            err instanceof Error
                              ? err.message
                              : 'PDF upload failed.'
                          );
                        }
                      }}
                    />
                  </label>
                  <span className="text-[11px] text-amber-200/70">
                    {profileForm.cvFileUrl
                      ? '✔ Custom CV PDF attached in database'
                      : 'Using default public folder CV fallback'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-amber-300">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
              <div>
                <label className="block mb-1 text-amber-300">Job Title *</label>
                <input
                  type="text"
                  required
                  value={profileForm.title}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
              <div>
                <label className="block mb-1 text-amber-300">Location *</label>
                <input
                  type="text"
                  required
                  value={profileForm.location}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, location: e.target.value })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
              <div>
                <label className="block mb-1 text-amber-300">
                  Public Email *
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
              <div>
                <label className="block mb-1 text-amber-300">Phone *</label>
                <input
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
              <div>
                <label className="block mb-1 text-amber-300">
                  GitHub URL *
                </label>
                <input
                  type="url"
                  required
                  value={profileForm.githubUrl}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      githubUrl: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block mb-1 text-amber-300">
                  LinkedIn URL *
                </label>
                <input
                  type="url"
                  required
                  value={profileForm.linkedinUrl}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      linkedinUrl: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-amber-300">
                About / Professional Summary *
              </label>
              <textarea
                rows={3}
                required
                value={profileForm.summary}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, summary: e.target.value })
                }
                className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-amber-300">
                  Education Degree *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.educationDegree}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      educationDegree: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
              <div>
                <label className="block mb-1 text-amber-300">
                  University *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.educationUniversity}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      educationUniversity: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
              <div>
                <label className="block mb-1 text-amber-300">
                  Grade &amp; GPA *
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.educationGrade}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      educationGrade: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-xl bg-amber-500 px-8 py-3 font-extrabold text-black hover:bg-amber-400 transition disabled:opacity-50"
            >
              {isSubmitting ? 'SAVING...' : 'SAVE PROFILE CHANGES'}
            </button>
          </form>
        )}

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
                  <label className="block mb-1 text-amber-300">
                    Project Name *
                  </label>
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
                  <label className="block mb-1 text-amber-300">
                    Project Type
                  </label>
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
                  <label className="block mb-1 text-amber-300">
                    Project Image *
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/60 bg-amber-950/40 px-3 py-2 text-amber-200 hover:bg-amber-500 hover:text-black transition">
                      <Upload className="h-4 w-4" />
                      <span>Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const dataUrl =
                              await compressImageFileToDataUrl(file);
                            setProjectForm((prev) => ({
                              ...prev,
                              imageUrl: dataUrl,
                            }));
                          } catch (err) {
                            showBanner(
                              'error',
                              err instanceof Error
                                ? err.message
                                : 'Image upload failed.'
                            );
                          }
                        }}
                      />
                    </label>
                    {projectForm.imageUrl && (
                      <img
                        src={projectForm.imageUrl}
                        alt="Preview"
                        className="h-9 w-9 rounded-lg border border-amber-500/50 object-cover bg-black shrink-0"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-amber-300">
                    Live URL (Absolute URI)
                  </label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) =>
                      setProjectForm({
                        ...projectForm,
                        liveUrl: e.target.value,
                      })
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
                <label className="block mb-1 text-amber-300">
                  Description *
                </label>
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
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-amber-800/50 bg-[#0e0b08] p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {proj.imageUrl && (
                        <img
                          src={proj.imageUrl}
                          alt={proj.name}
                          className="h-14 w-14 rounded-xl border border-amber-500/40 object-cover bg-black shrink-0"
                        />
                      )}
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
              ))}
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
                    {categoryId
                      ? 'UPDATE SKILL CATEGORY'
                      : 'NEW SKILL CATEGORY'}
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
                  <label className="block mb-1 text-amber-300">
                    Skill Name *
                  </label>
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

        {activeTab === 'challenge' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveBossAction}
              className="lg:col-span-5 rounded-3xl border border-amber-700/50 bg-[#0e0b08] p-6 space-y-4 font-code text-xs h-fit"
            >
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                <h2 className="text-sm font-extrabold text-amber-100">
                  {editingActionId
                    ? 'UPDATE COUNTERMEASURE'
                    : 'ADD SYSTEM COUNTERMEASURE'}
                </h2>
                {editingActionId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingActionId(null);
                      setActionLabel('');
                      setActionOrigin('');
                      setActionImpact('');
                      setActionDamage(35);
                    }}
                    className="text-amber-400 underline"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div>
                <label className="block mb-1 text-amber-300">
                  Action Label *
                </label>
                <input
                  type="text"
                  required
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                  placeholder="Deploy Optimistic Concurrency Control"
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-amber-300">
                    Project Origin *
                  </label>
                  <input
                    type="text"
                    required
                    value={actionOrigin}
                    onChange={(e) => setActionOrigin(e.target.value)}
                    placeholder="SH-Supplements"
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-amber-300">
                    Bottleneck Damage (%) *
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    required
                    value={actionDamage}
                    onChange={(e) => setActionDamage(Number(e.target.value))}
                    className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-amber-300">
                  Impact Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={actionImpact}
                  onChange={(e) => setActionImpact(e.target.value)}
                  placeholder="Eliminated race conditions and prevented flash-sale overselling..."
                  className="w-full rounded-xl border border-amber-900/60 bg-black px-3 py-2 text-amber-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-amber-500 py-3 font-extrabold text-black hover:bg-amber-400"
              >
                {editingActionId
                  ? 'SAVE COUNTERMEASURE'
                  : 'ADD COUNTERMEASURE'}
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {bossActions.map((act) => (
                <div
                  key={act.id}
                  className="rounded-2xl border border-amber-800/50 bg-[#0e0b08] p-5 flex items-center justify-between gap-4 font-code text-xs"
                >
                  <div className="space-y-1">
                    <span className="text-amber-400 font-bold">
                      [{act.projectOrigin}] • -{act.damage}% Bottleneck HP
                    </span>
                    <h3 className="text-sm font-extrabold text-amber-50">
                      {act.label}
                    </h3>
                    <p className="text-amber-100/80">{act.impactDescription}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingActionId(act.id);
                        setActionLabel(act.label);
                        setActionOrigin(act.projectOrigin);
                        setActionImpact(act.impactDescription);
                        setActionDamage(act.damage);
                      }}
                      className="rounded-lg border border-amber-500/50 px-3 py-1.5 text-amber-200 hover:bg-amber-500 hover:text-black"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        void handleDeleteBossAction(act.id, act.label)
                      }
                      className="rounded-lg border border-red-600/50 px-3 py-1.5 text-red-200 hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
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