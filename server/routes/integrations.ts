import { Router, Request, Response } from "express";

const router = Router();

// GET /api/integrations
router.get("/", (_req: Request, res: Response) => {
  const integrations = [
    {
      id: "int-1",
      name: "GitHub",
      description: "Sincronização de repositórios, webhooks de push e disparos de pull requests.",
      category: "vcs",
      status: "conectado",
      lastSync: "Agora mesmo",
      permissions: ["repo", "read:org", "workflow"],
      iconName: "Github",
    },
    {
      id: "int-2",
      name: "Firebase & Firestore",
      description: "Persistência em nuvem, regras de segurança e autenticação Google / Email.",
      category: "cloud",
      status: "conectado",
      lastSync: "Agora mesmo",
      permissions: ["firestore.admin", "auth.admin"],
      iconName: "Database",
    },
    {
      id: "int-3",
      name: "NVIDIA NIM",
      description: "Cluster de inferência de inteligência artificial com modelo Nemotron 3 Ultra 550B.",
      category: "protocol",
      status: "conectado",
      lastSync: "Agora mesmo",
      permissions: ["chat.completions", "models.read"],
      iconName: "Cpu",
    },
    {
      id: "int-4",
      name: "Docker Engine",
      description: "Ambiente local de execução isolada e conteinerização de microsserviços.",
      category: "cloud",
      status: "conectado",
      lastSync: "Há 10 min",
      permissions: ["containers.run", "images.build"],
      iconName: "Terminal",
    },
    {
      id: "int-5",
      name: "PostgreSQL / Cloud SQL",
      description: "Banco de dados relacional transacional com schemas versionados via migrations.",
      category: "database",
      status: "conectado",
      lastSync: "Há 5 min",
      permissions: ["read", "write", "schema.alter"],
      iconName: "Layers",
    },
  ];

  return res.json(integrations);
});

// POST /api/integrations/:id/test
router.post("/:id/test", (req: Request, res: Response) => {
  return res.json({
    success: true,
    integrationId: req.params.id,
    latencyMs: Math.floor(Math.random() * 20) + 12,
    message: "Conexão testada e ativa com latência de resposta excelente.",
    timestamp: new Date().toISOString(),
  });
});

export default router;
