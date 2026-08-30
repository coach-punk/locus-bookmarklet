import path from "node:path";

// All persistent instance data lives here so self-hosters can mount a single
// volume (Docker) or point DATA_DIR at any writable directory.
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");
export const RATINGS_DIR = path.join(DATA_DIR, "ratings");
export const CONFIG_FILE = path.join(DATA_DIR, "config.json");
