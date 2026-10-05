import React, { useState } from "react";
import { Terminal as TerminalIcon, Activity, RefreshCw, Cpu, HardDrive } from "lucide-react";
import { TerminalViewer } from "../ui/TerminalViewer";

export function ObserverView() {
  const [logs, setLogs] = useState<string[]>([
    "[INFO] Observer Daemon inicializado na porta interna 9001",
    "[INFO] Coletando métricas do runtime Node.js v22.0.0",
    "[INFO] CPU Usage: 4.2% · RAM: 248MB / 16GB",
    "[INFO] Socket connection: established with /var/run/docker.sock",
    "[INFO] PostgreSQL connection pool: 3/20 active connections",
    "[INFO] Redis hit rate: 98.4% (keyspace: 1,420 items)",
    "[INFO] Zero memory leaks detectados nas últimas 4 horas.",
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Observer & Telemetria em Tempo Real
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitoramento contínuo de processos, memória, conexões de banco e eventos
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Uso de CPU</span>
          <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">4.2%</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Consumo de Memória</span>
          <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">248 MB</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Pool de Banco</span>
          <p className="text-xl font-bold text-slate-900 font-mono tabular-nums">3 / 20</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500">Cache Hit Rate</span>
          <p className="text-xl font-bold text-emerald-600 font-mono tabular-nums">98.4%</p>
        </div>
      </div>

      <TerminalViewer logs={logs} title="Logs de Telemetria do Observer" onClear={() => setLogs([])} />
    </div>
  );
}

export function WorkspaceView() {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Workspace Boundaries & Políticas de Acesso
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Limites estritos de leitura e escrita concedidos aos agentes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Diretórios Autorizados</h3>
          <ul className="text-xs font-mono space-y-2 text-slate-700">
            <li className="p-2 bg-slate-50 rounded border border-slate-200">/src/components/* (READ/WRITE)</li>
            <li className="p-2 bg-slate-50 rounded border border-slate-200">/src/lib/* (READ/WRITE)</li>
            <li className="p-2 bg-slate-50 rounded border border-slate-200">/src/schemas/* (READ/WRITE)</li>
            <li className="p-2 bg-slate-50 rounded border border-slate-200">/tests/* (READ/WRITE/EXECUTE)</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-rose-200 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-rose-900">Zonas Protegidas (DENY)</h3>
          <ul className="text-xs font-mono space-y-2 text-rose-800">
            <li className="p-2 bg-rose-50 rounded border border-rose-200">.env, .env.local (SECRETS DENY)</li>
            <li className="p-2 bg-rose-50 rounded border border-rose-200">/etc/credentials/* (STRICT DENY)</li>
            <li className="p-2 bg-rose-50 rounded border border-rose-200">Production DB DROP (REQUIRES APPROVAL)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
