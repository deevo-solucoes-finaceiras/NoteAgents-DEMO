import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Sliders,
  Camera,
  CheckCircle2,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { UserService } from "../../lib/api/services";

export function ProfileView() {
  const { user, setUser, addToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<"perfil" | "seguranca" | "notificacoes" | "preferencias">("perfil");
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [organization, setOrganization] = useState(user.organization);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await UserService.updateProfile({
      name,
      email,
      role,
      organization,
      timezone: user.timezone,
      language: user.language,
    });
    setUser(updated);
    addToast("Perfil atualizado com sucesso!", "success");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Perfil do Usuário
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Gerenciamento de credenciais, papel no workspace e dados de contato
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Mini Navigation (Panel 12 left) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-5 h-fit">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                VA
              </div>
              <button
                onClick={() => addToast("Seletor de foto ativado.", "info")}
                className="absolute bottom-0 right-0 p-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-blue-600 shadow-2xs"
                title="Alterar foto"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
            {[
              { id: "perfil", label: "Perfil", icon: User },
              { id: "seguranca", label: "Segurança", icon: Shield },
              { id: "notificacoes", label: "Notificações", icon: Bell },
              { id: "preferencias", label: "Preferências", icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Form (Panel 12 right) */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200/90 p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Informações Pessoais</h3>
            <p className="text-xs text-slate-500">
              Dados visíveis na trilha de auditoria e commits de agentes
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organização</label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cargo / Função</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
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
