import { create } from "zustand";

interface AuthState {
  server: string;
  username: string;
  password: string;
  authenticated: boolean;

  login(server: string, username: string, password: string): void;

  logout(): void;
}

export const useAuthStore = create<AuthState>((set) => ({
  server: "",
  username: "",
  password: "",
  authenticated: false,

  login(server, username, password) {
    set({
      server,
      username,
      password,
      authenticated: true,
    });
  },

  logout() {
    set({
      server: "",
      username: "",
      password: "",
      authenticated: false,
    });
  },
}));
