import express, { Request, Response } from "express";
import paymentsRouter from "./routes/payments";
import customersRouter from "./routes/customers";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`[ViaPay Core] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    service: "viapay-core-backend",
    status: "healthy",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/customers", customersRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint não encontrado no ViaPay Core" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`ViaPay Core Backend rodando na porta ${port}`);
  });
}

export default app;
