import { useEffect, useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { motion } from "framer-motion";

import type { Song } from "../api/types";

import { NavidromeClient } from "../api/navidrome";
import { getCoverArtUrl } from "../api/utils";

import { useAuthStore } from "../stores/auth";
import { useNavigationStore } from "../stores/navigation";
import { usePlayerStore } from "../stores/player";

import { useAlbumColor } from "../hooks/useAlbumColor";

export default function AlbumPage() {
  const album = useNavigationStore((s) => s.selectedAlbum);

  const goBack = useNavigationStore((s) => s.goBack);

  const { server, username, password } = useAuthStore();

  const playQueue = usePlayerStore((s) => s.playQueue);

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!album) return;

    async function loadAlbum() {
      try {
        const client = new NavidromeClient(server, username, password);

        const result = await client.getAlbum(album.id);

        setSongs(result);
      } catch (error) {
        console.error("Failed loading album:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAlbum();
  }, [album, server, username, password]);

  if (!album) {
    return null;
  }

  const artwork = album.coverArt
    ? getCoverArtUrl(server, username, password, album.coverArt)
    : null;

  const albumColor = useAlbumColor(artwork);

  function playAlbum() {
    playQueue(songs, {
      ...album,
      coverArt: artwork ?? undefined,
    });
  }

  function playSong(index: number) {
    const queue = [...songs.slice(index), ...songs.slice(0, index)];

    playQueue(queue, {
      ...album,
      coverArt: artwork ?? undefined,
    });
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        p-10
        text-white
      "
    >
      {/* Dynamic background */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        <motion.div
          animate={{
            background: `
              radial-gradient(
                circle at top,
                ${albumColor},
                transparent 65%
              )
            `,
          }}
          transition={{
            duration: 1,
          }}
          className="
            absolute
            inset-0
            opacity-70
            blur-3xl
            scale-125
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-zinc-950/80
          "
        />
      </div>

      <div className="relative z-10">
        <motion.button
          onClick={goBack}
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="
            mb-8
            flex
            items-center
            gap-2
            rounded-xl
            px-4
            py-2
            text-zinc-400
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>

        <motion.section
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            flex
            items-end
            gap-8
          "
        >
          {artwork && (
            <motion.img
              src={artwork}
              alt={album.name}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.5,
              }}
              className="
                h-64
                w-64
                rounded-3xl
                object-cover
                shadow-2xl
              "
            />
          )}

          <div>
            <p className="text-zinc-400">Album</p>

            <h1
              className="
                text-5xl
                font-bold
              "
            >
              {album.name}
            </h1>

            <p
              className="
                mt-3
                text-xl
                text-zinc-400
              "
            >
              {album.artist}
            </p>

            <motion.button
              onClick={playAlbum}
              whileHover={{
                scale: 1.08,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="
                mt-6
                flex
                items-center
                gap-2
                rounded-full
                bg-white
                px-7
                py-3
                font-semibold
                text-black
              "
            >
              <Play size={20} fill="currentColor" />
              Play
            </motion.button>
          </div>
        </motion.section>

        <section
          className="
            mt-12
            space-y-2
          "
        >
          {loading ? (
            <p className="text-zinc-400">Loading tracks...</p>
          ) : (
            songs.map((song, index) => (
              <motion.button
                key={song.id}
                onClick={() => playSong(index)}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.04,
                }}
                whileHover={{
                  x: 8,
                }}
                className="
                    flex
                    w-full
                    items-center
                    gap-5
                    rounded-xl
                    p-4
                    text-left
                    hover:bg-white/10
                  "
              >
                <span
                  className="
                      w-8
                      text-zinc-500
                    "
                >
                  {index + 1}
                </span>

                <div>
                  <p className="font-semibold">{song.title}</p>

                  <p
                    className="
                        text-sm
                        text-zinc-400
                      "
                  >
                    {song.artist}
                  </p>
                </div>
              </motion.button>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
