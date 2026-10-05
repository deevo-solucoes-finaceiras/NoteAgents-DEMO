import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Download,
  FolderGit2,
  Bot,
  Blocks,
  Terminal,
  ChevronRight,
  ExternalLink,
  Code2,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { cn } from "../../lib/utils";

export function DocsView() {
  const { setCurrentPath } = useAppStore();
  const [activeTopic, setActiveTopic] = useState("introducao");
  const [search, setSearch] = useState("");

  const topics = [
    { id: "introducao", label: "Introdução" },
    { id: "instalacao", label: "Instalação" },
    { id: "guias", label: "Guias" },
    { id: "api-reference", label: "API Reference" },
    { id: "cli", label: "CLI" },
    { id: "agentes", label: "Agentes" },
    { id: "integracoes", label: "Integrações" },
    { id: "tutoriais", label: "Tutoriais" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="space-y-6">
      {/* Header (Panel 13) */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Documentação
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Guias de arquitetura, referências de API e protocolos do NoteAgents
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Docs Sidebar Navigation (Panel 13 left) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-2 space-y-1 h-fit">
          <div className="p-2 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar na documentação..."
                className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-1 space-y-0.5">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left flex items-center justify-between",
                  activeTopic === t.id
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span>{t.label}</span>
                {activeTopic === t.id && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        {/* Docs Main Content (Panel 13 right) */}
        <div className="md:col-span-3 bg-white rounded-xl border border-slate-200/90 p-6 space-y-6">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
              Guia de Início
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Comece aqui</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Aprenda a usar o NoteAgents em poucos minutos.
            </p>
          </div>

          {/* 4 Quick Start Cards (Panel 13) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setCurrentPath("/environment")}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Instalação
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure o ambiente e dependências locais
              </p>
            </div>

            <div
              onClick={() => setCurrentPath("/projects")}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Primeiro Projeto
              </h3>
              <p className="text-[11px] text-slate-500">
                Crie seu primeiro projeto sob supervisão de agentes
              </p>
            </div>

            <div
              onClick={() => setCurrentPath("/agents")}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                Agentes de IA
              </h3>
              <p className="text-[11px] text-slate-500">
                Conheça os agentes especialistas e políticas de autonomia
              </p>
            </div>

            <div
              onClick={() => setCurrentPath("/integrations")}
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Blocks className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Integrações
              </h3>
              <p className="text-[11px] text-slate-500">
                Conecte suas ferramentas: GitHub, Vercel, MCP e LSP
              </p>
            </div>
          </div>

          {/* Quick CLI Code Block */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800">
              Instalação da CLI NoteAgents
            </h4>
            <div className="p-3 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs flex items-center justify-between">
              <code>npm install -g @noteagents/cli</code>
              <span className="text-[11px] text-slate-400">v1.4.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
