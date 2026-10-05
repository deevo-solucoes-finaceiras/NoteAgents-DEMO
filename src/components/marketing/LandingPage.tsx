import React from "react";
import {
  BrainCircuit,
  Bot,
  Brain,
  ShieldCheck,
  Server,
  Blocks,
  CheckCircle2,
  ArrowRight,
  GitBranch,
  Cloud,
  Container,
  Database,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";

export function LandingPage() {
  const { setCurrentPath } = useAppStore();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Bar (Marketing Strip in Mockup) */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div
            onClick={() => setCurrentPath("/")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 leading-tight block">
                NoteAgents
              </span>
              <span className="text-[10px] text-blue-600 font-semibold tracking-wider">
                ENGENHARIA DE SOFTWARE ASSISTIDA POR IA
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button onClick={() => setCurrentPath("/dashboard")} className="hover:text-blue-600">
              Produto
            </button>
            <button onClick={() => setCurrentPath("/pipelines")} className="hover:text-blue-600">
              Soluções
            </button>
            <button onClick={() => setCurrentPath("/audits")} className="hover:text-blue-600">
              Preços
            </button>
            <button onClick={() => setCurrentPath("/documentacao")} className="hover:text-blue-600">
              Documentação
            </button>
            <button onClick={() => setCurrentPath("/knowledge/sources")} className="hover:text-blue-600">
              Blog
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPath("/login")}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={() => setCurrentPath("/dashboard")}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            Começar agora
          </button>
        </div>
      </header>

      {/* Hero Section (Matching Board Top Strip) */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Soft background blue gradient wave */}
        <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute top-20 left-10 -z-10 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seu AI Engineering Control Plane</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Do planejamento à produção,{" "}
              <span className="text-blue-600">
                com inteligência, evidência e automação.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Uma plataforma completa para desenvolvedores, projetos e equipes.
              Auditoria em tempo real, orquestração de 24 agentes e pipelines determinísticos.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentPath("/dashboard")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all hover:shadow-lg"
              >
                Começar agora
              </button>
              <button
                onClick={() => setCurrentPath("/chat")}
                className="px-5 py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
              >
                Ver demonstração
              </button>
            </div>
          </div>

          {/* Right Product Preview Mockup */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">
                Desenvolva Projetos melhores com IA.
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              {[
                "Mais produtividade",
                "Projetos mais seguros",
                "Decisões baseadas em evidências",
                "Construído com a comunidade",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Tech logos row */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-mono">
              <span className="font-semibold text-slate-800">GitHub</span>
              <span className="font-semibold text-slate-800">Vercel</span>
              <span className="font-semibold text-slate-800">OpenAI</span>
              <span className="font-semibold text-slate-800">Docker</span>
              <span className="font-semibold text-slate-800">PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* 5 Feature Cards Row (From Mockup Strip) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-14">
          <div
            onClick={() => setCurrentPath("/agents")}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer transition-all space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Agentes de IA</h3>
            <p className="text-[11px] text-slate-500">Especialistas em cada tarefa do workspace</p>
          </div>

          <div
            onClick={() => setCurrentPath("/knowledge/sources")}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer transition-all space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Fontes e Conhecimento</h3>
            <p className="text-[11px] text-slate-500">Documentos, código, imagens e PRDs</p>
          </div>

          <div
            onClick={() => setCurrentPath("/audits")}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer transition-all space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Auditoria e Verificação</h3>
            <p className="text-[11px] text-slate-500">Auditoria que realmente valida e corrige</p>
          </div>

          <div
            onClick={() => setCurrentPath("/environment")}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer transition-all space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Automação de Ambiente</h3>
            <p className="text-[11px] text-slate-500">Instala, configura e valida containers</p>
          </div>

          <div
            onClick={() => setCurrentPath("/integrations")}
            className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs cursor-pointer transition-all space-y-1.5"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Blocks className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Integrações</h3>
            <p className="text-[11px] text-slate-500">GitHub, OpenCode, MCP, LSP e mais</p>
          </div>
        </div>
      </section>

      {/* Two Brains Section (Master Prompt) */}
      <section className="bg-white border-y border-slate-200/80 py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Arquitetura de Dois Cérebros
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Engineering Brain & Knowledge Brain
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Separação estrutural entre execução operacional de código e gestão do conhecimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  EB
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Engineering Brain</h3>
                  <p className="text-xs text-slate-500">Execução, infraestrutura e runtime</p>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">✓ Código, Workspace e Compiladores LSP</li>
                <li className="flex items-center gap-2">✓ Docker, PostgreSQL e Cache Redis</li>
                <li className="flex items-center gap-2">✓ Suíte de Testes e Pipelines de Build</li>
                <li className="flex items-center gap-2">✓ Auto-reparo e validação de AST</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold">
                  KB
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Knowledge Brain</h3>
                  <p className="text-xs text-slate-500">Contexto, fontes e decisões de produto</p>
                </div>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">✓ Documentação, PRDs, ADRs e Requisitos</li>
                <li className="flex items-center gap-2">✓ Grounding em bases vetoriais e embeddings</li>
                <li className="flex items-center gap-2">✓ Trilha explicativa de cada decisão técnica</li>
                <li className="flex items-center gap-2">✓ Relatórios executivos de prontidão</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 px-4 sm:px-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white text-sm">NoteAgents</span>
            <span className="text-slate-500 ml-2">© 2026 NoteAgents Inc. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentPath("/dashboard")} className="hover:text-white">
              Console
            </button>
            <button onClick={() => setCurrentPath("/documentacao")} className="hover:text-white">
              Docs
            </button>
            <button onClick={() => setCurrentPath("/login")} className="hover:text-white">
              Entrar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
