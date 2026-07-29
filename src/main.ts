import { app, BrowserWindow, safeStorage, ipcMain } from "electron";

import path from "node:path";
import started from "electron-squirrel-startup";

import { saveAuth, loadAuth, clearAuth } from "./services/authStorage";

import {
  startDiscordRPC,
  updateDiscordRPC,
  stopDiscordRPC,
  startDiscordRPCRetry,
} from "./main/discord";

import { autoUpdater } from "electron-updater";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
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

// --------------------
// Authentication
// --------------------

ipcMain.handle("auth:save", async (_, auth) => {
  console.log("Encryption available:", safeStorage.isEncryptionAvailable());

  await saveAuth(auth);
});

ipcMain.handle("auth:load", async () => {
  return await loadAuth();
});

ipcMain.handle("auth:clear", async () => {
  await clearAuth();
});

// --------------------
// Discord RPC
// --------------------

ipcMain.handle("discord:start", async () => {
  try {
    const connected = await startDiscordRPC();

    return {
      success: connected,
    };
  } catch (error) {
    console.error("Discord RPC unavailable:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

ipcMain.handle("discord:stop", async () => {
  try {
    stopDiscordRPC();

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
    };
  }
});

ipcMain.handle("discord:update", async (_, data) => {
  try {
    updateDiscordRPC(data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Discord update failed:", error);

    return {
      success: false,
    };
  }
});
