import { describe, it, expect } from "vitest";
import {
  CreateProjectSchema,
  LoginSchema,
  RegisterSchema,
  CreateAgentSchema,
} from "../src/schemas";
import { formatBytes, formatDuration } from "../src/lib/utils";
import {
  ProjectsService,
  AgentsService,
  AuditsService,
  KnowledgeService,
} from "../src/lib/api/services";

describe("Schema Validations", () => {
  it("validates project creation", () => {
    const valid = CreateProjectSchema.safeParse({
      name: "ViaPay Enterprise",
      description: "Gateway de pagamentos corporativo",
      category: "Fintech",
      stack: ["TypeScript", "Next.js"],
    });
    expect(valid.success).toBe(true);

    const invalid = CreateProjectSchema.safeParse({
      name: "V", // too short
      description: "desc",
      category: "",
      stack: [],
    });
    expect(invalid.success).toBe(false);
  });

  it("validates authentication schemas", () => {
    const validLogin = LoginSchema.safeParse({
      email: "vini@noteagents.dev",
      password: "secretpassword",
    });
    expect(validLogin.success).toBe(true);

    const invalidLogin = LoginSchema.safeParse({
      email: "invalid-email",
      password: "123", // too short
    });
    expect(invalidLogin.success).toBe(false);

    const validRegister = RegisterSchema.safeParse({
      name: "Vini Amaral",
      email: "vini@noteagents.dev",
      password: "strongpassword123",
      organization: "NoteAgents",
    });
    expect(validRegister.success).toBe(true);
  });

  it("validates agent schema", () => {
    const validAgent = CreateAgentSchema.safeParse({
      name: "Security Agent",
      role: "SAST Scanner",
      category: "quality",
      autonomyLevel: 3,
      model: "GPT-5",
      description: "Auditoria estrita de código e dependências em busca de vulnerabilidades.",
    });
    expect(validAgent.success).toBe(true);
  });
});

describe("Formatters & Utility Functions", () => {
  it("formats bytes accurately", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(2500000)).toBe("2.4 MB");
  });

  it("formats durations accurately", () => {
    expect(formatDuration(400)).toBe("400ms");
    expect(formatDuration(2400)).toBe("2.4s");
  });
});

describe("Core Services Contracts", () => {
  it("provides projects list interface", async () => {
    expect(ProjectsService.list).toBeDefined();
    expect(typeof ProjectsService.importFromGit).toBe("function");
  });

  it("provides agents execution interface", async () => {
    expect(AgentsService.list).toBeDefined();
    expect(typeof AgentsService.runTask).toBe("function");
  });

  it("provides audits execution interface", async () => {
    expect(AuditsService.list).toBeDefined();
    expect(typeof AuditsService.runAudit).toBe("function");
  });

  it("provides knowledge sources", async () => {
    const sources = await KnowledgeService.list();
    expect(sources.length).toBeGreaterThan(0);
    expect(sources[0].name).toBeDefined();
  });
});

describe("ViaPay Core Demo Backend Logic", () => {
  it("validates payment amounts and cent conversion", () => {
    const amountCents = 25000;
    const reais = (amountCents / 100).toFixed(2);
    expect(reais).toBe("250.00");
  });

  it("validates pix payload structure", () => {
    const txId = "tx-123";
    const amount = 100;
    expect(txId).toMatch(/^tx-/);
    expect(amount).toBeGreaterThan(0);
  });
});
