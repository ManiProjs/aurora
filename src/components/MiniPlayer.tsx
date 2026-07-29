import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Music2,
  Volume2,
  Square,
} from "lucide-react";

import { motion } from "framer-motion";
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
  const stop = usePlayerStore((s) => s.stop);

  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);

  const progress = usePlayerStore((s) => s.progress);
  const duration = usePlayerStore((s) => s.duration);

  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);

  const seek = usePlayerStore((s) => s.seek);

  const openFullPlayer = usePlayerStore((s) => s.openFullPlayer);

  if (!song) {
    return null;
  }

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <motion.div
      initial={{
        y: 100,
        opacity: 0,
        scale: 0.96,
      }}
      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
      }}
      exit={{
        y: 100,
        opacity: 0,
        scale: 0.96,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      onClick={openFullPlayer}
      className="
        aurora-glass
        fixed
        bottom-4
        left-4
        right-4
        z-40
        flex
        h-24
        items-center
        gap-6
        rounded-3xl
        p-4
      "
    >
      {/* Artwork + info */}

      <div
        className="
          flex
          w-72
          shrink-0
          items-center
          gap-4
        "
      >
        {album?.coverArt ? (
          <img
            src={album.coverArt}
            alt={album.name}
            className="
              h-14
              w-14
              rounded-2xl
              object-cover
              shadow-lg
            "
          />
        ) : (
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-zinc-800
              text-zinc-400
            "
          >
            <Music2 size={24} />
          </div>
        )}

        <div className="min-w-0">
          <p
            className="
              aurora-text
              truncate
              font-semibold
            "
          >
            {song.title}
          </p>

          <p
            className="
              aurora-text-muted
              truncate
              text-sm
            "
          >
            {song.artist}
            {song.album && ` • ${song.album}`}
          </p>
        </div>
      </div>

      {/* Controls */}

      <div
        onClick={stopPropagation}
        className="
          flex
          items-center
          gap-3
        "
      >
        <button
          onClick={previous}
          className="
            aurora-button
            rounded-full
            p-2
          "
        >
          <SkipBack size={20} />
        </button>

        <motion.button
          whileTap={{
            scale: 0.9,
          }}
          onClick={playing ? pause : resume}
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-zinc-900
            text-white
            shadow-lg
            dark:bg-white
            dark:text-black
          "
        >
          {playing ? (
            <Pause size={22} fill="currentColor" />
          ) : (
            <Play size={22} fill="currentColor" />
          )}
        </motion.button>

        <button
          onClick={next}
          className="
            aurora-button
            rounded-full
            p-2
          "
        >
          <SkipForward size={20} />
        </button>

        <button
          onClick={stop}
          className="
            aurora-button
            rounded-full
            p-2
          "
          title="Stop playback"
        >
          <Square size={18} fill="currentColor" />
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
        "
      >
        <span
          className="
            aurora-text-muted
            w-10
            text-xs
          "
        >
          {formatTime(progress)}
        </span>

        <Slider value={progress} min={0} max={duration || 1} onChange={seek} />

        <span
          className="
            aurora-text-muted
            w-10
            text-xs
          "
        >
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume */}

      <div
        onClick={stopPropagation}
        className="
          flex
          w-36
          items-center
          gap-2
        "
      >
        <Volume2 size={18} />

        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={setVolume}
        />
      </div>
    </motion.div>
  );
}
