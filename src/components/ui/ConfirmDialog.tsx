import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            {isDestructive && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />}
            {title}
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "px-3.5 py-1.5 text-xs font-medium text-white rounded-lg shadow-xs transition-colors",
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ApprovalDialogProps {
  isOpen: boolean;
  actionTitle: string;
  detectedIssue: string;
  explanation: string;
  recommendation: string;
  affectedTarget: string;
  onApprove: () => void;
  onReject: () => void;
}

export function ApprovalDialog({
  isOpen,
  actionTitle,
  detectedIssue,
  explanation,
  recommendation,
  affectedTarget,
  onApprove,
  onReject,
}: ApprovalDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
              Solicitação de Aprovação de Engenharia
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{actionTitle}</h3>
          </div>
          <button
            onClick={onReject}
            className="text-slate-400 hover:text-slate-600 p-1"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <span className="font-semibold text-amber-900 block mb-0.5">Detectado:</span>
            <p className="text-amber-800">{detectedIssue}</p>
          </div>

          <div>
            <span className="font-semibold text-slate-700 block mb-0.5">Explicação técnica:</span>
            <p className="text-slate-600 leading-relaxed">{explanation}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <span className="font-semibold text-slate-700 block mb-0.5">Recomendação do Agente:</span>
            <p className="text-slate-600">{recommendation}</p>
            <p className="mt-1 text-[11px] text-slate-400 font-mono">Alvo: {affectedTarget}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onReject}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Rejeitar Ação
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
          >
            Aprovar e Executar
          </button>
        </div>
      </div>
    </div>
  );
}
