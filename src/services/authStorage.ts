import { safeStorage, app } from "electron";
import fs from "node:fs/promises";
import path from "node:path";

const FILE_NAME = "auth.json";

function getAuthPath() {
  return path.join(app.getPath("userData"), FILE_NAME);
}

interface Auth {
  server: string;
  username: string;
  password: string;
}

export async function saveAuth(auth: Auth) {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error("Encryption is not available");
  }

  const encrypted = {
    server: safeStorage.encryptString(auth.server).toString("base64"),

    username: safeStorage.encryptString(auth.username).toString("base64"),

    password: safeStorage.encryptString(auth.password).toString("base64"),
  };

  await fs.writeFile(
    getAuthPath(),
    JSON.stringify(encrypted, null, 2),
    "utf-8",
  );
}

export async function loadAuth(): Promise<Auth | null> {
  try {
    const content = await fs.readFile(getAuthPath(), "utf-8");

    const encrypted = JSON.parse(content);

    return {
      server: safeStorage.decryptString(
        Buffer.from(encrypted.server, "base64"),
      ),

      username: safeStorage.decryptString(
        Buffer.from(encrypted.username, "base64"),
      ),

      password: safeStorage.decryptString(
        Buffer.from(encrypted.password, "base64"),
      ),
    };
  } catch {
    return null;
  }
}

export async function clearAuth() {
  try {
    await fs.unlink(getAuthPath());
  } catch {
    // Already deleted
  }
}
