import { create } from "zustand";

export type Page =
  "home" | "albums" | "artists" | "songs" | "search" | "settings";

interface NavigationState {
  page: Page;
  setPage(page: Page): void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  page: "home",

  setPage(page) {
    set({
      page,
    });
  },
}));
