import { useEffect, useMemo, useRef, useState } from "react";
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

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(0);

  const resultRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const flatResults = useMemo(() => {
    if (!results) {
      return [];
    }

    return [
      ...(results.song ?? []).map((item: any) => ({
        type: "song",
        item,
      })),

      ...(results.album ?? []).map((item: any) => ({
        type: "album",
        item,
      })),

      ...(results.artist ?? []).map((item: any) => ({
        type: "artist",
        item,
      })),
    ];
  }, [results]);

  useEffect(() => {
    setSelected(0);
  }, [results]);

  useEffect(() => {
    const element = resultRefs.current[selected];

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [selected]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) {
        return;
      }

      if (e.key === "Escape") {
        setOpen(false);
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();

        setSelected((value) => Math.min(value + 1, flatResults.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();

        setSelected((value) => Math.max(value - 1, 0));
      }

      if (e.key === "Enter") {
        const result = flatResults[selected];

        if (result) {
          openResult(result);
        }
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, flatResults, selected]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const client = new NavidromeClient(server, username, password);

        setResults(await client.search(query));
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
  }

  function openResult(result: any) {
    if (result.type === "song") {
      playSong(result.item);
    }
  }

  function artwork(item: any) {
    if (!item.coverArt) {
      return null;
    }

    return getCoverArtUrl(server, username, password, item.coverArt);
  }

  let index = 0;

  function renderGroup(title: string, items: any[], type: string) {
    if (!items?.length) {
      return null;
    }

    return (
      <div>
        <p
          className="
            px-3
            py-2
            text-xs
            font-semibold
            uppercase
            text-zinc-500
          "
        >
          {title}
        </p>

        {items.map((item) => {
          const currentIndex = index++;

          const image = artwork(item);

          return (
            <button
              key={item.id}
              ref={(element) => {
                resultRefs.current[currentIndex] = element;
              }}
              onMouseEnter={() => setSelected(currentIndex)}
              onClick={() =>
                openResult({
                  type,
                  item,
                })
              }
              className={`
                flex
                w-full
                items-center
                gap-4
                rounded-xl
                p-3
                text-left
                transition
                ${
                  selected === currentIndex ? "bg-white/10" : "hover:bg-white/5"
                }
              `}
            >
              {image ? (
                <img
                  src={image}
                  alt=""
                  className="
                    h-12
                    w-12
                    rounded-lg
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    h-12
                    w-12
                    rounded-lg
                    bg-white/10
                  "
                />
              )}

              <div className="flex-1">
                <p className="font-semibold">{item.title ?? item.name}</p>

                <p
                  className="
                    text-sm
                    text-zinc-400
                  "
                >
                  {item.artist ?? type}
                </p>
              </div>

              {type === "song" && <Play size={18} />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-[999]
            flex
            justify-center
            pt-32
            bg-black/60
            backdrop-blur-xl
          "
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <div
              className="
                flex
                items-center
                gap-4
                rounded-3xl
                bg-zinc-900
                px-6
                py-5
              "
            >
              <Search className="text-zinc-400" />

              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
                  flex-1
                  bg-transparent
                  text-2xl
                  outline-none
                "
                placeholder="Search music..."
              />

              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            {(loading || results) && (
              <div
                className="
                  mt-3
                  max-h-96
                  overflow-y-auto
                  rounded-3xl
                  bg-zinc-900
                  p-3
                "
              >
                {loading && <p className="p-4 text-zinc-400">Searching...</p>}

                {results && (
                  <>
                    {renderGroup("Songs", results.song, "song")}

                    {renderGroup("Albums", results.album, "album")}

                    {renderGroup("Artists", results.artist, "artist")}
                  </>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
