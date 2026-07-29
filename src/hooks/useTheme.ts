import { useEffect } from "react";

import { useSettingsStore } from "../stores/settings";

const builtInThemes = {
  aurora: "theme-aurora",
  "light-aurora": "theme-light",
  dark: "theme-dark",
  amoled: "theme-amoled",
};

export function useTheme() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;

    /*
      Remove previous built-in theme classes
    */

    Object.values(builtInThemes).forEach((className) => {
      root.classList.remove(className);
    });

    /*
      Remove previously loaded external theme
    */

    const oldTheme = document.getElementById("aurora-theme");

    if (oldTheme) {
      oldTheme.remove();
    }

    /*
      Built-in themes
    */

    const builtInClass = builtInThemes[theme as keyof typeof builtInThemes];

    if (builtInClass) {
      root.classList.add(builtInClass);

      return;
    }

    /*
      External themes
    */

    async function loadExternalTheme() {
      try {
        const css = await window.themes.load(`${theme}.css`);

        const style = document.createElement("style");

        style.id = "aurora-theme";

        style.textContent = css;

        document.head.appendChild(style);
      } catch (error) {
        console.error("Failed loading external theme:", error);
      }
    }

    loadExternalTheme();
  }, [theme]);
}
