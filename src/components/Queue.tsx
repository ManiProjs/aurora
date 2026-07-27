import { X, GripVertical, Music2 } from "lucide-react";
import { Reorder, motion } from "framer-motion";

import { usePlayerStore } from "../stores/player";

export default function Queue() {
  const queue = usePlayerStore((s) => s.queue);

  const current = usePlayerStore((s) => s.current);

  const album = usePlayerStore((s) => s.album);

  const playSong = usePlayerStore((s) => s.playSong);

  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);

  const reorderQueue = usePlayerStore((s) => s.reorderQueue);

  return (
    <aside
      className="
        aurora-glass
        flex
        h-[230px]
        w-96
        flex-col
        rounded-3xl
        p-5
      "
    >
      <h2
        className="
          aurora-text
          mb-4
          text-xl
          font-bold
        "
      >
        Up Next
      </h2>

      {queue.length === 0 ? (
        <div
          className="
            aurora-text-muted
            flex
            flex-1
            flex-col
            items-center
            justify-center
            gap-3
          "
        >
          <Music2 size={36} />
          <p>Queue is empty</p>
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={queue}
          onReorder={reorderQueue}
          className="
            aurora-scrollbar
            flex-1
            space-y-2
            overflow-y-auto
            pr-2
            scroll-smooth
          "
        >
          {queue.map((song, index) => {
            const active = current?.id === song.id;

            return (
              <Reorder.Item
                key={song.id}
                value={song}
                as="div"
                whileDrag={{
                  scale: 1.03,
                }}
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  p-3
                  cursor-grab
                  transition
                  active:cursor-grabbing

                  ${
                    active
                      ? `
                        bg-white/20
                        ring-1
                        ring-white/20
                      `
                      : `
                        hover:bg-white/10
                      `
                  }
                `}
              >
                <GripVertical
                  size={18}
                  className="
                    aurora-text-muted
                    shrink-0
                  "
                />

                {song.coverArt || album?.coverArt ? (
                  <img
                    src={album?.coverArt}
                    alt=""
                    className="
                      h-10
                      w-10
                      shrink-0
                      rounded-xl
                      object-cover
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white/10
                    "
                  >
                    <Music2 size={18} />
                  </div>
                )}

                <button
                  onClick={() => playSong(index)}
                  className="
                    min-w-0
                    flex-1
                    text-left
                  "
                >
                  <p
                    className={`
                      truncate
                      font-medium
                      ${active ? "text-white" : "text-zinc-300"}
                    `}
                  >
                    {song.title}
                  </p>

                  <p
                    className="
                      aurora-text-muted
                      truncate
                      text-sm
                    "
                  >
                    {song.artist}
                  </p>
                </button>

                <motion.button
                  whileTap={{
                    scale: 0.8,
                  }}
                  onClick={() => removeFromQueue(song.id)}
                  className="
                    aurora-text-muted
                    rounded-full
                    p-2
                    transition
                    hover:bg-red-500/10
                    hover:text-red-500
                  "
                >
                  <X size={16} />
                </motion.button>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </aside>
  );
}
