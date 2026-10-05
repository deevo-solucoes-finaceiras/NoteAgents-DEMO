import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./firebase";
import {
  Project,
  Agent,
  AuditRecord,
  KnowledgeSource,
  EvidenceRecord,
} from "../types";

export const DEMO_PROJECTS: Project[] = [
  {
    id: "viapay",
    name: "ViaPay",
    slug: "viapay",
    description: "SaaS financeiro e gateway de pagamentos corporativo",
    category: "Fintech",
    status: "em_andamento",
    stack: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
    health: 91,
    lastAuditScore: 84,
    openIssuesCount: 3,
    updatedAt: new Date().toISOString(),
    repoUrl: "https://github.com/noteagents/viapay",
    workspacePath: "/workspaces/viapay",
  },
  {
    id: "ecommerce",
    name: "E-commerce Headless",
    slug: "ecommerce",
    description: "SaaS de e-commerce headless omnichannel com Next.js",
    category: "E-commerce",
    status: "planejamento",
    stack: ["React", "Node.js", "Redis", "Tailwind CSS"],
    health: 78,
    lastAuditScore: 76,
    openIssuesCount: 7,
    updatedAt: new Date().toISOString(),
    repoUrl: "https://github.com/noteagents/ecommerce-store",
    workspacePath: "/workspaces/ecommerce",
  },
  {
    id: "app-mobile",
    name: "App Mobile",
    slug: "app-mobile",
    description: "SaaS financeiro e aplicativo móvel de carteira",
    category: "Mobile",
    status: "validacao",
    stack: ["React Native", "TypeScript", "GraphQL", "PostgreSQL"],
    health: 88,
    lastAuditScore: 82,
    openIssuesCount: 4,
    updatedAt: new Date().toISOString(),
    repoUrl: "https://github.com/noteagents/wallet-mobile",
    workspacePath: "/workspaces/mobile",
  },
  {
    id: "site-institucional",
    name: "Site Institucional",
    slug: "site-institucional",
    description: "SaaS corporativo e portal de relacionamento",
    category: "Web",
    status: "concluido",
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    health: 96,
    lastAuditScore: 92,
    openIssuesCount: 0,
    updatedAt: new Date().toISOString(),
    repoUrl: "https://github.com/noteagents/corporate-portal",
    workspacePath: "/workspaces/portal",
  },
];

export const DEMO_AGENTS: Agent[] = [
  {
    id: "frontend-agent",
    name: "Frontend Agent",
    slug: "frontend-agent",
    description: "Criação de componentes e interfaces com design tokens e acessibilidade",
    category: "engineering",
    status: "ativo",
    autonomyLevel: 3,
    model: "GPT-5",
    capabilities: ["UI Generation", "Tailwind CSS", "Accessibility Audit"],
    tools: ["CodeEditor", "LSP", "Playwright"],
    mcpEnabled: true,
    lspEnabled: true,
    permissions: ["READ_WORKSPACE", "MODIFY_FRONTEND"],
    runsCount: 18,
    lastActive: "Hoje, 10:24",
  },
  {
    id: "backend-agent",
    name: "Backend Agent",
    slug: "backend-agent",
    description: "Execução de endpoints de alta performance, validações e autenticação",
    category: "engineering",
    status: "ativo",
    autonomyLevel: 3,
    model: "GPT-5",
    capabilities: ["API Design", "Authentication", "Validation"],
    tools: ["NodeRuntime", "PostgreSQLDriver", "DockerCLI"],
    mcpEnabled: true,
    lspEnabled: true,
    permissions: ["READ_WORKSPACE", "WRITE_BACKEND"],
    runsCount: 24,
    lastActive: "Hoje, 10:15",
  },
  {
    id: "database-agent",
    name: "Database Agent",
    slug: "database-agent",
    description: "Geração de schemas, migrations otimizadas e auditoria de índices",
    category: "engineering",
    status: "ativo",
    autonomyLevel: 2,
    model: "GPT-5",
    capabilities: ["Schema Design", "Migration Generation"],
    tools: ["PostgreSQLInspector", "MigrationRunner"],
    mcpEnabled: true,
    lspEnabled: false,
    permissions: ["READ_SCHEMA", "PROPOSE_MIGRATIONS"],
    runsCount: 12,
    lastActive: "Hoje, 09:40",
  },
  {
    id: "security-agent",
    name: "Security Agent",
    slug: "security-agent",
    description: "Detecção de vulnerabilidades, auditoria de dependências e SAST",
    category: "quality",
    status: "ativo",
    autonomyLevel: 4,
    model: "GPT-5",
    capabilities: ["SAST Scanner", "Secret Leak Detection"],
    tools: ["DependencyScanner", "Trivy", "Semgrep"],
    mcpEnabled: true,
    lspEnabled: true,
    permissions: ["AUDIT_WORKSPACE", "BLOCK_UNSAFE_COMMITS"],
    runsCount: 32,
    lastActive: "Hoje, 08:30",
  },
];

export async function seedDemoDataToFirestore(): Promise<{
  projectsCount: number;
  agentsCount: number;
}> {
  try {
    // 1. Seed Projects
    for (const project of DEMO_PROJECTS) {
      await setDoc(doc(db, "projects", project.id), project, { merge: true });
    }

    // 2. Seed Agents
    for (const agent of DEMO_AGENTS) {
      await setDoc(doc(db, "agents", agent.id), agent, { merge: true });
    }

    return {
      projectsCount: DEMO_PROJECTS.length,
      agentsCount: DEMO_AGENTS.length,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "projects/agents");
    return { projectsCount: 0, agentsCount: 0 };
  }
}
