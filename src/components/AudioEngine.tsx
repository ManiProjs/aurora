import { useEffect, useRef } from "react";

import { usePlayerStore } from "../stores/player";
import { useAuthStore } from "../stores/auth";
import { getStreamUrl } from "../api/stream";

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
    if (!song) {
      return;
    }

    const element = audio.current;

    const request = ++playRequest.current;

    element.src = getStreamUrl(server, username, password, song.id);

    element.load();

    async function start() {
      try {
        await element.play();

        if (request !== playRequest.current) {
          element.pause();
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to start playback:", error);
      }
    }

    start();
  }, [song, server, username, password]);

  // Play / pause
  useEffect(() => {
    const element = audio.current;

    if (!element.src) {
      return;
    }

    async function toggle() {
      try {
        if (playing) {
          await element.play();
        } else {
          element.pause();
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Playback error:", error);
      }
    }

    toggle();
  }, [playing]);

  // Volume
  useEffect(() => {
    audio.current.volume = volume;
  }, [volume]);

  // Seek
  useEffect(() => {
    if (seekPosition === null) {
      return;
    }

    audio.current.currentTime = seekPosition;

    clearSeek();
  }, [seekPosition, clearSeek]);

  // Cleanup
  useEffect(() => {
    const element = audio.current;

    return () => {
      element.pause();
      element.src = "";
    };
  }, []);

  // Events
  useEffect(() => {
    const element = audio.current;

    const updateTime = () => {
      setProgress(element.currentTime);
    };

    const updateDuration = () => {
      setDuration(Number.isFinite(element.duration) ? element.duration : 0);
    };

    const handleEnded = () => {
      next();
    };

    element.addEventListener("timeupdate", updateTime);

    element.addEventListener("loadedmetadata", updateDuration);

    element.addEventListener("ended", handleEnded);

    return () => {
      element.removeEventListener("timeupdate", updateTime);

      element.removeEventListener("loadedmetadata", updateDuration);

      element.removeEventListener("ended", handleEnded);
    };
  }, [setProgress, setDuration, next]);

  return null;
}
