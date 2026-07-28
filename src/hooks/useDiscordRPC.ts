import { useEffect, useRef } from "react";

import { usePlayerStore } from "../stores/player";
import { useSettingsStore } from "../stores/settings";
import { useNotificationStore } from "../stores/notifications";

export function useDiscordRPC() {
  const song = usePlayerStore((s) => s.current);
  const duration = usePlayerStore((s) => s.duration);

  const enabled = useSettingsStore((s) => s.discordRPC);

  const notify = useNotificationStore((s) => s.addNotification);

  const connected = useRef(false);

  useEffect(() => {
    if (!enabled) {
      if (connected.current) {
        window.discord?.stop();

        connected.current = false;

        notify({
          type: "info",
          title: "Discord Rich Presence disabled",
        });
      }

      return;
    }

    async function connect() {
      try {
        await window.discord?.start();

        connected.current = true;

        notify({
          type: "success",
          title: "Discord Connected",
          message:
            "Rich Presence is now active and your friends on Discord can see what music you're playing to.",
        });
      } catch (error) {
        console.error("Discord RPC failed:", error);

        notify({
          type: "error",
          title: "Discord Connection Failed",
          message: "Could not connect to Discord Rich Presence.",
        });
      }
    }

    connect();
  }, [enabled, notify]);

  useEffect(() => {
    if (!enabled || !song || !connected.current) {
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
