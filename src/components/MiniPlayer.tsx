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

  function stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  return (
    <motion.div
      initial={{
        y: 120,
        opacity: 0,
        scale: 0.96,
      }}

      animate={{
        y: 0,
        opacity: 1,
        scale: 1,
      }}

      exit={{
        y: 120,
        opacity: 0,
        scale: 0.96,
      }}

      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
      }}

      onClick={openFullPlayer}

      className="
        fixed
        bottom-4
        left-4
        right-4
        z-40

        flex
        min-h-24
        items-center
        gap-5

        rounded-3xl
        aurora-glass

        p-4

        shadow-2xl
      "
    >
      {/* Artwork */}

      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-4
        "
      >
        <motion.div
          animate={{
            scale: playing ? [1, 1.03, 1] : 1,
          }}

          transition={{
            repeat: playing ? Infinity : 0,

            duration: 2,
          }}
        >
          {album?.coverArt ? (
            <img
              src={album.coverArt}
              alt={album.name}

              className="
                h-16
                w-16
                rounded-2xl
                object-cover
                shadow-xl
              "
            />
          ) : (
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center

                rounded-2xl
                aurora-surface-muted
              "
            >
              <Music2 size={24} />
            </div>
          )}
        </motion.div>

        <div className="min-w-0">
          <p
            className="
              truncate
              font-semibold
              aurora-text
            "
          >
            {song.title}
          </p>

          <p
            className="
              truncate
              text-sm
              aurora-text-muted
            "
          >
            {song.artist}

            {song.album && ` • ${song.album}`}
          </p>

          {playing && (
            <div
              className="
                mt-1
                flex
                gap-1
              "
            >
              {[1, 2, 3].map((i) => (
                <motion.span
                  key={i}

                  animate={{
                    height: [4, 12, 4],
                  }}

                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.15,
                  }}

                  className="
                    w-1
                    rounded-full
                    bg-[var(--aurora-text)]
                  "
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Controls */}

      <div
        onClick={stopPropagation}

        className="
          flex
          items-center
          gap-2
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

            bg-[var(--aurora-text)]
            text-[var(--aurora-bg)]

            shadow-lg
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
        >
          <Square size={18} fill="currentColor" />
        </button>
      </div>

      {/* Progress */}

      <div
        onClick={stopPropagation}

        className="
          flex
          flex-[2]
          items-center
          gap-3
        "
      >
        <span className="w-10 text-xs aurora-text-muted">
          {formatTime(progress)}
        </span>

        <Slider value={progress} min={0} max={duration || 1} onChange={seek} />

        <span className="w-10 text-xs aurora-text-muted">
          {formatTime(duration)}
        </span>
      </div>

      {/* Volume */}

      <div
        onClick={stopPropagation}

        className="
          flex
          w-40
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
