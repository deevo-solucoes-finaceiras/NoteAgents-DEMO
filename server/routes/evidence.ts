import { Router, Request, Response } from "express";
import { firestoreDb } from "../db";
import crypto from "crypto";

const router = Router();

const INITIAL_EVIDENCE = [
  {
    id: "ev-1",
    projectId: "proj-1",
    projectName: "ViaPay Core",
    type: "Auditoria Criptográfica de Código",
    hashSha256: "8f4e2c1a9b3d5e7f0123456789abcdef0123456789abcdef0123456789abcdef",
    verifiedBy: "Security Agent",
    createdAt: "Hoje, 09:30",
    status: "valido",
    summary: "Verificação estática e teste de penetração em endpoints de liquidação PIX.",
  },
  {
    id: "ev-2",
    projectId: "proj-1",
    projectName: "ViaPay Core",
    type: "Compilação & Testes Unitários",
    hashSha256: "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0",
    verifiedBy: "Frontend Agent",
    createdAt: "Hoje, 10:15",
    status: "valido",
    summary: "Build de produção aprovado com 100% de integridade de tipos TypeScript.",
  },
];

// GET /api/evidence
router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await firestoreDb.collection("evidence").get();
    if (snapshot.empty) {
      const batch = firestoreDb.batch();
      for (const e of INITIAL_EVIDENCE) {
        batch.set(firestoreDb.collection("evidence").doc(e.id), e);
      }
      await batch.commit();
      return res.json(INITIAL_EVIDENCE);
    }
    const evidence = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return res.json(evidence);
  } catch (err: unknown) {
    console.error("GET /api/evidence error:", err);
    return res.json(INITIAL_EVIDENCE);
  }
});

// POST /api/evidence
router.post("/", async (req: Request, res: Response) => {
  try {
    const { projectId = "proj-1", projectName = "ViaPay Core", type, content, summary } = req.body;
    const dataToSign = typeof content === "string" ? content : JSON.stringify(content || req.body);
    const hash = crypto.createHash("sha256").update(dataToSign).digest("hex");

    const newEvidence = {
      id: `ev-${Date.now()}`,
      projectId,
      projectName,
      type: type || "Registro de Execução de Engenharia",
      hashSha256: hash,
      verifiedBy: "NoteAgents Security Auditor",
      createdAt: new Date().toISOString(),
      status: "valido",
      summary: summary || `Evidência computada com hash SHA-256 verificado.`,
    };

    await firestoreDb.collection("evidence").doc(newEvidence.id).set(newEvidence);
    return res.status(201).json(newEvidence);
  } catch (err: unknown) {
    console.error("POST /api/evidence error:", err);
    const msg = err instanceof Error ? err.message : "Erro ao gerar evidência";
    return res.status(500).json({ error: msg });
  }
});

export default router;
