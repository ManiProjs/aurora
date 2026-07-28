import { app, BrowserWindow, safeStorage, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { saveAuth, loadAuth, clearAuth } from "./services/authStorage";
import {
  startDiscordRPC,
  updateDiscordRPC,
  stopDiscordRPC,
} from "./main/discord";

import { autoUpdater } from "electron-updater";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
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

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  startDiscordRPC();

  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on("before-quit", () => {
  stopDiscordRPC();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

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

ipcMain.handle("discord:start", async () => {
  try {
    await startDiscordRPC();

    return {
      success: true,
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
    await stopDiscordRPC();

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
});

ipcMain.handle("discord:update", async (_, data) => {
  try {
    await updateDiscordRPC(data);

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
