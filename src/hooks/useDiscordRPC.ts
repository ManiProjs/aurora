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
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopped = useRef(false);
  const notifiedConnected = useRef(false);

  useEffect(() => {
    stopped.current = false;

    async function connect() {
      if (stopped.current || connected.current || !enabled) {
        return;
      }

      try {
        const success = await window.discord?.start();

        if (!success) {
          throw new Error("Discord RPC unavailable");
        }

        if (stopped.current) {
          window.discord?.stop();
          return;
        }

        connected.current = true;

        if (!notifiedConnected.current) {
          notifiedConnected.current = true;

          notify({
            type: "success",
            title: "Discord Connected",
            message: "Rich Presence is now active.",
          });
        }
      } catch (error) {
        console.error("Discord RPC connection failed:", error);

        connected.current = false;
        notifiedConnected.current = false;

        retryTimer.current = setTimeout(connect, 10000);
      }
    }

    if (!enabled) {
      if (connected.current) {
        window.discord?.stop();

        connected.current = false;
        notifiedConnected.current = false;

        notify({
          type: "info",
          title: "Discord Rich Presence disabled",
        });
      }

      return;
    }

    connect();

    return () => {
      stopped.current = true;

      if (retryTimer.current) {
        clearTimeout(retryTimer.current);

        retryTimer.current = null;
      }
    };
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
