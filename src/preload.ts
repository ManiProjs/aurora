// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

interface AuthData {
  [key: string]: unknown;
}

interface AuroraBridge {
  saveAuth: (auth: AuthData) => Promise<void>;
  loadAuth: () => Promise<AuthData | null>;
}

const authApi: AuroraBridge = {
  saveAuth: (auth: AuthData) => ipcRenderer.invoke("auth:save", auth),
  loadAuth: () => ipcRenderer.invoke("auth:load"),
};

contextBridge.exposeInMainWorld("auth", authApi);

const auroraApi = {
  getArtistImage: (name: string) => ipcRenderer.invoke("artist:image", name),
};

contextBridge.exposeInMainWorld("aurora", auroraApi);

contextBridge.exposeInMainWorld("discord", {
  start: () => ipcRenderer.invoke("discord:start"),

  stop: () => ipcRenderer.invoke("discord:stop"),

  update: (data: unknown) => ipcRenderer.invoke("discord:update", data),
});
