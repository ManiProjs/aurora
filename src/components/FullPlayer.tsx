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

import { getArtworkColor } from "../utils/colors";

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

  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);

  const [lyrics, setLyrics] = useState<LyricLine[]>([]);

  const [artworkColor, setArtworkColor] = useState("#09090b");

  /*
    Dynamic artwork colors
  */

  useEffect(() => {
    if (!album?.coverArt) {
      setArtworkColor("#09090b");
      return;
    }

    getArtworkColor(album.coverArt)
      .then((result) => {
        setArtworkColor(result.hex);
      })
      .catch(() => {
        setArtworkColor("#09090b");
      });
  }, [album?.coverArt]);

  /*
    Lyrics loading
  */

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
      } catch {
        setLyrics([]);
      }
    }

    loadLyrics();
  }, [song]);

  /*
    Keyboard shortcuts
  */

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
        {/* Dynamic background */}

        <motion.div
          animate={{
            backgroundPosition: [
              "0% 0%",
              "100% 100%",
              "0% 100%",
              "100% 0%",
              "0% 0%",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background: `
      radial-gradient(
        circle at 20% 20%,
        ${artworkColor},
        transparent 40%
      ),
      radial-gradient(
        circle at 80% 80%,
        ${artworkColor},
        #09090b 70%
      )
    `,
            backgroundSize: "200% 200%",
          }}
          className="
    absolute
    inset-0
    opacity-80
  "
        />

        {/* Artwork blur */}

        {album?.coverArt && (
          <motion.img
            src={album.coverArt}
            alt=""
            animate={{
              scale: [1, 1.15, 1],
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
              opacity-40
            "
          />
        )}

        <div
          className="
            absolute
            inset-0
            bg-black/60
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
            {album?.coverArt ? (
              <img
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

            <h1
              className="
                mt-8
                text-5xl
                font-bold
              "
            >
              {song.title}
            </h1>

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
                className="
                  aurora-button
                  rounded-full
                  p-3
                "
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
                  aurora-button
                  rounded-full
                  p-3
                "
              >
                <SkipForward size={32} />
              </button>

              <button
                onClick={toggleRepeat}
                className="
                  aurora-button
                  rounded-full
                  p-3
                "
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
