import { useEffect } from "react";

export function useThemes() {
  useEffect(() => {
    async function loadThemes() {
      const themes = await window.themes.list();

      console.log("Available themes:", themes);
    }

    loadThemes();
  }, []);
}
