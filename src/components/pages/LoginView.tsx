import React, { useState } from "react";
import { BrainCircuit, Lock, Mail, ArrowRight, Check } from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { LoginSchema, RegisterSchema } from "../../schemas";
import { cn } from "../../lib/utils";

export function LoginView() {
  const { setCurrentPath, addToast } = useAppStore();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("vini@noteagents.dev");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Vini Amaral");
  const [organization, setOrganization] = useState("NoteAgents");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab === "login") {
      const res = LoginSchema.safeParse({ email, password: password.length >= 6 ? password : "password123" });
      if (!res.success) {
        setError(res.error.issues[0]?.message || "Credenciais inválidas");
        return;
      }
      addToast("Autenticado com sucesso! Bem-vindo de volta.", "success");
      setCurrentPath("/dashboard");
    } else {
      const res = RegisterSchema.safeParse({
        name,
        email,
        password: password.length >= 8 ? password : "password123",
        organization,
      });
      if (!res.success) {
        setError(res.error.issues[0]?.message || "Dados de cadastro inválidos");
        return;
      }
      addToast("Conta corporativa criada com sucesso!", "success");
      setCurrentPath("/dashboard");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-6">
        {/* Brand Lockup (Panel 14) */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">NoteAgents</h2>
          <p className="text-xs text-slate-500">
            {tab === "login" ? "Acesse sua estação de engenharia" : "Crie seu workspace assistido"}
          </p>
        </div>

        {/* Tabs: Entrar / Criar conta (Panel 14) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setTab("login");
              setError(null);
            }}
            className={cn(
              "py-1.5 text-xs font-semibold rounded-lg transition-colors",
              tab === "login" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            className={cn(
              "py-1.5 text-xs font-semibold rounded-lg transition-colors",
              tab === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            )}
          >
            Criar conta
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {tab === "register" && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organização</label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Empresa ou time"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">Senha</label>
              {tab === "login" && (
                <button
                  type="button"
                  onClick={() => addToast("Link de recuperação enviado.", "info")}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>{tab === "login" ? "Entrar" : "Criar Conta"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
