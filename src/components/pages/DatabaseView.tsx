import React, { useState, useEffect } from "react";
import {
  Database,
  Table,
  Layers,
  ArrowRight,
  Search,
  ExternalLink,
  CheckCircle2,
  X,
  FileCode,
  HardDrive,
} from "lucide-react";
import { DatabaseService } from "../../lib/api/services";
import { DatabaseTable } from "../../types";
import { useAppStore } from "../../stores/useAppStore";
import { formatBytes, cn } from "../../lib/utils";

export function DatabaseView() {
  const { addToast } = useAppStore();
  const [tables, setTables] = useState<DatabaseTable[]>([]);
  const [activeTab, setActiveTab] = useState<"tabelas" | "migrations" | "seeds" | "conexao">("tabelas");
  const [selectedTable, setSelectedTable] = useState<DatabaseTable | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    DatabaseService.listTables().then(setTables);
  }, []);

  const filteredTables = tables.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header (Panel 10 from Mockup) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Banco de Dados
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspeção relacional, schemas, migrations e integridade referencial
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            PostgreSQL v16 Conectado
          </span>
        </div>
      </div>

      {/* Tabs (Tabelas, Migrations, Seeds, Conexão) */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-medium">
        {[
          { id: "tabelas", label: `Tabelas (${tables.length})` },
          { id: "migrations", label: "Migrations" },
          { id: "seeds", label: "Seeds" },
          { id: "conexao", label: "Conexão" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`pb-2.5 px-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tables Tab Content */}
      {activeTab === "tabelas" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200/90">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrar tabelas..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Total: {filteredTables.length} tabelas
            </span>
          </div>

          {/* Table Rows (Panel 10 from Mockup) */}
          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100">
            {filteredTables.map((t) => (
              <div
                key={t.name}
                onClick={() => setSelectedTable(t)}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50/70 cursor-pointer transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-mono">
                    <Table className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 font-mono">{t.name}</span>
                    <span className="text-[11px] text-slate-400 ml-2 font-mono">
                      (PK: {t.primaryKey})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-slate-500 font-mono tabular-nums">
                    {t.recordCount} registros
                  </span>
                  <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                    {formatBytes(t.sizeBytes)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTable(t);
                    }}
                    className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    Ver
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Migrations Tab Content */}
      {activeTab === "migrations" && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Histórico de Migrations</h3>
          <div className="space-y-2 text-xs">
            {[
              { id: "001_initial_schema.sql", status: "Applied", date: "Hoje, 08:30" },
              { id: "002_add_agents_table.sql", status: "Applied", date: "Hoje, 09:15" },
              { id: "003_audit_findings_indexes.sql", status: "Applied", date: "Hoje, 10:00" },
              { id: "004_transactions_fk_index.sql", status: "Pending", date: "Pendente aprovação" },
            ].map((mig) => (
              <div
                key={mig.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 font-mono">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800">{mig.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    mig.status === "Applied"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {mig.status}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{mig.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connection Tab Content */}
      {activeTab === "conexao" && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-3 text-xs">
          <h3 className="text-sm font-semibold text-slate-900">Parâmetros de Conexão</h3>
          <div className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono space-y-1">
            <p>HOST: localhost</p>
            <p>PORT: 5432</p>
            <p>DATABASE: noteagents_production</p>
            <p>SSL: REQUIRED (verify-full)</p>
            <p>POOL_SIZE: 20 max connections</p>
          </div>
        </div>
      )}

      {/* Table Details Modal */}
      {selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 font-mono">
                  {selectedTable.name}
                </h3>
              </div>
              <button onClick={() => setSelectedTable(null)} className="text-slate-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500">Registros:</span>
                  <p className="font-bold text-slate-900 font-mono tabular-nums">
                    {selectedTable.recordCount}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Tamanho em Disco:</span>
                  <p className="font-bold text-slate-900 font-mono">
                    {formatBytes(selectedTable.sizeBytes)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Colunas:</span>
                  <p className="font-bold text-slate-900 font-mono">
                    {selectedTable.columnsCount} campos
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Chave Primária:</span>
                  <p className="font-bold text-blue-600 font-mono">
                    {selectedTable.primaryKey}
                  </p>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Exemplo de Query
                </span>
                <pre className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
{`SELECT * FROM ${selectedTable.name} 
ORDER BY ${selectedTable.primaryKey} DESC 
LIMIT 10;`}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedTable(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
