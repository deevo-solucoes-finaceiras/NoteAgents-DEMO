import {
  Project,
  Agent,
  AuditRecord,
  RunRecord,
  EvidenceRecord,
  KnowledgeSource,
  EnvironmentTool,
  IntegrationItem,
  DatabaseTable,
  IssueItem,
  UserProfile,
  ChatMessage,
  PipelineStep,
} from "../../types";
import { CreateProjectInput, CreateAgentInput, UpdateProfileInput } from "../../schemas";

// Initial seed matching the authentic project board in image.png
const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "ViaPay",
    slug: "viapay",
    description: "SaaS financeiro e gateway de pagamentos corporativo",
    category: "Fintech",
    status: "em_andamento",
    stack: ["TypeScript", "Next.js", "PostgreSQL", "Docker"],
    health: 91,
    lastAuditScore: 84,
    lastRunDate: new Date(Date.now() - 3600000).toISOString(),
    openIssuesCount: 3,
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    repoUrl: "https://github.com/noteagents/viapay",
    workspacePath: "/workspaces/viapay",
  },
  {
    id: "proj-2",
    name: "E-commerce",
    slug: "ecommerce",
    description: "SaaS de e-commerce headless omnichannel",
    category: "E-commerce",
    status: "planejamento",
    stack: ["React", "Node.js", "Redis", "Tailwind CSS"],
    health: 78,
    lastAuditScore: 76,
    lastRunDate: new Date(Date.now() - 86400000).toISOString(),
    openIssuesCount: 7,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    repoUrl: "https://github.com/noteagents/ecommerce-store",
    workspacePath: "/workspaces/ecommerce",
  },
  {
    id: "proj-3",
    name: "App Mobile",
    slug: "app-mobile",
    description: "SaaS financeiro e aplicativo móvel de carteira",
    category: "Mobile",
    status: "validacao",
    stack: ["React Native", "TypeScript", "GraphQL", "PostgreSQL"],
    health: 88,
    lastAuditScore: 82,
    lastRunDate: new Date(Date.now() - 43200000).toISOString(),
    openIssuesCount: 4,
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    repoUrl: "https://github.com/noteagents/wallet-mobile",
    workspacePath: "/workspaces/mobile",
  },
  {
    id: "proj-4",
    name: "Site Institucional",
    slug: "site-institucional",
    description: "SaaS corporativo e portal de relacionamento",
    category: "Web",
    status: "concluido",
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    health: 96,
    lastAuditScore: 92,
    lastRunDate: new Date(Date.now() - 172800000).toISOString(),
    openIssuesCount: 0,
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    repoUrl: "https://github.com/noteagents/corporate-portal",
    workspacePath: "/workspaces/portal",
  },
  {
    id: "proj-5",
    name: "API Integrations",
    slug: "api-integrations",
    description: "Core de conexões bancárias e webhook processor",
    category: "Backend",
    status: "em_andamento",
    stack: ["Go", "Kafka", "PostgreSQL", "Docker"],
    health: 84,
    lastAuditScore: 88,
    lastRunDate: new Date(Date.now() - 1800000).toISOString(),
    openIssuesCount: 2,
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    repoUrl: "https://github.com/noteagents/integrations-api",
    workspacePath: "/workspaces/integrations",
  },
  {
    id: "proj-6",
    name: "Dashboard Analytics",
    slug: "dashboard-analytics",
    description: "SaaS de BI e inteligência de negócios",
    category: "Analytics",
    status: "em_andamento",
    stack: ["Python", "FastAPI", "ClickHouse", "React"],
    health: 89,
    lastAuditScore: 85,
    lastRunDate: new Date(Date.now() - 14400000).toISOString(),
    openIssuesCount: 5,
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
    repoUrl: "https://github.com/noteagents/analytics-platform",
    workspacePath: "/workspaces/analytics",
  },
  {
    id: "proj-7",
    name: "NoteAgents Core",
    slug: "noteagents-core",
    description: "Control plane de orquestração de agentes autônomos",
    category: "Core Engine",
    status: "validacao",
    stack: ["TypeScript", "Node.js", "Docker", "PostgreSQL"],
    health: 94,
    lastAuditScore: 90,
    lastRunDate: new Date(Date.now() - 900000).toISOString(),
    openIssuesCount: 1,
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    repoUrl: "https://github.com/noteagents/control-plane",
    workspacePath: "/workspaces/core",
  },
];

const DEFAULT_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Frontend Agent",
    slug: "frontend-agent",
    description: "Criação de componentes e interfaces com design tokens e acessibilidade",
    category: "engineering",
    status: "ativo",
    autonomyLevel: 3,
    model: "GPT-5",
    capabilities: ["UI Generation", "Tailwind CSS", "Accessibility Audit", "Component Testing"],
    tools: ["CodeEditor", "LSP", "Playwright", "FigmaParser"],
    mcpEnabled: true,
    lspEnabled: true,
    permissions: ["READ_WORKSPACE", "MODIFY_FRONTEND", "RUN_TESTS"],
    runsCount: 18,
    lastActive: "Hoje, 10:24",
  },
  {
    id: "agent-2",
    name: "Backend Agent",
    slug: "backend-agent",
    description: "Execução de endpoints de alta performance, validações e autenticação",
    category: "engineering",
    status: "ativo",
    autonomyLevel: 3,
    model: "GPT-5",
    capabilities: ["API Design", "Authentication", "Validation", "OpenAPI Spec"],
    tools: ["NodeRuntime", "PostgreSQLDriver", "DockerCLI", "OpenCode"],
    mcpEnabled: true,
    lspEnabled: true,
    permissions: ["READ_WORKSPACE", "WRITE_BACKEND", "EXECUTE_TESTS"],
    runsCount: 24,
    lastActive: "Hoje, 10:15",
  },
  {
    id: "agent-3",
    name: "Database Agent",
    slug: "database-agent",
    description: "Geração de schemas, migrations otimizadas e auditoria de índices",
    category: "engineering",
    status: "ativo",
    autonomyLevel: 2,
    model: "GPT-5",
    capabilities: ["Schema Design", "Migration Generation", "Query Plan Optimization"],
    tools: ["PostgreSQLInspector", "MigrationRunner", "SQLFormatter"],
    mcpEnabled: true,
    lspEnabled: false,
    permissions: ["READ_SCHEMA", "PROPOSE_MIGRATIONS", "EXECUTE_DEV_MIGRATIONS"],
    runsCount: 12,
    lastActive: "Hoje, 09:40",
  },
  {
    id: "agent-4",
    name: "Security Agent",
    slug: "security-agent",
    description: "Detecção de vulnerabilidades, auditoria de dependências e SAST",
    category: "quality",
    status: "ativo",
    autonomyLevel: 4,
    model: "GPT-5",
    capabilities: ["SAST Scanner", "Secret Leak Detection", "OWASP Top 10 Audit"],
    tools: ["DependencyScanner", "Trivy", "Semgrep", "EvidenceLogger"],
    mcpEnabled: true,
    lspEnabled: true,
    permissions: ["AUDIT_WORKSPACE", "BLOCK_UNSAFE_COMMITS"],
    runsCount: 32,
    lastActive: "Hoje, 08:30",
  },
  {
    id: "agent-5",
    name: "DevOps Agent",
    slug: "devops-agent",
    description: "Configuração de containers, pipelines CI/CD e ambientes em nuvem",
    category: "engineering",
    status: "ativo",
    autonomyLevel: 3,
    model: "GPT-5",
    capabilities: ["Dockerfile Optimization", "GitHub Actions CI", "Kubernetes Manifests"],
    tools: ["DockerCLI", "Terraform", "GitHubAPI", "VercelCLI"],
    mcpEnabled: true,
    lspEnabled: false,
    permissions: ["CONFIG_CONTAINERS", "TRIGGER_PIPELINES"],
    runsCount: 15,
    lastActive: "Ontem, 18:20",
  },
  {
    id: "agent-6",
    name: "Code Review Agent",
    slug: "code-review-agent",
    description: "Verificação de qualidade de código, padrões de design e testes",
    category: "quality",
    status: "ativo",
    autonomyLevel: 2,
    model: "GPT-5",
    capabilities: ["Diff Analysis", "Style Enforcement", "Complexity Measurement"],
    tools: ["GitDiff", "ESLintRunner", "LSPClient", "EvidenceEngine"],
    mcpEnabled: true,
    lspEnabled: true,
    permissions: ["READ_DIFF", "ADD_REVIEW_COMMENTS"],
    runsCount: 45,
    lastActive: "Hoje, 10:20",
  },
];

const DEFAULT_AUDIT: AuditRecord = {
  id: "audit-1",
  title: "Auditoria Completa de Produção",
  type: "arquitetura",
  score: 84,
  status: "concluido",
  date: "Hoje, 10:24",
  findingsCount: {
    critical: 3,
    high: 7,
    medium: 12,
    low: 5,
  },
  categories: [
    { name: "Arquitetura", score: 90, color: "#2563EB" },
    { name: "Código", score: 82, color: "#06B6D4" },
    { name: "Segurança", score: 76, color: "#EF4444" },
    { name: "Performance", score: 88, color: "#10B981" },
    { name: "Testes", score: 80, color: "#F59E0B" },
    { name: "Documentação", score: 70, color: "#8B5CF6" },
  ],
  findings: [
    {
      id: "f-1",
      auditId: "audit-1",
      severity: "critico",
      title: "Variáveis de ambiente sensíveis sem sanitização no build",
      description: "Detectada tentativa de expor secrets de API no bundle cliente.",
      impact: "Vazamento potencial de credenciais de serviço em produção.",
      recommendation: "Isolar secrets estritamente no runtime do servidor e utilizar Bearer headers.",
      status: "aberto",
      affectedFile: "src/server/auth-proxy.ts",
    },
    {
      id: "f-2",
      auditId: "audit-1",
      severity: "critico",
      title: "Índice ausente em chave estrangeira de transações",
      description: "A tabela transactions possui FK para customer_id sem índice dedicado.",
      impact: "Degradação de consultas de extrato com volume elevado (Full Table Scan).",
      recommendation: "Criar migration com índice CONCURRENTLY em transactions(customer_id).",
      status: "em_correcao",
      affectedFile: "src/db/migrations/004_transactions.sql",
    },
    {
      id: "f-3",
      auditId: "audit-1",
      severity: "critico",
      title: "Token de webhook sem verificação de assinatura HMAC",
      description: "O endpoint de callback bancário aceita payloads sem validar header X-Signature.",
      impact: "Risco de spoofing e injeção de notificações de pagamento fraudulentas.",
      recommendation: "Aplicar middleware de validação criptográfica HMAC SHA-256.",
      status: "aberto",
      affectedFile: "src/api/webhooks/payment.ts",
    },
    {
      id: "f-4",
      auditId: "audit-1",
      severity: "alto",
      title: "Tempo de resposta do endpoint /api/metrics acima de 450ms",
      description: "Métrica agregada sem camada de cache intermediária.",
      impact: "Aumento no consumo de CPU do banco de dados.",
      recommendation: "Adicionar cache TTL de 60 segundos com Redis.",
      status: "aberto",
      affectedFile: "src/services/metrics.service.ts",
    },
  ],
};

const DEFAULT_SOURCES: KnowledgeSource[] = [
  {
    id: "src-1",
    name: "Requisitos do Produto.pdf",
    type: "pdf",
    sizeBytes: 2400000,
    updatedAt: "Hoje, 10:24",
    officialBadge: true,
    status: "indexed",
    citationsCount: 14,
  },
  {
    id: "src-2",
    name: "Design System.pdf",
    type: "pdf",
    sizeBytes: 2400000,
    updatedAt: "Hoje, 10:24",
    officialBadge: false,
    status: "indexed",
    citationsCount: 9,
  },
  {
    id: "src-3",
    name: "dashboard.png",
    type: "image",
    sizeBytes: 1300000,
    updatedAt: "Hoje, 10:24",
    officialBadge: false,
    status: "indexed",
    citationsCount: 6,
  },
  {
    id: "src-4",
    name: "API Documentation.yaml",
    type: "code",
    sizeBytes: 1800000,
    updatedAt: "Hoje, 10:24",
    officialBadge: false,
    status: "indexed",
    citationsCount: 22,
  },
  {
    id: "src-5",
    name: "Visão do Produto.md",
    type: "markdown",
    sizeBytes: 1300000,
    updatedAt: "Hoje, 10:24",
    officialBadge: false,
    status: "indexed",
    citationsCount: 8,
  },
  {
    id: "src-6",
    name: "Arquitetura.png",
    type: "image",
    sizeBytes: 3100000,
    updatedAt: "Hoje, 10:24",
    officialBadge: false,
    status: "indexed",
    citationsCount: 11,
  },
  {
    id: "src-7",
    name: "Base de Conhecimento",
    type: "database",
    sizeBytes: 5200000,
    updatedAt: "Hoje, 10:24",
    officialBadge: false,
    status: "indexed",
    citationsCount: 31,
  },
];

const DEFAULT_ENVIRONMENT_TOOLS: EnvironmentTool[] = [
  {
    name: "Node.js",
    version: "v22.0.0",
    status: "connected",
    description: "Runtime JavaScript/TypeScript com suporte nativo a ESM",
    category: "runtime",
    detectedPath: "/usr/local/bin/node",
  },
  {
    name: "Docker",
    version: "v26.1.0",
    status: "connected",
    description: "Engine de containerização e isolamento de dependências",
    category: "container",
    detectedPath: "/usr/bin/docker",
  },
  {
    name: "PostgreSQL",
    version: "v16",
    status: "connected",
    description: "Banco relacional transacional com pooling e suporte JSONB",
    category: "database",
    detectedPath: "localhost:5432",
  },
  {
    name: "Redis",
    version: "v7.2",
    status: "connected",
    description: "Cache em memória de baixa latência e fila de pub/sub",
    category: "database",
    detectedPath: "localhost:6379",
  },
];

const DEFAULT_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "int-github",
    name: "GitHub",
    description: "Repositórios, PRs e Actions sincronizados",
    category: "vcs",
    status: "conectado",
    lastSync: "Hoje, 10:20",
    permissions: ["repo", "workflow", "read:org"],
    iconName: "github",
  },
  {
    id: "int-vercel",
    name: "Vercel",
    description: "Deploy contínuo e previews de branch",
    category: "cloud",
    status: "conectado",
    lastSync: "Hoje, 09:45",
    permissions: ["deployments", "domains", "env_vars"],
    iconName: "vercel",
  },
  {
    id: "int-opencode",
    name: "OpenCode",
    description: "Agente de código aberto e execução local",
    category: "protocol",
    status: "configurar",
    permissions: ["workspace:read", "code:generate"],
    iconName: "opencode",
  },
  {
    id: "int-mcp",
    name: "MCP",
    description: "Model Context Protocol para troca de ferramentas",
    category: "protocol",
    status: "conectado",
    lastSync: "Hoje, 10:12",
    permissions: ["tools:call", "resources:read"],
    iconName: "mcp",
  },
  {
    id: "int-lsp",
    name: "LSP",
    description: "Language Server Protocol para TypeScript, Go e Python",
    category: "protocol",
    status: "configurar",
    permissions: ["diagnostics", "definition", "references"],
    iconName: "lsp",
  },
  {
    id: "int-postgres",
    name: "PostgreSQL",
    description: "Instância de banco de dados e schema inspector",
    category: "database",
    status: "conectado",
    lastSync: "Hoje, 10:22",
    permissions: ["read_schema", "query_stats"],
    iconName: "postgres",
  },
  {
    id: "int-redis",
    name: "Redis",
    description: "Cache e filas de mensageria assíncrona",
    category: "database",
    status: "conectado",
    lastSync: "Hoje, 10:24",
    permissions: ["keys:info", "memory:monitor"],
    iconName: "redis",
  },
  {
    id: "int-slack",
    name: "Slack",
    description: "Notificações de auditoria e alertas de incidentes",
    category: "communication",
    status: "configurar",
    permissions: ["chat:write", "channels:read"],
    iconName: "slack",
  },
];

const DEFAULT_DB_TABLES: DatabaseTable[] = [
  { name: "projects", recordCount: 12, columnsCount: 14, sizeBytes: 64000, primaryKey: "id", lastUpdated: "Hoje, 10:24" },
  { name: "workspaces", recordCount: 8, columnsCount: 10, sizeBytes: 32000, primaryKey: "id", lastUpdated: "Hoje, 09:12" },
  { name: "agents", recordCount: 24, columnsCount: 16, sizeBytes: 98000, primaryKey: "id", lastUpdated: "Hoje, 10:15" },
  { name: "tasks", recordCount: 156, columnsCount: 12, sizeBytes: 240000, primaryKey: "id", lastUpdated: "Hoje, 10:20" },
  { name: "pipelines", recordCount: 18, columnsCount: 8, sizeBytes: 45000, primaryKey: "id", lastUpdated: "Hoje, 08:30" },
  { name: "pipeline_runs", recordCount: 45, columnsCount: 15, sizeBytes: 380000, primaryKey: "id", lastUpdated: "Hoje, 10:22" },
  { name: "audits", recordCount: 32, columnsCount: 11, sizeBytes: 190000, primaryKey: "id", lastUpdated: "Hoje, 10:24" },
  { name: "findings", recordCount: 78, columnsCount: 13, sizeBytes: 410000, primaryKey: "id", lastUpdated: "Hoje, 10:24" },
];

const DEFAULT_PIPELINE_STEPS: PipelineStep[] = [
  { id: "step-1", order: 1, name: "Descobrir", description: "Análise do projeto e topologia de arquivos", status: "success", durationMs: 1200, agent: "Discovery Agent", evidenceId: "ev-1" },
  { id: "step-2", order: 2, name: "Analisar", description: "Código e dependências com AST e LSP", status: "success", durationMs: 2400, agent: "Architecture Agent", evidenceId: "ev-2" },
  { id: "step-3", order: 3, name: "Planejar", description: "Estratégia de implementação e tokens", status: "success", durationMs: 1800, agent: "Product Agent", evidenceId: "ev-3" },
  { id: "step-4", order: 4, name: "Implementar", description: "Geração de código modular e tipado", status: "success", durationMs: 4600, agent: "Frontend Agent", evidenceId: "ev-4" },
  { id: "step-5", order: 5, name: "Build", description: "Compilação e testes de integridade", status: "success", durationMs: 3100, agent: "DevOps Agent", evidenceId: "ev-5" },
  { id: "step-6", order: 6, name: "Testar", description: "Execução de testes unitários e E2E", status: "success", durationMs: 5200, agent: "Testing Agent", evidenceId: "ev-6" },
  { id: "step-7", order: 7, name: "Revisar", description: "Verificação de qualidade e acessibilidade", status: "success", durationMs: 2100, agent: "Code Review Agent", evidenceId: "ev-7" },
  { id: "step-8", order: 8, name: "Corrigir", description: "Ajustes automáticos e auto-reparo", status: "success", durationMs: 1400, agent: "Error Fixer Agent", evidenceId: "ev-8" },
  { id: "step-9", order: 9, name: "Verificar", description: "Relatório final com auditoria e evidência", status: "success", durationMs: 900, agent: "Security Agent", evidenceId: "ev-9" },
];

const DEFAULT_USER: UserProfile = {
  name: "Vini Amaral",
  email: "vini@noteagents.dev",
  role: "Administrador",
  organization: "NoteAgents",
  avatarUrl: "",
  timezone: "America/Sao_Paulo",
  language: "Português (Brasil)",
};

const DEFAULT_EVIDENCE: EvidenceRecord[] = [
  {
    id: "ev-1",
    action: "Auditoria Completa de Segurança e Código",
    actor: "Sistema Autônomo",
    agent: "Security Agent",
    timestamp: "Hoje, 10:24",
    command: "noteagents audit --full --strict --project=viapay",
    inputSummary: "Repositório viapay (branch main @ 7c9a41b)",
    outputSummary: "Auditoria finalizada. Score 84/100. 3 achados críticos detectados e isolados.",
    exitCode: 0,
    filesChanged: ["src/server/auth-proxy.ts", "src/db/migrations/004_transactions.sql"],
    testsSummary: "142 testes executados: 138 aprovados, 4 com aviso de latência.",
    result: "success",
  },
  {
    id: "ev-2",
    action: "Execução do Setup de Ambiente Automático",
    actor: "Vini Amaral",
    agent: "Environment Agent",
    timestamp: "Hoje, 10:15",
    command: "docker-compose up -d postgres redis",
    inputSummary: "Verificação de conectividade e portas 5432 e 6379",
    outputSummary: "Containers inicializados e prontos para conexões em 1.4s.",
    exitCode: 0,
    filesChanged: [],
    testsSummary: "Conectividade validada com sucesso.",
    result: "success",
  },
  {
    id: "ev-3",
    action: "Geração de Componentes e Design Tokens",
    actor: "Chat com IA",
    agent: "Frontend Agent",
    timestamp: "Hoje, 10:05",
    command: "noteagents generate --tokens --components=all",
    inputSummary: "Análise da prancha visual do mockup (15 painéis)",
    outputSummary: "Identificados 12 componentes principais e extraídos design tokens.",
    exitCode: 0,
    filesChanged: ["src/components/layout/AppShell.tsx", "src/types/index.ts"],
    testsSummary: "Todos os componentes renderizam sem erros de hidratação.",
    result: "success",
  },
];

// Persistent state handlers backed by localStorage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`noteagents_${key}`);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`noteagents_${key}`, JSON.stringify(data));
  } catch {
    // Ignore storage quota
  }
}

export const ProjectsService = {
  async list(): Promise<Project[]> {
    return loadFromStorage("projects", DEFAULT_PROJECTS);
  },
  async getById(id: string): Promise<Project | null> {
    const list = await this.list();
    return list.find((p) => p.id === id || p.slug === id) || null;
  },
  async create(input: CreateProjectInput): Promise<Project> {
    const list = await this.list();
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: input.name,
      slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: input.description,
      category: input.category,
      status: "em_andamento",
      stack: input.stack,
      health: 90,
      lastAuditScore: 85,
      lastRunDate: new Date().toISOString(),
      openIssuesCount: 0,
      updatedAt: new Date().toISOString(),
      repoUrl: input.repoUrl || undefined,
      workspacePath: input.workspacePath || `/workspaces/${input.name.toLowerCase()}`,
    };
    const updated = [newProject, ...list];
    saveToStorage("projects", updated);
    return newProject;
  },
  async updateStatus(id: string, status: Project["status"]): Promise<Project> {
    const list = await this.list();
    const project = list.find((p) => p.id === id);
    if (!project) throw new Error("Projeto não encontrado");
    project.status = status;
    project.updatedAt = new Date().toISOString();
    saveToStorage("projects", list);
    return project;
  },
  async delete(id: string): Promise<void> {
    const list = await this.list();
    const filtered = list.filter((p) => p.id !== id);
    saveToStorage("projects", filtered);
  },
};

export const AgentsService = {
  async list(): Promise<Agent[]> {
    return loadFromStorage("agents", DEFAULT_AGENTS);
  },
  async getById(id: string): Promise<Agent | null> {
    const list = await this.list();
    return list.find((a) => a.id === id || a.slug === id) || null;
  },
  async create(input: CreateAgentInput): Promise<Agent> {
    const list = await this.list();
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: input.name,
      slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: input.description,
      category: input.category,
      status: "ativo",
      autonomyLevel: input.autonomyLevel as Agent["autonomyLevel"],
      model: input.model,
      capabilities: [input.role, "Code Generation", "Analysis"],
      tools: ["CodeEditor", "LSPClient"],
      mcpEnabled: true,
      lspEnabled: true,
      permissions: ["READ_WORKSPACE", "MODIFY_FILES"],
      runsCount: 0,
      lastActive: "Agora mesmo",
    };
    const updated = [...list, newAgent];
    saveToStorage("agents", updated);
    return newAgent;
  },
  async toggleStatus(id: string): Promise<Agent> {
    const list = await this.list();
    const agent = list.find((a) => a.id === id);
    if (!agent) throw new Error("Agente não encontrado");
    agent.status = agent.status === "ativo" ? "pausado" : "ativo";
    saveToStorage("agents", list);
    return agent;
  },
  async updateAutonomy(id: string, level: Agent["autonomyLevel"]): Promise<Agent> {
    const list = await this.list();
    const agent = list.find((a) => a.id === id);
    if (!agent) throw new Error("Agente não encontrado");
    agent.autonomyLevel = level;
    saveToStorage("agents", list);
    return agent;
  },
  async runAgent(id: string): Promise<RunRecord> {
    const agent = await this.getById(id);
    if (!agent) throw new Error("Agente não encontrado");
    const run: RunRecord = {
      id: `run-${Date.now()}`,
      projectId: "proj-1",
      projectName: "ViaPay",
      agentId: agent.id,
      agentName: agent.name,
      trigger: "Execução Manual",
      status: "success",
      startTime: new Date().toISOString(),
      durationMs: 2400,
      exitCode: 0,
      filesChanged: 2,
      testsPassed: 12,
      testsFailed: 0,
      logs: [
        `[INFO] Agente ${agent.name} inicializado em nível de autonomia ${agent.autonomyLevel}`,
        "[INFO] Carregando contexto de workspace e regras de segurança",
        "[INFO] Validando AST de arquivos e dependências",
        "[INFO] Execução concluída com sucesso. Nenhuma violação detectada.",
      ],
    };
    agent.runsCount += 1;
    agent.lastActive = "Agora mesmo";
    const agents = await this.list();
    saveToStorage("agents", agents);
    return run;
  },
};

export const AuditsService = {
  async getLatest(): Promise<AuditRecord> {
    return loadFromStorage("audit_latest", DEFAULT_AUDIT);
  },
  async runAudit(): Promise<AuditRecord> {
    const current = await this.getLatest();
    const updated: AuditRecord = {
      ...current,
      id: `audit-${Date.now()}`,
      date: "Agora mesmo",
      score: Math.min(100, current.score + 1),
    };
    saveToStorage("audit_latest", updated);
    return updated;
  },
};

export const KnowledgeService = {
  async listSources(): Promise<KnowledgeSource[]> {
    return loadFromStorage("sources", DEFAULT_SOURCES);
  },
  async addSource(source: Omit<KnowledgeSource, "id" | "updatedAt" | "citationsCount" | "status">): Promise<KnowledgeSource> {
    const list = await this.listSources();
    const newSrc: KnowledgeSource = {
      id: `src-${Date.now()}`,
      name: source.name,
      type: source.type,
      sizeBytes: source.sizeBytes || 1024 * 500,
      updatedAt: "Agora mesmo",
      officialBadge: source.officialBadge,
      status: "indexed",
      citationsCount: 0,
    };
    const updated = [newSrc, ...list];
    saveToStorage("sources", updated);
    return newSrc;
  },
  async removeSource(id: string): Promise<void> {
    const list = await this.listSources();
    const updated = list.filter((s) => s.id !== id);
    saveToStorage("sources", updated);
  },
};

export const EnvironmentService = {
  async listTools(): Promise<EnvironmentTool[]> {
    return loadFromStorage("env_tools", DEFAULT_ENVIRONMENT_TOOLS);
  },
  async runSetup(): Promise<{ success: boolean; logs: string[] }> {
    return {
      success: true,
      logs: [
        "[INFO] Detectando sistema operacional e arquitetura...",
        "[INFO] Instalando dependências e checando versões...",
        "[INFO] Configurando Docker compose e networks...",
        "[INFO] Criando containers postgres e redis...",
        "[INFO] Validando portas e variáveis de ambiente...",
        "[INFO] Testando conectividade do banco de dados...",
        "[INFO] Setup concluído! Tudo pronto para execução.",
      ],
    };
  },
};

export const IntegrationsService = {
  async list(): Promise<IntegrationItem[]> {
    return loadFromStorage("integrations", DEFAULT_INTEGRATIONS);
  },
  async toggle(id: string): Promise<IntegrationItem> {
    const list = await this.list();
    const item = list.find((i) => i.id === id);
    if (!item) throw new Error("Integração não encontrada");
    item.status = item.status === "conectado" ? "configurar" : "conectado";
    item.lastSync = item.status === "conectado" ? "Agora mesmo" : undefined;
    saveToStorage("integrations", list);
    return item;
  },
};

export const DatabaseService = {
  async listTables(): Promise<DatabaseTable[]> {
    return loadFromStorage("db_tables", DEFAULT_DB_TABLES);
  },
};

export const PipelineService = {
  async getSteps(): Promise<PipelineStep[]> {
    return loadFromStorage("pipeline_steps", DEFAULT_PIPELINE_STEPS);
  },
};

export const EvidenceService = {
  async list(): Promise<EvidenceRecord[]> {
    return loadFromStorage("evidence", DEFAULT_EVIDENCE);
  },
};

export const UserService = {
  async getProfile(): Promise<UserProfile> {
    return loadFromStorage("user_profile", DEFAULT_USER);
  },
  async updateProfile(input: UpdateProfileInput): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated: UserProfile = {
      ...current,
      name: input.name,
      email: input.email,
      role: input.role,
      organization: input.organization,
      timezone: input.timezone,
      language: input.language,
    };
    saveToStorage("user_profile", updated);
    return updated;
  },
};
