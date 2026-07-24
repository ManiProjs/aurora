import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import type { LyricLine } from "../api/lyrics";

import { usePlayerStore } from "../stores/player";

interface Props {
  lyrics: LyricLine[];
  progress: number;
}

export default function LyricsPanel({ lyrics, progress }: Props) {
  const seek = usePlayerStore((s) => s.seek);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const lineRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const [activeIndex, setActiveIndex] = useState(0);

  const manualSeek = useRef(false);

  function findCurrentLine(time: number) {
    let index = 0;

    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= time) {
        index = i;
      } else {
        break;
      }
    }

    return index;
  }

  function scrollToLine(index: number) {
    const element = lineRefs.current[index];

    if (!element || !containerRef.current) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  useEffect(() => {
    if (!lyrics.length) {
      return;
    }

    const index = findCurrentLine(progress);

    setActiveIndex(index);

    if (!manualSeek.current) {
      scrollToLine(index);
    }

    manualSeek.current = false;
  }, [progress, lyrics]);

  function handleClick(line: LyricLine, index: number) {
    manualSeek.current = true;

    setActiveIndex(index);

    seek(line.time);

    requestAnimationFrame(() => {
      scrollToLine(index);
    });
  }

  if (!lyrics.length) {
    return (
      <div
        className="
          aurora-glass
          flex
          h-80
          items-center
          justify-center
          rounded-3xl
          text-zinc-400
        "
      >
        No lyrics found
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="
        aurora-glass
        h-96
        overflow-y-auto
        rounded-3xl
        p-6
        scroll-smooth
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          gap-5
        "
      >
        {lyrics.map((line, index) => (
          <motion.button
            key={`${line.time}-${index}`}
            ref={(el) => {
              lineRefs.current[index] = el;
            }}
            onClick={() => handleClick(line, index)}
            animate={{
              scale: activeIndex === index ? 1.08 : 1,
              opacity: activeIndex === index ? 1 : 0.45,
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
            }}
            className="
              text-center
              text-lg
              font-medium
              transition
            "
          >
            {line.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
