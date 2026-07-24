import { useEffect, useRef } from "react";

import { usePlayerStore } from "../stores/player";
import { useAuthStore } from "../stores/auth";
import { getStreamUrl } from "../api/stream";

export default function AudioEngine(): null {
  const audio = useRef<HTMLAudioElement | null>(null);

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

  // Load and play new songs
  useEffect(() => {
    if (!song) {
      return;
    }

    const element = audio.current;

    element.src = getStreamUrl(server, username, password, song.id);

    element.load();

    element.play().catch((error) => {
      console.error("Failed to start playback:", error);
    });
  }, [song, server, username, password]);

  // Play / pause
  useEffect(() => {
    const element = audio.current;

    if (playing) {
      element.play().catch((error) => {
        console.error("Failed to resume playback:", error);
      });
    } else {
      element.pause();
    }
  }, [playing]);

  // Volume
  useEffect(() => {
    audio.current.volume = volume;
  }, [volume]);

  // Seeking
  useEffect(() => {
    if (seekPosition === null) {
      return;
    }

    audio.current.currentTime = seekPosition;

    clearSeek();
  }, [seekPosition, clearSeek]);

  useEffect(() => {
    const element = audio.current;

    return () => {
      if (element) {
        element.pause();
        element.src = "";
      }
    };
  }, []);

  // Audio events
  useEffect(() => {
    const element = audio.current;

    const updateTime = () => {
      setProgress(element.currentTime);
    };

    const updateDuration = () => {
      setDuration(element.duration);
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
