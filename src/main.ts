import {
  app,
  BrowserWindow,
  safeStorage,
  ipcMain,
  shell,
  dialog,
} from "electron";

import path from "node:path";
import fs from "node:fs/promises";

import started from "electron-squirrel-startup";

import { saveAuth, loadAuth, clearAuth } from "./services/authStorage";

import {
  startDiscordRPC,
  updateDiscordRPC,
  stopDiscordRPC,
  startDiscordRPCRetry,
} from "./main/discord";

import { autoUpdater } from "electron-updater";

if (started) {
  app.quit();
}

function getThemesPath() {
  const folder = path.join(app.getPath("userData"), "themes");

  console.log("Aurora themes folder:", folder);

  return folder;
}

async function listThemes() {
  const folder = getThemesPath();

  await fs.mkdir(folder, {
    recursive: true,
  });

  const files = await fs.readdir(folder);

  const themes = [];

  for (const file of files) {
    if (!file.endsWith(".css")) {
      continue;
    }

    try {
      const content = await fs.readFile(path.join(folder, file), "utf8");

      const match = content.match(/@aurora-theme\s*([\s\S]*?)\s*\*\//);

      if (!match) {
        continue;
      }

      const metadata = JSON.parse(match[1]);

      if (!metadata.id || !metadata.name) {
        console.warn(`Skipping invalid theme: ${file}`);

        continue;
      }

      themes.push({
        file,
        ...metadata,
      });
    } catch (error) {
      console.error(`Failed loading theme ${file}`, error);
    }
  }

  return themes;
}

async function loadTheme(file: string) {
  const themeFile = path.join(getThemesPath(), file);

  return fs.readFile(themeFile, "utf8");
}

async function openThemesFolder() {
  const folder = getThemesPath();

  await fs.mkdir(folder, {
    recursive: true,
  });

  await shell.openPath(folder);
}

async function importTheme() {
  const result = await dialog.showOpenDialog({
    title: "Import Aurora Theme",

    properties: ["openFile"],

    filters: [
      {
        name: "Aurora Theme",
        extensions: ["css"],
      },
    ],
  });

  if (result.canceled) {
    return false;
  }

  const source = result.filePaths[0];

  const destination = path.join(getThemesPath(), path.basename(source));

  await fs.mkdir(getThemesPath(), {
    recursive: true,
  });

  await fs.copyFile(source, destination);

  return true;
}

async function exportTheme(file: string) {
  const result = await dialog.showSaveDialog({
    title: "Export Aurora Theme",

    defaultPath: file,

    filters: [
      {
        name: "Aurora Theme",
        extensions: ["css"],
      },
    ],
  });

  if (result.canceled || !result.filePath) {
    return false;
  }

  await fs.copyFile(
    path.join(getThemesPath(), file),

    result.filePath,
  );

  return true;
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1400,

    height: 900,

    minWidth: 1100,

    minHeight: 700,

    titleBarStyle: "hidden",

    titleBarOverlay: {
      color: "#00000000",

      symbolColor: "#ffffff",

      height: 40,
    },

    autoHideMenuBar: true,

    webPreferences: {
      preload: path.join(__dirname, "preload.js"),

      nodeIntegration: false,

      contextIsolation: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

app.on("ready", async () => {
  createWindow();

  const connected = await startDiscordRPC();

  if (!connected) {
    startDiscordRPCRetry();
  }

  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on("before-quit", () => {
  stopDiscordRPC();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/*
 Authentication
*/

ipcMain.handle("auth:save", async (_, auth) => {
  console.log("Encryption available:", safeStorage.isEncryptionAvailable());

  await saveAuth(auth);
});

ipcMain.handle("auth:load", async () => {
  return loadAuth();
});

ipcMain.handle("auth:clear", async () => {
  await clearAuth();
});

/*
 Discord RPC
*/

ipcMain.handle("discord:start", async () => {
  try {
    await startDiscordRPC();

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,

      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

ipcMain.handle("discord:stop", async () => {
  stopDiscordRPC();

  return {
    success: true,
  };
});

ipcMain.handle("discord:update", async (_, data) => {
  updateDiscordRPC(data);

  return {
    success: true,
  };
});

/*
 Themes
*/

ipcMain.handle("themes:list", async () => {
  return await listThemes();
});

ipcMain.handle("themes:load", async (_, file: string) => {
  return await loadTheme(file);
});

ipcMain.handle("themes:open-folder", async () => {
  await openThemesFolder();

  return true;
});

ipcMain.handle("themes:import", async () => {
  return await importTheme();
});

ipcMain.handle("themes:export", async (_, file: string) => {
  return await exportTheme(file);
});
