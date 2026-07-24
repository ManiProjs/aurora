import { X, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Slider from "./Slider";
import Queue from "./Queue";
import { usePlayerStore } from "../stores/player";

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

  if (!fullPlayer) return null;

  return (
    <AnimatePresence>
      {fullPlayer && (
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
            text-white
          "
        >
          {/* Background */}
          {album?.coverArt && (
            <motion.img
              key={album.coverArt}
              src={album.coverArt}
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
              }}
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                blur-3xl
                saturate-150
              "
            />
          )}

          <div
            className="
              absolute
              inset-0
              bg-zinc-950/80
              backdrop-blur-3xl
            "
          />

          <button
            onClick={closeFullPlayer}
            className="
              absolute
              right-8
              top-8
              z-20
              rounded-full
              bg-white/10
              p-3
              transition
              hover:bg-white/20
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
            exit={{
              opacity: 0,
              y: 30,
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
            {/* Main player */}
            <div
              className="
                flex
                flex-1
                flex-col
                items-center
              "
            >
              {/* Artwork + Info */}
              <div
                className="
                  flex
                  items-center
                  gap-8
                "
              >
                {album?.coverArt && (
                  <motion.img
                    layoutId="player-artwork"
                    src={album.coverArt}
                    alt={album.name}
                    className="
                      h-64
                      w-64
                      rounded-3xl
                      object-cover
                      shadow-2xl
                    "
                  />
                )}

                <div className="max-w-md">
                  <motion.h1
                    key={song?.title}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    className="
                      text-4xl
                      font-bold
                    "
                  >
                    {song.title}
                  </motion.h1>

                  <motion.p
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.1,
                    }}
                    className="
                      mt-3
                      text-lg
                      text-zinc-300
                    "
                  >
                    {song?.artist}

                    {song?.album && (
                      <>
                        {" • "}
                        {song?.album}
                      </>
                    )}
                  </motion.p>
                </div>
              </div>

              {/* Progress */}
              <div
                className="
                  mt-12
                  flex
                  w-full
                  max-w-2xl
                  items-center
                  gap-3
                  text-xs
                  text-zinc-400
                "
              >
                <span>{formatTime(progress)}</span>

                <div className="flex-1">
                  <Slider
                    value={progress}
                    min={0}
                    max={duration || 0}
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
                    transition
                    hover:scale-110
                  "
                >
                  <SkipBack size={36} />
                </button>

                <button
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
                    transition
                    hover:scale-105
                  "
                >
                  {playing ? (
                    <Pause size={38} fill="currentColor" />
                  ) : (
                    <Play size={38} fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={next}
                  className="
                    transition
                    hover:scale-110
                  "
                >
                  <SkipForward size={36} />
                </button>
              </div>
            </div>

            {/* Queue */}
            <Queue />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
