import { promises as fs } from "node:fs";
import path from "node:path";
import { CONFIG_FILE, DATA_DIR } from "./paths";

export interface AppConfig {
  /** TMDB v3 API key (or v4 read access token), entered/edited from the admin settings page. */
  tmdbApiKey: string;
  /** GitHub usernames allowed to sign in as admin. Empty = GitHub login disabled. */
  allowedGithubUsers: string[];
  /** scrypt hash of a fallback admin password, used when GitHub OAuth isn't configured. */
  adminTokenHash: string | null;
}

const DEFAULT_CONFIG: AppConfig = {
  tmdbApiKey: "",
  allowedGithubUsers: [],
  adminTokenHash: null,
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readConfig(): Promise<AppConfig> {
  try {
    const raw = await fs.readFile(CONFIG_FILE, "utf8");
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { ...DEFAULT_CONFIG };
    }
    throw err;
  }
}

export async function writeConfig(config: AppConfig): Promise<void> {
  await ensureDataDir();
  const tmp = path.join(DATA_DIR, `.config.json.${process.pid}.tmp`);
  await fs.writeFile(tmp, JSON.stringify(config, null, 2), "utf8");
  await fs.rename(tmp, CONFIG_FILE);
}

export async function updateConfig(
  patch: Partial<AppConfig>
): Promise<AppConfig> {
  const current = await readConfig();
  const next = { ...current, ...patch };
  await writeConfig(next);
  return next;
}
