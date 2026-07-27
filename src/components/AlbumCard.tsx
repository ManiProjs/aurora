import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";

import type { Album } from "../api/types";

import { getCoverArtUrl } from "../api/utils";
import { NavidromeClient } from "../api/navidrome";

import { usePlayerStore } from "../stores/player";
import { useNavigationStore } from "../stores/navigation";

interface Props {
  album: Album;
  server: string;
  username: string;
  password: string;
}

export default function AlbumCard({
  album,
  server,
  username,
  password,
}: Props) {
  const playQueue = usePlayerStore((s) => s.playQueue);

  const openAlbum = useNavigationStore((s) => s.openAlbum);

  const [loading, setLoading] = useState(false);

  const [imageLoaded, setImageLoaded] = useState(false);

  async function playAlbum(event: React.MouseEvent) {
    event.stopPropagation();

    try {
      setLoading(true);

      const client = new NavidromeClient(server, username, password);

      const songs = await client.getAlbum(album.id);

      playQueue(songs, {
        ...album,
        coverArt: album.coverArt
          ? getCoverArtUrl(server, username, password, album.coverArt)
          : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.article
      onClick={() => openAlbum(album)}

      initial={{
        opacity: 0,
        y: 25,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      whileHover={{
        y: -10,
      }}

      whileTap={{
        scale: 0.97,
      }}

      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}

      className="
        group
        cursor-pointer
      "
    >
      <div
        className="
          relative
          aspect-square
          overflow-hidden
          rounded-3xl
          bg-zinc-900
        "
      >
        {/* Glow */}

        <div
          className="
            absolute
            inset-0
            bg-white/10
            opacity-0
            blur-2xl
            transition
            duration-500
            group-hover:opacity-100
          "
        />

        {album.coverArt && (
          <motion.img
            src={getCoverArtUrl(server, username, password, album.coverArt)}

            alt={album.name}

            onLoad={() => setImageLoaded(true)}

            initial={{
              opacity: 0,
              scale: 1.1,
            }}

            animate={{
              opacity: imageLoaded ? 1 : 0,
              scale: 1,
            }}

            transition={{
              duration: 0.5,
            }}

            whileHover={{
              scale: 1.08,
            }}

            className="
              relative
              h-full
              w-full
              object-cover
            "
          />
        )}

        {/* Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/80
            via-transparent
            opacity-0
            transition
            duration-300
            group-hover:opacity-100
          "
        />

        {/* Play */}

        <motion.button
          onClick={playAlbum}

          initial={{
            opacity: 0,
            scale: 0.5,
          }}

          whileHover={{
            scale: 1.15,
          }}

          whileTap={{
            scale: 0.9,
          }}

          className="
            absolute
            bottom-4
            right-4
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-white
            text-black
            shadow-2xl
            opacity-0
            transition
            duration-300
            group-hover:opacity-100
          "
        >
          {loading ? (
            <Loader2
              size={22}
              className="
                animate-spin
              "
            />
          ) : (
            <Play size={22} fill="currentColor" />
          )}
        </motion.button>
      </div>

      <motion.div className="mt-3" layout>
        <h3
          className="
            truncate
            font-semibold
          "
        >
          {album.name}
        </h3>

        <p
          className="
            truncate
            text-sm
            text-zinc-400
          "
        >
          {album.artist}
        </p>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="
            mt-1
            text-xs
            text-zinc-500
          "
        >
          {album.songCount ?? "?"}
          {" songs"}
          {" • "}
          {album.year ?? "Unknown"}
        </motion.p>
      </motion.div>
    </motion.article>
  );
}
