import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  discordRPC: boolean;

  animations: boolean;

  resumePlayback: boolean;

  autoplay: boolean;

  theme: "dark" | "amoled" | "aurora";

  setDiscordRPC(value: boolean): void;

  setAnimations(value: boolean): void;

  setResumePlayback(value: boolean): void;

  setAutoplay(value: boolean): void;

  setTheme(value: "dark" | "amoled" | "aurora"): void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      discordRPC: true,

      animations: true,

      resumePlayback: true,

      autoplay: true,

      theme: "aurora",

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

      setTheme(value) {
        set({
          theme: value,
        });
      },
    }),

    {
      name: "aurora-settings",
    },
  ),
);
