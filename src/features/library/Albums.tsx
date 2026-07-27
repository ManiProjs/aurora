import { useEffect, useState } from "react";
import { NavidromeClient } from "../../api/navidrome";
import type { Album } from "../../api/types";

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const client = new NavidromeClient("YOUR_SERVER", "USERNAME", "PASSWORD");

    client.getAlbums().then(setAlbums);
  }, []);

  return (
    <div className="grid grid-cols-5 gap-6">
      {albums.map((album) => (
        <div key={album.id}>
          <div
            className="
            aspect-square
            rounded-2xl
            bg-zinc-800
          "
          />

          <h3 className="mt-3 font-semibold">{album.name}</h3>

          <p className="text-sm text-zinc-500">{album.artist}</p>
        </div>
      ))}
    </div>
  );
}
