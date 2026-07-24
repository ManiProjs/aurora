import { create } from "zustand";
import { Album } from "../api/types";
import type { Song } from "../api/types";

interface PlayerState {
  queue: Song[];
  current: Song | null;
  currentIndex: number;

  playing: boolean;

  progress: number;
  duration: number;
  volume: number;

  album: Album | null;
  seekPosition: number | null;

  fullPlayer: boolean;

  shuffle: boolean;

  repeat: "off" | "all" | "one";

  history: Song[];

  toggleShuffle(): void;
  toggleRepeat(): void;

  addToHistory(song: Song): void;

  playQueue(songs: Song[], album: Album | null): void;
  playSong(index: number): void;

  reorderQueue(queue: Song[]): void;

  pause(): void;
  resume(): void;

  next(): void;
  previous(): void;

  removeFromQueue(id: string): void;
  clearQueue(): void;

  seek(value: number): void;
  clearSeek(): void;

  openFullPlayer(): void;
  closeFullPlayer(): void;

  setProgress(value: number): void;
  setDuration(value: number): void;
  setVolume(value: number): void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  current: null,
  currentIndex: -1,

  playing: false,

  progress: 0,
  duration: 0,
  volume: 1,

  album: null,
  seekPosition: null,

  fullPlayer: false,

  shuffle: false,

  repeat: "off",

  history: [],

  toggleShuffle() {
    set((state) => ({
      shuffle: !state.shuffle,
    }));
  },

  toggleRepeat() {
    set((state) => {
      const modes = ["off", "all", "one"] as const;

      const index = modes.indexOf(state.repeat);

      return {
        repeat: modes[(index + 1) % modes.length],
      };
    });
  },

  addToHistory(song) {
    set((state) => ({
      history: [
        song,
        ...state.history.filter((item) => item.id !== song.id),
      ].slice(0, 50),
    }));
  },

  playQueue(songs, album) {
    const first = songs[0] ?? null;

    set({
      queue: songs,
      current: first,
      currentIndex: first ? 0 : -1,
      album,
      playing: Boolean(first),
      progress: 0,
      duration: first?.duration ?? 0,
    });
  },

  playSong(index) {
    const song = get().queue[index];

    if (!song) return;

    set({
      current: song,
      currentIndex: index,
      playing: true,
      progress: 0,
      duration: song.duration ?? 0,
    });
  },

  reorderQueue(queue) {
    const current = get().current;

    set({
      queue,
      currentIndex: current
        ? queue.findIndex((song) => song.id === current.id)
        : -1,
    });
  },

  next() {
    const { currentIndex, queue, shuffle, repeat, current } = get();

    if (repeat === "one" && current) {
      set({
        progress: 0,
        playing: true,
      });

      return;
    }

    let nextIndex;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= queue.length) {
      if (repeat === "all") {
        nextIndex = 0;
      } else {
        set({
          playing: false,
        });

        return;
      }
    }

    const song = queue[nextIndex];

    set({
      current: song,
      currentIndex: nextIndex,
      playing: true,
      progress: 0,
      duration: song.duration ?? 0,
      history: [
        song,
        ...get().history.filter((item) => item.id !== song.id),
      ].slice(0, 50),
    });
  },

  previous() {
    const { currentIndex, queue } = get();

    const previousIndex = currentIndex - 1;

    if (previousIndex < 0) {
      return;
    }

    const previousSong = queue[previousIndex];

    set({
      current: previousSong,
      currentIndex: previousIndex,
      playing: true,
      progress: 0,
      duration: previousSong.duration ?? 0,
    });
  },

  removeFromQueue(id) {
    const current = get().current;

    const queue = get().queue.filter((song) => song.id !== id);

    set({
      queue,
      currentIndex: current
        ? queue.findIndex((song) => song.id === current.id)
        : -1,
    });
  },

  clearQueue() {
    set({
      queue: [],
      current: null,
      currentIndex: -1,
      playing: false,
    });
  },

  pause() {
    set({
      playing: false,
    });
  },

  resume() {
    set({
      playing: true,
    });
  },

  seek(value) {
    set({
      seekPosition: value,
    });
  },

  clearSeek() {
    set({
      seekPosition: null,
    });
  },

  openFullPlayer() {
    set({
      fullPlayer: true,
    });
  },

  closeFullPlayer() {
    set({
      fullPlayer: false,
    });
  },

  setProgress(value) {
    set({
      progress: value,
    });
  },

  setDuration(value) {
    set({
      duration: value,
    });
  },

  setVolume(value) {
    set({
      volume: value,
    });
  },
}));
