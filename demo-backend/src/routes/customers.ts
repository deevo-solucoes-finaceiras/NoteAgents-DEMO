import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

const CustomerSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  taxId: z.string().min(11, "CPF ou CNPJ inválido"),
  phone: z.string().optional(),
});

const customers = new Map<string, any>([
  [
    "cust-1",
    {
      id: "cust-1",
      name: "Empresa Alfa Pagamentos LTDA",
      email: "financeiro@alfa.com.br",
      taxId: "12.345.678/0001-90",
      phone: "+55 11 98888-7777",
      createdAt: "2026-01-15T10:00:00Z",
    },
  ],
  [
    "cust-2",
    {
      id: "cust-2",
      name: "Beta Soluções Cloud",
      email: "contato@betacloud.io",
      taxId: "98.765.432/0001-10",
      phone: "+55 21 97777-6666",
      createdAt: "2026-02-20T14:30:00Z",
    },
  ],
]);

// GET /api/v1/customers
router.get("/", (_req: Request, res: Response) => {
  return res.json(Array.from(customers.values()));
});

// POST /api/v1/customers
router.post("/", (req: Request, res: Response) => {
  const result = CustomerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Dados inválidos", details: result.error.issues });
  }

  const id = `cust-${Date.now()}`;
  const newCustomer = {
    id,
    ...result.data,
    createdAt: new Date().toISOString(),
  };

  customers.set(id, newCustomer);
  return res.status(201).json(newCustomer);
});

export default router;
