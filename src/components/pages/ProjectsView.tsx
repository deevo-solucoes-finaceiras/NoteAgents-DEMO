import React, { useState, useEffect } from "react";
import {
  FolderGit2,
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  Trash2,
  CheckCircle,
  Archive,
  X,
  Code2,
  GitBranch,
  Github,
  Terminal,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
} from "lucide-react";
import { ProjectsService } from "../../lib/api/services";
import { Project, ProjectStatus } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useAppStore } from "../../stores/useAppStore";
import { CreateProjectSchema } from "../../schemas";
import { db, auth } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { cn, formatRelativeTime } from "../../lib/utils";

export function ProjectsView() {
  const { setCurrentPath, setCurrentProjectId, addToast } = useAppStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"todos" | "em_andamento" | "planejamento" | "concluido">("todos");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"git" | "manual">("git");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Manual Form State
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Fintech");
  const [formStack, setFormStack] = useState("TypeScript, React, PostgreSQL");
  const [formError, setFormError] = useState<string | null>(null);

  // Git Import Form State
  const [gitUrl, setGitUrl] = useState("https://github.com/octocat/Hello-World.git");
  const [gitBranch, setGitBranch] = useState("master");
  const [gitCustomName, setGitCustomName] = useState("");
  const [gitCategory, setGitCategory] = useState("Fintech");
  const [isCloning, setIsCloning] = useState(false);
  const [gitStatusMessage, setGitStatusMessage] = useState<string | null>(null);

  const loadProjects = async () => {
    const list = await ProjectsService.list();
    setProjects(list);
  };

  useEffect(() => {
    loadProjects();

    // Realtime Firestore sync when authenticated
    let unsubscribe: (() => void) | undefined;
    if (auth.currentUser) {
      try {
        unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((doc) => doc.data() as Project);
            setProjects(list);
          }
        });
      } catch (err) {
        console.warn("Firestore snapshot listener failed:", err);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === "todos" || p.status === filter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = CreateProjectSchema.safeParse({
      name: formName,
      description: formDescription,
      category: formCategory,
      stack: formStack.split(",").map((s) => s.trim()).filter(Boolean),
    });

    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || "Dados inválidos");
      return;
    }

    try {
      const created = await ProjectsService.create(validation.data);
      addToast(`Projeto "${created.name}" criado com sucesso no Firestore!`, "success");
      setIsCreateModalOpen(false);
      setFormName("");
      setFormDescription("");
      loadProjects();
    } catch {
      setFormError("Falha ao criar projeto.");
    }
  };

  const handleGitImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setGitStatusMessage("Conectando ao Git e clonando repositório...");
    setIsCloning(true);

    try {
      const imported = await ProjectsService.importFromGit({
        repoUrl: gitUrl,
        branch: gitBranch || "main",
        customName: gitCustomName || undefined,
        category: gitCategory,
      });

      addToast(
        `Repositório "${imported.name}" importado e analisado com sucesso!`,
        "success"
      );
      setIsCreateModalOpen(false);
      setGitStatusMessage(null);
      setCurrentProjectId(imported.id);
      loadProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao clonar repositório Git.";
      setFormError(msg);
      setGitStatusMessage(null);
    } finally {
      setIsCloning(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await ProjectsService.delete(deleteTarget.id);
      addToast(`Projeto "${deleteTarget.name}" removido com sucesso.`, "info");
      setDeleteTarget(null);
      loadProjects();
    } catch {
      addToast("Erro ao excluir projeto.", "error");
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      await ProjectsService.updateStatus(projectId, newStatus);
      addToast(`Status do projeto atualizado para "${newStatus}".`, "success");
      setActiveMenuId(null);
      loadProjects();
    } catch {
      addToast("Erro ao atualizar status.", "error");
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProjectId(project.id);
    setCurrentPath(`/projects/${project.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Projetos
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerenciamento e topologia de workspaces sob supervisão dos agentes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCreateMode("git");
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <GitBranch className="w-3.5 h-3.5 text-blue-400" />
            <span>Subir via Git</span>
          </button>

          <button
            onClick={() => {
              setCreateMode("manual");
              setIsCreateModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Projeto</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200/90">
        {/* Interactive Filter Control */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "todos", label: "Todos", count: projects.length },
            { id: "em_andamento", label: "Em Andamento", count: projects.filter((p) => p.status === "em_andamento").length },
            { id: "planejamento", label: "Planejamento", count: projects.filter((p) => p.status === "planejamento").length },
            { id: "concluido", label: "Concluídos", count: projects.filter((p) => p.status === "concluido").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer",
                filter === tab.id
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou stack..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-2.5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition-all hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left zone: Folder Icon, Name, Category, Description */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    onClick={() => handleSelectProject(project)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {project.name}
                  </h3>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {project.category}
                  </span>
                  <StatusBadge status={project.status} />
                  {project.repoUrl && (
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                      <GitBranch className="w-3 h-3 text-slate-400" />
                      Git Conectado
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {project.description}
                </p>

                {/* Stack Tags */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right zone: Metrics, Time & Action Menu */}
            <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-right">
                <div className="text-[11px] text-slate-400">Score de Saúde</div>
                <div className="text-xs font-bold text-slate-800 font-mono">
                  {project.health}%
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400">Auditoria</div>
                <div className="text-xs font-bold text-blue-600 font-mono">
                  {project.lastAuditScore || 85}/100
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <div className="text-[11px] text-slate-400">Atualizado</div>
                <div className="text-xs text-slate-600">
                  {formatRelativeTime(project.updatedAt)}
                </div>
              </div>

              {/* Action Menu Popover */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveMenuId(activeMenuId === project.id ? null : project.id)
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Ações do projeto"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {activeMenuId === project.id && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setActiveMenuId(null)}
                    />
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-xl z-40 p-1 space-y-0.5 animate-in fade-in duration-100 text-xs">
                      <button
                        onClick={() => handleSelectProject(project)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        Abrir Workspace
                      </button>

                      <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        Mudar Status
                      </div>

                      <button
                        onClick={() => handleStatusChange(project.id, "em_andamento")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                        Em Andamento
                      </button>

                      <button
                        onClick={() => handleStatusChange(project.id, "concluido")}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5 text-emerald-500" />
                        Concluir
                      </button>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            setDeleteTarget(project);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          Excluir Projeto
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              Nenhum projeto encontrado
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Não encontramos projetos com os filtros atuais. Suba um novo repositório Git ou crie manualmente.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setCreateMode("git");
                  setIsCreateModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                Subir Projeto via Git
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Subir via Git / Criar Manualmente */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {createMode === "git" ? "Subir Projeto via Git" : "Novo Workspace"}
                </h3>
                <p className="text-xs text-slate-500">
                  {createMode === "git"
                    ? "Clonagem e análise estática real de repositório"
                    : "Configuração manual de workspace assistido"}
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setCreateMode("git");
                  setFormError(null);
                }}
                className={cn(
                  "py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                  createMode === "git"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                <span>Importar via Git</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreateMode("manual");
                  setFormError(null);
                }}
                className={cn(
                  "py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                  createMode === "manual"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Plus className="w-3.5 h-3.5 text-slate-600" />
                <span>Manual</span>
              </button>
            </div>

            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {/* Git Import Form */}
            {createMode === "git" ? (
              <form onSubmit={handleGitImport} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    URL do Repositório Git (HTTPS)
                  </label>
                  <div className="relative">
                    <Github className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="url"
                      required
                      value={gitUrl}
                      onChange={(e) => setGitUrl(e.target.value)}
                      placeholder="https://github.com/usuario/repositorio.git"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Suporta GitHub, GitLab, Bitbucket ou qualquer servidor Git público.
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Branch
                    </label>
                    <div className="relative">
                      <GitBranch className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={gitBranch}
                        onChange={(e) => setGitBranch(e.target.value)}
                        placeholder="main ou master"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Categoria
                    </label>
                    <select
                      value={gitCategory}
                      onChange={(e) => setGitCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    >
                      <option value="Fintech">Fintech</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Core Engine">Core Engine</option>
                      <option value="Web">Web</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome Customizado (opcional)
                  </label>
                  <input
                    type="text"
                    value={gitCustomName}
                    onChange={(e) => setGitCustomName(e.target.value)}
                    placeholder="Deixe em branco para inferir do repositório"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>

                {gitStatusMessage && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                    <span>{gitStatusMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isCloning || !gitUrl.trim()}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCloning ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Clonando & Analisando...</span>
                      </>
                    ) : (
                      <>
                        <span>Clonar & Subir Projeto</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Manual Form */
              <form onSubmit={handleManualCreate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nome do Projeto
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: ViaPay Core"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Ex: SaaS financeiro e gateway de pagamentos corporativo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Categoria
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    >
                      <option value="Fintech">Fintech</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Core Engine">Core Engine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Stack (separada por vírgulas)
                    </label>
                    <input
                      type="text"
                      value={formStack}
                      onChange={(e) => setFormStack(e.target.value)}
                      placeholder="TypeScript, Next.js, Docker"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
                  >
                    Criar Projeto
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Excluir Projeto"
        description={`Tem certeza que deseja excluir o projeto "${deleteTarget?.name}"? Esta ação removerá os registros no Firestore e arquivos do workspace.`}
        confirmLabel="Sim, excluir"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
