import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Sliders,
  Camera,
  CheckCircle2,
  KeyRound,
  LogOut,
  Mail,
  Lock,
  ExternalLink,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { UserService } from "../../lib/api/services";
import { auth, signOut } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export function ProfileView() {
  const { user, setUser, addToast, setCurrentPath, firebaseUid } = useAppStore();
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

  const handlePasswordReset = async () => {
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email);
      addToast(`Email de redefinição de senha enviado para ${email}.`, "success");
    } catch {
      addToast("Instruções de recuperação geradas para o email.", "info");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("SignOut error", err);
    }
    setCurrentPath("/login");
    addToast("Você saiu da conta.", "info");
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
        {/* Left Column: Avatar & Mini Navigation */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 space-y-5 h-fit">
          <div className="flex items-center gap-3">
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover border border-slate-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <button
                onClick={() => addToast("Seletor de foto ativado.", "info")}
                className="absolute bottom-0 right-0 p-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-blue-600 shadow-2xs cursor-pointer"
                title="Alterar foto"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-400">{user.role}</p>
              {firebaseUid && (
                <span className="inline-block text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 border border-emerald-200">
                  Firebase Conectado
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
            {[
              { id: "perfil", label: "Perfil", icon: User },
              { id: "seguranca", label: "Segurança & Firebase", icon: Shield },
              { id: "notificacoes", label: "Notificações", icon: Bell },
              { id: "preferencias", label: "Preferências", icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors text-left cursor-pointer ${
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

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Desconectar Conta</span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200/90 p-6 space-y-4">
          {activeTab === "perfil" && (
            <>
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
                    className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </>
          )}

          {activeTab === "seguranca" && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-base font-bold text-slate-900">Segurança & Autenticação</h3>
                <p className="text-xs text-slate-500">
                  Controle de acesso e integração com Firebase Authentication
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-slate-900">Provedor de Identidade</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Firebase Auth
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-slate-600 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Projeto Firebase</span>
                    <span className="font-mono font-medium text-slate-800">noteagents</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">UID do Usuário</span>
                    <span className="font-mono font-medium text-slate-800 truncate block">
                      {firebaseUid || auth.currentUser?.uid || "Sessão Local"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-slate-500" />
                  Redefinição de Senha
                </h4>
                <p className="text-slate-500">
                  Envia um link seguro de recuperação e alteração de senha para o email{" "}
                  <strong className="text-slate-700">{email}</strong> via Firebase Auth.
                </p>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Enviar link de redefinição
                </button>
              </div>

              <div className="p-4 border border-rose-200 bg-rose-50/50 rounded-xl space-y-2">
                <h4 className="font-semibold text-rose-900">Encerrar Sessão</h4>
                <p className="text-rose-700 text-[11px]">
                  Desconecta sua conta do Firebase neste navegador e retorna à tela de login.
                </p>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Sair do NoteAgents
                </button>
              </div>
            </div>
          )}

          {activeTab === "notificacoes" && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Preferências de Notificações</h3>
              <p className="text-slate-500">Configuração de alertas e relatórios por email e push</p>
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Notificar quando uma auditoria encontrar problemas críticos</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Notificar conclusão de execuções de agentes (Pipelines)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span>Relatório semanal de saúde dos projetos</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "preferencias" && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-bold text-slate-900">Preferências do Sistema</h3>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Idioma</label>
                  <select
                    defaultValue="pt-BR"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fuso Horário</label>
                  <select
                    defaultValue="America/Sao_Paulo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="America/Sao_Paulo">America/Sao_Paulo (UTC-3)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
