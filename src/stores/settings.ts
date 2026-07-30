import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "aurora" | "light-aurora" | "dark" | "amoled" | string;

interface SettingsState {
  discordRPC: boolean;

  animations: boolean;

  reduceAnimations: boolean;

  compactMode: boolean;

  resumePlayback: boolean;

  autoplay: boolean;

  defaultVolume: number;

  crossfade: boolean;

  autoScrollLyrics: boolean;

  lyricsFontSize: number;

  lyricsOffset: number;

  theme: Theme;

  customCSS: string;

  setDiscordRPC(value: boolean): void;

  setAnimations(value: boolean): void;

  setReduceAnimations(value: boolean): void;

  setCompactMode(value: boolean): void;

  setResumePlayback(value: boolean): void;

  setAutoplay(value: boolean): void;

  setDefaultVolume(value: number): void;

  setCrossfade(value: boolean): void;

  setAutoScrollLyrics(value: boolean): void;

  setLyricsFontSize(value: number): void;

  setLyricsOffset(value: number): void;

  setTheme(value: Theme): void;

  setCustomCSS(value: string): void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      discordRPC: true,

      animations: true,

      reduceAnimations: false,

      compactMode: false,

      resumePlayback: true,

      autoplay: true,

      defaultVolume: 0.8,

      crossfade: false,

      autoScrollLyrics: true,

      lyricsFontSize: 18,

      lyricsOffset: 0,

      theme: "aurora",

      customCSS: "",

      setDiscordRPC(value) {
        set({
          discordRPC: value,
        });
      },

      setAnimations(value) {
        set({
          animations: value,
        });
      },

      setReduceAnimations(value) {
        set({
          reduceAnimations: value,
        });
      },

      setCompactMode(value) {
        set({
          compactMode: value,
        });
      },

      setResumePlayback(value) {
        set({
          resumePlayback: value,
        });
      },

      setAutoplay(value) {
        set({
          autoplay: value,
        });
      },

      setDefaultVolume(value) {
        set({
          defaultVolume: value,
        });
      },

      setCrossfade(value) {
        set({
          crossfade: value,
        });
      },

      setAutoScrollLyrics(value) {
        set({
          autoScrollLyrics: value,
        });
      },

      setLyricsFontSize(value) {
        set({
          lyricsFontSize: value,
        });
      },

      setLyricsOffset(value) {
        set({
          lyricsOffset: value,
        });
      },

      setTheme(value) {
        set({
          theme: value,
        });
      },

      setCustomCSS(value) {
        set({
          customCSS: value,
        });
      },
    }),

    {
      name: "aurora-settings",
    },
  ),
);
