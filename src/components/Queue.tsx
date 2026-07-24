import { X, GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";

import { usePlayerStore } from "../stores/player";

export default function Queue() {
  const queue = usePlayerStore((s) => s.queue);
  const current = usePlayerStore((s) => s.current);

  const playSong = usePlayerStore((s) => s.playSong);

  const removeFromQueue = usePlayerStore((s) => s.removeFromQueue);

  const reorderQueue = usePlayerStore((s) => s.reorderQueue);

  return (
    <aside
      className="
        w-96
        max-h-[70vh]
        overflow-hidden
        rounded-2xl
        bg-zinc-900/80
        p-4
        backdrop-blur-xl
      "
    >
      <h2
        className="
          mb-4
          text-xl
          font-bold
        "
      >
        Up Next
      </h2>

      <Reorder.Group
        axis="y"
        values={queue}
        onReorder={reorderQueue}
        className="
          space-y-2
          overflow-y-auto
          pr-2
        "
      >
        {queue.map((song, index) => (
          <Reorder.Item
            key={song.id}
            value={song}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              bg-white/5
              p-3
              cursor-grab
              active:cursor-grabbing
            "
          >
            <GripVertical
              size={18}
              className="
                text-zinc-500
              "
            />

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
                  ${current?.id === song.id ? "text-white" : "text-zinc-300"}
                `}
              >
                {song.title}
              </p>

              <p
                className="
                  truncate
                  text-sm
                  text-zinc-500
                "
              >
                {song.artist}
              </p>
            </button>

            <button
              onClick={() => removeFromQueue(song.id)}
              className="
                text-zinc-500
                transition
                hover:text-white
              "
            >
              <X size={16} />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </aside>
  );
}
