import { useEffect, useState } from "react";
import { Play, ChevronLeft, ChevronRight, Music2 } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { NavidromeClient } from "../api/navidrome";
import { getCoverArtUrl } from "../api/utils";

import { useAuthStore } from "../stores/auth";
import { usePlayerStore } from "../stores/player";

import type { Album, Song } from "../api/types";

import AlbumCard from "../components/AlbumCard";

export default function Home() {
  const { server, username, password } = useAuthStore();

  const playQueue = usePlayerStore((s) => s.playQueue);

  const history = usePlayerStore((s) => s.history);

  const [albums, setAlbums] = useState<Album[]>([]);

  const [featured, setFeatured] = useState<Album | null>(null);

  const [loading, setLoading] = useState(true);

  const [heroPaused, setHeroPaused] = useState(false);

  const [greeting, setGreeting] = useState("");

  /*
   * Greeting
   */

  useEffect(() => {
    function updateGreeting() {
      const hour = new Date().getHours();

      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    }

    updateGreeting();

    const timer = setInterval(updateGreeting, 60_000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /*
   * Load albums
   */

  useEffect(() => {
    const controller = new AbortController();

    const client = new NavidromeClient(server, username, password);

    client.setSignal(controller.signal);

    async function loadAlbums() {
      try {
        const data = await client.getAlbums();

        if (controller.signal.aborted) {
          return;
        }

        setAlbums(data);

        if (data.length > 0) {
          setFeatured(data[Math.floor(Math.random() * data.length)]);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed loading albums:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAlbums();

    return () => {
      controller.abort();
    };
  }, [server, username, password]);

  /*
   * Hero carousel
   */

  useEffect(() => {
    if (!albums.length || heroPaused) {
      return;
    }

    const timer = setInterval(() => {
      setFeatured((current) => {
        if (!current) {
          return albums[0];
        }

        const index = albums.findIndex((album) => album.id === current.id);

        return albums[(index + 1) % albums.length];
      });
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [albums, heroPaused]);

  /*
   * Playback helpers
   */

  async function playAlbum(album: Album) {
    try {
      const client = new NavidromeClient(server, username, password);

      const songs = await client.getAlbum(album.id);

      playQueue(songs, {
        ...album,
        coverArt: album.coverArt
          ? getCoverArtUrl(server, username, password, album.coverArt)
          : undefined,
      });
    } catch (error) {
      console.error("Failed playing album:", error);
    }
  }

  async function playHistorySong(song: Song) {
    try {
      const client = new NavidromeClient(server, username, password);

      const songs = await client.getAlbum(song.albumId);

      playQueue(songs, {
        id: song.albumId,
        name: song.album ?? "",
        artist: song.artist ?? "",
        coverArt: song.coverArt
          ? getCoverArtUrl(server, username, password, song.coverArt)
          : undefined,
      });

      const index = songs.findIndex((item) => item.id === song.id);

      if (index !== -1) {
        usePlayerStore.getState().playSong(index);
      }
    } catch (error) {
      console.error("Failed playing history song:", error);
    }
  }

  function changeFeatured(direction: "next" | "previous") {
    if (!featured || !albums.length) {
      return;
    }

    const index = albums.findIndex((album) => album.id === featured.id);

    const nextIndex =
      direction === "next"
        ? (index + 1) % albums.length
        : (index - 1 + albums.length) % albums.length;

    setFeatured(albums[nextIndex]);
  }

  const recent = albums.slice(0, 6);

  return (
    <main
      className="
        aurora-background
        min-h-full
        px-6
        py-8
        pb-40
        aurora-text
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        <header>
          <motion.h1
            initial={{
              opacity: 0,
              y: -15,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            className="
              text-5xl
              font-bold
            "
          >
            {greeting}
          </motion.h1>

          <p
            className="
              mt-2
              aurora-text-muted
            "
          >
            Your personal music space
          </p>
        </header>

        <AnimatePresence mode="wait">
          {featured && (
            <motion.section
              key={featured.id}

              onMouseEnter={() => setHeroPaused(true)}

              onMouseLeave={() => setHeroPaused(false)}

              initial={{
                opacity: 0,
                y: 25,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                y: -25,
              }}

              transition={{
                duration: 0.35,
              }}

              className="
                relative
                mt-10
                overflow-hidden
                rounded-3xl
                aurora-glass
                p-8
              "
            >
              {featured.coverArt && (
                <img
                  src={getCoverArtUrl(
                    server,
                    username,
                    password,
                    featured.coverArt,
                  )}

                  alt=""

                  loading="lazy"

                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
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
                  bg-black/40
                "
              />

              <div
                className="
                  relative
                  flex
                  flex-col
                  gap-6
                  md:flex-row
                  md:items-end
                "
              >
                {featured.coverArt && (
                  <motion.img
                    src={getCoverArtUrl(
                      server,
                      username,
                      password,
                      featured.coverArt,
                    )}

                    alt={featured.name}

                    whileHover={{
                      scale: 1.05,
                    }}

                    className="
                      h-56
                      w-56
                      rounded-3xl
                      object-cover
                      shadow-2xl
                    "
                  />
                )}

                <div>
                  <p
                    className="
                      text-white/70
                    "
                  >
                    Featured album
                  </p>

                  <h2
                    className="
                      text-5xl
                      font-black
                    "
                  >
                    {featured.name}
                  </h2>

                  <p
                    className="
                      mt-2
                      text-white/70
                    "
                  >
                    {featured.artist}
                  </p>

                  <motion.button
                    onClick={() => playAlbum(featured)}

                    whileHover={{
                      scale: 1.05,
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
                      px-6
                      py-3
                      font-semibold
                      text-black
                    "
                  >
                    <Play size={18} fill="currentColor" />
                    Play
                  </motion.button>
                </div>
              </div>

              <div
                className="
                  absolute
                  right-6
                  top-6
                  flex
                  gap-2
                "
              >
                <button
                  onClick={() => changeFeatured("previous")}

                  className="
                    rounded-full
                    bg-black/40
                    p-3
                    text-white
                  "
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={() => changeFeatured("next")}

                  className="
                    rounded-full
                    bg-black/40
                    p-3
                    text-white
                  "
                >
                  <ChevronRight />
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {/* Continue Listening */}

        <section className="mt-12">
          <motion.h2
            initial={{
              opacity: 0,
              x: -20,
            }}

            whileInView={{
              opacity: 1,
              x: 0,
            }}

            viewport={{
              once: true,
            }}

            className="
              mb-5
              text-2xl
              font-bold
            "
          >
            Continue Listening
          </motion.h2>

          {history.length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}

              animate={{
                opacity: 1,
                scale: 1,
              }}

              className="
                rounded-3xl
                aurora-glass
                p-8
                text-center
                aurora-text-muted
              "
            >
              <Music2
                className="
                  mx-auto
                  mb-3
                "
                size={36}
              />

              <p>Play some music and it will appear here.</p>
            </motion.div>
          ) : (
            <div
              className="
                flex
                gap-4
                overflow-x-auto
                pb-3
                aurora-scrollbar
              "
            >
              {history.slice(0, 8).map((song, index) => (
                <motion.button
                  key={song.id}

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: index * 0.05,
                  }}

                  whileHover={{
                    y: -5,
                  }}

                  whileTap={{
                    scale: 0.97,
                  }}

                  onClick={() => playHistorySong(song)}

                  className="
                      flex
                      w-64
                      shrink-0
                      items-center
                      gap-4
                      rounded-2xl
                      aurora-glass
                      p-4
                      text-left
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

                      alt={song.title}

                      loading="lazy"

                      className="
                          h-14
                          w-14
                          rounded-xl
                          object-cover
                        "
                    />
                  ) : (
                    <div
                      className="
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-xl
                          aurora-surface-muted
                        "
                    >
                      <Music2 size={22} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p
                      className="
                          truncate
                          font-semibold
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
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </section>

        {/* Recently Added */}

        <section className="mt-12">
          <motion.h2
            initial={{
              opacity: 0,
              x: -20,
            }}

            whileInView={{
              opacity: 1,
              x: 0,
            }}

            viewport={{
              once: true,
            }}

            className="
              mb-5
              text-2xl
              font-bold
            "
          >
            Recently Added
          </motion.h2>

          {loading ? (
            <div
              className="
                grid
                grid-cols-2
                gap-5
                sm:grid-cols-3
                lg:grid-cols-6
              "
            >
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <motion.div
                  key={index}

                  initial={{
                    opacity: 0,
                  }}

                  animate={{
                    opacity: 1,
                  }}

                  transition={{
                    delay: index * 0.05,
                  }}

                  className="
                    aspect-square
                    animate-pulse
                    rounded-3xl
                    aurora-surface-muted
                  "
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{
                opacity: 0,
              }}

              animate={{
                opacity: 1,
              }}

              className="
                grid
                grid-cols-2
                gap-5
                sm:grid-cols-3
                lg:grid-cols-6
              "
            >
              {recent.map((album, index) => (
                <motion.div
                  key={album.id}

                  initial={{
                    opacity: 0,
                    y: 20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: index * 0.04,
                  }}
                >
                  <AlbumCard
                    album={album}

                    server={server}

                    username={username}

                    password={password}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}
