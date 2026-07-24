import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";

import { useSearchStore } from "../stores/search";

export default function SearchOverlay() {
  const open = useSearchStore((s) => s.open);
  const setOpen = useSearchStore((s) => s.setOpen);

  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);

  const isMac = navigator.platform.toLowerCase().includes("mac");

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
          className="
            fixed
            inset-0
            z-[999]
            flex
            items-start
            justify-center
            bg-black/60
            backdrop-blur-xl
            pt-32
          "
          onClick={() => setOpen(false)}
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
              flex
              w-full
              max-w-2xl
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
            <Search
              size={28}
              className="
                text-zinc-400
              "
            />

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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
