import React from "react";
import { cn } from "../../lib/utils";

export type BadgeVariant =
  | "em_andamento"
  | "planejamento"
  | "validacao"
  | "concluido"
  | "ativo"
  | "pausado"
  | "conectado"
  | "configurar"
  | "fonte_oficial"
  | "critico"
  | "alto"
  | "medio"
  | "baixo";

interface StatusBadgeProps {
  variant?: BadgeVariant | string;
  status?: BadgeVariant | string;
  label?: string;
  className?: string;
}

export function StatusBadge({ variant, status, label, className }: StatusBadgeProps) {
  const badgeType = status || variant || "em_andamento";
  let text = label;
  let styleClasses = "bg-slate-100 text-slate-700 border-slate-200";

  switch (badgeType) {
    case "em_andamento":
      text = text || "Em andamento";
      styleClasses = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "planejamento":
      text = text || "Planejamento";
      styleClasses = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "validacao":
      text = text || "Validação";
      styleClasses = "bg-purple-50 text-purple-700 border-purple-200";
      break;
    case "concluido":
      text = text || "Concluído";
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "ativo":
      text = text || "Ativo";
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "pausado":
      text = text || "Pausado";
      styleClasses = "bg-slate-100 text-slate-600 border-slate-200";
      break;
    case "conectado":
      text = text || "Conectado";
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "configurar":
      text = text || "Configurar";
      styleClasses = "bg-blue-50 text-blue-700 border-blue-200";
      break;
    case "fonte_oficial":
      text = text || "Fonte oficial";
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    case "critico":
      text = text || "Crítico";
      styleClasses = "bg-rose-50 text-rose-700 border-rose-200";
      break;
    case "alto":
      text = text || "Alto";
      styleClasses = "bg-orange-50 text-orange-700 border-orange-200";
      break;
    case "medio":
      text = text || "Médio";
      styleClasses = "bg-amber-50 text-amber-700 border-amber-200";
      break;
    case "baixo":
      text = text || "Baixo";
      styleClasses = "bg-emerald-50 text-emerald-700 border-emerald-200";
      break;
    default:
      text = text || variant;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tabular-nums whitespace-nowrap",
        styleClasses,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {text}
    </span>
  );
}
