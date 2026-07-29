import { useEffect } from "react";

import { useSettingsStore } from "../stores/settings";

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove(
      "theme-aurora",
      "theme-light-aurora",
      "theme-dark",
      "theme-amoled",
      "dark",
    );

    root.classList.add(`theme-${theme}`);

    // Keep Tailwind dark mode working
    if (theme === "aurora" || theme === "dark" || theme === "amoled") {
      root.classList.add("dark");
    }

    return () => {
      root.classList.remove(`theme-${theme}`);
    };
  }, [theme]);
}
