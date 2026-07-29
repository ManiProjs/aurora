import { useEffect } from "react";

import { useSettingsStore } from "../stores/settings";

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);

  const customCSS = useSettingsStore((s) => s.customCSS);

  useEffect(() => {
    async function applyTheme() {
      document.documentElement.className = `theme-${theme}`;

      let css = customCSS;

      if (!["aurora", "light-aurora", "dark", "amoled"].includes(theme)) {
        try {
          const themeCSS = await window.themes.load(theme);

          css = `${themeCSS}\n${css}`;
        } catch (error) {
          console.error("Failed loading theme:", error);
        }
      }

      let style = document.getElementById("aurora-custom-css");

      if (!style) {
        style = document.createElement("style");

        style.id = "aurora-custom-css";

        document.head.appendChild(style);
      }

      style.textContent = css;
    }

    applyTheme();
  }, [theme, customCSS]);
}
