import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileDrawer } from "./MobileDrawer";
import { CommandPalette } from "./CommandPalette";
import { useAppStore } from "../../stores/useAppStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar />

      {/* Mobile Drawer (Hidden on md+) */}
      <MobileDrawer />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette />

      {/* Main Column */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Global Header */}
        <Header />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border shadow-lg text-xs font-medium animate-in slide-in-from-bottom duration-200",
                toast.type === "success" && "bg-emerald-50 text-emerald-900 border-emerald-200",
                toast.type === "error" && "bg-rose-50 text-rose-900 border-rose-200",
                toast.type === "warning" && "bg-amber-50 text-amber-900 border-amber-200",
                toast.type === "info" && "bg-slate-900 text-white border-slate-800"
              )}
            >
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {toast.type === "info" && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <span>{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-2 text-current opacity-60 hover:opacity-100 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
