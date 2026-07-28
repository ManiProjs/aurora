import { useEffect } from "react";

import { useSettingsStore } from "../stores/settings";

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("theme-aurora", "theme-dark", "theme-amoled");

    root.classList.add(`theme-${theme}`);
  }, [theme]);
}
