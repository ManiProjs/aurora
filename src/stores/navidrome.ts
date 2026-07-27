import { create } from "zustand";

interface NavidromeState {
  server: string;
  username: string;
  password: string;

  setConnection(server: string, username: string, password: string): void;
}

export const useNavidromeStore = create<NavidromeState>((set) => ({
  server: "",
  username: "",
  password: "",

  setConnection(server, username, password) {
    set({
      server,
      username,
      password,
    });
  },
}));
