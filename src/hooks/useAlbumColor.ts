import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

export function useAlbumColor(image?: string | null) {
  const [color, setColor] = useState("rgb(24,24,27)");

  useEffect(() => {
    if (!image) return;

    const fac = new FastAverageColor();

    fac
      .getColorAsync(image)
      .then((result) => {
        setColor(result.rgb);
      })
      .catch(() => {
        console.error("Failed to get average color for album artwork");
      });
  }, [image]);

  return color;
}
