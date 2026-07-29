import { useEffect, useState } from "react";
import { ArrowLeft, Play, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { Song } from "../api/types";

import { NavidromeClient } from "../api/navidrome";
import { getCoverArtUrl } from "../api/utils";

import { useAuthStore } from "../stores/auth";
import { useNavigationStore } from "../stores/navigation";
import { usePlayerStore } from "../stores/player";
import { useSettingsStore } from "../stores/settings";

import { useAlbumColors } from "../hooks/useAlbumColors";

export default function AlbumPage() {
  const album = useNavigationStore((s) => s.selectedAlbum);

  const goBack = useNavigationStore((s) => s.goBack);

  const { server, username, password } = useAuthStore();

  const playQueue = usePlayerStore((s) => s.playQueue);

  const animations = useSettingsStore((s) => s.animations);

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

    async function load() {
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

    load();

    return () => {
      controller.abort();
    };
  }, [album?.id, server, username, password]);

  if (!album) {
    return null;
  }

  const playerAlbum = {
    ...album,
    coverArt: artwork ?? undefined,
  };

  function playAlbum() {
    if (!songs.length) {
      return;
    }

    playQueue(songs, playerAlbum);
  }

  function playSong(index: number) {
    const queue = [...songs.slice(index), ...songs.slice(0, index)];

    playQueue(queue, playerAlbum);
  }

  const motionProps = animations
    ? {
        initial: {
          opacity: 0,
          y: 20,
        },

        animate: {
          opacity: 1,
          y: 0,
        },
      }
    : {};

  return (
    <motion.main
      {...motionProps}

      transition={{
        duration: 0.35,
      }}

      className="
        relative
        min-h-screen
        overflow-hidden
        p-10
        pb-32
        aurora-text
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
          animate={
            animations
              ? {
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
                    )
                    `,
                  ],
                }
              : undefined
          }

          transition={{
            duration: 12,
            repeat: Infinity,
          }}

          className="
            absolute
            -inset-40
            blur-3xl
            opacity-70
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-black/30
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

          whileHover={
            animations
              ? {
                  x: -5,
                }
              : undefined
          }

          className="
            aurora-button
            mb-8
            flex
            items-center
            gap-2
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
          {artwork ? (
            <motion.img
              src={artwork}
              alt={album.name}

              {...(animations
                ? {
                    initial: {
                      opacity: 0,
                      scale: 0.8,
                    },

                    animate: {
                      opacity: 1,
                      scale: 1,
                    },
                  }
                : {})}

              className="
                h-64
                w-64
                rounded-3xl
                object-cover
                shadow-2xl
              "
            />
          ) : (
            <div
              className="
                flex
                h-64
                w-64
                items-center
                justify-center
                rounded-3xl
                aurora-surface-muted
              "
            >
              <Music2 size={70} />
            </div>
          )}

          <div>
            <p className="aurora-text-muted">Album</p>

            <h1
              className="
                mt-2
                text-5xl
                font-black
              "
            >
              {album.name}
            </h1>

            <p className="mt-3 text-xl">{album.artist}</p>

            <p
              className="
                mt-2
                text-sm
                aurora-text-muted
              "
            >
              {songs.length} songs
              {" • "}
              {album.year ?? "Unknown"}
            </p>

            <button
              onClick={playAlbum}

              disabled={!songs.length}

              className="
                aurora-button-primary
                mt-6
                flex
                items-center
                gap-3
                disabled:opacity-50
              "
            >
              <Play size={20} fill="currentColor" />
              Play album
            </button>
          </div>
        </section>

        <section
          className="
            mt-14
            space-y-2
          "
        >
          {loading ? (
            <p className="aurora-text-muted">Loading tracks...</p>
          ) : (
            <AnimatePresence>
              {songs.map((song, index) => (
                <motion.button
                  key={song.id}

                  onClick={() => playSong(index)}

                  {...motionProps}

                  transition={{
                    delay: index * 0.03,
                  }}

                  className="
                      aurora-row
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
                        aurora-text-muted
                      "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <p className="font-semibold">{song.title}</p>

                    <p
                      className="
                          text-sm
                          aurora-text-muted
                        "
                    >
                      {song.artist}
                    </p>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </section>
      </div>
    </motion.main>
  );
}
