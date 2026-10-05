import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve(process.cwd(), "serviceAccountKey.json");
const LOCAL_STORAGE_DIR = path.resolve(process.cwd(), ".data");

if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
  fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
}

let app: App;
let adminFirestore: Firestore | null = null;

if (getApps().length === 0) {
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || "noteagents",
      });
      adminFirestore = getFirestore(app);
      console.log("Firebase Admin conectado ao projeto: noteagents");
    } catch (e) {
      console.warn("Erro ao carregar serviceAccountKey.json:", e);
    }
  }
} else {
  app = getApps()[0];
  try {
    adminFirestore = getFirestore(app);
  } catch (e) {
    console.warn("Erro ao obter getFirestore:", e);
  }
}

// Local filesystem fallback store for collections (keeps data persistent on server)
export class LocalCollection {
  private filePath: string;

  constructor(private name: string) {
    this.filePath = path.join(LOCAL_STORAGE_DIR, `${name}.json`);
  }

  private readAll(): Record<string, any> {
    if (!fs.existsSync(this.filePath)) return {};
    try {
      return JSON.parse(fs.readFileSync(this.filePath, "utf-8"));
    } catch {
      return {};
    }
  }

  private writeAll(data: Record<string, any>): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error(`Erro ao gravar dados locais em ${this.name}:`, err);
    }
  }

  async get(): Promise<{ empty: boolean; docs: Array<{ id: string; data: () => any }> }> {
    const all = this.readAll();
    const keys = Object.keys(all);
    const docs = keys.map((k) => ({
      id: k,
      data: () => all[k],
    }));
    return { empty: docs.length === 0, docs };
  }

  async set(id: string, data: any, options?: { merge?: boolean }): Promise<void> {
    const all = this.readAll();
    if (options?.merge && all[id]) {
      all[id] = { ...all[id], ...data };
    } else {
      all[id] = data;
    }
    this.writeAll(all);
  }

  async delete(id: string): Promise<void> {
    const all = this.readAll();
    delete all[id];
    this.writeAll(all);
  }

  doc(id: string) {
    const self = this;
    return {
      async get() {
        const all = self.readAll();
        const exists = Boolean(all[id]);
        return {
          exists,
          id,
          data: () => all[id],
        };
      },
      async set(data: any, options?: { merge?: boolean }) {
        return self.set(id, data, options);
      },
      async delete() {
        return self.delete(id);
      },
    };
  }

  async count() {
    const all = this.readAll();
    return {
      async get() {
        return {
          data: () => ({ count: Object.keys(all).length }),
        };
      },
    };
  }

  limit(num: number) {
    const self = this;
    return {
      async get() {
        const all = self.readAll();
        const keys = Object.keys(all).slice(0, num);
        const docs = keys.map((k) => ({
          id: k,
          data: () => all[k],
        }));
        return { empty: docs.length === 0, docs };
      },
    };
  }

  where(field: string, op: string, value: any) {
    const self = this;
    return {
      limit(num: number) {
        return {
          async get() {
            const all = self.readAll();
            const matching = Object.keys(all)
              .filter((k) => all[k][field] === value)
              .slice(0, num);
            const docs = matching.map((k) => ({
              id: k,
              data: () => all[k],
            }));
            return { empty: docs.length === 0, docs };
          },
        };
      },
    };
  }
}

// Resilient wrapper: tries Firestore first, falls back to persistent local storage on disk
export const firestoreDb = {
  collection(name: string) {
    const local = new LocalCollection(name);

    return {
      async get() {
        if (adminFirestore) {
          try {
            return await adminFirestore.collection(name).get();
          } catch (err: any) {
            console.warn(`Firestore collection(${name}).get() fallback to local:`, err?.message || err);
          }
        }
        return await local.get();
      },

      doc(id: string) {
        return {
          async get() {
            if (adminFirestore) {
              try {
                return await adminFirestore.collection(name).doc(id).get();
              } catch (err: any) {
                console.warn(`Firestore doc(${id}).get() fallback to local:`, err?.message || err);
              }
            }
            return await local.doc(id).get();
          },

          async set(data: any, options?: { merge?: boolean }) {
            // Save locally first for instant persistence
            await local.doc(id).set(data, options);
            if (adminFirestore) {
              try {
                await adminFirestore.collection(name).doc(id).set(data, options || {});
              } catch (err: any) {
                console.warn(`Firestore doc(${id}).set() sync pending:`, err?.message || err);
              }
            }
          },

          async delete() {
            await local.doc(id).delete();
            if (adminFirestore) {
              try {
                await adminFirestore.collection(name).doc(id).delete();
              } catch (err: any) {
                console.warn(`Firestore doc(${id}).delete() sync pending:`, err?.message || err);
              }
            }
          },
        };
      },

      limit(num: number) {
        return local.limit(num);
      },

      where(field: string, op: string, value: any) {
        return local.where(field, op, value);
      },

      async count() {
        return await local.count();
      },
    };
  },

  batch() {
    const operations: Array<() => Promise<void>> = [];
    return {
      set(docRef: any, data: any) {
        operations.push(async () => {
          await docRef.set(data);
        });
      },
      async commit() {
        for (const op of operations) {
          await op();
        }
      },
    };
  },

  async listCollections() {
    return [
      this.collection("projects"),
      this.collection("agents"),
      this.collection("audits"),
      this.collection("evidence"),
      this.collection("pipelines"),
      this.collection("users"),
    ];
  },
};
