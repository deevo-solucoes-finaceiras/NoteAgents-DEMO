import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Plus,
  Search,
  FileText,
  Image as ImageIcon,
  Code2,
  Globe,
  Database,
  MoreVertical,
  Trash2,
  RefreshCw,
  ExternalLink,
  X,
  Upload,
} from "lucide-react";
import { KnowledgeService } from "../../lib/api/services";
import { KnowledgeSource, SourceType } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";
import { useAppStore } from "../../stores/useAppStore";
import { formatBytes, cn } from "../../lib/utils";

export function KnowledgeView() {
  const { addToast } = useAppStore();
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [activeTab, setActiveTab] = useState<"todas" | "documentos" | "imagens" | "codigo" | "urls">("todas");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Add source form
  const [sourceName, setSourceName] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("pdf");
  const [isOfficial, setIsOfficial] = useState(false);

  const loadSources = async () => {
    const list = await KnowledgeService.listSources();
    setSources(list);
  };

  useEffect(() => {
    loadSources();
  }, []);

  const filteredSources = sources.filter((s) => {
    let matchesTab = true;
    if (activeTab === "documentos") matchesTab = s.type === "pdf" || s.type === "markdown";
    else if (activeTab === "imagens") matchesTab = s.type === "image";
    else if (activeTab === "codigo") matchesTab = s.type === "code";
    else if (activeTab === "urls") matchesTab = s.type === "url";

    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim()) return;

    await KnowledgeService.addSource({
      name: sourceName,
      type: sourceType,
      sizeBytes: 1024 * 1024 * 2.2, // ~2.2 MB
      officialBadge: isOfficial,
    });

    addToast(`Fonte "${sourceName}" indexada com sucesso!`, "success");
    setIsAddModalOpen(false);
    setSourceName("");
    loadSources();
  };

  const handleRemove = async (id: string, name: string) => {
    await KnowledgeService.removeSource(id);
    addToast(`Fonte "${name}" removida.`, "info");
    loadSources();
  };

  const getSourceIcon = (type: SourceType) => {
    switch (type) {
      case "pdf":
      case "markdown":
        return <FileText className="w-5 h-5 text-rose-500" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case "code":
        return <Code2 className="w-5 h-5 text-amber-500" />;
      case "url":
        return <Globe className="w-5 h-5 text-cyan-500" />;
      case "database":
        return <Database className="w-5 h-5 text-purple-500" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header (Panel 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Fontes e Conhecimento
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Base contextual indexada para raciocínio e grounding dos agentes
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200/90">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "todas", label: `Todas (${sources.length})` },
            { id: "documentos", label: "Documentos" },
            { id: "imagens", label: "Imagens" },
            { id: "codigo", label: "Código" },
            { id: "urls", label: "URLs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar fontes indexadas..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Source List (Panel 4 from Mockup) */}
      <div className="space-y-2.5">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="bg-white rounded-xl border border-slate-200/90 p-3.5 hover:border-blue-200 transition-colors flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                {getSourceIcon(source.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {source.name}
                  </h4>
                  {source.officialBadge && (
                    <StatusBadge variant="fonte_oficial" label="Fonte oficial" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  <span className="uppercase">{source.type}</span> · {formatBytes(source.sizeBytes)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs text-slate-400">{source.updatedAt}</span>

              {/* Kebab */}
              <div className="relative">
                <button
                  onClick={() => setActiveMenuId(activeMenuId === source.id ? null : source.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {activeMenuId === source.id && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setActiveMenuId(null)}
                    />
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl border border-slate-200 shadow-xl z-40 p-1.5 text-xs space-y-0.5 animate-in fade-in duration-100">
                      <button
                        onClick={() => {
                          addToast(`Reprocessando embeddings de "${source.name}"`, "info");
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 text-left"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        Reprocessar
                      </button>
                      <button
                        onClick={() => {
                          handleRemove(source.id, source.name);
                          setActiveMenuId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        Remover
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Adicionar Fonte</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nome do Arquivo ou URL
                </label>
                <input
                  type="text"
                  required
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="Ex: Arquitetura_v2.pdf ou https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as SourceType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="pdf">Documento PDF</option>
                  <option value="markdown">Markdown (.md)</option>
                  <option value="code">Código / OpenAPI (.yaml / .json)</option>
                  <option value="image">Diagrama / Imagem (.png)</option>
                  <option value="url">Link / URL Web</option>
                  <option value="database">Base Estruturada</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="officialCheck"
                  checked={isOfficial}
                  onChange={(e) => setIsOfficial(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <label htmlFor="officialCheck" className="text-slate-700 cursor-pointer">
                  Marcar como Fonte Oficial do Projeto
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Adicionar Fonte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
