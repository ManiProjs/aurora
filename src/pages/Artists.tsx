import { useEffect, useState } from "react";

import type { Artist } from "../api/types";

import { NavidromeClient } from "../api/navidrome";
import { useAuthStore } from "../stores/auth";

import ArtistCard from "../components/ArtistCard";

export default function Artists() {
  const { server, username, password } = useAuthStore();

  const [artists, setArtists] = useState<Artist[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtists() {
      try {
        const client = new NavidromeClient(server, username, password);

        const data = await client.getArtists();

        // Render immediately
        setArtists(data);

        setLoading(false);

        // Load images in background
        data.forEach(async (artist) => {
          try {
            const imageUrl = await client.getArtistImage(artist.id);

            setArtists((current) =>
              current.map((item) =>
                item.id === artist.id
                  ? {
                      ...item,
                      artistImageUrl: imageUrl,
                    }
                  : item,
              ),
            );
          } catch (error) {
            console.error(`Failed loading image for ${artist.name}`, error);
          }
        });
      } catch (error) {
        console.error("Failed to load artists:", error);
        setLoading(false);
      }
    }

    loadArtists();
  }, [server, username, password]);

  if (loading) {
    return <div className="p-6 text-zinc-400">Loading artists...</div>;
  }

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-4
        p-6
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-6
      "
    >
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
}
