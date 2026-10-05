import { Router, Request, Response } from "express";

const router = Router();
const NVIDIA_API_KEY =
  process.env.NVIDIA_API_KEY ||
  "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";
const NVIDIA_BASE_URL =
  process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1";
const DEFAULT_MODEL =
  process.env.NVIDIA_MODEL || "nvidia/nemotron-3-ultra-550b-a55b";

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const {
      messages,
      model = DEFAULT_MODEL,
      temperature = 0.7,
      max_tokens = 2048,
      agentName = "Frontend Agent",
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid 'messages' array" });
    }

    const systemMessage = {
      role: "system",
      content: `Você é o ${agentName} no NoteAgents (AI Engineering Control Plane).
Suas especialidades incluem arquitetura de software, código limpo em TypeScript/React/Tailwind, segurança, testes, pipelines CI/CD e boas práticas de engenharia.
Responda de forma clara, técnica, estruturada e prática em português. Quando apropriado, inclua blocos de código com a linguagem indicada e passos objetivos de verificação.`,
    };

    const payload = {
      model,
      messages: [systemMessage, ...messages],
      temperature: Number(temperature),
      max_tokens: Number(max_tokens),
    };

    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API error:", response.status, errorText);
      return res.status(response.status).json({
        error: `NVIDIA API error (${response.status})`,
        details: errorText,
      });
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const assistantMessage = choice?.message?.content || "";
    const reasoning = choice?.message?.reasoning_content || "";

    return res.json({
      content: assistantMessage,
      reasoning: reasoning || undefined,
      model: data.model || model,
      usage: data.usage,
    });
  } catch (err: unknown) {
    console.error("Error in /api/ai/chat:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return res.status(500).json({ error: msg });
  }
});

export default router;
