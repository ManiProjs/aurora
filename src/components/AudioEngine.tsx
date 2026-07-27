import { useEffect, useRef } from "react";

import { usePlayerStore } from "../stores/player";
import { useAuthStore } from "../stores/auth";

import { getStreamUrl } from "../api/stream";

import { useSettingsStore } from "../stores/settings";

export default function AudioEngine(): null {
  const audio = useRef<HTMLAudioElement | null>(null);
  const playRequest = useRef(0);

  if (!audio.current) {
    audio.current = new Audio();
  }

  const song = usePlayerStore((s) => s.current);
  const playing = usePlayerStore((s) => s.playing);

  const volume = usePlayerStore((s) => s.volume);

  const seekPosition = usePlayerStore((s) => s.seekPosition);

  const clearSeek = usePlayerStore((s) => s.clearSeek);

  const setProgress = usePlayerStore((s) => s.setProgress);
  const setDuration = usePlayerStore((s) => s.setDuration);

  const next = usePlayerStore((s) => s.next);

  const server = useAuthStore((s) => s.server);
  const username = useAuthStore((s) => s.username);
  const password = useAuthStore((s) => s.password);

  // Load song
  useEffect(() => {
    if (!song) return;

    const element = audio.current!;
    const request = ++playRequest.current;

    element.pause();

    element.src = getStreamUrl(server, username, password, song.id);

    element.load();

    const start = async () => {
      try {
        await element.play();

        if (request !== playRequest.current) {
          element.pause();
        }
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          console.error(error);
        }
      }
    };

    element.addEventListener("canplay", start, {
      once: true,
    });

    return () => {
      element.removeEventListener("canplay", start);
    };
  }, [song, server, username, password]);

  // Play / pause
  useEffect(() => {
    const element = audio.current!;

    async function toggle() {
      if (!playing) {
        element.pause();
        return;
      }

      if (element.readyState >= 3) {
        try {
          await element.play();
        } catch (error) {
          if ((error as DOMException).name !== "AbortError") {
            console.error(error);
          }
        }
      }
    }

    toggle();
  }, [playing]);

  // Volume
  useEffect(() => {
    audio.current!.volume = volume;
  }, [volume]);

  // Seek
  useEffect(() => {
    if (seekPosition === null) {
      return;
    }

    const element = audio.current!;

    if (!Number.isNaN(element.duration)) {
      element.currentTime = seekPosition;
    }

    clearSeek();
  }, [seekPosition, clearSeek]);

  // Events
  useEffect(() => {
    const element = audio.current!;

    const time = () => {
      setProgress(element.currentTime);
    };

    const duration = () => {
      setDuration(element.duration);
    };

    const ended = () => {
      const autoplay = useSettingsStore.getState().autoplay;

      if (autoplay) {
        next();
      } else {
        usePlayerStore.getState().pause();
      }
    };

    element.addEventListener("timeupdate", time);

    element.addEventListener("loadedmetadata", duration);

    element.addEventListener("ended", ended);

    return () => {
      element.removeEventListener("timeupdate", time);

      element.removeEventListener("loadedmetadata", duration);

      element.removeEventListener("ended", ended);
    };
  }, [setProgress, setDuration, next]);

  return null;
}
