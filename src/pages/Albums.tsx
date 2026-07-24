import { useEffect, useState } from "react";

import { NavidromeClient } from "../api/navidrome";
import type { Album } from "../api/types";

import AlbumCard from "../components/AlbumCard";
import { useAuthStore } from "../stores/auth";

export default function Albums() {
  const { server, username, password } = useAuthStore();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlbums() {
      try {
        const client = new NavidromeClient(server, username, password);

        const data = await client.getAlbums();

        setAlbums(data);
      } catch (error) {
        console.error("Failed to load albums:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAlbums();
  }, [server, username, password]);

  return (
    <main
      className="
        p-10
        text-white
      "
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
        Your entire music collection
      </p>

      <section
        className="
          mt-10
        "
      >
        {loading ? (
          <div
            className="
              grid
              grid-cols-2
              gap-6
              sm:grid-cols-3
              lg:grid-cols-5
            "
          >
            {Array.from({
              length: 15,
            }).map((_, i) => (
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
              gap-6
              sm:grid-cols-3
              lg:grid-cols-5
              xl:grid-cols-6
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
    </main>
  );
}
