import React from "react";
import { Activity, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { ScoreGauge } from "../ui/ScoreGauge";
import { useAppStore } from "../../stores/useAppStore";

export function ReadinessView() {
  const { setCurrentPath } = useAppStore();

  const categories = [
    { name: "Prontidão de Mercado", score: 92, color: "#2563EB" },
    { name: "Prontidão de Produção", score: 84, color: "#10B981" },
    { name: "Segurança & Conformidade", score: 76, color: "#EF4444" },
    { name: "Saúde Técnica", score: 88, color: "#06B6D4" },
    { name: "Completude do Produto", score: 85, color: "#8B5CF6" },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Production Readiness Engine
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Critérios de elegibilidade para deploy em produção com pesos explicáveis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScoreGauge
            score={84}
            label="Elegível para Produção com Ressalvas"
            categories={categories}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Bloqueadores Ativos
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                3 Vulnerabilidades Críticas
              </span>
              <p className="text-[11px] text-rose-700">
                Necessária sanitização de secrets antes do build final.
              </p>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Índice de Transações Pendente
              </span>
              <p className="text-[11px] text-amber-700">
                Pode gerar degradação de latência com carga concorrente.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentPath("/audits")}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Ver Trilha de Resolução</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
