import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("auth", {
  saveAuth(auth: { server: string; username: string; password: string }) {
    return ipcRenderer.invoke("auth:save", auth);
  },

  loadAuth() {
    return ipcRenderer.invoke("auth:load");
  },

  clearAuth() {
    return ipcRenderer.invoke("auth:clear");
  },

  // aliases for newer code
  save(auth: { server: string; username: string; password: string }) {
    return ipcRenderer.invoke("auth:save", auth);
  },

  load() {
    return ipcRenderer.invoke("auth:load");
  },

  clear() {
    return ipcRenderer.invoke("auth:clear");
  },
});

contextBridge.exposeInMainWorld("discord", {
  start() {
    return ipcRenderer.invoke("discord:start");
  },

  stop() {
    return ipcRenderer.invoke("discord:stop");
  },

  update(data: {
    title: string;
    artist?: string;
    album?: string;
    duration?: number;
  }) {
    return ipcRenderer.invoke("discord:update", data);
  },
});

contextBridge.exposeInMainWorld("themes", {
  list() {
    return ipcRenderer.invoke("themes:list");
  },

  load(name: string) {
    return ipcRenderer.invoke("themes:load", name);
  },
});
