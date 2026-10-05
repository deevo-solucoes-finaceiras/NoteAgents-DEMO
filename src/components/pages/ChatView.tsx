import React, { useState } from "react";
import {
  Send,
  Paperclip,
  Code,
  Image as ImageIcon,
  FileText,
  Bot,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Layers,
} from "lucide-react";
import { ChatMessage } from "../../types";
import { useAppStore } from "../../stores/useAppStore";
import { cn } from "../../lib/utils";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    role: "user",
    content: "Analise esta tela e me ajude a criar os componentes em React.",
    timestamp: "Hoje, 10:04",
    model: "GPT-5",
    agent: "Frontend Agent",
    attachments: [{ name: "dashboard.png", type: "image/png" }],
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "Recebi a prancha de design do NoteAgents com 15 painéis e os requisitos arquiteturais. Finalizei o mapeamento de tokens, componentes e topologia.",
    timestamp: "Hoje, 10:05",
    model: "GPT-5",
    agent: "Frontend Agent",
    analysisCard: {
      title: "Análise concluída",
      description: "Identifiquei 12 componentes principais:",
      items: [
        { label: "Layout analisado", completed: true },
        { label: "Componentes detectados", completed: true },
        { label: "Cores e tipografia identificadas", completed: true },
        { label: "Design tokens extraídos", completed: true },
        { label: "Estrutura de pastas sugerida", completed: true },
        { label: "Plano de implementação gerado", completed: true },
      ],
      actionLabel: "Ver plano completo →",
      actionTarget: "/pipelines",
    },
    evidenceId: "ev-3",
  },
];

export function ChatView() {
  const { setCurrentPath, addToast } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-5");
  const [selectedAgent, setSelectedAgent] = useState("Frontend Agent");
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: "Agora mesmo",
      model: selectedModel,
      agent: selectedAgent,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Simulated streamed grounded response from agent
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: `Compreendido! O agente ${selectedAgent} (${selectedModel}) processou seu comando no contexto do workspace ativo. As diretrizes foram validadas pelo compilador de tipos e a evidência de execução foi registrada.`,
        timestamp: "Agora mesmo",
        model: selectedModel,
        agent: selectedAgent,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsStreaming(false);
      addToast(`Resposta gerada pelo ${selectedAgent}.`, "success");
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Chat Top Bar (Panel 3 Header) */}
      <div className="px-5 py-3 border-b border-slate-200/80 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Chat com IA</h2>
            <p className="text-[11px] text-slate-500">Engenharia assistida com grounding em código e evidências</p>
          </div>
        </div>

        {/* Model Selector Pill Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="GPT-5">GPT-5</option>
            <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet</option>
            <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col max-w-2xl",
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            {/* Meta info */}
            <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-600">
                {msg.role === "user" ? "Você" : msg.agent || "Assistente NoteAgents"}
              </span>
              <span>·</span>
              <span>{msg.timestamp}</span>
              {msg.model && (
                <>
                  <span>·</span>
                  <span className="font-mono text-blue-600">{msg.model}</span>
                </>
              )}
            </div>

            {/* Bubble */}
            {msg.role === "user" ? (
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 text-xs leading-relaxed shadow-xs">
                {msg.content}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-500/60 flex items-center gap-1.5 text-[11px] text-blue-100">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Anexo: {msg.attachments[0].name}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-xs p-4 text-xs leading-relaxed space-y-3 w-full shadow-2xs">
                <p>{msg.content}</p>

                {/* Analysis Card (From Mockup Panel 3) */}
                {msg.analysisCard && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <ImageIcon className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {msg.analysisCard.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {msg.analysisCard.description}
                        </p>
                      </div>
                    </div>

                    {/* Checklist items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                      {msg.analysisCard.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setIsPlanModalOpen(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {msg.analysisCard.actionLabel}
                      </button>

                      {msg.evidenceId && (
                        <button
                          onClick={() => setCurrentPath("/evidence")}
                          className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 font-mono"
                        >
                          <Layers className="w-3 h-3" />
                          Evidência #{msg.evidenceId}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic animate-pulse">
            <Bot className="w-4 h-4 text-blue-600" />
            <span>{selectedAgent} está analisando os arquivos do workspace...</span>
          </div>
        )}
      </div>

      {/* Composer Section (Panel 3 Bottom) */}
      <div className="p-3 sm:p-4 border-t border-slate-200/80 bg-slate-50/50 shrink-0">
        <form onSubmit={handleSend} className="space-y-2.5">
          <div className="relative bg-white rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-2xs">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={2}
              placeholder="Digite sua mensagem ou comando de engenharia..."
              className="w-full px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent resize-none focus:outline-none"
            />

            <div className="px-3 pb-2.5 flex items-center justify-between border-t border-slate-100 pt-2">
              {/* Quick Actions */}
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => addToast("Seletor de arquivos engajado.", "info")}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <Paperclip className="w-3 h-3" />
                  <span className="hidden sm:inline">Anexar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInput((prev) => `${prev}\n\`\`\`typescript\n// Inserir trecho\n\`\`\``);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <Code className="w-3 h-3" />
                  <span className="hidden sm:inline">Código</span>
                </button>
                <button
                  type="button"
                  onClick={() => addToast("Upload de imagem pronto.", "info")}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <ImageIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">Imagem</span>
                </button>
                <button
                  type="button"
                  onClick={() => addToast("Documento anexado para contexto.", "info")}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  <span className="hidden sm:inline">Documento</span>
                </button>
              </div>

              {/* Agent selector & Send button */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Frontend Agent">Frontend Agent</option>
                  <option value="Backend Agent">Backend Agent</option>
                  <option value="Database Agent">Database Agent</option>
                  <option value="Security Agent">Security Agent</option>
                  <option value="DevOps Agent">DevOps Agent</option>
                  <option value="Code Review Agent">Code Review Agent</option>
                </select>

                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center shadow-xs transition-colors shrink-0"
                  aria-label="Enviar mensagem"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Plan Details Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Plano de Implementação de Engenharia
            </h3>
            <div className="text-xs text-slate-600 space-y-3 max-h-80 overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-800">1. Extração de Design Tokens</h4>
                <p>Cores primárias (#0B5FFF, #2563EB), neutros (#0F172A, #F8FAFC) e radius 12px.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-800">2. Estrutura Modular</h4>
                <p>Componentes isolados com TypeScript strict mode, Zod schemas e Zustand stores.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-800">3. Auditoria & Evidência Contínua</h4>
                <p>Garantia de acessibilidade WCAG AA e integridade contra quebras de layout.</p>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsPlanModalOpen(false)}
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
