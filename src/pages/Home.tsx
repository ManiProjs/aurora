import { useEffect, useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

import { NavidromeClient } from "../api/navidrome";
import { getCoverArtUrl } from "../api/utils";
import { useAuthStore } from "../stores/auth";
import { usePlayerStore } from "../stores/player";

import type { Album } from "../api/types";
import AlbumCard from "../components/AlbumCard";
import MiniPlayer from "../components/MiniPlayer";

import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { server, username, password } = useAuthStore();

  const playQueue = usePlayerStore((state) => state.playQueue);

  const [albums, setAlbums] = useState<Album[]>([]);
  const [featured, setFeatured] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroPaused, setHeroPaused] = useState(false);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 18) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };

    updateGreeting();

    const timer = setInterval(updateGreeting, 60000);

    return () => clearInterval(timer);
  }, []);

  function changeFeatured(direction: "next" | "previous") {
    if (albums.length === 0 || !featured) return;

    const index = albums.findIndex((album) => album.id === featured.id);

    let newIndex;

    if (direction === "next") {
      newIndex = (index + 1) % albums.length;
    } else {
      newIndex = (index - 1 + albums.length) % albums.length;
    }

    setFeatured(albums[newIndex]);
  }

  useEffect(() => {
    const client = new NavidromeClient(server, username, password);

    client
      .getAlbums()
      .then((data) => {
        setAlbums(data);

        if (data.length > 0) {
          setFeatured(data[Math.floor(Math.random() * data.length)]);
        }
      })
      .finally(() => setLoading(false));
  }, [server, username, password]);

  useEffect(() => {
    if (albums.length === 0 || heroPaused) return;

    const timer = setInterval(() => {
      setFeatured((current) => {
        if (!current) return albums[0];

        const index = albums.findIndex((album) => album.id === current.id);

        return albums[(index + 1) % albums.length];
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [albums, heroPaused]);

  async function handleHeroPlay() {
    if (!featured) return;

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
      console.error("Failed to play featured album:", error);
    }
  }

  const recent = albums.slice(0, 6);

  return (
    <main
      className="
        h-screen
        overflow-y-auto
        bg-zinc-950
        px-6
        py-8
        pb-32
        text-white
      "
    >
      <div className="mx-auto max-w-7xl">
        <header>
          <h1 className="text-4xl font-bold md:text-5xl">{greeting}</h1>

          <p className="mt-2 text-zinc-400">Your personal music space</p>
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
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -20,
                scale: 0.98,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="
        relative
        mt-10
        overflow-hidden
        rounded-3xl
        p-6
        md:p-8
      "
            >
              {featured.coverArt && (
                <motion.img
                  key={`background-${featured.id}`}
                  src={getCoverArtUrl(
                    server,
                    username,
                    password,
                    featured.coverArt,
                  )}
                  alt=""
                  initial={{
                    scale: 1.2,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1.05,
                    opacity: 0.7,
                  }}
                  transition={{
                    duration: 1.2,
                  }}
                  className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            blur-3xl
            saturate-200
          "
                />
              )}

              <div
                className="
          absolute
          inset-0
          bg-gradient-to-r
          from-zinc-950/75
          via-zinc-950/45
          to-zinc-950/70
        "
              />

              <div
                className="
          absolute
          right-6
          top-6
          z-20
          flex
          gap-2
        "
              >
                <button
                  onClick={() => changeFeatured("previous")}
                  className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-black/40
            text-white
            backdrop-blur-md
            transition
            hover:scale-105
            hover:bg-black/60
          "
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  onClick={() => changeFeatured("next")}
                  className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-black/40
            text-white
            backdrop-blur-md
            transition
            hover:scale-105
            hover:bg-black/60
          "
                >
                  <ChevronRight size={22} />
                </button>
              </div>

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
                    key={`cover-${featured.id}`}
                    src={getCoverArtUrl(
                      server,
                      username,
                      password,
                      featured.coverArt,
                    )}
                    alt={featured.name}
                    initial={{
                      opacity: 0,
                      scale: 0.85,
                      rotate: -4,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "backOut",
                    }}
                    className="
              h-40
              w-40
              rounded-2xl
              object-cover
              shadow-2xl
              md:h-56
              md:w-56
            "
                  />
                )}

                <motion.div
                  initial={{
                    opacity: 0,
                    x: -25,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.15,
                    duration: 0.5,
                  }}
                  className="min-w-0"
                >
                  <p className="text-sm text-zinc-300">Featured album</p>

                  <h2
                    className="
              mt-2
              truncate
              text-3xl
              font-bold
              md:text-5xl
            "
                  >
                    {featured.name}
                  </h2>

                  <p className="mt-2 text-zinc-300">{featured.artist}</p>

                  <motion.button
                    whileHover={{
                      scale: 1.08,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    onClick={handleHeroPlay}
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
              shadow-xl
            "
                  >
                    <Play size={18} fill="currentColor" />
                    Play
                  </motion.button>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Continue Listening</h2>

          <div
            className="
    grid
    grid-cols-2
    gap-5
    sm:grid-cols-3
    lg:grid-cols-6
  "
          >
            {albums.slice(0, 6).map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                server={server}
                username={username}
                password={password}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Recently Added</h2>

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
            <div
              className="
                grid
                grid-cols-2
                gap-5
                sm:grid-cols-3
                lg:grid-cols-6
              "
            >
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

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">More Albums</h2>

          <div
            className="
      grid
      grid-cols-2
      gap-5
      sm:grid-cols-3
      lg:grid-cols-6
    "
          >
            {albums.slice(6, 12).map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                server={server}
                username={username}
                password={password}
              />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Quick Access</h2>

          <div
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {["Recently Played", "Liked Songs", "Random Mix"].map((item) => (
              <button
                key={item}
                className="
                  rounded-2xl
                  bg-zinc-900
                  p-6
                  text-left
                  text-lg
                  font-semibold
                  transition
                  hover:bg-zinc-800
                "
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      </div>

      <MiniPlayer />
    </main>
  );
}
