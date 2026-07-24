import { useEffect, useState } from "react";
import { X, Pause, Play, SkipBack, SkipForward, Music2 } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import Slider from "./Slider";
import Queue from "./Queue";
import LyricsPanel from "./LyricsPanel";

import { usePlayerStore } from "../stores/player";

import { getLyrics } from "../api/lyrics";
import type { LyricLine } from "../api/lyrics";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function FullPlayer() {
  const song = usePlayerStore((s) => s.current);
  const album = usePlayerStore((s) => s.album);

  const fullPlayer = usePlayerStore((s) => s.fullPlayer);

  const closeFullPlayer = usePlayerStore((s) => s.closeFullPlayer);

  const playing = usePlayerStore((s) => s.playing);

  const pause = usePlayerStore((s) => s.pause);

  const resume = usePlayerStore((s) => s.resume);

  const next = usePlayerStore((s) => s.next);

  const previous = usePlayerStore((s) => s.previous);

  const progress = usePlayerStore((s) => s.progress);

  const duration = usePlayerStore((s) => s.duration);

  const seek = usePlayerStore((s) => s.seek);

  const [lyrics, setLyrics] = useState<LyricLine[]>([]);

  useEffect(() => {
    if (!song) {
      return;
    }

    async function loadLyrics() {
      const result = await getLyrics(song.artist ?? "", song.title, song.album);

      setLyrics(result);
    }

    loadLyrics();
  }, [song]);

  if (!fullPlayer || !song) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}

        animate={{
          opacity: 1,
        }}

        exit={{
          opacity: 0,
        }}

        className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          overflow-hidden
          aurora-text
        "
      >
        {/* Animated background */}

        {album?.coverArt && (
          <motion.img
            src={album.coverArt}
            alt=""

            animate={{
              scale: [1, 1.15, 1],

              rotate: [0, 2, -2, 0],

              x: [0, 20, -20, 0],

              y: [0, -20, 20, 0],
            }}

            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}

            className="
              absolute
              inset-[-10%]
              h-[120%]
              w-[120%]
              object-cover
              blur-3xl
              saturate-150
              opacity-60
            "
          />
        )}

        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}

          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}

          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,.12),transparent_45%)]
            bg-[length:200%_200%]
            backdrop-blur-3xl
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-zinc-950/75
          "
        />

        {/* Close */}

        <button
          onClick={closeFullPlayer}

          className="
            aurora-glass
            absolute
            right-8
            top-8
            z-20
            rounded-full
            p-3
            transition
            hover:scale-110
          "
        >
          <X size={22} />
        </button>

        <motion.div
          key={song.id}

          initial={{
            opacity: 0,
            y: 30,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            type: "spring",
            stiffness: 160,
            damping: 20,
          }}

          className="
            relative
            flex
            w-full
            max-w-7xl
            items-center
            gap-10
            px-8
          "
        >
          {/* Player */}

          <div
            className="
              flex-1
              flex
              flex-col
              items-center
            "
          >
            <div
              className="
                flex
                items-center
                gap-8
              "
            >
              {album?.coverArt ? (
                <motion.img
                  layoutId="player-artwork"

                  src={album.coverArt}

                  alt={album.name}

                  className="
                    h-72
                    w-72
                    rounded-3xl
                    object-cover
                    shadow-2xl
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-72
                    w-72
                    items-center
                    justify-center
                    rounded-3xl
                    bg-zinc-800
                  "
                >
                  <Music2 size={64} />
                </div>
              )}

              <div>
                <motion.h1
                  key={song.title}

                  initial={{
                    opacity: 0,
                    x: -20,
                  }}

                  animate={{
                    opacity: 1,
                    x: 0,
                  }}

                  className="
                    text-5xl
                    font-bold
                  "
                >
                  {song.title}
                </motion.h1>

                <p
                  className="
                    mt-4
                    text-xl
                    aurora-text-muted
                  "
                >
                  {song.artist}

                  {song.album && ` • ${song.album}`}
                </p>
              </div>
            </div>

            {/* Progress */}

            <div
              className="
                mt-12
                flex
                w-full
                max-w-3xl
                items-center
                gap-3
              "
            >
              <span>{formatTime(progress)}</span>

              <div className="flex-1">
                <Slider
                  value={progress}
                  min={0}
                  max={duration || 1}
                  onChange={seek}
                />
              </div>

              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}

            <div
              className="
                mt-10
                flex
                items-center
                gap-10
              "
            >
              <button
                onClick={previous}
                className="
                  aurora-button
                  rounded-full
                  p-3
                "
              >
                <SkipBack size={36} />
              </button>

              <motion.button
                whileTap={{
                  scale: 0.9,
                }}

                onClick={playing ? pause : resume}

                className="
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-black
                  shadow-xl
                "
              >
                {playing ? (
                  <Pause size={38} fill="currentColor" />
                ) : (
                  <Play size={38} fill="currentColor" />
                )}
              </motion.button>

              <button
                onClick={next}
                className="
                  aurora-button
                  rounded-full
                  p-3
                "
              >
                <SkipForward size={36} />
              </button>
            </div>
          </div>

          {/* Lyrics + Queue */}

          <div
            className="
              flex
              w-96
              flex-col
              gap-5
            "
          >
            <LyricsPanel lyrics={lyrics} progress={progress} />

            <Queue />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
