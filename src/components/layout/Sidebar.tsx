import React from "react";
import {
  LayoutDashboard,
  FolderGit2,
  Bot,
  BrainCircuit,
  Workflow,
  ShieldCheck,
  Server,
  Database,
  Blocks,
  Settings,
  FileText,
  FileCode,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { cn } from "../../lib/utils";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projetos", path: "/projects", icon: FolderGit2, badge: "7" },
  { id: "chat", label: "Chat com IA", path: "/chat", icon: Sparkles },
  { id: "knowledge", label: "Fontes", path: "/knowledge/sources", icon: BrainCircuit },
  { id: "workspace", label: "Workspace", path: "/workspace", icon: FileCode },
  { id: "files", label: "Arquivos", path: "/files", icon: FileText },
  { id: "agents", label: "Agentes", path: "/agents", icon: Bot, badge: "6" },
  { id: "pipelines", label: "Pipelines", path: "/pipelines", icon: Workflow },
  { id: "audits", label: "Auditorias", path: "/audits", icon: ShieldCheck },
  { id: "database", label: "Banco de dados", path: "/database", icon: Database },
  { id: "integrations", label: "Integrações", path: "/integrations", icon: Blocks },
  { id: "environment", label: "Ambiente", path: "/environment", icon: Server },
  { id: "observer", label: "Observer", path: "/observer", icon: Terminal },
  { id: "readiness", label: "Readiness", path: "/readiness", icon: Activity },
  { id: "evidence", label: "Evidências", path: "/evidence", icon: Layers },
  { id: "settings", label: "Configurações", path: "/settings", icon: Settings },
];

export function Sidebar() {
  const { currentPath, setCurrentPath, isSidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-white border-r border-slate-200/90 transition-all duration-200 ease-in-out shrink-0 select-none z-30",
        isSidebarCollapsed ? "w-[72px]" : "w-[240px] xl:w-[260px]"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200/80 justify-between">
        <div
          onClick={() => setCurrentPath("/dashboard")}
          className="flex items-center gap-2.5 cursor-pointer group overflow-hidden"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:bg-blue-700 transition-colors">
            {/* NoteAgents Brain / Circuit Logo */}
            <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 leading-none">
                NoteAgents
              </span>
              <span className="text-[10px] text-blue-600 font-medium tracking-tight mt-0.5">
                ENGINEERING CONTROL PLANE
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            (item.path !== "/dashboard" && currentPath.startsWith(item.path));

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPath(item.path)}
              title={isSidebarCollapsed ? item.label : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative",
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />

              {!isSidebarCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!isSidebarCollapsed && item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-md font-mono tabular-nums",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Active Indicator on Left */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r" />
              )}
            </button>
          );
        })}
      </div>

      {/* Sidebar Footer with Collapse Toggle */}
      <div className="p-2 border-t border-slate-200/80 flex items-center justify-between">
        {!isSidebarCollapsed && (
          <span className="text-[11px] text-slate-400 px-2 font-mono">
            v1.4-enterprise
          </span>
        )}
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
          className={cn(
            "p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors",
            isSidebarCollapsed && "w-full flex justify-center"
          )}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
