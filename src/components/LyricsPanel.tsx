import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import type { LyricLine } from "../api/lyrics";

interface Props {
  lyrics: LyricLine[];
  progress: number;
}

export default function LyricsPanel({ lyrics, progress }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);

  const currentIndex = lyrics.findIndex(
    (line, index) =>
      progress >= line.time && progress < (lyrics[index + 1]?.time ?? Infinity),
  );

  useEffect(() => {
    if (
      currentIndex < 0 ||
      !containerRef.current ||
      !lineRefs.current[currentIndex]
    ) {
      return;
    }

    const container = containerRef.current;
    const line = lineRefs.current[currentIndex];

    const offset =
      line.offsetTop - container.clientHeight / 2 + line.clientHeight / 2;

    container.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  }, [currentIndex]);

  return (
    <div
      className="
        aurora-glass
        flex
        h-96
        flex-col
        rounded-3xl
        p-6
      "
    >
      <h2
        className="
          mb-4
          text-lg
          font-bold
        "
      >
        Lyrics
      </h2>

      <div
        ref={containerRef}
        className="
          flex-1
          overflow-y-auto
          pr-2
          aurora-scrollbar
        "
      >
        {lyrics.length === 0 ? (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              aurora-text-muted
            "
          >
            No lyrics available
          </div>
        ) : (
          <div
            className="
              space-y-6
              py-32
              text-center
            "
          >
            {lyrics.map((line, index) => (
              <div
                key={index}
                ref={(element) => {
                  lineRefs.current[index] = element;
                }}
              >
                <motion.p
                  animate={{
                    opacity: index === currentIndex ? 1 : 0.35,

                    scale: index === currentIndex ? 1.12 : 1,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="
                    cursor-default
                    text-base
                    font-medium
                  "
                >
                  {line.text}
                </motion.p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
