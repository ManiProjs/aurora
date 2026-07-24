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
    <motion.aside
      initial={{
        opacity: 0,
        x: 40,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      className="
        aurora-glass
        flex
        w-96
        max-h-[70vh]
        flex-col
        rounded-3xl
        p-5
      "
    >
      <h2
        className="
          aurora-text
          mb-5
          text-xl
          font-bold
        "
      >
        Up Next
      </h2>

      {queue.length === 0 ? (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="
            aurora-text-muted
            flex
            flex-1
            flex-col
            items-center
            justify-center
            gap-3
            py-12
          "
        >
          <Music2 size={40} />
          <p>Queue is empty</p>
        </motion.div>
      ) : (
        <Reorder.Group
          axis="y"
          values={queue}
          onReorder={reorderQueue}
          className="
            aurora-scrollbar
            space-y-2
            overflow-y-auto
            pr-2
          "
        >
          {queue.map((song, index) => {
            const active = current?.id === song.id;

            return (
              <Reorder.Item
                key={song.id}
                value={song}
                as="div"
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                whileDrag={{
                  scale: 1.04,
                  rotate: 1,
                  zIndex: 20,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                className={`
                  group
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  p-3
                  cursor-grab
                  active:cursor-grabbing
                  transition

                  ${
                    active
                      ? `
                        bg-white/15
                        shadow-lg
                        ring-1
                        ring-white/20
                      `
                      : `
                        hover:bg-white/10
                      `
                  }
                `}
              >
                <motion.div
                  whileHover={{
                    scale: 1.15,
                  }}
                >
                  <GripVertical
                    size={18}
                    className="
                      aurora-text-muted
                    "
                  />
                </motion.div>

                {album?.coverArt ? (
                  <motion.img
                    src={album.coverArt}
                    alt=""
                    animate={
                      active
                        ? {
                            scale: [1, 1.06, 1],
                          }
                        : {
                            scale: 1,
                          }
                    }
                    transition={{
                      duration: 3,
                      repeat: active ? Infinity : 0,
                    }}
                    className="
                      h-10
                      w-10
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
                      items-center
                      justify-center
                      rounded-xl
                      bg-zinc-800
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
                  <motion.p
                    animate={
                      active
                        ? {
                            x: [0, 3, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 2,
                      repeat: active ? Infinity : 0,
                    }}
                    className={`
                      truncate
                      font-medium

                      ${active ? "text-white" : "text-zinc-300"}
                    `}
                  >
                    {song.title}
                  </motion.p>

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
                  initial={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  whileHover={{
                    scale: 1.15,
                  }}
                  whileTap={{
                    scale: 0.8,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  onClick={() => removeFromQueue(song.id)}
                  className="
                    aurora-text-muted
                    rounded-full
                    p-2
                    transition
                    hover:bg-red-500/20
                    hover:text-red-400
                  "
                >
                  <X size={16} />
                </motion.button>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}
    </motion.aside>
  );
}
