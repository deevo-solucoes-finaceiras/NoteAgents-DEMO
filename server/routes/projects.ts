import { Router, Request, Response } from "express";
import { firestoreDb } from "../db";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const router = Router();
const WORKSPACES_DIR = path.resolve(process.cwd(), "workspaces");

// Initial Seed Data for projects if Firestore collection is empty
const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    name: "ViaPay Core",
    slug: "viapay-core",
    description: "SaaS financeiro corporativo com gateway multi-adquirente, tokenização PCI-DSS e liquidação instantânea.",
    category: "Fintech",
    status: "em_andamento",
    stack: ["TypeScript", "Next.js", "Express", "PostgreSQL", "Docker", "Tailwind CSS"],
    health: 96,
    lastAuditScore: 92,
    lastRunDate: new Date().toISOString(),
    openIssuesCount: 2,
    updatedAt: new Date().toISOString(),
    repoUrl: "https://github.com/noteagents/viapay-core.git",
    workspacePath: "/workspaces/viapay-core",
  },
  {
    id: "proj-2",
    name: "E-commerce Headless",
    slug: "ecommerce-headless",
    description: "Plataforma de alta conversão com checkout transparente e integração com ERPs e operadoras logísticas.",
    category: "E-commerce",
    status: "em_andamento",
    stack: ["React", "TypeScript", "Node.js", "Redis", "Tailwind CSS"],
    health: 91,
    lastAuditScore: 88,
    lastRunDate: new Date().toISOString(),
    openIssuesCount: 4,
    updatedAt: new Date().toISOString(),
    repoUrl: "https://github.com/noteagents/ecommerce-headless.git",
    workspacePath: "/workspaces/ecommerce-headless",
  },
  {
    id: "proj-3",
    name: "App Mobile Flutter",
    slug: "app-mobile-flutter",
    description: "Carteira digital para iOS e Android com autenticação biométrica e pagamentos instantâneos via Pix e QR Code.",
    category: "Mobile",
    status: "planejamento",
    stack: ["Flutter", "Dart", "Firebase", "SQLite"],
    health: 84,
    lastAuditScore: 79,
    lastRunDate: new Date().toISOString(),
    openIssuesCount: 1,
    updatedAt: new Date().toISOString(),
    workspacePath: "/workspaces/app-mobile-flutter",
  },
  {
    id: "proj-4",
    name: "Site Institucional",
    slug: "site-institucional",
    description: "Portal corporativo com blog, área de carreiras, central de ajuda e documentação de API para desenvolvedores.",
    category: "Web",
    status: "concluido",
    stack: ["Astro", "TypeScript", "Tailwind CSS"],
    health: 99,
    lastAuditScore: 98,
    lastRunDate: new Date().toISOString(),
    openIssuesCount: 0,
    updatedAt: new Date().toISOString(),
    workspacePath: "/workspaces/site-institucional",
  },
];

// GET /api/projects
router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await firestoreDb.collection("projects").get();
    if (snapshot.empty) {
      // Seed initial real data into Firestore
      const batch = firestoreDb.batch();
      for (const p of INITIAL_PROJECTS) {
        batch.set(firestoreDb.collection("projects").doc(p.id), p);
      }
      await batch.commit();
      return res.json(INITIAL_PROJECTS);
    }
    const projects = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return res.json(projects);
  } catch (err: unknown) {
    console.error("GET /api/projects error:", err);
    return res.json(INITIAL_PROJECTS);
  }
});

// GET /api/projects/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const doc = await firestoreDb.collection("projects").doc(req.params.id).get();
    if (!doc.exists) {
      const found = INITIAL_PROJECTS.find((p) => p.id === req.params.id || p.slug === req.params.id);
      if (found) return res.json(found);
      return res.status(404).json({ error: "Projeto não encontrado" });
    }
    return res.json({ id: doc.id, ...doc.data() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao buscar projeto";
    return res.status(500).json({ error: msg });
  }
});

// POST /api/projects
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, category, stack, repoUrl, workspacePath } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "Nome e descrição são obrigatórios" });
    }

    const id = `proj-${Date.now()}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProject = {
      id,
      name,
      slug,
      description,
      category: category || "Fintech",
      status: "em_andamento",
      stack: Array.isArray(stack) ? stack : ["TypeScript", "React"],
      health: 90,
      lastAuditScore: 85,
      lastRunDate: new Date().toISOString(),
      openIssuesCount: 0,
      updatedAt: new Date().toISOString(),
      repoUrl: repoUrl || undefined,
      workspacePath: workspacePath || `/workspaces/${slug}`,
    };

    await firestoreDb.collection("projects").doc(id).set(newProject);
    return res.status(201).json(newProject);
  } catch (err: unknown) {
    console.error("POST /api/projects error:", err);
    const msg = err instanceof Error ? err.message : "Erro ao criar projeto";
    return res.status(500).json({ error: msg });
  }
});

// PUT /api/projects/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates.id;
    await firestoreDb.collection("projects").doc(req.params.id).set(updates, { merge: true });
    const updated = await firestoreDb.collection("projects").doc(req.params.id).get();
    return res.json({ id: updated.id, ...updated.data() });
  } catch (err: unknown) {
    console.error("PUT /api/projects error:", err);
    const msg = err instanceof Error ? err.message : "Erro ao atualizar projeto";
    return res.status(500).json({ error: msg });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await firestoreDb.collection("projects").doc(req.params.id).delete();
    return res.json({ success: true, message: "Projeto excluído com sucesso." });
  } catch (err: unknown) {
    console.error("DELETE /api/projects error:", err);
    const msg = err instanceof Error ? err.message : "Erro ao excluir projeto";
    return res.status(500).json({ error: msg });
  }
});

// POST /api/projects/git-import
router.post("/git-import", async (req: Request, res: Response) => {
  try {
    const { repoUrl, branch = "main", customName, category = "Fintech" } = req.body;

    if (!repoUrl || typeof repoUrl !== "string") {
      return res.status(400).json({ error: "URL do repositório Git é obrigatória." });
    }

    const trimmedUrl = repoUrl.trim();
    if (!/^[a-zA-Z0-9_.:/@-]+$/.test(trimmedUrl)) {
      return res.status(400).json({ error: "URL do repositório Git contém caracteres inválidos." });
    }

    let inferredName = customName;
    if (!inferredName) {
      const parts = trimmedUrl.replace(/\.git$/, "").split("/");
      inferredName = parts[parts.length - 1] || "projeto-git";
    }

    const slug = inferredName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const targetDir = path.join(WORKSPACES_DIR, slug);

    if (fs.existsSync(targetDir)) {
      try {
        fs.rmSync(targetDir, { recursive: true, force: true });
      } catch {
        // ignore
      }
    }

    const branchArg = branch ? `--branch ${branch}` : "";
    const cloneCmd = `git clone --depth 1 ${branchArg} "${trimmedUrl}" "${targetDir}"`;

    console.log(`Cloning git repository: ${trimmedUrl} into ${targetDir}`);
    await execAsync(cloneCmd);

    const detectedStack: string[] = [];
    let projectDescription = `Repositório clonado via Git (${trimmedUrl})`;

    const hasPackageJson = fs.existsSync(path.join(targetDir, "package.json"));
    if (hasPackageJson) {
      try {
        const pkgRaw = fs.readFileSync(path.join(targetDir, "package.json"), "utf-8");
        const pkg = JSON.parse(pkgRaw);
        if (pkg.description) projectDescription = pkg.description;
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };

        if (deps["react"]) detectedStack.push("React");
        if (deps["next"]) detectedStack.push("Next.js");
        if (deps["vue"]) detectedStack.push("Vue");
        if (deps["typescript"] || fs.existsSync(path.join(targetDir, "tsconfig.json"))) {
          detectedStack.push("TypeScript");
        }
        if (deps["tailwindcss"]) detectedStack.push("Tailwind CSS");
        if (deps["express"]) detectedStack.push("Express");
        if (deps["@nestjs/core"]) detectedStack.push("NestJS");
        if (deps["prisma"]) detectedStack.push("Prisma");
        if (deps["drizzle-orm"]) detectedStack.push("Drizzle");
      } catch {
        detectedStack.push("Node.js");
      }
    }

    if (fs.existsSync(path.join(targetDir, "requirements.txt")) || fs.existsSync(path.join(targetDir, "pyproject.toml"))) {
      detectedStack.push("Python");
    }
    if (fs.existsSync(path.join(targetDir, "go.mod"))) {
      detectedStack.push("Go");
    }
    if (fs.existsSync(path.join(targetDir, "Cargo.toml"))) {
      detectedStack.push("Rust");
    }
    if (fs.existsSync(path.join(targetDir, "Dockerfile")) || fs.existsSync(path.join(targetDir, "docker-compose.yml"))) {
      detectedStack.push("Docker");
    }
    if (fs.existsSync(path.join(targetDir, "pom.xml")) || fs.existsSync(path.join(targetDir, "build.gradle"))) {
      detectedStack.push("Java");
    }

    if (detectedStack.length === 0) {
      detectedStack.push("Git Repository", "Software Engineering");
    }

    let fileCount = 0;
    function countFiles(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name === ".git" || entry.name === "node_modules") continue;
        if (entry.isDirectory()) {
          countFiles(path.join(dir, entry.name));
        } else {
          fileCount++;
        }
      }
    }
    try {
      countFiles(targetDir);
    } catch {
      fileCount = 10;
    }

    const newProject = {
      id: `git-${slug}-${Date.now()}`,
      name: inferredName,
      slug,
      description: projectDescription,
      category: category || "Fintech",
      status: "em_andamento",
      stack: detectedStack,
      health: 95,
      lastAuditScore: 88,
      openIssuesCount: 0,
      updatedAt: new Date().toISOString(),
      repoUrl: trimmedUrl,
      workspacePath: targetDir,
      fileCount,
      branch,
    };

    // Save to Firestore
    await firestoreDb.collection("projects").doc(newProject.id).set(newProject);

    return res.json({
      success: true,
      project: newProject,
      message: `Repositório ${inferredName} clonado com sucesso (${fileCount} arquivos analisados).`,
    });
  } catch (err: unknown) {
    console.error("Git import error:", err);
    const msg = err instanceof Error ? err.message : "Falha ao clonar o repositório Git";
    return res.status(500).json({ error: msg });
  }
});

export default router;
