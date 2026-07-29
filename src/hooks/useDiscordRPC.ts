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
          title: "Discord RPC disabled",
        });
      }

      return;
    }

    async function connect() {
      try {
        const result = await window.discord?.start();

        if (!result?.success) {
          connected.current = false;

          notify({
            type: "error",
            title: "Discord RPC unavailable",
            message: "Discord is not running or Rich Presence is unavailable.",
          });

          return;
        }

        connected.current = true;

        notify({
          type: "success",
          title: "Discord Connected",
          message: "Rich Presence is now active.",
        });
      } catch (error) {
        console.error("Discord RPC failed:", error);

        connected.current = false;

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
