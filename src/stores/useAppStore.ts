import { create } from "zustand";
import { Project, UserProfile } from "../types";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

interface AppState {
  // Navigation & Shell
  currentPath: string;
  setCurrentPath: (path: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;

  // Selected Project
  currentProjectId: string;
  setCurrentProjectId: (id: string) => void;

  // Command Palette
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage["type"]) => void;
  removeToast: (id: string) => void;

  // User Profile
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Auditoria Finalizada",
    message: "A auditoria de segurança detectou 3 apontamentos críticos no projeto ViaPay.",
    type: "warning",
    timestamp: "Há 10 min",
    read: false,
    link: "/audits",
  },
  {
    id: "notif-2",
    title: "Agente DevOps Concluído",
    message: "Build e verificação de containers Docker finalizados com sucesso.",
    type: "success",
    timestamp: "Há 25 min",
    read: false,
    link: "/runs",
  },
  {
    id: "notif-3",
    title: "Setup de Ambiente",
    message: "Todos os serviços locais (PostgreSQL e Redis) estão conectados.",
    type: "info",
    timestamp: "Há 1 hora",
    read: true,
    link: "/environment",
  },
];

export const useAppStore = create<AppState>((set, get) => {
  // Initialize initial route from browser URL if available
  const initialPath = typeof window !== "undefined" ? window.location.pathname || "/dashboard" : "/dashboard";
  const savedCollapsed = typeof window !== "undefined" ? localStorage.getItem("noteagents_sidebar_collapsed") === "true" : false;
  const savedProject = typeof window !== "undefined" ? localStorage.getItem("noteagents_current_project") || "proj-1" : "proj-1";

  return {
    currentPath: initialPath === "/" ? "/dashboard" : initialPath,
    setCurrentPath: (path: string) => {
      if (typeof window !== "undefined" && window.location.pathname !== path) {
        window.history.pushState({}, "", path);
      }
      set({ currentPath: path, isMobileDrawerOpen: false });
    },
    isSidebarCollapsed: savedCollapsed,
    toggleSidebar: () => {
      const next = !get().isSidebarCollapsed;
      if (typeof window !== "undefined") {
        localStorage.setItem("noteagents_sidebar_collapsed", String(next));
      }
      set({ isSidebarCollapsed: next });
    },
    setSidebarCollapsed: (collapsed: boolean) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("noteagents_sidebar_collapsed", String(collapsed));
      }
      set({ isSidebarCollapsed: collapsed });
    },
    isMobileDrawerOpen: false,
    setMobileDrawerOpen: (open: boolean) => set({ isMobileDrawerOpen: open }),

    currentProjectId: savedProject,
    setCurrentProjectId: (id: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("noteagents_current_project", id);
      }
      set({ currentProjectId: id });
    },

    isCommandPaletteOpen: false,
    setCommandPaletteOpen: (open: boolean) => set({ isCommandPaletteOpen: open }),

    notifications: DEFAULT_NOTIFICATIONS,
    addNotification: (n) =>
      set((state) => ({
        notifications: [
          {
            ...n,
            id: `notif-${Date.now()}`,
            timestamp: "Agora mesmo",
            read: false,
          },
          ...state.notifications,
        ],
      })),
    markNotificationAsRead: (id: string) =>
      set((state) => ({
        notifications: state.notifications.map((item) =>
          item.id === id ? { ...item, read: true } : item
        ),
      })),
    clearNotifications: () => set({ notifications: [] }),

    toasts: [],
    addToast: (message: string, type: ToastMessage["type"] = "info") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
      setTimeout(() => {
        get().removeToast(id);
      }, 4000);
    },
    removeToast: (id: string) =>
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

    user: {
      name: "Vini Amaral",
      email: "vini@noteagents.dev",
      role: "Administrador",
      organization: "NoteAgents",
      timezone: "America/Sao_Paulo",
      language: "Português (Brasil)",
    },
    setUser: (user) => set({ user }),
  };
});
