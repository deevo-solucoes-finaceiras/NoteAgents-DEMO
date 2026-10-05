import React, { useState, useEffect } from "react";
import {
  Bot,
  Plus,
  Play,
  Pause,
  Sliders,
  CheckCircle,
  Shield,
  Layers,
  Sparkles,
  X,
  Code2,
  Cpu,
} from "lucide-react";
import { AgentsService } from "../../lib/api/services";
import { Agent, AgentAutonomy } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";
import { useAppStore } from "../../stores/useAppStore";
import { CreateAgentSchema } from "../../schemas";
import { cn } from "../../lib/utils";

export function AgentsView() {
  const { addToast, setCurrentPath } = useAppStore();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filter, setFilter] = useState<"todos" | "ativos" | "pausados">("todos");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);

  // New agent form
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formCategory, setFormCategory] = useState<"engineering" | "quality" | "knowledge" | "system">("engineering");
  const [formAutonomy, setFormAutonomy] = useState(3);
  const [formModel, setFormModel] = useState("GPT-5");
  const [formDescription, setFormDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const loadAgents = async () => {
    const list = await AgentsService.list();
    setAgents(list);
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const filteredAgents = agents.filter((a) => {
    if (filter === "ativos") return a.status === "ativo";
    if (filter === "pausados") return a.status === "pausado";
    return true;
  });

  const handleToggleStatus = async (id: string, name: string) => {
    const updated = await AgentsService.toggleStatus(id);
    addToast(`Agente "${name}" agora está ${updated.status}.`, "info");
    loadAgents();
  };

  const handleAutonomyChange = async (id: string, level: AgentAutonomy) => {
    await AgentsService.updateAutonomy(id, level);
    addToast(`Nível de autonomia atualizado para Nível ${level}.`, "info");
    loadAgents();
  };

  const handleRunAgent = async (agent: Agent) => {
    setRunningAgentId(agent.id);
    addToast(`Iniciando execução do ${agent.name}...`, "info");

    try {
      const run = await AgentsService.runAgent(agent.id);
      setTimeout(() => {
        setRunningAgentId(null);
        addToast(`Execução do ${agent.name} concluída com sucesso!`, "success");
        loadAgents();
      }, 1500);
    } catch {
      setRunningAgentId(null);
      addToast("Falha na execução do agente.", "error");
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = CreateAgentSchema.safeParse({
      name: formName,
      role: formRole,
      category: formCategory,
      autonomyLevel: Number(formAutonomy),
      model: formModel,
      description: formDescription,
    });

    if (!validation.success) {
      setFormError(validation.error.issues[0]?.message || "Dados inválidos");
      return;
    }

    await AgentsService.create(validation.data);
    addToast(`Agente "${formName}" criado com sucesso!`, "success");
    setIsCreateModalOpen(false);
    setFormName("");
    setFormRole("");
    setFormDescription("");
    loadAgents();
  };

  return (
    <div className="space-y-6">
      {/* Header (Panel 6 from Mockup) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Agentes de IA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Orquestração de agentes especializados com limites de autonomia e segurança
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Novo Agente
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-1 bg-white p-2.5 rounded-xl border border-slate-200/90 overflow-x-auto">
        {[
          { id: "todos", label: "Todos" },
          { id: "ativos", label: "Ativos" },
          { id: "pausados", label: "Pausados" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap",
              filter === tab.id
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Agents List (Panel 6) */}
      <div className="space-y-3">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-xl border border-slate-200/90 p-4 hover:border-blue-200 hover:shadow-2xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
          >
            {/* Left: Icon & Info */}
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {agent.name}
                  </h3>
                  <StatusBadge variant={agent.status} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {agent.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <span className="font-mono text-slate-600 font-medium">
                    Modelo: {agent.model}
                  </span>
                  <span>·</span>
                  <span>{agent.runsCount} execuções registradas</span>
                  <span>·</span>
                  <span>Ativo: {agent.lastActive}</span>
                </div>
              </div>
            </div>

            {/* Right: Autonomy Selector & Run Action */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              {/* Autonomy Level Control */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="text-[11px] text-slate-400 font-medium">Autonomia:</span>
                <select
                  value={agent.autonomyLevel}
                  onChange={(e) => handleAutonomyChange(agent.id, Number(e.target.value) as AgentAutonomy)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value={0}>L0: Observar</option>
                  <option value={1}>L1: Sugerir</option>
                  <option value={2}>L2: Preparar</option>
                  <option value={3}>L3: Executar c/ Aprovação</option>
                  <option value={4}>L4: Automático</option>
                  <option value={5}>L5: Autônomo</option>
                </select>
              </div>

              {/* Pause/Resume button */}
              <button
                onClick={() => handleToggleStatus(agent.id, agent.name)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                title={agent.status === "ativo" ? "Pausar agente" : "Ativar agente"}
              >
                {agent.status === "ativo" ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Execute Agent Button */}
              <button
                onClick={() => handleRunAgent(agent)}
                disabled={runningAgentId === agent.id || agent.status === "pausado"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                {runningAgentId === agent.id ? "Executando..." : "Executar"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Agent Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Novo Agente Especialista</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateAgent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Agente</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Performance Agent"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Função Principal</label>
                <input
                  type="text"
                  required
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="Ex: Otimização de latência e consumo de CPU"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Modelo de IA</label>
                  <select
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="GPT-5">GPT-5</option>
                    <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet</option>
                    <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nível de Autonomia</label>
                  <select
                    value={formAutonomy}
                    onChange={(e) => setFormAutonomy(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value={1}>L1: Sugerir</option>
                    <option value={2}>L2: Preparar</option>
                    <option value={3}>L3: Executar com Aprovação</option>
                    <option value={4}>L4: Automático</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instruções e Diretrizes</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Defina as regras de validação, limites de leitura/escrita e ferramentas permitidas..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Cadastrar Agente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
