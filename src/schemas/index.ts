import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(60, "Nome muito longo"),
  description: z.string().min(5, "Descreva brevemente o projeto"),
  category: z.string().min(1, "Selecione uma categoria"),
  stack: z.array(z.string()).min(1, "Adicione ao menos uma tecnologia na stack"),
  repoUrl: z.string().url("URL de repositório inválida").optional().or(z.literal("")),
  workspacePath: z.string().optional().or(z.literal("")),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  role: z.string().min(2, "Cargo é obrigatório"),
  organization: z.string().min(2, "Organização é obrigatória"),
  timezone: z.string().default("America/Sao_Paulo"),
  language: z.string().default("pt-BR"),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Endereço de email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nome completo é obrigatório"),
  email: z.string().email("Endereço de email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  organization: z.string().min(2, "Nome da organização"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const CreateAgentSchema = z.object({
  name: z.string().min(2, "Nome do agente"),
  role: z.string().min(2, "Função principal"),
  category: z.enum(["engineering", "quality", "knowledge", "system"]),
  autonomyLevel: z.number().min(0).max(5),
  model: z.string().min(1, "Selecione um modelo"),
  description: z.string().min(10, "Instruções do agente"),
});

export type CreateAgentInput = z.infer<typeof CreateAgentSchema>;

export const SendMessageSchema = z.object({
  content: z.string().min(1, "Mensagem não pode ser vazia"),
  agent: z.string().optional(),
  model: z.string().default("GPT-5"),
});

export type SendMessageInput = z.infer<typeof SendMessageSchema>;
