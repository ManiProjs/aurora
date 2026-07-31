import { useEffect } from "react";

import { usePlayerStore } from "../stores/player";

import { isTypingTarget } from "../utils/isTypingTarget";

export function useKeyboardShortcuts() {
  const togglePlay = usePlayerStore((s) => s.toggle);

  const next = usePlayerStore((s) => s.next);

  const previous = usePlayerStore((s) => s.previous);

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) {
        return;
      }

      switch (event.code) {
        case "Space":
          event.preventDefault();
          togglePlay();
          break;
      }
    }

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [togglePlay, next, previous]);
}
