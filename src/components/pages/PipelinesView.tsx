import React, { useState, useEffect } from "react";
import {
  Workflow,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  Bot,
  FileCode,
  Layers,
  ChevronRight,
  Terminal,
  X,
} from "lucide-react";
import { PipelineService } from "../../lib/api/services";
import { PipelineStep } from "../../types";
import { PipelineVisual } from "../ui/PipelineVisual";
import { TerminalViewer } from "../ui/TerminalViewer";
import { useAppStore } from "../../stores/useAppStore";
import { formatDuration } from "../../lib/utils";

export function PipelinesView() {
  const { addToast, setCurrentPath } = useAppStore();
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<PipelineStep | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  useEffect(() => {
    PipelineService.getSteps().then(setSteps);
  }, []);

  const handleRunFullPipeline = () => {
    setIsRunning(true);
    setActiveStepIndex(0);
    addToast("Iniciando pipeline sequencial de 9 etapas...", "info");

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= steps.length) {
        clearInterval(interval);
        setIsRunning(false);
        setActiveStepIndex(null);
        addToast("Pipeline finalizado! Todas as 9 etapas validadas com sucesso.", "success");
      } else {
        setActiveStepIndex(current);
      }
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header (Panel 7) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Pipelines de Execução
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fluxo determinístico de automação e validação contínua dos agentes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunFullPipeline}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? `Executando etapa ${(activeStepIndex ?? 0) + 1}/9...` : "Executar Pipeline Completo"}
          </button>
        </div>
      </div>

      {/* Main Grid: Pipeline visual + Step details / logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineVisual
            steps={steps}
            onSelectStep={(step) => setSelectedStep(step)}
          />
        </div>

        {/* Right Info Card / Step Detail */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Resumo da Execução
            </h3>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Duração Total:</span>
                <span className="font-semibold text-slate-900 font-mono tabular-nums">22.8s</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Agentes Envolvidos:</span>
                <span className="font-semibold text-slate-900">6 agentes</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Status Geral:</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  100% Sucesso
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Garantia de Tipagem:</span>
                <span className="text-blue-700 font-mono font-semibold">Strict Mode</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setCurrentPath("/evidence")}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                <Layers className="w-3.5 h-3.5" />
                Inspecionar Trilha de Evidências
              </button>
            </div>
          </div>

          {/* Quick Step Inspector */}
          {selectedStep ? (
            <div className="bg-white rounded-xl border border-blue-200 p-5 space-y-3 shadow-xs animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-600 font-mono font-semibold uppercase">
                    Etapa {selectedStep.order} de 9
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{selectedStep.name}</h4>
                </div>
                <button onClick={() => setSelectedStep(null)} className="text-slate-400 p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-600">{selectedStep.description}</p>

              <div className="text-[11px] text-slate-500 space-y-1 pt-1 font-mono">
                <p>Agente: {selectedStep.agent || "Sistema"}</p>
                <p>Tempo: {formatDuration(selectedStep.durationMs || 1200)}</p>
                <p>Status: {selectedStep.status}</p>
              </div>

              {selectedStep.evidenceId && (
                <button
                  onClick={() => setCurrentPath("/evidence")}
                  className="text-xs text-blue-600 hover:underline font-semibold inline-flex items-center gap-1 pt-1"
                >
                  Ver Evidência Associada #{selectedStep.evidenceId}
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
              Clique em qualquer etapa do pipeline para inspecionar os detalhes e logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
