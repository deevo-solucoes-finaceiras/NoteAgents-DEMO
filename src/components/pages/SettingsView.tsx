import React, { useState } from "react";
import {
  Settings,
  Shield,
  Users,
  Bot,
  Server,
  Bell,
  Palette,
  Check,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { cn } from "../../lib/utils";

export function SettingsView() {
  const { addToast } = useAppStore();
  const [activeSection, setActiveSection] = useState("geral");
  const [orgName, setOrgName] = useState("NoteAgents");
  const [contactEmail, setContactEmail] = useState("contato@noteagents.dev");
  const [timezone, setTimezone] = useState("(UTC-3) América/São Paulo");
  const [language, setLanguage] = useState("Português (Brasil)");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast("Configurações salvas com sucesso!", "success");
  };

  const navItems = [
    { id: "geral", label: "Geral", icon: Settings },
    { id: "seguranca", label: "Segurança", icon: Shield },
    { id: "equipe", label: "Equipe", icon: Users },
    { id: "modelos", label: "Modelos de IA", icon: Bot },
    { id: "ambiente", label: "Ambiente", icon: Server },
    { id: "notificacoes", label: "Notificações", icon: Bell },
    { id: "aparencia", label: "Aparência", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Header (Panel 11) */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Configurações
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Parâmetros organizacionais, regras de autenticação e preferências do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation Menu (Panel 11 left) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-2 space-y-1 h-fit">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
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

        {/* Form Container (Panel 11 right) */}
        <div className="md:col-span-3 bg-white rounded-xl border border-slate-200/90 p-6 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Configurações Gerais</h3>
            <p className="text-xs text-slate-500">
              Dados principais da organização e preferências regionais
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs max-w-xl">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nome da Organização
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Fuso Horário
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
                >
                  <option value="(UTC-3) América/São Paulo">(UTC-3) América/São Paulo</option>
                  <option value="(UTC-0) UTC London">(UTC-0) UTC London</option>
                  <option value="(UTC-5) America/New_York">(UTC-5) America/New_York</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Idioma
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
                >
                  <option value="Português (Brasil)">Português (Brasil)</option>
                  <option value="English (US)">English (US)</option>
                  <option value="Español">Español</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
