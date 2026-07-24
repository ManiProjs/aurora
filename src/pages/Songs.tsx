import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

import type { Song } from "../api/types";

import { NavidromeClient } from "../api/navidrome";

import { useAuthStore } from "../stores/auth";
import { usePlayerStore } from "../stores/player";

import { getCoverArtUrl } from "../api/utils";

function formatTime(seconds?: number) {
  if (!seconds) return "";

  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${min}:${sec}`;
}

export default function Songs() {
  const { server, username, password } = useAuthStore();

  const playQueue = usePlayerStore((s) => s.playQueue);

  const current = usePlayerStore((s) => s.current);

  const playing = usePlayerStore((s) => s.playing);

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const client = new NavidromeClient(server, username, password);

        const data = await client.getSongs();

        setSongs(data);
      } catch (error) {
        console.error("Failed loading songs:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [server, username, password]);

  function playSong(index: number) {
    const song = songs[index];

    playQueue(songs.slice(index), {
      id: song.album ?? song.id,
      name: song.album ?? "",
      artist: song.artist ?? "",
      coverArt: song.coverArt,
    });
  }

  if (loading) {
    return <div className="p-6 text-zinc-400">Loading songs...</div>;
  }

  return (
    <div
      className="
        p-6
        text-white
      "
    >
      <h1
        className="
          mb-6
          text-3xl
          font-bold
        "
      >
        Songs
      </h1>

      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-zinc-900/50
          backdrop-blur-xl
        "
      >
        {songs.map((song, index) => {
          const active = current?.id === song.id;

          return (
            <motion.button
              key={song.id}
              onClick={() => playSong(index)}
              whileHover={{
                x: 6,
              }}
              className={`
                group
                flex
                w-full
                items-center
                gap-4
                border-b
                border-white/5
                px-5
                py-3
                text-left
                transition

                ${active ? "bg-white/10" : "hover:bg-white/5"}
              `}
            >
              <div
                className="
                  relative
                  h-14
                  w-14
                  shrink-0
                  overflow-hidden
                  rounded-xl
                "
              >
                {song.coverArt ? (
                  <img
                    src={getCoverArtUrl(
                      server,
                      username,
                      password,
                      song.coverArt,
                    )}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      bg-zinc-800
                    "
                  >
                    <Play size={18} />
                  </div>
                )}

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-black/50
                    opacity-0
                    transition
                    group-hover:opacity-100
                  "
                >
                  {active && playing ? (
                    <Pause size={20} fill="white" />
                  ) : (
                    <Play size={20} fill="white" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="
                    truncate
                    font-medium
                  "
                >
                  {song.title}
                </p>

                <p
                  className="
                    truncate
                    text-sm
                    text-zinc-400
                  "
                >
                  {song.artist}
                </p>
              </div>

              <p
                className="
                  hidden
                  max-w-48
                  truncate
                  text-sm
                  text-zinc-500
                  md:block
                "
              >
                {song.album}
              </p>

              <p
                className="
                  w-12
                  text-right
                  text-sm
                  text-zinc-500
                "
              >
                {formatTime(song.duration)}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
