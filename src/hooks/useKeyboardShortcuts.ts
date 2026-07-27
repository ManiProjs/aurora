import { useEffect } from "react";

import { usePlayerStore } from "../stores/player";

export function useKeyboardShortcuts() {
  const togglePlay = usePlayerStore((s) => s.toggle);

  const next = usePlayerStore((s) => s.next);

  const previous = usePlayerStore((s) => s.previous);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      // Don't hijack typing
      const target = event.target as HTMLElement;

      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      switch (event.code) {
        case "Space":
          event.preventDefault();
          togglePlay();
          break;

        case "ArrowRight":
          next();
          break;

        case "ArrowLeft":
          previous();
          break;
      }
    }

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [togglePlay, next, previous]);
}
