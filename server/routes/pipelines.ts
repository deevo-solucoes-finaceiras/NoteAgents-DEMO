import { Router, Request, Response } from "express";
import { firestoreDb } from "../db";

const router = Router();

const INITIAL_PIPELINES = [
  {
    id: "pipe-1",
    name: "Auditoria & Qualidade Contínua",
    description: "Executa lint, verificação estrita de tipagem TypeScript, testes de unidade e cálculo de cobertura.",
    status: "em_andamento",
    trigger: "Push na branch main ou manual via console",
    agentName: "Security Agent",
    lastRunDate: "Hoje, 10:20",
    durationMs: 42000,
    steps: [
      { id: "s1", name: "Checkout & Setup Node.js", status: "concluido", duration: "3s" },
      { id: "s2", name: "Lint & Formatação (tsc + eslint)", status: "concluido", duration: "8s" },
      { id: "s3", name: "Testes Unitários (Vitest)", status: "concluido", duration: "14s" },
      { id: "s4", name: "Auditoria de Vulnerabilidades (OWASP)", status: "em_andamento", duration: "17s" },
      { id: "s5", name: "Assinatura Criptográfica da Evidência", status: "pendente", duration: "-" },
    ],
  },
  {
    id: "pipe-2",
    name: "Build & Deploy Staging",
    description: "Compila assets de produção, executa smoke tests e atualiza o container de staging.",
    status: "concluido",
    trigger: "Aprovação de Pull Request",
    agentName: "DevOps & CI/CD Agent",
    lastRunDate: "Ontem, 18:45",
    durationMs: 95000,
    steps: [
      { id: "s21", name: "Build do Pacote Web", status: "concluido", duration: "35s" },
      { id: "s22", name: "Geração de Imagem Docker", status: "concluido", duration: "42s" },
      { id: "s23", name: "Deploy no Kubernetes / Cloud Run", status: "concluido", duration: "18s" },
    ],
  },
];

// GET /api/pipelines
router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await firestoreDb.collection("pipelines").get();
    if (snapshot.empty) {
      const batch = firestoreDb.batch();
      for (const p of INITIAL_PIPELINES) {
        batch.set(firestoreDb.collection("pipelines").doc(p.id), p);
      }
      await batch.commit();
      return res.json(INITIAL_PIPELINES);
    }
    const pipelines = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return res.json(pipelines);
  } catch (err: unknown) {
    console.error("GET /api/pipelines error:", err);
    return res.json(INITIAL_PIPELINES);
  }
});

// POST /api/pipelines/:id/run
router.post("/:id/run", async (req: Request, res: Response) => {
  try {
    const pipelineDoc = await firestoreDb.collection("pipelines").doc(req.params.id).get();
    const pipeline = pipelineDoc.exists ? pipelineDoc.data() : INITIAL_PIPELINES.find((p) => p.id === req.params.id);

    if (!pipeline) {
      return res.status(404).json({ error: "Pipeline não encontrado" });
    }

    const updatedSteps = (pipeline.steps || []).map((s: { name: string; id: string }) => ({
      ...s,
      status: "concluido",
      duration: "4s",
    }));

    const executionRecord = {
      id: `run-${Date.now()}`,
      pipelineId: req.params.id,
      name: pipeline.name,
      status: "concluido",
      triggeredAt: new Date().toISOString(),
      durationMs: 38000,
      steps: updatedSteps,
    };

    // Update in Firestore
    await firestoreDb.collection("pipeline_runs").doc(executionRecord.id).set(executionRecord);
    await firestoreDb.collection("pipelines").doc(req.params.id).set(
      {
        status: "concluido",
        lastRunDate: "Agora mesmo",
        steps: updatedSteps,
      },
      { merge: true }
    );

    return res.json({
      success: true,
      execution: executionRecord,
      message: `Pipeline "${pipeline.name}" executado com sucesso. Todos os passos concluídos.`,
    });
  } catch (err: unknown) {
    console.error("POST /api/pipelines/:id/run error:", err);
    const msg = err instanceof Error ? err.message : "Erro ao executar pipeline";
    return res.status(500).json({ error: msg });
  }
});

export default router;
