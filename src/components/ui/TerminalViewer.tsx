import React, { useState } from "react";
import { Terminal, Copy, Check, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface TerminalViewerProps {
  logs: string[];
  title?: string;
  className?: string;
  onClear?: () => void;
}

export function TerminalViewer({
  logs,
  title = "Terminal de Execução",
  className,
  onClear,
}: TerminalViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(logs.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-md flex flex-col font-mono text-xs",
        className
      )}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-[11px] font-sans font-medium text-slate-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Copiar logs"
            aria-label="Copiar logs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {onClear && (
            <button
              onClick={onClear}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Limpar logs"
              aria-label="Limpar logs"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Log Content */}
      <div
        role="log"
        aria-live="polite"
        className="p-4 overflow-y-auto max-h-64 space-y-1.5 text-slate-200 select-text"
      >
        {logs.length === 0 ? (
          <p className="text-slate-500 italic">Nenhum log registrado ainda...</p>
        ) : (
          logs.map((line, idx) => {
            const isInfo = line.includes("[INFO]");
            const isWarn = line.includes("[WARN]");
            const isError = line.includes("[ERROR]");

            return (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-blue-400 select-none">$</span>
                <span
                  className={cn(
                    "flex-1",
                    isInfo && "text-slate-200",
                    isWarn && "text-amber-300",
                    isError && "text-rose-400 font-semibold"
                  )}
                >
                  {line}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
