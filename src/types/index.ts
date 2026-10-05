export type ProjectStatus = "em_andamento" | "planejamento" | "validacao" | "concluido";

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  status: ProjectStatus;
  stack: string[];
  health: number; // 0-100
  lastAuditScore?: number;
  lastRunDate?: string;
  openIssuesCount: number;
  updatedAt: string;
  repoUrl?: string;
  workspacePath?: string;
}

export type AgentAutonomy = 0 | 1 | 2 | 3 | 4 | 5;
export type AgentStatus = "ativo" | "pausado" | "executando" | "bloqueado" | "erro";

export interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: "engineering" | "quality" | "knowledge" | "system";
  status: AgentStatus;
  autonomyLevel: AgentAutonomy;
  model: string;
  capabilities: string[];
  tools: string[];
  mcpEnabled: boolean;
  lspEnabled: boolean;
  permissions: string[];
  runsCount: number;
  lastActive?: string;
}

export type AuditType =
  | "arquitetura"
  | "codigo"
  | "seguranca"
  | "performance"
  | "testes"
  | "documentacao"
  | "infraestrutura";

export type FindingSeverity = "critico" | "alto" | "medio" | "baixo";

export interface Finding {
  id: string;
  auditId: string;
  severity: FindingSeverity;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  status: "aberto" | "em_correcao" | "resolvido";
  affectedFile?: string;
}

export interface AuditRecord {
  id: string;
  title: string;
  type: AuditType;
  score: number; // 0-100
  status: "concluido" | "em_andamento" | "falha";
  date: string;
  findingsCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  categories: {
    name: string;
    score: number;
    color: string;
  }[];
  findings: Finding[];
}

export interface PipelineStep {
  id: string;
  order: number;
  name: string;
  description: string;
  status: "pending" | "running" | "success" | "failed" | "blocked";
  durationMs?: number;
  agent?: string;
  logs?: string[];
  evidenceId?: string;
}

export interface RunRecord {
  id: string;
  projectId: string;
  projectName: string;
  agentId: string;
  agentName: string;
  trigger: string;
  status: "success" | "running" | "failed";
  startTime: string;
  durationMs: number;
  exitCode: number;
  filesChanged: number;
  testsPassed: number;
  testsFailed: number;
  logs: string[];
}

export interface EvidenceRecord {
  id: string;
  action: string;
  actor: string;
  agent: string;
  timestamp: string;
  command: string;
  inputSummary: string;
  outputSummary: string;
  exitCode: number;
  filesChanged: string[];
  testsSummary: string;
  result: "success" | "failure";
}

export type SourceType = "pdf" | "image" | "code" | "url" | "markdown" | "database";

export interface KnowledgeSource {
  id: string;
  name: string;
  type: SourceType;
  sizeBytes: number;
  updatedAt: string;
  officialBadge?: boolean;
  status: "indexed" | "processing" | "failed";
  citationsCount: number;
}

export interface EnvironmentTool {
  name: string;
  version: string;
  status: "connected" | "missing" | "warning" | "error";
  description: string;
  category: "runtime" | "container" | "database" | "protocol";
  detectedPath?: string;
}

export interface IntegrationItem {
  id: string;
  name: string;
  description: string;
  category: "vcs" | "cloud" | "protocol" | "database" | "communication";
  status: "conectado" | "configurar" | "erro";
  lastSync?: string;
  permissions: string[];
  iconName: string;
}

export interface DatabaseTable {
  name: string;
  recordCount: number;
  columnsCount: number;
  sizeBytes: number;
  primaryKey: string;
  lastUpdated: string;
}

export interface IssueItem {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  type: "bug" | "security" | "performance" | "architecture" | "database" | "ux";
  severity: FindingSeverity;
  status: "open" | "assigned" | "fixing" | "resolved";
  createdAt: string;
  assignedAgent?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  avatarUrl?: string;
  timezone: string;
  language: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  reasoning?: string;
  timestamp: string;
  model?: string;
  agent?: string;
  attachments?: { name: string; type: string; url?: string }[];
  analysisCard?: {
    title: string;
    description: string;
    items: { label: string; completed: boolean }[];
    actionLabel: string;
    actionTarget: string;
  };
  evidenceId?: string;
}
