import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "aurora" | "light-aurora" | "dark" | "amoled";

interface SettingsState {
  discordRPC: boolean;

  animations: boolean;

  resumePlayback: boolean;

  autoplay: boolean;

  autoScrollLyrics: boolean;

  theme: Theme;

  customCSS: string;

  setDiscordRPC(value: boolean): void;

  setAnimations(value: boolean): void;

  setResumePlayback(value: boolean): void;

  setAutoplay(value: boolean): void;

  setAutoScrollLyrics(value: boolean): void;

  setTheme(value: Theme): void;

  setCustomCSS(value: string): void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      discordRPC: true,

      animations: true,

      resumePlayback: true,

      autoplay: true,

      autoScrollLyrics: true,

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

      setAutoScrollLyrics(value) {
        set({
          autoScrollLyrics: value,
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
