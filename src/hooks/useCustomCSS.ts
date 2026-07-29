import { useEffect } from "react";

import { useSettingsStore } from "../stores/settings";

export function useCustomCSS() {
  const customCSS = useSettingsStore((s) => s.customCSS);

  useEffect(() => {
    let style = document.getElementById(
      "aurora-custom-css",
    ) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement("style");

      style.id = "aurora-custom-css";

      document.head.appendChild(style);
    }

    style.textContent = customCSS;

    return () => {
      if (style) {
        style.textContent = "";
      }
    };
  }, [customCSS]);
}
