import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Music2,
  Volume2,
} from "lucide-react";

import { motion } from "framer-motion";
import type { MouseEvent, ReactElement } from "react";

import Slider from "./Slider";

import { usePlayerStore } from "../stores/player";

import { useNavigationStore } from "../stores/navigation";

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

  const setPage = useNavigationStore((s) => s.setPage);

  if (!song) {
    return null;
  }

  function stopPropagation(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <motion.div
      initial={{
        y: 120,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      whileHover={{
        y: -4,
      }}
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 20,
      }}
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
          <div className="relative cursor-pointer" onClick={openFullPlayer}>
            <div
              className="
                h-14
                w-14
                overflow-hidden
                rounded-2xl
                shadow-lg
              "
            >
              <img
                src={album.coverArt}
                alt={album.name}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            </div>

            {playing && (
              <motion.div
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  rounded-2xl
                  ring-2
                  ring-white/40
                "
              />
            )}
          </div>
        ) : (
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-zinc-200
              shadow-lg
              dark:bg-zinc-800
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPage("artist");
              }}
              className="
      transition
      hover:text-white
    "
            >
              {song.artist}
            </button>

            {song.album && (
              <>
                {" • "}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage("album");
                  }}
                  className="
          transition
          hover:text-white
        "
                >
                  {song.album}
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Controls */}

      <div
        onClick={stopPropagation}
        className="
          flex
          items-center
          gap-4
        "
      >
        <button
          onClick={previous}
          className="
            aurora-button
            rounded-full
            p-2
            transition
            hover:scale-110
          "
        >
          <SkipBack size={20} />
        </button>

        <motion.button
          whileTap={{
            scale: 0.9,
          }}
          whileHover={{
            scale: 1.08,
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
            transition
            hover:scale-110
          "
        >
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
