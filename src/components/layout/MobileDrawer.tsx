import React, { useEffect } from "react";
import {
  BrainCircuit,
  X,
  LayoutDashboard,
  FolderGit2,
  Sparkles,
  BrainCircuit as BrainIcon,
  Bot,
  Workflow,
  ShieldCheck,
  Database,
  Blocks,
  Server,
  Terminal,
  Activity,
  Layers,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { cn } from "../../lib/utils";

const MOBILE_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projetos", path: "/projects", icon: FolderGit2 },
  { id: "chat", label: "Chat com IA", path: "/chat", icon: Sparkles },
  { id: "knowledge", label: "Fontes e Conhecimento", path: "/knowledge/sources", icon: BrainIcon },
  { id: "agents", label: "Agentes de IA", path: "/agents", icon: Bot },
  { id: "pipelines", label: "Pipelines", path: "/pipelines", icon: Workflow },
  { id: "audits", label: "Auditoria e Verificação", path: "/audits", icon: ShieldCheck },
  { id: "database", label: "Banco de dados", path: "/database", icon: Database },
  { id: "integrations", label: "Integrações", path: "/integrations", icon: Blocks },
  { id: "environment", label: "Ambiente", path: "/environment", icon: Server },
  { id: "observer", label: "Observer & Terminal", path: "/observer", icon: Terminal },
  { id: "readiness", label: "Production Readiness", path: "/readiness", icon: Activity },
  { id: "evidence", label: "Evidências", path: "/evidence", icon: Layers },
  { id: "documentacao", label: "Documentação", path: "/documentacao", icon: HelpCircle },
  { id: "settings", label: "Configurações", path: "/settings", icon: Settings },
];

export function MobileDrawer() {
  const {
    isMobileDrawerOpen,
    setMobileDrawerOpen,
    currentPath,
    setCurrentPath,
    user,
  } = useAppStore();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileDrawerOpen(false);
    }
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileDrawerOpen, setMobileDrawerOpen]);

  if (!isMobileDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setMobileDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block leading-tight">
                NoteAgents
              </span>
              <span className="text-[10px] text-blue-600 font-medium">CONTROL PLANE</span>
            </div>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Fechar navegação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div
          onClick={() => {
            setCurrentPath("/settings/profile");
            setMobileDrawerOpen(false);
          }}
          className="mx-3 mt-3 p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
            VA
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.role}</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {MOBILE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPath(item.path);
                  setMobileDrawerOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left",
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
