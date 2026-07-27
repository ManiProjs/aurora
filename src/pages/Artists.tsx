import { useEffect, useState } from "react";

import type { Artist } from "../api/types";

import { NavidromeClient } from "../api/navidrome";
import { useAuthStore } from "../stores/auth";

import ArtistCard from "../components/ArtistCard";
import { Skeleton } from "../components/Skeleton";

export default function Artists() {
  const { server, username, password } = useAuthStore();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadImages(
    data: Artist[],
    client: NavidromeClient,
    cancelled: { value: boolean },
  ) {
    const queue = [...data];

    async function worker() {
      while (queue.length > 0) {
        const artist = queue.shift();

        if (!artist || cancelled.value) {
          return;
        }

        try {
          const imageUrl = await client.getArtistImage(artist.id);

          if (cancelled.value) {
            return;
          }

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
      }
    }

    await Promise.all([worker(), worker(), worker(), worker()]);
  }

  useEffect(() => {
    const cancelled = {
      value: false,
    };

    async function loadArtists() {
      try {
        const client = new NavidromeClient(server, username, password);

        const data = await client.getArtists();

        if (cancelled.value) {
          return;
        }

        // Show artists immediately
        setArtists(data);
        setLoading(false);

        // Load images separately
        loadImages(data, client, cancelled);
      } catch (error) {
        console.error("Failed to load artists:", error);

        if (!cancelled.value) {
          setLoading(false);
        }
      }
    }

    loadArtists();

    return () => {
      cancelled.value = true;
    };
  }, [server, username, password]);

  if (loading) {
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
        {Array.from({
          length: 12,
        }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton
              className="
                aspect-square
              "
            />

            <Skeleton
              className="
                h-5
                w-3/4
              "
            />

            <Skeleton
              className="
                h-4
                w-1/2
              "
            />
          </div>
        ))}
      </div>
    );
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
