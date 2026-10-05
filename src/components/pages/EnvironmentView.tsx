import React, { useState, useEffect } from "react";
import {
  Server,
  Play,
  CheckCircle2,
  Check,
  Cpu,
  Layers,
  Container,
  Database,
  Terminal,
  RefreshCw,
} from "lucide-react";
import { EnvironmentService } from "../../lib/api/services";
import { EnvironmentTool } from "../../types";
import { TerminalViewer } from "../ui/TerminalViewer";
import { StatusBadge } from "../ui/StatusBadge";
import { useAppStore } from "../../stores/useAppStore";
import { cn } from "../../lib/utils";

const INITIAL_LOGS = [
  "[INFO] Detectando sistema operacional e arquitetura x86_64...",
  "[INFO] Node.js v22.0.0 verificado em /usr/local/bin/node",
  "[INFO] Docker engine v26.1.0 ativo com daemon respondendo",
  "[INFO] PostgreSQL v16 conectado na porta 5432 (database: noteagents_dev)",
  "[INFO] Redis v7.2 em execução no host localhost:6379",
  "[INFO] Todas as variáveis de ambiente sanitizadas e carregadas.",
  "[INFO] Tudo pronto para execução de pipelines e testes!",
];

export function EnvironmentView() {
  const { addToast } = useAppStore();
  const [tools, setTools] = useState<EnvironmentTool[]>([]);
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);
  const [activeTab, setActiveTab] = useState<"geral" | "componentes" | "banco" | "infra">("geral");
  const [isExecutingSetup, setIsExecutingSetup] = useState(false);

  useEffect(() => {
    EnvironmentService.listTools().then(setTools);
  }, []);

  const handleExecuteSetup = async () => {
    setIsExecutingSetup(true);
    addToast("Executando Setup Automático do Ambiente...", "info");

    const newLogs = [
      "[INFO] Iniciando rotina de setup do ambiente...",
      "[INFO] Validando integridade de pacotes e lockfile...",
      "[INFO] Executando 'docker-compose up -d postgres redis'...",
      "[INFO] Aguardando healthcheck das portas 5432 e 6379...",
      "[INFO] Verificando compatibilidade dos Language Server Protocols...",
      "[INFO] Setup finalizado com sucesso em 1.4s.",
    ];

    setTimeout(() => {
      setLogs((prev) => [...prev, ...newLogs]);
      setIsExecutingSetup(false);
      addToast("Setup concluído com 100% de sucesso!", "success");
    }, 1200);
  };

  const getToolIcon = (name: string) => {
    if (name.includes("Node")) return <Cpu className="w-5 h-5 text-emerald-600" />;
    if (name.includes("Docker")) return <Container className="w-5 h-5 text-blue-600" />;
    if (name.includes("Postgre")) return <Database className="w-5 h-5 text-blue-700" />;
    if (name.includes("Redis")) return <Database className="w-5 h-5 text-rose-600" />;
    return <Server className="w-5 h-5 text-slate-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header (Panel 8) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Ambiente de Desenvolvimento
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ambiente Automático com auto-detecção, isolamento de containers e validação
          </p>
        </div>

        <button
          onClick={handleExecuteSetup}
          disabled={isExecutingSetup}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          {isExecutingSetup ? "Executando Setup..." : "Executar Setup"}
        </button>
      </div>

      {/* Tabs (Panel 8 from Mockup) */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium">
        {[
          { id: "geral", label: "Visão Geral" },
          { id: "componentes", label: "Componentes" },
          { id: "banco", label: "Banco de Dados" },
          { id: "infra", label: "Infraestrutura" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 Tool Cards (Node.js, Docker, PostgreSQL, Redis) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className="bg-white rounded-xl border border-slate-200/90 p-4 space-y-2.5 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                {getToolIcon(tool.name)}
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-slate-900">{tool.name}</h3>
                <span className="text-[11px] font-mono text-slate-400">{tool.version}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                {tool.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Setup Checklist + Terminal Console Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Checklist Setup (Panel 8 left) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Checklist de Setup
            </h3>
            <p className="text-xs text-slate-500">
              Etapas validadas pelo Environment Agent
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              "Detecta ambiente",
              "Instala dependências",
              "Configura ferramentas",
              "Valida instalação",
              "Testa conectividade",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-slate-700">
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleExecuteSetup}
              disabled={isExecutingSetup}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              {isExecutingSetup ? "Executando..." : "Executar Setup"}
            </button>
          </div>
        </div>

        {/* Terminal Viewer (Panel 8 right) */}
        <div className="lg:col-span-2">
          <TerminalViewer
            logs={logs}
            title="Console do Ambiente Automático"
            onClear={() => setLogs([])}
          />
        </div>
      </div>
    </div>
  );
}
