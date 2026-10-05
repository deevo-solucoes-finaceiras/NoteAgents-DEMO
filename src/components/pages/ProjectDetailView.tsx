import React, { useState, useEffect } from "react";
import {
  FolderGit2,
  GitBranch,
  Bot,
  ShieldCheck,
  FileCode,
  Sliders,
  Play,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { ProjectsService, AgentsService, AuditsService } from "../../lib/api/services";
import { Project, Agent, AuditRecord } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";
import { ScoreGauge } from "../ui/ScoreGauge";
import { useAppStore } from "../../stores/useAppStore";
import { formatRelativeTime } from "../../lib/utils";

export function ProjectDetailView({ projectId }: { projectId: string }) {
  const { setCurrentPath, addToast } = useAppStore();
  const [project, setProject] = useState<Project | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [audit, setAudit] = useState<AuditRecord | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "agents" | "audits" | "workspace">("overview");

  useEffect(() => {
    Promise.all([
      ProjectsService.getById(projectId),
      AgentsService.list(),
      AuditsService.getLatest(),
    ]).then(([p, a, aud]) => {
      setProject(p);
      setAgents(a);
      setAudit(aud);
    });
  }, [projectId]);

  if (!project) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">Projeto não encontrado.</p>
        <button
          onClick={() => setCurrentPath("/projects")}
          className="mt-3 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg"
        >
          Voltar para Projetos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation Back */}
      <button
        onClick={() => setCurrentPath("/projects")}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar para todos os projetos
      </button>

      {/* Project Banner Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-slate-900">{project.name}</h1>
              <StatusBadge variant={project.status} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{project.description}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
              <span>Stack: {project.stack.join(" · ")}</span>
              <span>·</span>
              <span>Health: {project.health}%</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setCurrentPath("/chat");
              addToast(`Iniciando sessão de chat no contexto de ${project.name}`, "info");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            Engajar Agente
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium">
        {[
          { id: "overview", label: "Visão Geral" },
          { id: "agents", label: `Agentes (${agents.length})` },
          { id: "audits", label: "Auditoria & Achados" },
          { id: "workspace", label: "Workspace & Diretórios" },
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

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Topologia do Workspace
              </h3>
              <div className="text-xs space-y-2 text-slate-600">
                <p>
                  <strong>Caminho Local:</strong>{" "}
                  <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono">
                    {project.workspacePath || `/workspaces/${project.slug}`}
                  </code>
                </p>
                <p>
                  <strong>Repositório:</strong>{" "}
                  <a
                    href={project.repoUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    {project.repoUrl || "git@github.com:noteagents/viapay.git"}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
                <p>
                  <strong>Última Sincronização:</strong>{" "}
                  {formatRelativeTime(project.updatedAt)}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Histórico Recente de Verificações
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-800">
                      Pipeline CI/CD executado com sucesso
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono">Há 1h</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-amber-800">
                      3 apontamentos críticos pendentes de aprovação
                    </span>
                  </div>
                  <span className="text-amber-700 font-mono">Há 3h</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            {audit && (
              <ScoreGauge
                score={audit.score}
                label="Score de Produção"
                categories={audit.categories.slice(0, 4)}
                onClick={() => setActiveTab("audits")}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === "agents" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((ag) => (
            <div
              key={ag.id}
              className="bg-white rounded-xl border border-slate-200 p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{ag.name}</h4>
                <StatusBadge variant="ativo" />
              </div>
              <p className="text-xs text-slate-500">{ag.description}</p>
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Modelo: {ag.model} · Autonomia: Nível {ag.autonomyLevel}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "audits" && audit && (
        <div className="space-y-4">
          <ScoreGauge
            score={audit.score}
            label="Auditoria Geral"
            categories={audit.categories}
          />
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Apontamentos Críticos
            </h3>
            {audit.findings.map((f) => (
              <div
                key={f.id}
                className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900">{f.title}</span>
                  <StatusBadge variant="critico" />
                </div>
                <p className="text-rose-800">{f.description}</p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Arquivo: {f.affectedFile}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "workspace" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Estrutura de Pastas</h3>
          <pre className="p-4 bg-slate-950 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
{`viapay/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   └── webhooks/
│   ├── server/
│   │   └── auth-proxy.ts
│   └── db/
│       └── migrations/
├── package.json
└── docker-compose.yml`}
          </pre>
        </div>
      )}
    </div>
  );
}
