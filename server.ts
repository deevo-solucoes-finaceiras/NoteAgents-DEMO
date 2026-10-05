import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

// Route modules
import projectsRouter from "./server/routes/projects";
import agentsRouter from "./server/routes/agents";
import pipelinesRouter from "./server/routes/pipelines";
import auditsRouter from "./server/routes/audits";
import evidenceRouter from "./server/routes/evidence";
import databaseRouter from "./server/routes/database";
import observerRouter from "./server/routes/observer";
import integrationsRouter from "./server/routes/integrations";
import aiRouter from "./server/routes/ai";

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === "production";

async function startServer() {
  const app = express();
  app.use(express.json());

  // Healthcheck endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      server: "NoteAgents Enterprise Backend",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Real Backend Routers
  app.use("/api/projects", projectsRouter);
  app.use("/api/agents", agentsRouter);
  app.use("/api/pipelines", pipelinesRouter);
  app.use("/api/audits", auditsRouter);
  app.use("/api/evidence", evidenceRouter);
  app.use("/api/database", databaseRouter);
  app.use("/api/observer", observerRouter);
  app.use("/api/integrations", integrationsRouter);
  app.use("/api/ai", aiRouter);

  if (!isProd) {
    // Vite Dev Server middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(import.meta.dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`NoteAgents Full-Stack Server rodando na porta ${port}`);
  });
}

startServer().catch((err) => {
  console.error("Falha ao inicializar o servidor NoteAgents:", err);
  process.exit(1);
});
