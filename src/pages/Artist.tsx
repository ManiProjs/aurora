import { useEffect, useState } from "react";
import { ArrowLeft, Play, UserRound } from "lucide-react";
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

  function playArtist() {
    playQueue(songs, {
      id: artist.id,
      name: artist.name,
      artist: artist.name,
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
      <div
        className="
          absolute
          inset-0
          pointer-events-none
        "
      >
        <motion.div
          animate={{
            background: `
              radial-gradient(
                circle at top,
                ${color},
                transparent 65%
              )
            `,
          }}
          className="
            absolute
            inset-0
            scale-125
            blur-3xl
            opacity-70
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
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
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
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="
                flex
                h-64
                w-64
                items-center
                justify-center
                rounded-3xl
                bg-zinc-800
                text-zinc-500
                shadow-2xl
              "
            >
              <UserRound size={90} strokeWidth={1.2} />
            </motion.div>
          )}

          <div>
            <p
              className="
                text-zinc-400
              "
            >
              Artist
            </p>

            <h1
              className="
                text-5xl
                font-bold
              "
            >
              {artist.name}
            </h1>

            <button
              onClick={playArtist}
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
                transition
                hover:scale-105
              "
            >
              <Play size={20} fill="currentColor" />
              Play
            </button>
          </div>
        </section>

        <section className="mt-12">
          <h2
            className="
              mb-5
              text-2xl
              font-bold
            "
          >
            Albums
          </h2>

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
