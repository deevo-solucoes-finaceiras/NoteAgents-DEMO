import React, { useState, useEffect } from "react";
import {
  Search,
  FolderGit2,
  Bot,
  ShieldCheck,
  Server,
  Database,
  Blocks,
  Workflow,
  Sparkles,
  Settings,
  HelpCircle,
  Play,
  X,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { cn } from "../../lib/utils";

interface CommandItem {
  id: string;
  category: "Páginas" | "Ações Rápidas" | "Projetos";
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    setCurrentPath,
    setCurrentProjectId,
    addToast,
  } = useAppStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global keyboard shortcut listener for ⌘K and Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  const items: CommandItem[] = [
    // Pages
    { id: "p-dash", category: "Páginas", title: "Ir para Dashboard", icon: Server, action: () => setCurrentPath("/dashboard") },
    { id: "p-proj", category: "Páginas", title: "Ir para Projetos", icon: FolderGit2, action: () => setCurrentPath("/projects") },
    { id: "p-chat", category: "Páginas", title: "Abrir Chat com IA", icon: Sparkles, action: () => setCurrentPath("/chat") },
    { id: "p-audit", category: "Páginas", title: "Resultados da Auditoria", icon: ShieldCheck, action: () => setCurrentPath("/audits") },
    { id: "p-agent", category: "Páginas", title: "Ver Agentes de IA", icon: Bot, action: () => setCurrentPath("/agents") },
    { id: "p-pipe", category: "Páginas", title: "Pipelines de Execução", icon: Workflow, action: () => setCurrentPath("/pipelines") },
    { id: "p-env", category: "Páginas", title: "Ambiente de Desenvolvimento", icon: Server, action: () => setCurrentPath("/environment") },
    { id: "p-db", category: "Páginas", title: "Banco de Dados & Tabelas", icon: Database, action: () => setCurrentPath("/database") },
    { id: "p-int", category: "Páginas", title: "Central de Integrações", icon: Blocks, action: () => setCurrentPath("/integrations") },
    { id: "p-doc", category: "Páginas", title: "Documentação do Sistema", icon: HelpCircle, action: () => setCurrentPath("/documentacao") },
    { id: "p-cfg", category: "Páginas", title: "Configurações Gerais", icon: Settings, action: () => setCurrentPath("/settings") },

    // Quick Actions
    {
      id: "a-run-audit",
      category: "Ações Rápidas",
      title: "Executar Auditoria Completa",
      subtitle: "Analisa segurança, código e performance",
      icon: Play,
      action: () => {
        setCurrentPath("/audits");
        addToast("Auditoria iniciada em segundo plano.", "info");
      },
    },
    {
      id: "a-env-setup",
      category: "Ações Rápidas",
      title: "Executar Setup de Ambiente",
      subtitle: "Inicializa Docker compose e serviços locais",
      icon: Play,
      action: () => {
        setCurrentPath("/environment");
        addToast("Setup de ambiente engajado.", "info");
      },
    },

    // Projects
    {
      id: "proj-1-nav",
      category: "Projetos",
      title: "ViaPay (SaaS financeiro)",
      subtitle: "Health: 91% · 3 apontamentos",
      icon: FolderGit2,
      action: () => {
        setCurrentProjectId("proj-1");
        setCurrentPath("/dashboard");
        addToast("Projeto ViaPay selecionado.", "info");
      },
    },
    {
      id: "proj-2-nav",
      category: "Projetos",
      title: "E-commerce Headless",
      subtitle: "Health: 78% · 7 apontamentos",
      icon: FolderGit2,
      action: () => {
        setCurrentProjectId("proj-2");
        setCurrentPath("/dashboard");
        addToast("Projeto E-commerce selecionado.", "info");
      },
    },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    setCommandPaletteOpen(false);
    setQuery("");
    item.action();
  };

  const handleKeyDownNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownNav}
            placeholder="Digite um comando, projeto ou página..."
            className="w-full pl-3 pr-2 text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              Nenhum comando encontrado para "{query}".
            </p>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors",
                    isSelected ? "bg-blue-50 text-blue-900" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4", isSelected ? "text-blue-600" : "text-slate-400")} />
                    <div>
                      <span className="font-semibold block">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-[10px] text-slate-400">{item.subtitle}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{item.category}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ para navegar</span>
            <span>↵ para executar</span>
            <span>esc para fechar</span>
          </div>
          <span className="font-mono">NoteAgents OS</span>
        </div>
      </div>
    </div>
  );
}
