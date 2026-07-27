import { useEffect, useState } from "react";

export function useAlbumColors(image?: string | null) {
  const [colors, setColors] = useState(["#18181b", "#27272a", "#09090b"]);

  useEffect(() => {
    if (!image) return;

    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = 100;
      canvas.height = 100;

      ctx.drawImage(img, 0, 0, 100, 100);

      const data = ctx.getImageData(0, 0, 100, 100).data;

      const picked: string[] = [];

      for (let i = 0; i < data.length; i += 40) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const color = `rgb(${r},${g},${b})`;

        picked.push(color);
      }

      setColors([
        picked[0],
        picked[Math.floor(picked.length / 2)],
        picked[picked.length - 1],
      ]);
    };
  }, [image]);

  return colors;
}
