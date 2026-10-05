import React from "react";
import { Check, Clock, AlertCircle, Play, FileCode, CheckCircle2 } from "lucide-react";
import { PipelineStep } from "../../types";
import { cn, formatDuration } from "../../lib/utils";

interface PipelineVisualProps {
  steps: PipelineStep[];
  onSelectStep?: (step: PipelineStep) => void;
  className?: string;
}

export function PipelineVisual({
  steps,
  onSelectStep,
  className,
}: PipelineVisualProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200/90 p-5", className)}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Pipeline de Agentes
          </h3>
          <p className="text-xs text-slate-500">
            Fluxo sequencial automatizado de descoberta à verificação
          </p>
        </div>
        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          9 etapas ativas
        </span>
      </div>

      <div className="relative pl-6 space-y-4">
        {/* Connecting vertical guide line */}
        <div className="absolute left-[23px] top-3 bottom-5 w-0.5 bg-blue-100 -translate-x-1/2" />

        {steps.map((step, idx) => {
          const isSuccess = step.status === "success";
          const isRunning = step.status === "running";
          const isFailed = step.status === "failed";

          return (
            <div
              key={step.id}
              onClick={() => onSelectStep?.(step)}
              className={cn(
                "relative flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group",
                onSelectStep && "cursor-pointer"
              )}
            >
              {/* Left icon with sequence badge */}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 z-10",
                    isSuccess && "bg-blue-600 text-white shadow-xs",
                    isRunning && "bg-blue-500 text-white animate-pulse",
                    isFailed && "bg-rose-500 text-white",
                    !isSuccess && !isRunning && !isFailed && "bg-slate-100 text-slate-600"
                  )}
                >
                  {isSuccess ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {step.name}
                  </h4>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </div>

              {/* Right metadata and check icon */}
              <div className="flex items-center gap-3">
                {step.durationMs && (
                  <span className="text-xs text-slate-400 flex items-center gap-1 tabular-nums font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatDuration(step.durationMs)}
                  </span>
                )}

                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center border",
                    isSuccess && "bg-emerald-50 text-emerald-600 border-emerald-200",
                    isRunning && "bg-blue-50 text-blue-600 border-blue-200",
                    isFailed && "bg-rose-50 text-rose-600 border-rose-200"
                  )}
                >
                  {isSuccess && <CheckCircle2 className="w-4 h-4" />}
                  {isRunning && <Play className="w-3 h-3 fill-current" />}
                  {isFailed && <AlertCircle className="w-4 h-4" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
