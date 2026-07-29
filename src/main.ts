import { app, BrowserWindow, safeStorage, ipcMain } from "electron";

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
    } catch (error) {
      console.error(`Invalid theme metadata: ${file}`, error);
    }
  }

  return themes;
}

async function loadTheme(file: string) {
  const themeFile = path.join(getThemesPath(), file);

  return fs.readFile(themeFile, "utf8");
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
