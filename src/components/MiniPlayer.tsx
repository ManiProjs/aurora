import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import type { MouseEvent, ReactElement } from "react";

import Slider from "./Slider";
import { usePlayerStore } from "../stores/player";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function MiniPlayer(): ReactElement | null {
  const song = usePlayerStore((s) => s.current);
  const album = usePlayerStore((s) => s.album);

  const playing = usePlayerStore((s) => s.playing);

  const pause = usePlayerStore((s) => s.pause);
  const resume = usePlayerStore((s) => s.resume);

  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);

  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);

  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);

  const seek = usePlayerStore((s) => s.seek);

  const openFullPlayer = usePlayerStore((s) => s.openFullPlayer);

  if (!song) return null;

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <div
      onClick={openFullPlayer}
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-40
        flex
        cursor-pointer
        items-center
        gap-6
        border-t
        border-zinc-800
        bg-zinc-950/90
        p-4
        text-white
        backdrop-blur-xl
      "
    >
      {/* Song info */}
      <div className="flex w-64 shrink-0 items-center gap-3">
        {album?.coverArt && (
          <img
            src={album.coverArt}
            alt={album.name}
            className="
              h-14
              w-14
              rounded-lg
              object-cover
              shadow-lg
            "
          />
        )}

        <div className="min-w-0">
          <p className="truncate font-semibold">{song.title}</p>

          <p className="truncate text-sm text-zinc-500">
            {song.artist}
            {song.album && ` • ${song.album}`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div onClick={stopPropagation} className="flex items-center gap-3">
        <button onClick={previous} className="transition hover:scale-110">
          <SkipBack size={20} />
        </button>

        <button
          onClick={playing ? pause : resume}
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-white
            text-black
            transition
            hover:scale-105
          "
        >
          {playing ? (
            <Pause size={22} fill="currentColor" />
          ) : (
            <Play size={22} fill="currentColor" />
          )}
        </button>

        <button onClick={next} className="transition hover:scale-110">
          <SkipForward size={20} />
        </button>
      </div>

      {/* Progress */}
      <div
        onClick={stopPropagation}
        className="
          flex
          flex-1
          items-center
          gap-3
          text-xs
          text-zinc-500
        "
      >
        <span className="w-10 text-right">{formatTime(progress)}</span>

        <div className="flex-1">
          <Slider
            value={progress}
            min={0}
            max={duration || 0}
            onChange={seek}
          />
        </div>

        <span className="w-10">{formatTime(duration)}</span>
      </div>

      {/* Volume */}
      <div onClick={stopPropagation} className="w-32 shrink-0">
        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={setVolume}
        />
      </div>
    </div>
  );
}
