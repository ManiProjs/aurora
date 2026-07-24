import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

import type { Song } from "../api/types";

import { NavidromeClient } from "../api/navidrome";

import { useAuthStore } from "../stores/auth";
import { usePlayerStore } from "../stores/player";
import { getCoverArtUrl } from "../api/utils";

export default function Songs() {
  const { server, username, password } = useAuthStore();

  const playQueue = usePlayerStore((s) => s.playQueue);

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
    playQueue(songs.slice(index), {
      id: songs[index].id,
      name: songs[index].album,
      artist: songs[index].artist,
      coverArt: songs[index].coverArt,
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
          rounded-2xl
          border
          border-white/10
        "
      >
        {songs.map((song, index) => (
          <motion.button
            key={song.id}
            onClick={() => playSong(index)}
            whileHover={{
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
            className="
                group
                flex
                w-full
                items-center
                gap-4
                border-b
                border-white/5
                px-5
                py-4
                text-left
              "
          >
            <div
              className="
    relative
    h-12
    w-12
    overflow-hidden
    rounded-xl
    shrink-0
  "
            >
              {song.coverArt ? (
                <>
                  <img
                    src={getCoverArtUrl(
                      server,
                      username,
                      password,
                      song.coverArt,
                    )}
                    alt={song.album}
                    loading="lazy"
                    className="
          h-full
          w-full
          object-cover
        "
                  />

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
                    <Play
                      size={18}
                      fill="currentColor"
                      className="text-white"
                    />
                  </div>
                </>
              ) : (
                <div
                  className="
        flex
        h-full
        w-full
        items-center
        justify-center
        bg-zinc-800
      "
                >
                  <Play size={18} className="text-zinc-500" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <p
                className="
                    font-medium
                  "
              >
                {song.title}
              </p>

              <p
                className="
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
                  text-sm
                  text-zinc-400
                  md:block
                "
            >
              {song.album}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
