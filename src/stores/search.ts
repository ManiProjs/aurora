import { create } from "zustand";

interface SearchResult {
  songs: any[];
  albums: any[];
  artists: any[];
}

interface SearchState {
  open: boolean;
  query: string;
  results: SearchResult | null;

  setOpen(open: boolean): void;
  setQuery(query: string): void;
  setResults(results: SearchResult | null): void;
}

export const useSearchStore = create<SearchState>((set) => ({
  open: false,
  query: "",
  results: null,

  setOpen(open) {
    set({ open });
  },

  setQuery(query) {
    set({ query });
  },

  setResults(results) {
    set({ results });
  },
}));
