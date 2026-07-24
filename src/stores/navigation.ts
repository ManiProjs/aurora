import { create } from "zustand";
import type { Album } from "../api/types";

export type Page =
  "home" | "albums" | "artists" | "songs" | "search" | "settings" | "album";

interface NavigationState {
  page: Page;
  selectedAlbum: Album | null;
  history: Page[];

  setPage(page: Page): void;
  openAlbum(album: Album): void;
  goBack(): void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  page: "home",
  selectedAlbum: null,
  history: [],

  setPage(page) {
    const current = get().page;

    set({
      page,
      history: [...get().history, current],
    });
  },

  openAlbum(album) {
    set({
      page: "album",
      selectedAlbum: album,
      history: [...get().history, get().page],
    });
  },

  goBack() {
    const history = [...get().history];

    const previous = history.pop();

    if (!previous) {
      return;
    }

    set({
      page: previous,
      history,
      selectedAlbum: previous === "album" ? get().selectedAlbum : null,
    });
  },
}));
