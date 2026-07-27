import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

import { useAnimations } from "../hooks/useAnimations";

import type { Artist } from "../api/types";

import { useNavigationStore } from "../stores/navigation";

interface Props {
  artist: Artist;
}

export default function ArtistCard({ artist }: Props) {
  const openArtist = useNavigationStore((s) => s.openArtist);

  const animations = useAnimations();

  const [imageError, setImageError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setImageError(false);
    setRetry(0);
  }, [artist.artistImageUrl]);

  function retryImage() {
    setImageError(false);
    setRetry((value) => value + 1);
  }

  return (
    <motion.button
      onClick={() => openArtist(artist)}

      initial={
        animations
          ? {
              opacity: 0,
              y: 20,
            }
          : false
      }

      animate={
        animations
          ? {
              opacity: 1,
              y: 0,
            }
          : undefined
      }

      whileHover={
        animations
          ? {
              y: -8,
            }
          : undefined
      }

      whileTap={
        animations
          ? {
              scale: 0.96,
            }
          : undefined
      }

      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}

      className="
        aurora-card
        group
        overflow-hidden
        text-left
      "
    >
      {/* Image */}

      <div
        className="
          relative
          aspect-square
          overflow-hidden
        "
      >
        {artist.artistImageUrl && !imageError ? (
          <motion.img
            key={`${artist.artistImageUrl}-${retry}`}

            src={artist.artistImageUrl}

            alt={artist.name}

            loading="lazy"

            onError={() => {
              console.error(
                "Failed loading artist image:",
                artist.artistImageUrl,
              );

              setImageError(true);

              setTimeout(() => {
                retryImage();
              }, 5000);
            }}

            whileHover={
              animations
                ? {
                    scale: 1.08,
                  }
                : undefined
            }

            transition={{
              duration: 0.4,
            }}

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
              items-center
              justify-center
              bg-zinc-100
              text-zinc-400
              dark:bg-zinc-800
            "
          >
            <User size={56} strokeWidth={1.3} />
          </div>
        )}

        {/* Gradient */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-24
            bg-gradient-to-t
            from-black/60
            to-transparent
          "
        />
      </div>

      {/* Info */}

      <div
        className="
          p-4
        "
      >
        <h2
          className="
            aurora-text
            truncate
            text-lg
            font-semibold
          "
        >
          {artist.name}
        </h2>

        <p
          className="
            aurora-text-muted
            mt-1
            text-sm
          "
        >
          {artist.albumCount ?? 0} albums
        </p>
      </div>
    </motion.button>
  );
}
