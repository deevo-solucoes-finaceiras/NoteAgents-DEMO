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
} from "lucide-react";
import { ProjectsService } from "../../lib/api/services";
import { Project, ProjectStatus } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { useAppStore } from "../../stores/useAppStore";
import { CreateProjectSchema } from "../../schemas";
import { cn, formatRelativeTime } from "../../lib/utils";

export function ProjectsView() {
  const { setCurrentPath, setCurrentProjectId, addToast } = useAppStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"todos" | "em_andamento" | "planejamento" | "concluido">("todos");
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("Fintech");
  const [formStack, setFormStack] = useState("TypeScript, React, PostgreSQL");
  const [formError, setFormError] = useState<string | null>(null);

  const loadProjects = async () => {
    const list = await ProjectsService.list();
    setProjects(list);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesFilter = filter === "todos" || p.status === filter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreate = async (e: React.FormEvent) => {
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
      addToast(`Projeto "${created.name}" criado com sucesso!`, "success");
      setIsCreateModalOpen(false);
      setFormName("");
      setFormDescription("");
      loadProjects();
    } catch {
      setFormError("Falha ao criar projeto.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await ProjectsService.delete(deleteTarget.id);
    addToast(`Projeto "${deleteTarget.name}" removido.`, "info");
    setDeleteTarget(null);
    loadProjects();
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

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Novo Projeto
        </button>
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
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5",
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

      {/* Projects List (Panel 2 from Mockup) */}
      <div className="space-y-2.5">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-blue-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative group"
          >
            <div
              onClick={() => {
                setCurrentProjectId(project.id);
                setCurrentPath(`/projects/${project.id}`);
              }}
              className="flex items-center gap-3.5 cursor-pointer flex-1 min-w-0"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {project.name}
                  </h3>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500">{project.category}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Code2 className="w-3 h-3 text-slate-400" />
                    {project.stack.slice(0, 3).join(", ")}
                  </span>
                  <span>·</span>
                  <span>Atualizado {formatRelativeTime(project.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Right Meta and Actions */}
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <StatusBadge variant={project.status} />

              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                  {project.health}%
                </span>
                <span className="text-[10px] text-slate-400">Health</span>
              </div>

              {/* Kebab Action Menu */}
              <div className="relative">
                <button
                  onClick={() => setActiveMenuId(activeMenuId === project.id ? null : project.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
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
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-xl z-40 p-1.5 text-xs space-y-0.5 animate-in fade-in duration-100">
                      <button
                        onClick={() => {
                          setCurrentProjectId(project.id);
                          setCurrentPath(`/projects/${project.id}`);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 text-left"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        Abrir Workspace
                      </button>
                      <button
                        onClick={() => {
                          ProjectsService.updateStatus(
                            project.id,
                            project.status === "concluido" ? "em_andamento" : "concluido"
                          );
                          loadProjects();
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 text-left"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                        Alternar Status
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(project);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        Excluir Projeto
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Novo Projeto</h3>
                <p className="text-xs text-slate-500">Cadastre um workspace para supervisão de IA</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
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
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Criar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Excluir Projeto"
        description={`Tem certeza que deseja excluir o projeto "${deleteTarget?.name}"? Esta ação removerá os registros de auditoria e configurações associadas.`}
        confirmLabel="Sim, excluir"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
