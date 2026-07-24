import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Play } from "lucide-react";

import { useSearchStore } from "../stores/search";
import { useAuthStore } from "../stores/auth";
import { usePlayerStore } from "../stores/player";

import { NavidromeClient } from "../api/navidrome";
import { getCoverArtUrl } from "../api/utils";

export default function SearchOverlay() {
  const open = useSearchStore((s) => s.open);
  const setOpen = useSearchStore((s) => s.setOpen);

  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);

  const { server, username, password } = useAuthStore();

  const playQueue = usePlayerStore((s) => s.playQueue);

  const [results, setResults] = useState<{
    song?: any[];
    album?: any[];
    artist?: any[];
  } | null>(null);

  const [loading, setLoading] = useState(false);

  // ESC close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, setOpen]);

  // Search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const client = new NavidromeClient(server, username, password);

        const response = await client.search(query);

        console.log("Search results:", response);

        // FIX: search() already returns searchResult3
        setResults(response);
      } catch (error) {
        console.error("Search failed:", error);

        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, server, username, password]);

  async function playSong(song: any) {
    try {
      const client = new NavidromeClient(server, username, password);

      const songs = await client.getAlbum(song.albumId);

      playQueue(songs, {
        id: song.albumId,
        name: song.album,
        artist: song.artist,
        coverArt: song.coverArt
          ? getCoverArtUrl(server, username, password, song.coverArt)
          : undefined,
      });

      setOpen(false);
    } catch (error) {
      console.error("Playback failed:", error);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          exit={{
            opacity: 0,
          }}

          onClick={() => setOpen(false)}

          className="
            fixed
            inset-0
            z-[999]
            flex
            items-start
            justify-center
            bg-black/60
            pt-32
            backdrop-blur-xl
          "
        >
          <motion.div
            initial={{
              y: -40,
              scale: 0.95,
            }}

            animate={{
              y: 0,
              scale: 1,
            }}

            exit={{
              y: -40,
              scale: 0.95,
            }}

            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}

            onClick={(e) => e.stopPropagation()}

            className="
              relative
              w-full
              max-w-2xl
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
                rounded-3xl
                border
                border-white/10
                bg-zinc-900
                px-6
                py-5
                shadow-2xl
              "
            >
              <Search size={28} className="text-zinc-400" />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search music..."
                className="
                  flex-1
                  bg-transparent
                  text-2xl
                  text-white
                  outline-none
                  placeholder:text-zinc-500
                "
              />

              <kbd
                className="
                  rounded-md
                  border
                  border-white/10
                  bg-white/5
                  px-2
                  py-1
                  text-xs
                  text-zinc-500
                "
              >
                ESC
              </kbd>

              <button
                onClick={() => setOpen(false)}
                className="
                  rounded-full
                  p-2
                  text-zinc-400
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <X size={22} />
              </button>
            </div>

            {(loading || results) && (
              <div
                className="
                  mt-3
                  max-h-96
                  overflow-y-auto
                  rounded-3xl
                  border
                  border-white/10
                  bg-zinc-900
                  p-3
                "
              >
                {loading && (
                  <p
                    className="
                      p-4
                      text-zinc-400
                    "
                  >
                    Searching...
                  </p>
                )}

                {!loading &&
                  !results?.song?.length &&
                  !results?.album?.length &&
                  !results?.artist?.length && (
                    <p
                      className="
                        p-4
                        text-zinc-400
                      "
                    >
                      No results
                    </p>
                  )}

                {results?.song?.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => playSong(song)}
                    className="
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        p-3
                        text-left
                        hover:bg-white/10
                      "
                  >
                    <div>
                      <p className="font-semibold">{song.title}</p>

                      <p
                        className="
                            text-sm
                            text-zinc-400
                          "
                      >
                        {song.artist}
                      </p>
                    </div>

                    <Play size={18} />
                  </button>
                ))}

                {results?.album?.map((album) => (
                  <div
                    key={album.id}
                    className="
                        rounded-xl
                        p-3
                        text-zinc-300
                        hover:bg-white/10
                      "
                  >
                    Album: {album.name}
                  </div>
                ))}

                {results?.artist?.map((artist) => (
                  <div
                    key={artist.id}
                    className="
                        rounded-xl
                        p-3
                        text-zinc-300
                        hover:bg-white/10
                      "
                  >
                    Artist: {artist.name}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
