import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileCode,
  X,
} from "lucide-react";
import { AuditsService } from "../../lib/api/services";
import { AuditRecord, Finding } from "../../types";
import { ScoreGauge } from "../ui/ScoreGauge";
import { StatusBadge } from "../ui/StatusBadge";
import { ApprovalDialog } from "../ui/ConfirmDialog";
import { useAppStore } from "../../stores/useAppStore";
import { cn } from "../../lib/utils";

export function AuditsView() {
  const { setCurrentPath, addToast } = useAppStore();
  const [audit, setAudit] = useState<AuditRecord | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [approvalTarget, setApprovalTarget] = useState<Finding | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>("todos");

  useEffect(() => {
    AuditsService.getLatest().then(setAudit);
  }, []);

  if (!audit) return null;

  const handleRunAudit = async () => {
    addToast("Executando auditoria contínua de segurança e código...", "info");
    const updated = await AuditsService.runAudit();
    setAudit(updated);
    addToast("Auditoria finalizada com sucesso.", "success");
  };

  const handleApproveFix = () => {
    if (!approvalTarget) return;
    addToast(`Plano de correção aprovado para "${approvalTarget.title}". Iniciando pipeline...`, "success");
    setApprovalTarget(null);
    setSelectedFinding(null);
  };

  const filteredFindings = audit.findings.filter((f) =>
    filterSeverity === "todos" ? true : f.severity === filterSeverity
  );

  return (
    <div className="space-y-6">
      {/* Header (Panel 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Auditoria e Verificação
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Diagnóstico de segurança, código, arquitetura e prontidão para produção
          </p>
        </div>

        <button
          onClick={handleRunAudit}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          Executar Nova Auditoria
        </button>
      </div>

      {/* Top Gauge & Severity Breakdown (Panel 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ScoreGauge
            score={audit.score}
            label="Pronto para produção"
            categories={audit.categories}
          />
        </div>

        {/* Principais Apontamentos Cards */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Principais apontamentos
            </h3>
            <p className="text-xs text-slate-500">
              Distribuição por severidade e criticidade
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFilterSeverity(filterSeverity === "critico" ? "todos" : "critico")}
              className={cn(
                "p-3 rounded-lg border text-left transition-colors",
                filterSeverity === "critico"
                  ? "bg-rose-100/70 border-rose-300"
                  : "bg-rose-50/70 border-rose-200/80 hover:bg-rose-100/50"
              )}
            >
              <span className="text-xl font-bold text-rose-700 block font-mono tabular-nums">
                3
              </span>
              <span className="text-xs font-semibold text-rose-800">críticos</span>
            </button>

            <button
              onClick={() => setFilterSeverity(filterSeverity === "alto" ? "todos" : "alto")}
              className={cn(
                "p-3 rounded-lg border text-left transition-colors",
                filterSeverity === "alto"
                  ? "bg-orange-100/70 border-orange-300"
                  : "bg-orange-50/70 border-orange-200/80 hover:bg-orange-100/50"
              )}
            >
              <span className="text-xl font-bold text-orange-700 block font-mono tabular-nums">
                7
              </span>
              <span className="text-xs font-semibold text-orange-800">altos</span>
            </button>

            <button
              onClick={() => setFilterSeverity(filterSeverity === "medio" ? "todos" : "medio")}
              className={cn(
                "p-3 rounded-lg border text-left transition-colors",
                filterSeverity === "medio"
                  ? "bg-amber-100/70 border-amber-300"
                  : "bg-amber-50/70 border-amber-200/80 hover:bg-amber-100/50"
              )}
            >
              <span className="text-xl font-bold text-amber-700 block font-mono tabular-nums">
                12
              </span>
              <span className="text-xs font-semibold text-amber-800">médios</span>
            </button>

            <button
              onClick={() => setFilterSeverity(filterSeverity === "baixo" ? "todos" : "baixo")}
              className={cn(
                "p-3 rounded-lg border text-left transition-colors",
                filterSeverity === "baixo"
                  ? "bg-emerald-100/70 border-emerald-300"
                  : "bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-100/50"
              )}
            >
              <span className="text-xl font-bold text-emerald-700 block font-mono tabular-nums">
                5
              </span>
              <span className="text-xs font-semibold text-emerald-800">baixos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Findings List (Interactive Detail) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Achados da Auditoria
            </h3>
            <p className="text-xs text-slate-500">
              Vulnerabilidades e débitos detectados pelo Security Agent e AST Scanner
            </p>
          </div>
          {filterSeverity !== "todos" && (
            <button
              onClick={() => setFilterSeverity("todos")}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              Limpar filtro ({filterSeverity})
            </button>
          )}
        </div>

        <div className="space-y-2 pt-1">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              onClick={() => setSelectedFinding(finding)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-slate-50/60 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StatusBadge variant={finding.severity} />
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {finding.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {finding.description}
                </p>
                {finding.affectedFile && (
                  <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <FileCode className="w-3 h-3 text-slate-400" />
                    {finding.affectedFile}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setApprovalTarget(finding);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Gerar Fix
                </button>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Últimas Auditorias (Table list from Mockup Panel 5) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">
          Últimas Auditorias
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { title: "Auditoria de Segurança", records: "12 registros", date: "Hoje, 10:24" },
            { title: "Auditoria de Performance", records: "8 registros", date: "Hoje, 09:12" },
            { title: "Auditoria de Código", records: "18 registros", date: "Hoje, 08:45" },
            { title: "Auditoria de Infraestrutura", records: "19 registros", date: "Ontem, 22:30" },
          ].map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">{item.title}</span>
                <span className="text-slate-400 ml-2">· {item.records}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono text-[11px]">{item.date}</span>
                <button
                  onClick={() => addToast(`Relatório de ${item.title} aberto.`, "info")}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Finding Detail Modal */}
      {selectedFinding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div className="space-y-1">
                <StatusBadge variant={selectedFinding.severity} />
                <h3 className="text-base font-bold text-slate-900">{selectedFinding.title}</h3>
              </div>
              <button onClick={() => setSelectedFinding(null)} className="text-slate-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <strong className="text-slate-800 block mb-0.5">Descrição:</strong>
                <p>{selectedFinding.description}</p>
              </div>
              <div>
                <strong className="text-slate-800 block mb-0.5">Impacto Estimado:</strong>
                <p>{selectedFinding.impact}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <strong className="text-blue-900 block mb-0.5">Recomendação do Agente:</strong>
                <p className="text-blue-800">{selectedFinding.recommendation}</p>
                {selectedFinding.affectedFile && (
                  <p className="mt-1 font-mono text-[11px] text-blue-700">
                    Arquivo: {selectedFinding.affectedFile}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedFinding(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setApprovalTarget(selectedFinding);
                }}
                className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-xs shadow-xs"
              >
                Aprovar Plano de Correção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Repair Approval Dialog */}
      {approvalTarget && (
        <ApprovalDialog
          isOpen={true}
          actionTitle="Auto-reparo com Agente de Correção"
          detectedIssue={approvalTarget.title}
          explanation={approvalTarget.description}
          recommendation={approvalTarget.recommendation}
          affectedTarget={approvalTarget.affectedFile || "Workspace"}
          onApprove={handleApproveFix}
          onReject={() => setApprovalTarget(null)}
        />
      )}
    </div>
  );
}
