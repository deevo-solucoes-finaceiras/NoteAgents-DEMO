import React, { useState, useEffect } from "react";
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Terminal,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { EvidenceService } from "../../lib/api/services";
import { EvidenceRecord } from "../../types";
import { cn } from "../../lib/utils";

export function EvidenceView() {
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    EvidenceService.list().then(setEvidenceList);
  }, []);

  const filtered = evidenceList.filter((e) =>
    e.action.toLowerCase().includes(search.toLowerCase()) ||
    e.agent.toLowerCase().includes(search.toLowerCase()) ||
    e.command.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Trilha de Evidências Auditadas
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Registro imutável de comandos, saídas, arquivos modificados e validações
        </p>
      </div>

      {/* Filter / Search */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por comando, agente ou ação..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} evidências registradas
        </span>
      </div>

      {/* Evidence Timeline Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3.5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.action}</h3>
                  <p className="text-[11px] text-slate-400">
                    Ator: <span className="text-slate-700">{item.actor}</span> · Agente:{" "}
                    <span className="text-blue-600 font-semibold">{item.agent}</span>
                  </p>
                </div>
              </div>

              <span className="text-xs text-slate-400 font-mono">{item.timestamp}</span>
            </div>

            {/* Command execution block */}
            <div className="p-3 bg-slate-950 text-slate-200 rounded-lg text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-1">
                <span>COMANDO</span>
                <span>EXIT CODE: {item.exitCode}</span>
              </div>
              <p className="text-blue-400 pt-1">$ {item.command}</p>
              <p className="text-slate-300 text-[11px]">{item.outputSummary}</p>
            </div>

            {/* Output details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-1">
                  Arquivos Modificados:
                </span>
                {item.filesChanged.length > 0 ? (
                  <ul className="list-disc list-inside font-mono text-[11px] text-slate-600">
                    {item.filesChanged.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-slate-400 italic">Nenhum arquivo alterado</span>
                )}
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 block mb-1">
                  Validação de Testes:
                </span>
                <p className="text-slate-600 text-[11px]">{item.testsSummary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
