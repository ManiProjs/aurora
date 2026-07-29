import fs from "node:fs/promises";
import path from "node:path";

import { app } from "electron";

function getThemeFolder() {
  return path.join(app.getPath("userData"), "themes");
}

export async function listThemes() {
  const folder = getThemeFolder();

  await fs.mkdir(folder, {
    recursive: true,
  });

  const files = await fs.readdir(folder);

  const themes = [];

  for (const file of files) {
    if (!file.endsWith(".css")) {
      continue;
    }

    const content = await fs.readFile(path.join(folder, file), "utf8");

    const match = content.match(/@aurora-theme\s*([\s\S]*?)\s*\*\//);

    if (!match) {
      continue;
    }

    try {
      const metadata = JSON.parse(match[1]);

      themes.push({
        file,
        ...metadata,
      });
    } catch {
      console.error(`Invalid theme metadata: ${file}`);
    }
  }

  return themes;
}

export async function loadTheme(file: string) {
  const themePath = path.join(getThemeFolder(), file);

  return fs.readFile(themePath, "utf8");
}
