import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import type { Album } from "../api/types";
import { getCoverArtUrl } from "../api/utils";
import { NavidromeClient } from "../api/navidrome";
import { usePlayerStore } from "../stores/player";

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
  const playQueue = usePlayerStore((state) => state.playQueue);

  const [loading, setLoading] = useState(false);

  async function handlePlay() {
    try {
      setLoading(true);

      const client = new NavidromeClient(server, username, password);

      const songs = await client.getAlbum(album.id);

      playQueue(
        songs.map((song) => ({
          ...song,
          title: song.title ?? "Unknown Title",
          artist: song.artist ?? album.artist,
        })),
        {
          ...album,
          coverArt: album.coverArt
            ? getCoverArtUrl(server, username, password, album.coverArt)
            : undefined,
        },
      );
    } catch (error) {
      console.error("Failed to play album:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="group cursor-pointer">
      <div
        className="
        relative
        aspect-square
        overflow-hidden
        rounded-3xl
        bg-zinc-800
      "
      >
        {album.coverArt && (
          <img
            src={getCoverArtUrl(server, username, password, album.coverArt)}
            alt={album.name}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-300
              group-hover:scale-105
            "
          />
        )}

        <button
          onClick={handlePlay}
          disabled={loading}
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
            opacity-0
            shadow-xl
            transition
            group-hover:opacity-100
            hover:scale-110
            disabled:cursor-wait
          "
        >
          {loading ? (
            <Loader2 size={22} className="animate-spin" />
          ) : (
            <Play size={22} fill="currentColor" />
          )}
        </button>
      </div>

      <h3 className="mt-3 truncate font-semibold">{album.name}</h3>

      <p className="truncate text-sm text-zinc-500">{album.artist}</p>
    </article>
  );
}
