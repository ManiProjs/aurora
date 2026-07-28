import { useEffect } from "react";

import { usePlayerStore } from "../stores/player";

export function useMediaKeys() {
  const toggle = usePlayerStore((s) => s.toggle);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        toggle();
      }

      if (e.metaKey && e.key === "ArrowRight") {
        next();
      }

      if (e.metaKey && e.key === "ArrowLeft") {
        previous();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [toggle, next, previous]);
}
