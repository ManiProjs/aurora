import { useEffect, useState } from "react";
import { ArrowLeft, Play } from "lucide-react";
import { motion } from "framer-motion";

import type { Song } from "../api/types";

import { NavidromeClient } from "../api/navidrome";
import { getCoverArtUrl } from "../api/utils";

import { useAuthStore } from "../stores/auth";
import { useNavigationStore } from "../stores/navigation";
import { usePlayerStore } from "../stores/player";

import { useAlbumColors } from "../hooks/useAlbumColors";

export default function AlbumPage() {
  const album = useNavigationStore((s) => s.selectedAlbum);
  const goBack = useNavigationStore((s) => s.goBack);

  const { server, username, password } = useAuthStore();

  const playQueue = usePlayerStore((s) => s.playQueue);

  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const artwork = album?.coverArt
    ? getCoverArtUrl(server, username, password, album.coverArt)
    : null;

  const colors = useAlbumColors(artwork);

  useEffect(() => {
    if (!album) {
      return;
    }

    const controller = new AbortController();

    const client = new NavidromeClient(server, username, password);

    client.setSignal(controller.signal);

    async function loadAlbum() {
      try {
        setLoading(true);

        const result = await client.getAlbum(album.id);

        if (controller.signal.aborted) {
          return;
        }

        setSongs(result);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed loading album:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAlbum();

    return () => {
      controller.abort();
    };
  }, [album?.id, server, username, password]);

  if (!album) {
    return null;
  }

  function getPlayerAlbum() {
    return {
      ...album,
      coverArt: artwork ?? undefined,
    };
  }

  function playAlbum() {
    if (songs.length === 0) {
      return;
    }

    playQueue(songs, getPlayerAlbum());
  }

  function playSong(index: number) {
    const queue = [...songs.slice(index), ...songs.slice(0, index)];

    playQueue(queue, getPlayerAlbum());
  }

  return (
    <motion.main
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      className="
        relative
        min-h-screen
        overflow-hidden
        p-10
        pb-32
        text-white
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <motion.div
          animate={{
            background: [
              `
              radial-gradient(
                circle at 20% 20%,
                ${colors[0]},
                transparent 55%
              ),
              radial-gradient(
                circle at 80% 30%,
                ${colors[1]},
                transparent 60%
              ),
              radial-gradient(
                circle at 50% 90%,
                ${colors[2]},
                transparent 55%
              )
              `,
              `
              radial-gradient(
                circle at 80% 20%,
                ${colors[1]},
                transparent 55%
              ),
              radial-gradient(
                circle at 20% 80%,
                ${colors[2]},
                transparent 60%
              ),
              radial-gradient(
                circle at 50% 30%,
                ${colors[0]},
                transparent 55%
              )
              `,
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            -inset-40
            blur-3xl
            opacity-80
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-black/20
            via-zinc-950/70
            to-zinc-950
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-6xl
        "
      >
        <motion.button
          onClick={goBack}
          whileHover={{
            x: -5,
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
            hover:bg-white/10
            hover:text-white
          "
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>

        <section
          className="
            flex
            flex-col
            gap-8
            md:flex-row
            md:items-end
          "
        >
          {artwork && (
            <motion.img
              src={artwork}
              alt={album.name}
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
              }}
              whileHover={{
                scale: 1.04,
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
                mt-2
                text-5xl
                font-black
              "
            >
              {album.name}
            </h1>

            <p
              className="
                mt-3
                text-xl
                text-zinc-300
              "
            >
              {album.artist}
            </p>

            <p
              className="
                mt-2
                text-sm
                text-zinc-500
              "
            >
              {songs.length} songs
              {" • "}
              {album.year ?? "Unknown"}
            </p>

            <motion.button
              onClick={playAlbum}
              disabled={songs.length === 0}
              whileHover={{
                scale: songs.length ? 1.08 : 1,
              }}
              whileTap={{
                scale: songs.length ? 0.95 : 1,
              }}
              className="
                mt-6
                flex
                items-center
                gap-3
                rounded-full
                bg-white
                px-8
                py-3
                font-bold
                text-black
                disabled:opacity-50
              "
            >
              <Play size={20} fill="currentColor" />
              Play album
            </motion.button>
          </div>
        </section>

        <section
          className="
            mt-14
            space-y-2
          "
        >
          {loading ? (
            <p className="text-zinc-400">Loading tracks...</p>
          ) : songs.length === 0 ? (
            <p className="text-zinc-400">No tracks found.</p>
          ) : (
            songs.map((song, index) => (
              <motion.button
                key={song.id}
                onClick={() => playSong(index)}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.03,
                }}
                whileHover={{
                  x: 10,
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-5
                  rounded-2xl
                  p-4
                  text-left
                "
              >
                <span
                  className="
                    w-8
                    text-zinc-500
                  "
                >
                  {String(index + 1).padStart(2, "0")}
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
    </motion.main>
  );
}
