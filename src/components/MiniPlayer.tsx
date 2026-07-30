import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Music2,
  Volume2,
  Square,
  Heart,
  ListMusic,
  Mic2,
  Shuffle,
  Repeat,
} from "lucide-react";

import { motion } from "framer-motion";
import type { MouseEvent, ReactElement } from "react";

import Slider from "./Slider";

import { usePlayerStore } from "../stores/player";
import { useSettingsStore } from "../stores/settings";

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

  const compactMode = useSettingsStore((s) => s.compactMode);

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
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: 120,
        opacity: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
      }}
      onClick={openFullPlayer}
      className={`
        fixed
        bottom-4
        left-4
        right-4
        z-40

        flex
        items-center

        rounded-3xl
        aurora-glass

        transition-all

        ${compactMode ? "h-16 gap-3 p-3" : "h-24 gap-5 p-4"}
      `}
    >
      {/* Artwork */}

      <div
        className={`
          flex
          shrink-0
          items-center
          gap-3

          ${compactMode ? "w-56" : "w-80"}
        `}
      >
        {album?.coverArt ? (
          <img
            src={album.coverArt}
            alt={album.name}
            className={`
              rounded-2xl
              object-cover
              shadow-xl

              ${compactMode ? "h-10 w-10" : "h-16 w-16"}
            `}
          />
        ) : (
          <div
            className={`
              flex
              items-center
              justify-center
              rounded-2xl
              aurora-surface-muted

              ${compactMode ? "h-10 w-10" : "h-16 w-16"}
            `}
          >
            <Music2 size={compactMode ? 18 : 24} />
          </div>
        )}

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
        {!compactMode && (
          <button
            className="
              aurora-button
              rounded-full
              p-2
            "
            title="Shuffle"
          >
            <Shuffle size={18} />
          </button>
        )}

        <button
          onClick={previous}
          className="
            aurora-button
            rounded-full
            p-2
          "
        >
          <SkipBack size={compactMode ? 18 : 20} />
        </button>

        <motion.button
          whileTap={{
            scale: 0.9,
          }}
          onClick={playing ? pause : resume}
          className={`
            flex
            items-center
            justify-center
            rounded-full
            bg-[var(--aurora-text)]
            text-[var(--aurora-bg)]
            shadow-lg

            ${compactMode ? "h-9 w-9" : "h-12 w-12"}
          `}
        >
          {playing ? (
            <Pause size={compactMode ? 16 : 22} fill="currentColor" />
          ) : (
            <Play size={compactMode ? 16 : 22} fill="currentColor" />
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
          <SkipForward size={compactMode ? 18 : 20} />
        </button>

        {!compactMode && (
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
        )}

        {!compactMode && (
          <button
            className="
              aurora-button
              rounded-full
              p-2
            "
            title="Repeat"
          >
            <Repeat size={18} />
          </button>
        )}
      </div>

      {/* Progress */}

      <div
        onClick={stopPropagation}
        className={`
    flex
    flex-1
    items-center
    gap-2

    ${compactMode ? "max-w-xs" : ""}
  `}
      >
        {!compactMode && (
          <span className="w-10 text-xs aurora-text-muted">
            {formatTime(progress)}
          </span>
        )}

        <Slider value={progress} min={0} max={duration || 1} onChange={seek} />

        {!compactMode && (
          <span className="w-10 text-xs aurora-text-muted">
            {formatTime(duration)}
          </span>
        )}
      </div>

      {/* Extra actions */}

      {!compactMode && (
        <div
          onClick={stopPropagation}
          className="
            flex
            items-center
            gap-2
          "
        >
          <button className="aurora-button rounded-full p-2">
            <Mic2 size={19} />
          </button>

          <button className="aurora-button rounded-full p-2">
            <ListMusic size={19} />
          </button>

          <button className="aurora-button rounded-full p-2">
            <Heart size={19} />
          </button>
        </div>
      )}

      {/* Volume */}

      <div
        onClick={stopPropagation}
        className={`
    flex
    items-center
    gap-2

    ${compactMode ? "w-24" : "w-40"}
  `}
      >
        <Volume2 size={compactMode ? 16 : 18} />

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
