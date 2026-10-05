import React, { useState, useEffect } from "react";
import { FolderGit2, Check, ChevronDown, Plus, Search } from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { ProjectsService } from "../../lib/api/services";
import { Project } from "../../types";
import { cn } from "../../lib/utils";

export function ProjectSelector() {
  const { currentProjectId, setCurrentProjectId, setCurrentPath } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    ProjectsService.list().then(setProjects);
  }, [currentProjectId]);

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200/80 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300 transition-colors text-xs text-slate-800 font-medium"
      >
        <FolderGit2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="font-semibold text-slate-900 max-w-[130px] truncate">
          {currentProject?.name || "Selecionar Projeto"}
        </span>
        {currentProject && (
          <span className="hidden sm:inline-block text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-mono tabular-nums border border-emerald-200">
            {currentProject.health}%
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-xl border border-slate-200 shadow-lg z-50 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-100">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar projeto..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Project List */}
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filtered.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setCurrentProjectId(proj.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg transition-colors text-left",
                    proj.id === currentProjectId
                      ? "bg-blue-50 text-blue-900 font-medium"
                      : "hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div className="truncate">
                    <p className="font-semibold truncate">{proj.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{proj.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[10px] text-slate-500 tabular-nums">
                      {proj.health}%
                    </span>
                    {proj.id === currentProjectId && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setCurrentPath("/projects");
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Criar Novo Projeto
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
