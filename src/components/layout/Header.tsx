import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  User,
  ChevronDown,
  Key,
  Shield,
  Sliders,
  LogOut,
  Check,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { ProjectSelector } from "./ProjectSelector";
import { cn } from "../../lib/utils";

export function Header() {
  const {
    currentPath,
    setCurrentPath,
    setMobileDrawerOpen,
    setCommandPaletteOpen,
    notifications,
    markNotificationAsRead,
    user,
    addToast,
  } = useAppStore();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Breadcrumbs title helper
  const getBreadcrumbTitle = (path: string): string => {
    if (path.startsWith("/projects")) return "Projetos";
    if (path.startsWith("/chat")) return "Chat com IA";
    if (path.startsWith("/knowledge")) return "Fontes e Conhecimento";
    if (path.startsWith("/audits")) return "Auditoria e Verificação";
    if (path.startsWith("/agents")) return "Agentes de IA";
    if (path.startsWith("/pipelines")) return "Pipelines de Execução";
    if (path.startsWith("/database")) return "Banco de Dados";
    if (path.startsWith("/environment")) return "Ambiente de Desenvolvimento";
    if (path.startsWith("/integrations")) return "Integrações";
    if (path.startsWith("/observer")) return "Observer & Logs";
    if (path.startsWith("/workspace")) return "Workspace";
    if (path.startsWith("/readiness")) return "Production Readiness";
    if (path.startsWith("/evidence")) return "Evidências Auditadas";
    if (path.startsWith("/settings/profile")) return "Perfil do Usuário";
    if (path.startsWith("/settings")) return "Configurações";
    if (path.startsWith("/documentacao")) return "Documentação";
    return "Dashboard";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between z-20 shrink-0">
      {/* Left zone: Mobile hamburger + ProjectSelector + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <ProjectSelector />

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400">
          <span>/</span>
          <span className="text-slate-700 font-medium">{getBreadcrumbTitle(currentPath)}</span>
        </div>
      </div>

      {/* Middle/Right zone: Search, Notifications, Help, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Buscar...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-3 space-y-2 animate-in fade-in duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-900">
                    Notificações do Sistema
                  </span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                    {unreadCount} novas
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1.5">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markNotificationAsRead(item.id);
                        if (item.link) {
                          setCurrentPath(item.link);
                          setIsNotificationsOpen(false);
                        }
                      }}
                      className={cn(
                        "p-2.5 rounded-lg text-xs transition-colors cursor-pointer border",
                        item.read
                          ? "bg-white border-transparent text-slate-500"
                          : "bg-blue-50/50 border-blue-100 text-slate-800"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900">{item.title}</span>
                        <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-normal">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Documentation Link */}
        <button
          onClick={() => setCurrentPath("/documentacao")}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="Documentação e Guias"
          aria-label="Documentação"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              VA
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-400 leading-none">
                {user.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-2 space-y-1 animate-in fade-in duration-100 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentPath("/settings/profile");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Perfil do Usuário
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentPath("/settings");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  Configurações Gerais
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentPath("/settings");
                    addToast("Painel de chaves de API carregado.", "info");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Chaves de API
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setCurrentPath("/audits");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Políticas de Segurança
                </button>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setCurrentPath("/login");
                      addToast("Sessão finalizada com segurança.", "info");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    Sair da Conta
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
