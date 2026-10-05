# ⚡ NoteAgents

<p align="center"><strong>AI Engineering Control Plane</strong><br/><em>Build faster. Understand everything. Fix automatically. Verify continuously.</em></p>

<p align="center">
<img alt="Status" src="https://img.shields.io/badge/status-active%20development-0B5FFF?style=for-the-badge">
<img alt="Open Source" src="https://img.shields.io/badge/open--source-yes-06B6D4?style=for-the-badge">
<img alt="Frontend Demo" src="https://img.shields.io/badge/frontend-demo-2563EB?style=for-the-badge">
<img alt="Next.js" src="https://img.shields.io/badge/Next.js-App%20Router-000000?style=for-the-badge&logo=next.js">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript">
<img alt="Vercel" src="https://img.shields.io/badge/Vercel-ready-000000?style=for-the-badge&logo=vercel">
</p>

> **NoteAgents é uma plataforma open source de engenharia de software assistida por IA. Este repositório público também contém o frontend demonstrativo do produto, preparado para publicação na Vercel.**

---

## 🚀 Demo

O frontend deste repositório é uma **demo pública e navegável** criada para tornar tangível a visão do NoteAgents para desenvolvedores, colaboradores, parceiros e investidores.

A demo apresenta a arquitetura de informação, os principais módulos, a experiência de navegação e os fluxos planejados para o Web Console.

**Status:** frontend interativo em desenvolvimento ativo.

**Deploy:** preparado para Vercel. A URL oficial deve ser adicionada após o deploy estável.

> ⚠️ A demo não deve ser confundida com a plataforma de produção completa. Recursos que dependem de backend, agentes, credenciais, execução local, GitHub, Vercel, MCP, LSP, bancos de dados ou provedores de IA serão integrados progressivamente.

---

## 🧭 Visão geral

O NoteAgents funciona como um **AI Engineering Control Plane**: uma camada de coordenação entre desenvolvedor, workspace, código, ambiente, agentes, ferramentas, conhecimento, testes, auditoria, evidências e produção.

A tese central é:

> **A IA aumentou drasticamente a velocidade de geração de software, mas a capacidade de compreender, validar, testar e manter esse software não cresceu na mesma velocidade.**

O NoteAgents existe para fechar essa lacuna.

```text
IDEIA
  ↓
CONHECIMENTO
  ↓
PLANEJAMENTO
  ↓
AMBIENTE
  ↓
ARQUITETURA
  ↓
BANCO DE DADOS
  ↓
IMPLEMENTAÇÃO
  ↓
TESTES
  ↓
AUDITORIA
  ↓
DETECÇÃO DE ERROS
  ↓
CORREÇÃO
  ↓
VERIFICAÇÃO
  ↓
EVIDÊNCIA
  ↓
DEPLOY
  ↓
PRODUÇÃO
  ↓
PRONTIDÃO DE MERCADO
  ↓
EVOLUÇÃO CONTÍNUA
```

---

## 🎯 O problema

A engenharia moderna envolve simultaneamente IA, agentes autônomos, IDEs, OpenCode, Git, GitHub, MCP, LSP, bancos, cloud, CI/CD, containers, testes e observabilidade.

Isso aumentou a produtividade, mas também criou um novo problema: **é possível produzir código muito mais rápido do que é possível verificar se todo o sistema está realmente correto.**

Um projeto pode parecer pronto e ainda possuir:

- dependências quebradas;
- imports incorretos;
- arquitetura inconsistente;
- componentes duplicados;
- código excessivamente acoplado;
- ausência ou insuficiência de testes;
- migrations e schemas inconsistentes;
- problemas de banco;
- vulnerabilidades;
- falhas de autenticação e autorização;
- problemas de performance e acessibilidade;
- erros de frontend, backend ou API;
- falhas de infraestrutura e deploy;
- inconsistências visuais;
- dívida técnica;
- documentação incompleta.

A pergunta passa de **"a IA escreveu?"** para **"o software realmente funciona, está seguro e está pronto?"**.

---

## 🧠 A solução

O produto combina dois grandes cérebros.

### Engineering Brain

Responsável por computador, ambiente, workspace, código, arquitetura, banco, migrations, OpenCode, MCP, LSP, agentes, testes, browser, runtime, segurança, infraestrutura, deployment e observabilidade.

### Knowledge Brain

Responsável por documentos, fontes, requisitos, pesquisas, imagens, decisões, contexto, documentação, relatórios, mapas mentais, explicações, artefatos e conhecimento do projeto.

```text
                  NOTEAGENTS
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
Engineering       Knowledge       Control
Brain             Brain           Plane
       │              │              │
       ▼              ▼              ▼
Código/Runtime     Fontes/Docs     Orquestração
Banco/Infra        Contexto        Agentes
OpenCode           Pesquisa        Tools
MCP/LSP            Chat            Pipelines
Testes             Evidências      Integrações
```

---

# 🖥️ Frontend Demo

O frontend público representa a **visão de produto** do NoteAgents. Ele permite que qualquer pessoa conheça a experiência planejada sem precisar instalar toda a infraestrutura de engenharia.

Princípios do frontend:

- Next.js + React + TypeScript;
- componentes reutilizáveis;
- páginas focadas em composição e roteamento;
- estado separado da apresentação;
- navegação real;
- sidebar colapsável;
- menus e dropdowns funcionais;
- modais, tabs, filtros e gráficos;
- loading, empty e error states;
- responsividade desktop/tablet/mobile;
- acessibilidade;
- preparação para APIs reais;
- arquitetura preparada para evolução.

A regra arquitetural é:

```text
UI
 ↓
State
 ↓
Action
 ↓
Backend Contract
 ↓
Validation
 ↓
Error Handling
 ↓
Evidence
 ↓
Tests
```

Uma tela que apenas aparenta funcionar não deve ser considerada uma funcionalidade concluída.

---

## 🧩 Módulos da interface

### Dashboard

Centro operacional do projeto: saúde, atividade, auditorias, pipelines, agentes, problemas, evolução e readiness.

### Chat com IA

Interface contextual para conversar com agentes, selecionar modelos, anexar documentos, imagens, código e repositórios e visualizar resultados e evidências.

### Projetos

Projetos, workspaces, stack, ambiente, repositórios, integrações, atividade e auditorias.

### Fontes

Documentos, PDFs, imagens, código, URLs, requisitos, documentação e artefatos.

### Notebook / Knowledge Studio

Notas, decisões, pesquisas, contexto, mapas, explicações, relatórios e conhecimento persistente.

### Arquivos

Árvore de workspace, busca, código, contexto e relacionamento entre artefatos.

### Agentes

Catálogo de agentes especializados, como Frontend, Backend, Database, Security, Testing, Architecture, DevOps, Documentation, Audit e Vision.

### Pipelines

```text
Discover → Analyze → Plan → Implement → Build → Test → Review → Fix → Verify
```

### Auditorias

Arquitetura, código, segurança, performance, testes, documentação, frontend, infraestrutura e produção, com score, severidade, evidências, recomendações e histórico.

### Banco de dados

Conexões, schemas, tabelas, migrations, índices, relacionamentos, integridade e diagnóstico.

### Integrações

Git, GitHub, Vercel, OpenCode, MCP, LSP, Docker, cloud, bancos, CI/CD, observabilidade, IA e Slack.

### Ambiente

Descoberta, detecção, configuração, instalação, validação e diagnóstico do ambiente.

### Relatórios

Auditorias, evidências, testes, readiness, evolução e documentação.

### Configurações

Perfil, providers, modelos, agentes, integrações, permissões, segurança e ambiente.

---

## 📱 Responsividade

A interface foi projetada para desktop, notebook, tablet e smartphone.

A sidebar pode ser minimizada/expandida e o layout deve adaptar navegação, cards, tabelas, gráficos, chat e painéis ao espaço disponível.

```text
Desktop
┌──────────────┬────────────────────────────┐
│ Sidebar      │ Conteúdo                   │
└──────────────┴────────────────────────────┘

Mobile
┌────────────────────────────────────────────┐
│ Header / Menu                              │
├────────────────────────────────────────────┤
│ Conteúdo                                   │
└────────────────────────────────────────────┘
```

---

## 🎨 Design System

A identidade visual prioriza branco, azul institucional, azul primário, azul claro e ciano.

| Token | Valor |
|---|---|
| Institutional Blue | `#0B5FFF` |
| Primary Blue | `#2563EB` |
| Light Blue | `#60A5FA` |
| Cyan | `#06B6D4` |
| White | `#FFFFFF` |

A interface deve privilegiar clareza, produtividade, contraste e consistência.

---

# 🏗️ Arquitetura

Princípios:

- modularidade;
- baixo acoplamento;
- interfaces explícitas;
- agentes desacoplados;
- providers intercambiáveis;
- ferramentas registráveis;
- segurança por padrão;
- permissões explícitas;
- execução verificável;
- evidências persistentes;
- observabilidade;
- extensibilidade;
- testes automatizados;
- compatibilidade com diferentes stacks.

O NoteAgents não deve obrigar o usuário a adotar uma única tecnologia. A plataforma deve detectar o ambiente e trabalhar com aquilo que já existe.

---

# 🔌 Integrações

| Categoria | Integrações |
|---|---|
| Source Control | Git / GitHub |
| AI Coding | OpenCode |
| Tool Protocol | MCP |
| Language Intelligence | LSP |
| Deployment | Vercel / Cloudflare |
| Backend Services | Firebase e outros |
| Database | PostgreSQL e outros |
| CI/CD | Pipelines externos |
| Communication | Slack |
| AI Providers | Providers compatíveis |
| Runtime | Local / Containers / Cloud |
| Observability | Providers compatíveis |

> Integrações ainda não implementadas não devem ser interpretadas como funcionalidades de produção.

---

# 🤖 Agentes

Um agente não deve ser apenas um prompt. Deve possuir identidade, capacidades, ferramentas, contexto, permissões, execução, validação e evidências.

```text
Identity
 ↓
Capabilities
 ↓
Tools
 ↓
Context
 ↓
Permissions
 ↓
Execution
 ↓
Validation
 ↓
Evidence
```

---

# 🔍 Auditoria e Evidence Engine

O NoteAgents deve conseguir responder:

- o que foi analisado?
- qual agente executou?
- quais ferramentas foram utilizadas?
- quais arquivos foram considerados?
- quais problemas foram encontrados?
- qual evidência comprova o problema?
- qual ação foi executada?
- qual foi o resultado?
- a correção foi verificada?

Fluxo:

```text
Input → Analysis → Finding → Evidence → Action → Validation → Result
```

---

# 🛡️ Segurança

O sistema deve operar com segurança por padrão.

Nunca:

- apagar arquivos silenciosamente;
- apagar banco automaticamente;
- alterar o sistema sem autorização;
- expor secrets;
- enviar arquivos privados sem consentimento;
- executar comandos privilegiados sem política;
- modificar fora do workspace autorizado.

Sempre:

```text
DISCOVER
→ EXPLAIN
→ ASK
→ APPROVE
→ EXECUTE
→ VERIFY
```

---

# 🧪 Qualidade

O projeto deve considerar:

- TypeScript;
- lint;
- testes unitários;
- testes de integração;
- testes de componentes;
- testes end-to-end;
- acessibilidade;
- responsividade;
- build;
- contratos;
- observabilidade.

---

# 🛠️ Stack do frontend

- Next.js / App Router;
- React;
- TypeScript;
- Tailwind CSS;
- componentes reutilizáveis;
- Vitest;
- ESLint;
- pnpm.

Separação recomendada:

```text
Routes
Components
Features
State
Services
Contracts
Types
Utils
Styles
```

---

# 📁 Estrutura conceitual

```text
NoteAgents/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── dashboard/
│   ├── chat/
│   ├── projects/
│   ├── sources/
│   ├── agents/
│   ├── pipelines/
│   ├── audits/
│   ├── database/
│   ├── integrations/
│   └── reports/
├── features/
├── lib/
│   ├── api/
│   ├── state/
│   ├── validation/
│   └── permissions/
├── types/
├── public/
├── docs/
├── tests/
├── AGENTS.md
├── CLAUDE.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```

A estrutura real pode evoluir conforme a implementação amadurecer.

---

# ⚙️ Quick Start

## Requisitos

- Node.js LTS;
- pnpm;
- Git.

```bash
node --version
pnpm --version
git --version
```

## Clone

```bash
git clone https://github.com/deevo-solucoes-finaceiras/NoteAgents.git
cd NoteAgents
```

## Instalação

```bash
pnpm install
```

## Desenvolvimento

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Produção local

```bash
pnpm start
```

## Testes

```bash
pnpm test
```

## Typecheck

```bash
pnpm exec tsc --noEmit
```

> Confira o `package.json` da versão atual para os scripts efetivamente disponíveis.

---

# ☁️ Deploy na Vercel

Fluxo:

```text
GitHub → Vercel → Build → Deploy → Demo pública
```

Configure, conforme a implementação real:

- variáveis de ambiente;
- domínio;
- secrets;
- observabilidade;
- logs;
- preview deployments;
- production deployments.

A URL oficial deve ser adicionada após o deploy estável.

---

# 🧪 Estado da Demo

A demo possui dois níveis.

### Demonstrativo

Pode utilizar estado local, fixtures, dados de demonstração, simulações e contratos preparados para integração.

### Produção

Depende de backend, autenticação, autorização, banco, agentes, providers de IA, MCP, LSP, Git/GitHub, infraestrutura, observabilidade e execução segura.

O README mantém essa distinção para não apresentar ao público uma capacidade como pronta quando ela ainda estiver em desenvolvimento.

---

# 🔭 Roadmap

### Fase 1 — Foundation

- [x] Identidade do produto
- [x] Arquitetura inicial
- [x] Repositório público
- [x] Frontend demo
- [x] Design system
- [x] Navegação principal
- [x] Componentes
- [ ] Contratos de backend
- [ ] Testes completos

### Fase 2 — Core Platform

- [ ] Workspace management
- [ ] Project management
- [ ] Environment Intelligence
- [ ] Knowledge Studio
- [ ] Chat contextual
- [ ] Agent runtime
- [ ] Tool Router
- [ ] Permission model

### Fase 3 — Verification

- [ ] Auto Audit
- [ ] Evidence Engine
- [ ] Observer
- [ ] Readiness Engine
- [ ] Test orchestration
- [ ] Visual validation
- [ ] Security validation

### Fase 4 — Autonomous Engineering

- [ ] Auto-fix
- [ ] Retries
- [ ] Agent orchestration
- [ ] Continuous observer
- [ ] Autonomous pipelines
- [ ] Technical debt analysis
- [ ] Engineering insights
- [ ] Production readiness

### Fase 5 — Integrations

- [ ] GitHub
- [ ] Vercel
- [ ] Docker
- [ ] Cloud
- [ ] CI/CD
- [ ] Observability
- [ ] AI providers
- [ ] MCP ecosystem
- [ ] LSP ecosystem

### Fase 6 — Ecosystem

- [ ] Agent Registry
- [ ] Plugin Registry
- [ ] MCP Registry
- [ ] Provider ecosystem
- [ ] Community contributions
- [ ] Enterprise capabilities

---

# 🧩 Ecossistema futuro

A comunidade poderá contribuir com:

- Agents;
- Plugins;
- Providers;
- MCPs;
- Validators;
- Framework Adapters;
- Database Adapters;
- Integrations;
- Auditors;
- Tools;
- Knowledge Modules.

A arquitetura deve permitir que uma nova capacidade seja registrada sem reconstruir a plataforma inteira.

---

# 🤝 OpenCode

```text
Developer
    │
    ├──────────────► OpenCode
    │                    ├── MCP
    │                    ├── LSP
    │                    └── Tools
    │
    └──────────────► NoteAgents
                         ├── Audit
                         ├── Evidence
                         ├── Observer
                         ├── Readiness
                         └── Evolution
```

A proposta é trabalhar ao lado das ferramentas existentes, adicionando contexto, coordenação, verificação e evidências.

---

# 💳 Circle, USDC e Solana

O projeto possui documentação experimental para integrações com Circle, USDC e Solana.

Essas integrações fazem parte da exploração do ecossistema e não devem ser interpretadas como infraestrutura financeira de produção enquanto não estiverem implementadas, testadas e auditadas.

Documentação relacionada:

- `doc/circle-integration.md`
- `doc/solana-integration.md`
- `.flow/hackathon-prep.md`

---

# 📚 Documentação

Arquivos relevantes:

```text
AGENTS.md
CLAUDE.md
doc/
├── README_NoteAgents.md
├── circle-integration.md
└── solana-integration.md

.flow/
└── hackathon-prep.md
```

---

# 📐 Critério fundamental de desenvolvimento

Toda funcionalidade deve possuir:

```text
UI
State
Action
Backend Contract
Validation
Error Handling
Evidence
Tests
```

Priorize trabalho por dependências e nunca implemente uma interface apenas visual quando a funcionalidade puder representar uma operação real.

---

# 💼 Para investidores e parceiros

O frontend demonstrativo existe para tornar tangível a visão do produto.

A demo permite visualizar:

- experiência de uso;
- organização dos módulos;
- agentes especializados;
- auditorias;
- pipelines;
- conhecimento;
- código;
- integrações;
- evolução para uma plataforma completa.

A oportunidade é criar uma camada de engenharia acima das ferramentas individuais:

```text
GitHub
Vercel
OpenCode
MCP
LSP
Docker
Databases
AI Models
Testing
Observability
Cloud
       ↓
   NOTEAGENTS
       ↓
Developer Intelligence
```

O frontend público é, portanto, uma **demo de produto**, e não uma alegação de que toda a arquitetura já está implementada em produção.

---

# 🧭 O que o NoteAgents não é

O NoteAgents não é:

- substituto do desenvolvedor;
- uma IA que promete criar qualquer software sem supervisão;
- uma IDE obrigatória;
- substituto do GitHub;
- substituto do OpenCode;
- substituto do MCP;
- substituto do LSP;
- substituto de todas as ferramentas de segurança;
- uma caixa-preta que executa comandos sem controle.

Ele é uma camada de coordenação, inteligência, automação, contexto, validação, auditoria, evidência e evolução.

---

# 🧠 Filosofia

O NoteAgents não diz:

> "Confie na IA."

A filosofia é:

> **Use IA em escala, mas verifique o resultado.**

O desenvolvedor continua responsável pelas decisões.

O NoteAgents fornece:

```text
Context
Automation
Evidence
Intelligence
Agents
Validation
Recommendations
```

---

# 🏆 A visão

> **NoteAgents — Your AI Engineering Control Plane.**

```text
IDEA
 ↓
DESIGN
 ↓
BUILD
 ↓
TEST
 ↓
AUDIT
 ↓
FIX
 ↓
VERIFY
 ↓
DEPLOY
 ↓
PRODUCTION
 ↓
MONITOR
 ↓
EVOLVE
```

O resultado esperado não é:

> "A IA criou meu software."

O resultado esperado é:

> **"Eu construí meu software com IA, e o NoteAgents me mostrou o que realmente funciona, encontrou o que estava errado, ajudou a corrigir, verificou as correções e continua acompanhando o projeto enquanto ele evolui."**

---

# 📊 Status do projeto

**Development stage:** Active development 🚧

O frontend demonstrativo está sendo utilizado para validar a experiência de produto e tornar a visão do NoteAgents pública.

A arquitetura, backend, agentes, integrações e infraestrutura continuam em evolução.

Recursos marcados como roadmap, conceptuais ou planejados não devem ser interpretados como implementados em produção.

---

# 🔒 Segurança para colaboradores

Nunca publique:

```text
.env
.env.local
API keys
OAuth secrets
private keys
tokens
service-account credentials
database credentials
webhook secrets
```

Use `.env.example` para documentar configurações sem expor valores reais.

---

# 🤝 Contribuindo

Contribuições são bem-vindas.

```bash
git checkout -b feat/minha-feature
pnpm lint
pnpm test
pnpm exec tsc --noEmit
pnpm build
git add .
git commit -m "feat: descreva a alteração"
git push origin feat/minha-feature
```

Pull Requests devem explicar:

- problema;
- solução;
- impacto arquitetural;
- arquivos alterados;
- testes;
- evidências;
- riscos;
- documentação atualizada.

---

# 📝 Conventional Commits

```text
feat: nova funcionalidade
fix: correção de bug
refactor: refatoração
docs: documentação
test: testes
chore: manutenção
perf: performance
security: segurança
build: build e dependências
ci: integração contínua
```

---

# 🌍 Open Source

O NoteAgents nasce com uma filosofia aberta para que desenvolvedores possam estudar a arquitetura, testar a demo, acompanhar a evolução, criar agentes, plugins e integrações, propor melhorias e contribuir com código e documentação.

O repositório público também funciona como uma vitrine técnica do produto e como ponto de entrada para a futura comunidade.

---

# 📄 Licença

A licença definitiva deve ser definida antes do primeiro release público estável. Até essa definição, consulte os arquivos e políticas do repositório antes de reutilizar código ou componentes.

---

# 💙 NoteAgents

<p align="center">
<strong>Build faster.</strong><br/>
<strong>Understand everything.</strong><br/>
<strong>Fix automatically.</strong><br/>
<strong>Verify continuously.</strong>
</p>

<p align="center">Made for developers building the next generation of software with AI.</p>
