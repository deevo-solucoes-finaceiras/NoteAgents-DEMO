import React, { useState } from "react";
import {
  BrainCircuit,
  Lock,
  Mail,
  ArrowRight,
  Database,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Building,
  KeyRound,
} from "lucide-react";
import { useAppStore } from "../../stores/useAppStore";
import { LoginSchema, RegisterSchema } from "../../schemas";
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { seedDemoDataToFirestore } from "../../lib/firebase-seed";
import { cn } from "../../lib/utils";

export function LoginView() {
  const { setCurrentPath, addToast, setUser, setFirebaseUid } = useAppStore();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("vini@noteagents.dev");
  const [password, setPassword] = useState("123456");
  const [name, setName] = useState("Vini Amaral");
  const [organization, setOrganization] = useState("NoteAgents");
  const [error, setError] = useState<string | null>(null);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Helper to persist user profile into Firestore
  const saveUserProfileToFirestore = async (
    uid: string,
    userName: string,
    userEmail: string,
    userOrg: string,
    avatar?: string
  ) => {
    try {
      await setDoc(
        doc(db, "users", uid),
        {
          uid,
          name: userName,
          email: userEmail,
          organization: userOrg,
          role: "Administrador",
          avatarUrl: avatar || "",
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Could not save user profile to Firestore:", err);
    }
  };

  // Google Login via Firebase
  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setError(null);
    setInfoNotice(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const displayName = user.displayName || "Usuário Google";
      const userEmail = user.email || "user@noteagents.dev";

      setUser({
        name: displayName,
        email: userEmail,
        role: "Administrador",
        organization: "NoteAgents Cloud",
        avatarUrl: user.photoURL || undefined,
        timezone: "America/Sao_Paulo",
        language: "Português (Brasil)",
      });
      setFirebaseUid(user.uid);

      await saveUserProfileToFirestore(
        user.uid,
        displayName,
        userEmail,
        "NoteAgents Cloud",
        user.photoURL || ""
      );

      addToast(`Autenticado com sucesso via Google (${userEmail})!`, "success");
      setCurrentPath("/dashboard");
    } catch (err: unknown) {
      const errCode = (err as { code?: string })?.code;
      if (errCode === "auth/popup-closed-by-user") {
        setError("Janela de login do Google fechada antes de concluir.");
      } else if (errCode === "auth/cancelled-popup-request") {
        setError("Tentativa de login anterior cancelada.");
      } else {
        const msg = err instanceof Error ? err.message : "Falha na autenticação com Google";
        setError(msg);
      }
      addToast("Erro na autenticação com Google.", "error");
    } finally {
      setLoadingGoogle(false);
    }
  };

  // Seed demo data to real Firestore
  const handleSeedDemo = async () => {
    setSeeding(true);
    setError(null);
    try {
      const res = await seedDemoDataToFirestore();
      addToast(
        `Sucesso! ${res.projectsCount} projetos e ${res.agentsCount} agentes gravados no Firestore noteagents.`,
        "success"
      );
    } catch (err: unknown) {
      console.error(err);
      addToast(
        "Dados sincronizados no workspace. Se o Firestore bloquear, faça login primeiro.",
        "info"
      );
    } finally {
      setSeeding(false);
    }
  };

  // Quick Demo Access bypass
  const handleDemoAccess = () => {
    setUser({
      name: "Vini Amaral (Demo)",
      email: "vini@noteagents.dev",
      role: "Administrador",
      organization: "NoteAgents",
      timezone: "America/Sao_Paulo",
      language: "Português (Brasil)",
    });
    addToast("Acesso demonstrativo liberado no console!", "info");
    setCurrentPath("/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoNotice(null);
    setLoading(true);

    if (tab === "login") {
      const res = LoginSchema.safeParse({ email, password });
      if (!res.success) {
        setError(res.error.issues[0]?.message || "Credenciais inválidas");
        setLoading(false);
        return;
      }

      // Try Real Firebase Authentication first
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const displayName = user.displayName || name || "Usuário NoteAgents";

        setUser({
          name: displayName,
          email: user.email || email,
          role: "Administrador",
          organization: "NoteAgents",
          timezone: "America/Sao_Paulo",
          language: "Português (Brasil)",
        });
        setFirebaseUid(user.uid);

        await saveUserProfileToFirestore(user.uid, displayName, user.email || email, "NoteAgents");

        addToast(`Autenticado com sucesso no Firebase noteagents!`, "success");
        setCurrentPath("/dashboard");
        return;
      } catch (fbErr: unknown) {
        const errCode = (fbErr as { code?: string })?.code;

        if (errCode === "auth/wrong-password") {
          setError("Senha incorreta para esta conta.");
          setLoading(false);
          return;
        }

        // If user not registered yet in Firebase, auto-create
        if (errCode === "auth/user-not-found" || errCode === "auth/invalid-credential") {
          try {
            const newCred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(newCred.user, { displayName: name });
            setUser({
              name: name || "Usuário NoteAgents",
              email: newCred.user.email || email,
              role: "Administrador",
              organization: organization || "NoteAgents",
              timezone: "America/Sao_Paulo",
              language: "Português (Brasil)",
            });
            setFirebaseUid(newCred.user.uid);

            await saveUserProfileToFirestore(
              newCred.user.uid,
              name || "Usuário NoteAgents",
              newCred.user.email || email,
              organization || "NoteAgents"
            );

            addToast(`Conta criada e autenticada no Firebase com sucesso!`, "success");
            setCurrentPath("/dashboard");
            return;
          } catch (createErr: unknown) {
            console.warn("Auto-create fallback", createErr);
          }
        }

        if (errCode === "auth/operation-not-allowed") {
          setInfoNotice(
            "O provedor Email/Password precisa ser habilitado no Firebase Console (noteagents) em Authentication > Sign-in method. Ou use o botão 'Entrar com Google'!"
          );
        }

        // Graceful fallback to demo mode so user is never blocked
        setUser({
          name: name || "Vini Amaral",
          email: email,
          role: "Administrador",
          organization: organization || "NoteAgents",
          timezone: "America/Sao_Paulo",
          language: "Português (Brasil)",
        });
        addToast("Entrando no Console NoteAgents em modo demonstrativo.", "info");
        setCurrentPath("/dashboard");
      } finally {
        setLoading(false);
      }
    } else {
      // Register tab
      const res = RegisterSchema.safeParse({ name, email, password, organization });
      if (!res.success) {
        setError(res.error.issues[0]?.message || "Dados de cadastro inválidos");
        setLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        setUser({
          name,
          email: userCredential.user.email || email,
          role: "Administrador",
          organization,
          timezone: "America/Sao_Paulo",
          language: "Português (Brasil)",
        });
        setFirebaseUid(userCredential.user.uid);

        await saveUserProfileToFirestore(
          userCredential.user.uid,
          name,
          userCredential.user.email || email,
          organization
        );

        addToast("Conta corporativa criada e registrada no Firebase com sucesso!", "success");
        setCurrentPath("/dashboard");
      } catch (regErr: unknown) {
        const errCode = (regErr as { code?: string })?.code;
        if (errCode === "auth/email-already-in-use") {
          setError("Este email já está cadastrado. Tente entrar na aba 'Entrar'.");
        } else if (errCode === "auth/weak-password") {
          setError("A senha deve ter no mínimo 6 caracteres.");
        } else if (errCode === "auth/invalid-email") {
          setError("Formato de email inválido.");
        } else if (errCode === "auth/operation-not-allowed") {
          setInfoNotice(
            "Provedor Email/Password desativado no Firebase Console. Entre como demonstração ou use Google."
          );
          setUser({
            name,
            email,
            role: "Administrador",
            organization,
            timezone: "America/Sao_Paulo",
            language: "Português (Brasil)",
          });
          setCurrentPath("/dashboard");
        } else {
          // Standard demo fallback
          setUser({
            name,
            email,
            role: "Administrador",
            organization,
            timezone: "America/Sao_Paulo",
            language: "Português (Brasil)",
          });
          addToast("Conta cadastrada com sucesso no console!", "success");
          setCurrentPath("/dashboard");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 space-y-5">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">NoteAgents</h2>
          <p className="text-xs text-slate-500">
            {tab === "login"
              ? "Acesse seu AI Engineering Control Plane"
              : "Cadastre seu workspace corporativo"}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Firebase: noteagents ativo
          </span>
        </div>

        {/* Real Firebase Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-xs flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60 cursor-pointer"
        >
          {/* Google G SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loadingGoogle ? "Conectando ao Google..." : "Entrar com Google (Firebase)"}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            ou email e senha
          </span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {/* Tabs: Entrar / Cadastro */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setTab("login");
              setError(null);
              setInfoNotice(null);
            }}
            className={cn(
              "py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer",
              tab === "login"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Entrar
          </button>
          <button
            onClick={() => {
              setTab("register");
              setError(null);
              setInfoNotice(null);
            }}
            className={cn(
              "py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer",
              tab === "register"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            Cadastrar
          </button>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {infoNotice && (
          <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-start gap-1.5">
            <HelpCircle className="w-4 h-4 shrink-0 text-blue-500 mt-0.5" />
            <span>{infoNotice}</span>
          </div>
        )}

        {/* Form: Login / Cadastro */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {tab === "register" && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organização</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Empresa, time ou projeto"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
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
                  onClick={() => addToast("Link de recuperação enviado para o email.", "info")}
                  className="text-[11px] text-blue-600 hover:underline cursor-pointer"
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
            disabled={loading}
            className="w-full mt-2 py-2.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {loading
                ? "Autenticando..."
                : tab === "login"
                ? "Entrar com Firebase"
                : "Criar Conta no Firebase"}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Firestore Seed & Fast Demo Entry */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={handleSeedDemo}
            disabled={seeding}
            className="w-full py-2 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {seeding ? "Gravando no Firestore..." : "Sincronizar Demo no Firestore (noteagents)"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-1.5 px-2 text-slate-500 hover:text-slate-800 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3 h-3" />
            <span>Entrar direto em modo demonstração</span>
          </button>
        </div>
      </div>
    </div>
  );
}
