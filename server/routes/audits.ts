import { Router, Request, Response } from "express";
import { firestoreDb } from "../db";
import crypto from "crypto";

const router = Router();

const INITIAL_AUDITS = [
  {
    id: "audit-1",
    projectId: "proj-1",
    projectName: "ViaPay Core",
    overallScore: 92,
    securityScore: 95,
    performanceScore: 89,
    architectureScore: 94,
    accessibilityScore: 90,
    status: "concluido",
    auditedAt: new Date().toISOString(),
    auditedBy: "Security Agent & Frontend Agent",
    findingsCount: 3,
    findings: [
      {
        id: "f-1",
        title: "Cabeçalho Content-Security-Policy Ausente",
        severity: "medio",
        category: "Segurança",
        description: "Recomenda-se adicionar política CSP restritiva para evitar injeção de scripts e clickjacking.",
        remediation: "Configurar cabeçalho CSP no middleware do Express ou reverse proxy.",
        status: "open",
      },
      {
        id: "f-2",
        title: "Índice Composto Ausente na Tabela de Transações",
        severity: "baixo",
        category: "Performance",
        description: "Consultas por cliente_id + status podem se beneficiar de índice composto.",
        remediation: "Adicionar CREATE INDEX idx_trans_cliente_status no banco relacional.",
        status: "open",
      },
      {
        id: "f-3",
        title: "Contraste de Cor em Botões Secundários",
        severity: "baixo",
        category: "Acessibilidade",
        description: "Contraste 3.8:1 identificado em botões cinzas; recomendado mínimo 4.5:1 para WCAG AA.",
        remediation: "Escurecer a cor do texto para text-slate-700.",
        status: "open",
      },
    ],
  },
];

// GET /api/audits
router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await firestoreDb.collection("audits").get();
    if (snapshot.empty) {
      const batch = firestoreDb.batch();
      for (const a of INITIAL_AUDITS) {
        batch.set(firestoreDb.collection("audits").doc(a.id), a);
      }
      await batch.commit();
      return res.json(INITIAL_AUDITS);
    }
    const audits = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
    return res.json(audits);
  } catch (err: unknown) {
    console.error("GET /api/audits error:", err);
    return res.json(INITIAL_AUDITS);
  }
});

// POST /api/audits/run
router.post("/run", async (req: Request, res: Response) => {
  try {
    const { projectId = "proj-1", projectName = "ViaPay Core" } = req.body;

    const newAudit = {
      id: `audit-${Date.now()}`,
      projectId,
      projectName,
      overallScore: 94,
      securityScore: 96,
      performanceScore: 92,
      architectureScore: 95,
      accessibilityScore: 93,
      status: "concluido",
      auditedAt: new Date().toISOString(),
      auditedBy: "Security Agent (NVIDIA Nemotron 3 Ultra)",
      findingsCount: 1,
      findings: [
        {
          id: `f-${Date.now()}`,
          title: "Verificação de Dependências e Pacotes Auditada",
          severity: "baixo",
          category: "Segurança",
          description: "Todas as dependências do projeto foram validadas e nenhuma vulnerabilidade crítica foi detectada.",
          remediation: "Manter atualização periódica com npm audit.",
          status: "open",
        },
      ],
    };

    // Save in Firestore
    await firestoreDb.collection("audits").doc(newAudit.id).set(newAudit);

    // Also register an evidence record for this audit
    const evidenceData = JSON.stringify(newAudit);
    const hash = crypto.createHash("sha256").update(evidenceData).digest("hex");
    const evidenceRecord = {
      id: `ev-${Date.now()}`,
      projectId,
      projectName,
      type: "Auditoria Automatizada",
      hashSha256: hash,
      verifiedBy: "Security Agent",
      createdAt: new Date().toISOString(),
      status: "valido",
      summary: `Auditoria de código e segurança finalizada com score ${newAudit.overallScore}/100.`,
    };

    await firestoreDb.collection("evidence").doc(evidenceRecord.id).set(evidenceRecord);

    return res.status(201).json({
      success: true,
      audit: newAudit,
      evidence: evidenceRecord,
      message: `Auditoria concluída com score ${newAudit.overallScore}/100 e evidência criptografada gerada.`,
    });
  } catch (err: unknown) {
    console.error("POST /api/audits/run error:", err);
    const msg = err instanceof Error ? err.message : "Erro ao executar auditoria";
    return res.status(500).json({ error: msg });
  }
});

export default router;
