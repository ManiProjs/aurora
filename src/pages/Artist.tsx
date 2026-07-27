import { useEffect, useState } from "react";
import { ArrowLeft, Play, Shuffle, UserRound } from "lucide-react";
import { motion } from "framer-motion";

import type { Album, Song } from "../api/types";

import { NavidromeClient } from "../api/navidrome";
import { getCoverArtUrl } from "../api/utils";

import { useAuthStore } from "../stores/auth";
import { useNavigationStore } from "../stores/navigation";
import { usePlayerStore } from "../stores/player";

import AlbumCard from "../components/AlbumCard";
import { useAlbumColor } from "../hooks/useAlbumColor";

export default function ArtistPage() {
  const artist = useNavigationStore((s) => s.selectedArtist);
  const goBack = useNavigationStore((s) => s.goBack);

  const { server, username, password } = useAuthStore();

  const playQueue = usePlayerStore((s) => s.playQueue);

  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artist) return;

    async function load() {
      try {
        const client = new NavidromeClient(server, username, password);

        const result = await client.getArtist(artist.id);

        setAlbums(result.album ?? []);

        const artistSongs = await client.getSongsByArtist(artist.id);

        setSongs(artistSongs);
      } catch (error) {
        console.error("Failed loading artist:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [artist, server, username, password]);

  if (!artist) {
    return null;
  }

  const artwork =
    artist.artistImageUrl ??
    (albums[0]?.coverArt
      ? getCoverArtUrl(server, username, password, albums[0].coverArt)
      : null);

  const color = useAlbumColor(artwork);

  const popularSongs = songs.slice(0, 5);

  const playerAlbum: Album = {
    id: artist.id,
    name: artist.name,
    artist: artist.name,
    coverArt: artwork ?? undefined,
  };

  function playArtist() {
    playQueue(songs, playerAlbum);
  }

  function shuffleArtist() {
    const shuffled = [...songs].sort(() => Math.random() - 0.5);

    playQueue(shuffled, playerAlbum);
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
      {/* Aurora background */}

      <div
        className="
          absolute
          inset-0
          overflow-hidden
          pointer-events-none
        "
      >
        {artwork && (
          <motion.img
            src={artwork}
            alt=""
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 30, -30, 0],
              y: [0, -20, 20, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 20,
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
              opacity-50
              saturate-150
            "
          />
        )}

        <motion.div
          animate={{
            x: ["-10%", "10%", "-10%"],
            y: ["0%", "10%", "0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `
              radial-gradient(
                circle,
                ${color},
                transparent 65%
              )
            `,
          }}
          className="
            absolute
            inset-0
            scale-150
            blur-3xl
            opacity-70
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-zinc-950/75
            backdrop-blur-3xl
          "
        />
      </div>

      <div
        className="
          relative
          z-10
        "
      >
        <button
          onClick={goBack}
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
        </button>

        <section
          className="
            flex
            items-end
            gap-8
          "
        >
          {artwork ? (
            <motion.img
              src={artwork}
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
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
                bg-zinc-800
                text-zinc-500
              "
            >
              <UserRound size={90} />
            </div>
          )}

          <div>
            <p className="text-zinc-400">Artist</p>

            <h1
              className="
                text-5xl
                font-bold
              "
            >
              {artist.name}
            </h1>

            <div
              className="
                mt-6
                flex
                gap-3
              "
            >
              <button
                onClick={playArtist}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-7
                  py-3
                  font-semibold
                  text-black
                  transition
                  hover:scale-105
                "
              >
                <Play size={20} fill="currentColor" />
                Play
              </button>

              <button
                onClick={shuffleArtist}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white/10
                  px-6
                  py-3
                  font-semibold
                  transition
                  hover:bg-white/20
                "
              >
                <Shuffle size={20} />
                Shuffle
              </button>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Popular Songs</h2>

          <div className="max-w-3xl space-y-2">
            {popularSongs.map((song, index) => (
              <motion.button
                key={song.id}
                onClick={() => playQueue([song], playerAlbum)}
                whileHover={{
                  x: 8,
                }}
                className="
                    flex
                    w-full
                    items-center
                    gap-4
                    rounded-xl
                    p-3
                    text-left
                    hover:bg-white/10
                  "
              >
                <span className="w-8 text-zinc-500">{index + 1}</span>

                <div className="flex-1">
                  <p className="font-medium">{song.title}</p>

                  <p className="text-sm text-zinc-400">{song.album}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Albums</h2>

          {loading ? (
            <p className="text-zinc-400">Loading...</p>
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
              {albums.map((album) => (
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
