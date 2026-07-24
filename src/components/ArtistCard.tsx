import { motion } from "framer-motion";
import { Mic2, User } from "lucide-react";

import type { Artist } from "../api/types";

import { useNavigationStore } from "../stores/navigation";

import { useState } from "react";

interface Props {
  artist: Artist;
}

export default function ArtistCard({ artist }: Props) {
  const openArtist = useNavigationStore((s) => s.openArtist);

  const [imageError, setImageError] = useState(false);

  return (
    <motion.button
      onClick={() => openArtist(artist)}
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.97,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
      }}
      className="
        group
        rounded-3xl
        border
        border-white/10
        bg-zinc-900
        p-6
        text-left
        transition
        hover:bg-zinc-800
      "
    >
      <div
        className="
    aspect-square
    overflow-hidden
    rounded-2xl
    bg-zinc-800
  "
      >
        {artist.artistImageUrl && !imageError ? (
          <img
            src={artist.artistImageUrl}
            alt={artist.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="
        h-full
        w-full
        object-cover
      "
          />
        ) : (
          <div
            className="
        flex
        h-full
        w-full
        items-center
        justify-center
        text-zinc-500
      "
          >
            <User size={56} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <h2
        className="
          mt-5
          truncate
          text-lg
          font-semibold
          text-white
        "
      >
        {artist.name}
      </h2>

      <p
        className="
          mt-1
          text-sm
          text-zinc-400
        "
      >
        {artist.albumCount ?? 0} albums
      </p>
    </motion.button>
  );
}
