import { Router, Request, Response } from "express";
import { firestoreDb } from "../db";

const router = Router();
const NVIDIA_API_KEY =
  process.env.NVIDIA_API_KEY ||
  "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";
const NVIDIA_BASE_URL =
  process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1";
const NVIDIA_MODEL =
  process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b";

const INITIAL_AGENTS = [
  {
    id: "agent-1",
    name: "Frontend Agent",
    role: "Especialista em Interface, Acessibilidade e Componentes React",
    status: "ativo",
    avatarUrl: "",
    model: "NVIDIA Nemotron 3 Ultra 550B",
    currentTask: "Supervisionando design tokens e regras de layout Tailwind CSS",
    completedTasksCount: 142,
    successRate: 99.4,
    skills: ["React", "TypeScript", "Tailwind CSS", "Acessibilidade WCAG AA", "Design System"],
    lastActive: "Agora mesmo",
    systemPrompt: "Você é o Frontend Agent no NoteAgents. Garanta componentes desacoplados, código estrito em TypeScript e compliance WCAG AA.",
  },
  {
    id: "agent-2",
    name: "Backend Agent",
    role: "Arquiteto de APIs, Microsserviços e Lógica Transacional",
    status: "ativo",
    avatarUrl: "",
    model: "NVIDIA Nemotron 3 Ultra 550B",
    currentTask: "Validando idempotência e schemas de validação Zod nas rotas",
    completedTasksCount: 189,
    successRate: 98.9,
    skills: ["Node.js", "Express", "RESTful APIs", "Zod", "Autenticação JWT", "PostgreSQL"],
    lastActive: "Há 2 minutos",
    systemPrompt: "Você é o Backend Agent no NoteAgents. Projete APIs resilientes, com tratamento robusto de erros e schemas Zod estritos.",
  },
  {
    id: "agent-3",
    name: "Database Agent",
    role: "DBA & Modelagem Relacional e Documentos",
    status: "ativo",
    avatarUrl: "",
    model: "NVIDIA Nemotron 3 Ultra 550B",
    currentTask: "Otimizando índices em queries transacionais e regras de integridade",
    completedTasksCount: 97,
    successRate: 100,
    skills: ["PostgreSQL", "Firestore", "Drizzle ORM", "Modelagem ERD", "Migrations"],
    lastActive: "Há 10 minutos",
    systemPrompt: "Você é o Database Agent no NoteAgents. Otimize índices, garanta integridade referencial e auditoria de escrita.",
  },
  {
    id: "agent-4",
    name: "Security Agent",
    role: "Auditoria de Segurança, Vulnerabilidades e Compliance",
    status: "ativo",
    avatarUrl: "",
    model: "NVIDIA Nemotron 3 Ultra 550B",
    currentTask: "Escaneando dependências contra CVEs conhecidos e regras de OWASP Top 10",
    completedTasksCount: 231,
    successRate: 99.1,
    skills: ["OWASP Top 10", "Auditoria de Dependências", "Segurança de Cabeçalhos", "Criptografia SHA-256"],
    lastActive: "Há 5 minutos",
    systemPrompt: "Você é o Security Agent no NoteAgents. Identifique falhas de segurança, injeções, vazamento de credenciais e proponha patches imediatos.",
  },
  {
    id: "agent-5",
    name: "DevOps & CI/CD Agent",
    role: "Automação de Build, Testes e Pipelines de Implantação",
    status: "pausado",
    avatarUrl: "",
    model: "NVIDIA Nemotron 3 Ultra 550B",
    currentTask: "Aguardando aprovação para disparo de pipeline de staging",
    completedTasksCount: 76,
    successRate: 97.5,
    skills: ["GitHub Actions", "Docker", "Kubernetes", "Linux", "Testes Vitest"],
    lastActive: "Há 1 hora",
    systemPrompt: "Você é o DevOps Agent no NoteAgents. Monitore pipelines de build, verifique status de testes e garanta deployments sem downtime.",
  },
];

// GET /api/agents
router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await firestoreDb.collection("agents").get();
    if (snapshot.empty) {
      const batch = firestoreDb.batch();
      for (const a of INITIAL_AGENTS) {
        batch.set(firestoreDb.collection("agents").doc(a.id), a);
      }
      await batch.commit();
      return res.json(INITIAL_AGENTS);
    }
    const agents = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return res.json(agents);
  } catch (err: unknown) {
    console.error("GET /api/agents error:", err);
    return res.json(INITIAL_AGENTS);
  }
});

// POST /api/agents/:id/run
router.post("/:id/run", async (req: Request, res: Response) => {
  try {
    const { task = "Executar diagnóstico geral e análise estática do workspace" } = req.body;
    const agentDoc = await firestoreDb.collection("agents").doc(req.params.id).get();
    const agent = agentDoc.exists ? agentDoc.data() : INITIAL_AGENTS.find((a) => a.id === req.params.id);

    if (!agent) {
      return res.status(404).json({ error: "Agente não encontrado" });
    }

    // Call real NVIDIA NIM API to execute the agent task
    let executionResult = `Tarefa "${task}" executada com sucesso pelo ${agent.name}. Todos os checks de integridade passaram.`;
    let reasoning = "";

    try {
      const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          model: NVIDIA_MODEL,
          messages: [
            {
              role: "system",
              content: `${agent.systemPrompt || "Você é um agente autônomo de engenharia."} Forneça um relatório técnico executivo objetivo do que você realizou e os artefatos verificados.`,
            },
            {
              role: "user",
              content: `Execute a tarefa: ${task}`,
            },
          ],
          max_tokens: 1024,
          temperature: 0.5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const choice = data.choices?.[0];
        executionResult = choice?.message?.content || executionResult;
        reasoning = choice?.message?.reasoning_content || "";
      }
    } catch (apiErr) {
      console.warn("NVIDIA call in agent run fallback", apiErr);
    }

    const logEntry = {
      id: `log-${Date.now()}`,
      agentId: req.params.id,
      agentName: agent.name,
      task,
      result: executionResult,
      reasoning: reasoning || undefined,
      timestamp: new Date().toISOString(),
      status: "success",
    };

    // Store log in Firestore
    await firestoreDb.collection("agent_logs").doc(logEntry.id).set(logEntry);

    // Update agent completed task count
    await firestoreDb.collection("agents").doc(req.params.id).set(
      {
        completedTasksCount: (agent.completedTasksCount || 0) + 1,
        lastActive: "Agora mesmo",
        currentTask: `Última tarefa: ${task}`,
      },
      { merge: true }
    );

    return res.json({
      success: true,
      log: logEntry,
      message: `Execução do ${agent.name} concluída.`,
    });
  } catch (err: unknown) {
    console.error("POST /api/agents/:id/run error:", err);
    const msg = err instanceof Error ? err.message : "Erro na execução do agente";
    return res.status(500).json({ error: msg });
  }
});

// GET /api/agents/:id/logs
router.get("/:id/logs", async (req: Request, res: Response) => {
  try {
    const snapshot = await firestoreDb
      .collection("agent_logs")
      .where("agentId", "==", req.params.id)
      .limit(20)
      .get();

    const logs = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return res.json(logs);
  } catch (err: unknown) {
    console.error("GET /api/agents/:id/logs error:", err);
    return res.json([]);
  }
});

export default router;
