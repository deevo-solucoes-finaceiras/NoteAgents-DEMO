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

describe("Core Services", () => {
  it("fetches projects list with real contracts", async () => {
    const projects = await ProjectsService.list();
    expect(projects.length).toBeGreaterThan(0);
    const first = projects[0];
    expect(first.name).toBe("ViaPay");
    expect(first.health).toBe(91);
  });

  it("fetches agents with autonomy levels", async () => {
    const agents = await AgentsService.list();
    expect(agents.length).toBeGreaterThanOrEqual(6);
    const frontendAgent = agents.find((a) => a.name === "Frontend Agent");
    expect(frontendAgent).toBeDefined();
    expect(frontendAgent?.status).toBe("ativo");
  });

  it("fetches production audits with score breakdown", async () => {
    const audit = await AuditsService.getLatest();
    expect(audit.score).toBe(84);
    expect(audit.categories.length).toBe(6);
    expect(audit.findingsCount.critical).toBe(3);
  });

  it("manages knowledge sources", async () => {
    const sources = await KnowledgeService.listSources();
    expect(sources.length).toBeGreaterThan(0);
    const pdf = sources.find((s) => s.name === "Requisitos do Produto.pdf");
    expect(pdf).toBeDefined();
    expect(pdf?.officialBadge).toBe(true);
  });
});
