import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

// Validation Schemas
const PixPaymentSchema = z.object({
  amountCents: z.number().int().positive("Valor deve ser positivo em centavos"),
  customerId: z.string().min(1, "ID do cliente é obrigatório"),
  description: z.string().optional(),
});

const CreditCardPaymentSchema = z.object({
  amountCents: z.number().int().positive(),
  customerId: z.string().min(1),
  cardToken: z.string().min(10, "Token do cartão inválido"),
  installments: z.number().int().min(1).max(12).default(1),
});

// In-memory ledger for payment transactions
const transactions = new Map<string, any>();

// POST /api/v1/payments/pix
router.post("/pix", (req: Request, res: Response) => {
  const result = PixPaymentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Dados inválidos", details: result.error.issues });
  }

  const { amountCents, customerId, description } = result.data;
  const transactionId = `tx-pix-${Date.now()}`;
  const qrCodeText = `00020126580014br.gov.bcb.pix0136viapay-${transactionId}520400005303986540${(amountCents / 100).toFixed(2)}5802BR5915ViaPay Corporat6009Sao Paulo62070503***6304`;

  const tx = {
    id: transactionId,
    method: "PIX",
    amountCents,
    customerId,
    description: description || "Pagamento instantâneo via Pix",
    status: "pending",
    qrCodeText,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 30).toISOString(), // 30 mins
  };

  transactions.set(transactionId, tx);
  return res.status(201).json(tx);
});

// POST /api/v1/payments/credit-card
router.post("/credit-card", (req: Request, res: Response) => {
  const result = CreditCardPaymentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Dados inválidos", details: result.error.issues });
  }

  const { amountCents, customerId, installments } = result.data;
  const transactionId = `tx-cc-${Date.now()}`;

  const tx = {
    id: transactionId,
    method: "CREDIT_CARD",
    amountCents,
    customerId,
    installments,
    status: "approved",
    authorizationCode: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
    nsu: `NSU${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  transactions.set(transactionId, tx);
  return res.status(201).json(tx);
});

// GET /api/v1/payments/:id
router.get("/:id", (req: Request, res: Response) => {
  const tx = transactions.get(req.params.id);
  if (!tx) {
    return res.status(404).json({ error: "Transação não encontrada" });
  }
  return res.json(tx);
});

// GET /api/v1/payments
router.get("/", (_req: Request, res: Response) => {
  return res.json(Array.from(transactions.values()));
});

export default router;
