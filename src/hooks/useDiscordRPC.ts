import { useEffect } from "react";

import { usePlayerStore } from "../stores/player";
import { useSettingsStore } from "../stores/settings";

export function useDiscordRPC() {
  const song = usePlayerStore((s) => s.current);
  const duration = usePlayerStore((s) => s.duration);

  const enabled = useSettingsStore((s) => s.discordRPC);

  useEffect(() => {
    if (!enabled) {
      window.discord?.stop();
      return;
    }

    window.discord?.start();
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !song) {
      return;
    }

    window.discord?.update({
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration,
    });
  }, [enabled, song, duration]);
}
