import React, { useEffect, useState } from "react";
import {
  FolderGit2,
  Bot,
  Zap,
  CheckCircle2,
  ChevronRight,
  Play,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Layers,
} from "lucide-react";
import { MetricCard } from "../ui/MetricCard";
import { ScoreGauge } from "../ui/ScoreGauge";
import { AreaChartVisual } from "../ui/AreaChartVisual";
import { StatusBadge } from "../ui/StatusBadge";
import { ProjectsService, AgentsService, AuditsService } from "../../lib/api/services";
import { Project, Agent, AuditRecord } from "../../types";
import { useAppStore } from "../../stores/useAppStore";
import { LoadingSkeleton } from "../ui/LoadingSkeleton";
import { formatRelativeTime } from "../../lib/utils";

export function DashboardView() {
  const { setCurrentPath, setCurrentProjectId } = useAppStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [audit, setAudit] = useState<AuditRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ProjectsService.list(),
      AgentsService.list(),
      AuditsService.getLatest(),
    ]).then(([p, a, aud]) => {
      setProjects(p);
      setAgents(a);
      setAudit(aud);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSkeleton lines={8} />;
  }

  const recentProjects = projects.slice(0, 3);
  const availableAgents = agents.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Visão unificada da operação de engenharia assistida por IA
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPath("/chat")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            Abrir Chat com IA
          </button>
        </div>
      </div>

      {/* Top 4 Metrics Row (Panel 1 from Mockup) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MetricCard
          label="Projetos"
          value={projects.length}
          icon={<FolderGit2 className="w-5 h-5 text-blue-600" />}
          iconColorClass="bg-blue-50 text-blue-600 border-blue-100"
          onClick={() => setCurrentPath("/projects")}
        />
        <MetricCard
          label="Agentes"
          value={agents.length}
          icon={<Bot className="w-5 h-5 text-cyan-600" />}
          iconColorClass="bg-cyan-50 text-cyan-600 border-cyan-100"
          onClick={() => setCurrentPath("/agents")}
        />
        <MetricCard
          label="Execuções"
          value={45}
          icon={<Zap className="w-5 h-5 text-purple-600" />}
          iconColorClass="bg-purple-50 text-purple-600 border-purple-100"
          onClick={() => setCurrentPath("/runs")}
        />
        <MetricCard
          label="Taxa de Sucesso"
          value="94%"
          trend="+2.4%"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          iconColorClass="bg-emerald-50 text-emerald-600 border-emerald-100"
          onClick={() => setCurrentPath("/evidence")}
        />
      </div>

      {/* Middle Row: Area Chart + Score Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <AreaChartVisual />
        </div>

        <div className="flex flex-col">
          {audit && (
            <div className="flex-1 flex flex-col justify-between">
              <ScoreGauge
                score={audit.score}
                label="Pronto para produção"
                categories={audit.categories}
                onClick={() => setCurrentPath("/audits")}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Agentes Disponíveis + Projetos Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Agentes Disponíveis */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Agentes Disponíveis
              </h3>
              <p className="text-xs text-slate-500">
                Especialistas prontos para automação e execução
              </p>
            </div>
            <button
              onClick={() => setCurrentPath("/agents")}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ver todos ({agents.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {availableAgents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => setCurrentPath(`/agents/${agent.id}`)}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50/70 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {agent.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {agent.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge variant="ativo" label="Ativo" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projetos Recentes */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Projetos Recentes
              </h3>
              <p className="text-xs text-slate-500">
                Workspaces em andamento no control plane
              </p>
            </div>
            <button
              onClick={() => setCurrentPath("/projects")}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ver todos ({projects.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {recentProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setCurrentProjectId(proj.id);
                  setCurrentPath(`/projects/${proj.id}`);
                }}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50/70 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {proj.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge variant={proj.status} />
                  <span className="text-xs font-semibold text-slate-700 font-mono tabular-nums">
                    {proj.health}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
