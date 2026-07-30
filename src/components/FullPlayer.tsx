import { useEffect, useState } from "react";
import {
  X,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Music2,
  Shuffle,
  Repeat,
} from "lucide-react";

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

  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);

  const shuffle = usePlayerStore((s) => s.shuffle);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);

  const repeat = usePlayerStore((s) => s.repeat);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);

  const [lyrics, setLyrics] = useState<LyricLine[]>([]);

  useEffect(() => {
    if (!song) {
      return;
    }

    const currentSong = song;

    async function loadLyrics() {
      try {
        const result = await getLyrics(
          currentSong.artist ?? "",
          currentSong.title,
          currentSong.album,
        );

        setLyrics(result);
      } catch (error) {
        console.error("Failed loading lyrics:", error);
        setLyrics([]);
      }
    }

    loadLyrics();
  }, [song]);

  useEffect(() => {
    function handleKeyboard(event: KeyboardEvent) {
      if (!fullPlayer) {
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();

        playing ? pause() : resume();
      }

      if (event.key === "Escape") {
        closeFullPlayer();
      }

      if (event.key === "ArrowRight") {
        seek(Math.min(progress + 10, duration));
      }

      if (event.key === "ArrowLeft") {
        seek(Math.max(progress - 10, 0));
      }
    }

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [
    fullPlayer,
    playing,
    progress,
    duration,
    pause,
    resume,
    closeFullPlayer,
    seek,
  ]);

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
        {/* Background artwork */}

        {album?.coverArt && (
          <motion.img
            key={album.coverArt}
            src={album.coverArt}
            alt=""

            animate={
              playing
                ? {
                    scale: [1, 1.05, 1],
                  }
                : {
                    scale: 1,
                  }
            }

            transition={{
              duration: 12,
              repeat: playing ? Infinity : 0,
              ease: "easeInOut",
            }}

            className="
      absolute
      inset-[-15%]

      h-[130%]
      w-[130%]

      object-cover

      blur-3xl
      saturate-150

      opacity-50
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
          <div
            className="
              flex
              flex-1
              flex-col
              items-center
            "
          >
            <div className="relative">
              <motion.div
                animate={
                  playing
                    ? {
                        scale: [1, 1.08, 1],
                        opacity: [0.35, 0.7, 0.35],
                      }
                    : {
                        scale: 1,
                        opacity: 0.35,
                      }
                }

                transition={{
                  duration: 6,
                  repeat: playing ? Infinity : 0,
                }}
                className="
                  absolute
                  inset-0
                  rounded-3xl
                  bg-white/20
                  blur-3xl
                "
              />

              {album?.coverArt ? (
                <motion.img
                  layoutId="player-artwork"
                  src={album.coverArt}
                  alt={album.name}
                  className="
  relative

  h-80
  w-80

  rounded-[2rem]

  object-cover

  shadow-2xl

  transition-transform

  hover:scale-[1.02]
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
            </div>

            <motion.h1
              key={song.title}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                mt-8
                text-5xl
                font-bold
              "
            >
              {song.title}
            </motion.h1>

            <p
              className="
                mt-3
                text-xl
                aurora-text-muted
              "
            >
              {song.artist}

              {song.album && ` • ${song.album}`}
            </p>

            <div
              className="
                mt-10
                flex
                w-full
                max-w-3xl
                items-center
                gap-3
              "
            >
              <span>{formatTime(progress)}</span>

              <Slider
                value={progress}
                min={0}
                max={duration || 1}
                onChange={seek}
              />

              <span>{formatTime(duration)}</span>
            </div>

            <div
              className="
                mt-8
                flex
                items-center
                gap-6
              "
            >
              <button
                onClick={toggleShuffle}
                className={`
                  aurora-button
                  rounded-full
                  p-3
                  ${shuffle ? "bg-white/20 text-white" : "text-zinc-400"}
                `}
              >
                <Shuffle />
              </button>

              <button
                onClick={previous}
                className="
                  aurora-button
                  rounded-full
                  p-3
                "
              >
                <SkipBack size={32} />
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
                <SkipForward size={32} />
              </button>

              <button
                onClick={toggleRepeat}
                className={`
    aurora-button
    rounded-full
    p-3

    ${repeat ? "bg-white/20 text-white" : "text-zinc-400"}
  `}
              >
                <Repeat />
              </button>
            </div>

            <div className="mt-8 w-64">
              <Slider
                value={volume}
                min={0}
                max={1}
                step={0.01}
                onChange={setVolume}
              />
            </div>
          </div>

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
