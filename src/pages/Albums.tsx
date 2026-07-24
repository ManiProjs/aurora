import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { NavidromeClient } from "../api/navidrome";
import type { Album } from "../api/types";

import AlbumCard from "../components/AlbumCard";
import { useAuthStore } from "../stores/auth";

export default function Albums() {
  const { server, username, password } = useAuthStore();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = new NavidromeClient(server, username, password);

    client
      .getAlbums()
      .then(setAlbums)
      .finally(() => setLoading(false));
  }, [server, username, password]);

  return (
    <main
      className="
        p-10
        text-white
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <h1
          className="
            text-5xl
            font-bold
          "
        >
          Albums
        </h1>

        <p
          className="
            mt-2
            text-zinc-400
          "
        >
          Explore your collection
        </p>
      </motion.div>

      <section
        className="
          mt-10
          grid
          grid-cols-2
          gap-6
          sm:grid-cols-3
          lg:grid-cols-5
          xl:grid-cols-6
        "
      >
        {loading
          ? Array.from({
              length: 18,
            }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
                className="
                aspect-square
                rounded-3xl
                bg-zinc-800
              "
              />
            ))
          : albums.map((album, index) => (
              <motion.div
                key={album.id}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: index * 0.03,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
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
      </section>
    </main>
  );
}
