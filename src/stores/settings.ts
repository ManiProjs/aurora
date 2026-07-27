import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  animations: boolean;
  autoScrollLyrics: boolean;
  autoplay: boolean;
  discordRPC: boolean;

  setAnimations(value: boolean): void;
  setAutoScrollLyrics(value: boolean): void;
  setAutoplay(value: boolean): void;
  setDiscordRPC(value: boolean): void;

  rememberVolume: boolean;
  setRememberVolume(value: boolean): void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      animations: true,
      autoScrollLyrics: true,
      autoplay: false,
      discordRPC: false,
      rememberVolume: true,

      setAnimations(value) {
        set({
          animations: value,
        });
      },

      setAutoScrollLyrics(value) {
        set({
          autoScrollLyrics: value,
        });
      },

      setAutoplay(value) {
        set({
          autoplay: value,
        });
      },

      setDiscordRPC(value) {
        set({
          discordRPC: value,
        });
      },

      setRememberVolume(value) {
        set({
          rememberVolume: value,
        });
      },
    }),

    {
      name: "aurora-settings",
    },
  ),
);
