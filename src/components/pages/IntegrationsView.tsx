import React, { useState, useEffect } from "react";
import {
  Blocks,
  Plus,
  GitBranch,
  Cloud,
  Code2,
  Terminal,
  Database,
  MessageSquare,
  CheckCircle2,
  Settings,
  X,
  ExternalLink,
} from "lucide-react";
import { IntegrationsService } from "../../lib/api/services";
import { IntegrationItem } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";
import { useAppStore } from "../../stores/useAppStore";
import { cn } from "../../lib/utils";

export function IntegrationsView() {
  const { addToast } = useAppStore();
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<IntegrationItem | null>(null);

  const loadIntegrations = async () => {
    const list = await IntegrationsService.list();
    setIntegrations(list);
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const handleToggle = async (id: string, name: string) => {
    const updated = await IntegrationsService.toggle(id);
    addToast(
      `Integração com ${name} agora está ${updated.status}.`,
      updated.status === "conectado" ? "success" : "info"
    );
    loadIntegrations();
  };

  const getIntegrationIcon = (name: string) => {
    if (name === "GitHub") return <GitBranch className="w-6 h-6 text-slate-900" />;
    if (name === "Vercel") return <Cloud className="w-6 h-6 text-slate-900" />;
    if (name === "OpenCode") return <Code2 className="w-6 h-6 text-blue-600" />;
    if (name === "MCP") return <Terminal className="w-6 h-6 text-emerald-600" />;
    if (name === "LSP") return <Code2 className="w-6 h-6 text-purple-600" />;
    if (name === "PostgreSQL") return <Database className="w-6 h-6 text-blue-700" />;
    if (name === "Redis") return <Database className="w-6 h-6 text-rose-600" />;
    if (name === "Slack") return <MessageSquare className="w-6 h-6 text-amber-600" />;
    return <Blocks className="w-6 h-6 text-slate-700" />;
  };

  return (
    <div className="space-y-6">
      {/* Header (Panel 9) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Integrações
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Conectores para repositórios, nuvem, bancos, protocolos MCP e LSP
          </p>
        </div>

        <button
          onClick={() => addToast("Assistente de nova integração ativado.", "info")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Nova Integração
        </button>
      </div>

      {/* Grid of 8 Integration Cards (Panel 9 from Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 flex flex-col justify-between space-y-4 hover:border-blue-200 hover:shadow-xs transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  {getIntegrationIcon(item.name)}
                </div>
                <StatusBadge variant={item.status} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {item.lastSync || "Aguardando setup"}
              </span>

              <button
                onClick={() => handleToggle(item.id, item.name)}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-lg transition-colors border",
                  item.status === "conectado"
                    ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                )}
              >
                {item.status === "conectado" ? "Gerenciar" : "Conectar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
