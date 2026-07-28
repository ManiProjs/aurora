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

  console.log(usePlayerStore.getState().history);

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

    const timer = setInterval(updateGreeting, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadAlbums() {
      try {
        const client = new NavidromeClient(server, username, password);

        const data = await client.getAlbums();

        setAlbums(data);

        if (data.length > 0) {
          setFeatured(data[Math.floor(Math.random() * data.length)]);
        }
      } catch (error) {
        console.error("Failed loading albums:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAlbums();
  }, [server, username, password]);

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

    return () => clearInterval(timer);
  }, [albums, heroPaused]);

  function changeFeatured(direction: "next" | "previous") {
    if (!featured) {
      return;
    }

    const index = albums.findIndex((album) => album.id === featured.id);

    const newIndex =
      direction === "next"
        ? (index + 1) % albums.length
        : (index - 1 + albums.length) % albums.length;

    setFeatured(albums[newIndex]);
  }

  async function playFeatured() {
    if (!featured) {
      return;
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
        console.error("Failed to play history song:", error);
      }
    }

    try {
      const client = new NavidromeClient(server, username, password);

      const songs = await client.getAlbum(featured.id);

      playQueue(songs, {
        ...featured,
        coverArt: featured.coverArt
          ? getCoverArtUrl(server, username, password, featured.coverArt)
          : undefined,
      });
    } catch (error) {
      console.error("Failed playing album:", error);
    }
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
      <div className="mx-auto max-w-7xl">
        <header>
          <h1 className="text-5xl font-bold">{greeting}</h1>

          <p className="mt-2 aurora-text-muted">Your personal music space</p>
        </header>

        <AnimatePresence mode="wait">
          {featured && (
            <motion.section
              key={featured.id}
              onMouseEnter={() => setHeroPaused(true)}
              onMouseLeave={() => setHeroPaused(false)}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              className="
                relative
                mt-10
                overflow-hidden
                rounded-3xl
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
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    blur-3xl
                    opacity-50
                  "
                />
              )}

              <div
                className="
                  absolute
                  inset-0
                  bg-black/60
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
                  <img
                    src={getCoverArtUrl(
                      server,
                      username,
                      password,
                      featured.coverArt,
                    )}
                    className="
                      h-56
                      w-56
                      rounded-3xl
                      object-cover
                    "
                  />
                )}

                <div>
                  <p className="text-zinc-300">Featured album</p>

                  <h2 className="text-5xl font-bold">{featured.name}</h2>

                  <p className="mt-2 text-zinc-300">{featured.artist}</p>

                  <button
                    onClick={playFeatured}
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
                  </button>
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
                  "
                >
                  <ChevronRight />
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Continue Listening</h2>

          {history.length === 0 ? (
            <div
              className="
                rounded-3xl
                bg-zinc-900
                p-8
                text-center
                text-zinc-400
              "
            >
              <Music2 className="mx-auto mb-3" size={32} />
              Play some music and it will appear here.
            </div>
          ) : (
            <div
              className="
                flex
                gap-4
                overflow-x-auto
              "
            >
              {history.slice(0, 8).map((song) => (
                <div
                  key={song.id}
                  onClick={() => playHistorySong(song)}
                  className="
                    flex
                    w-64
                    shrink-0
                    items-center
                    gap-4
                    rounded-2xl
                    bg-zinc-900
                    p-4
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
                        bg-zinc-800
                      "
                    >
                      <Music2 size={20} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-semibold">{song.title}</p>

                    <p className="truncate text-sm text-zinc-400">
                      {song.artist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Recently Added</h2>

          {loading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="
                    aspect-square
                    animate-pulse
                    rounded-3xl
                    bg-zinc-800
                  "
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {recent.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  server={server}
                  username={username}
                  password={password}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
