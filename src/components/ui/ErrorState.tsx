import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "../../lib/utils";

export function LoadingSkeleton({
  lines = 4,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("p-6 bg-white rounded-xl border border-slate-200/90 space-y-4 animate-pulse", className)}>
      <div className="h-5 bg-slate-200 rounded-md w-1/3" />
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-slate-100 rounded-md"
            style={{ width: `${100 - (i % 3) * 15}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  title = "Falha ao carregar dados",
  message = "Ocorreu um erro ao obter os registros do serviço.",
  onRetry,
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-xl border border-rose-200 text-rose-900",
        className
      )}
    >
      <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-rose-600/90 max-w-sm mt-1">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}
