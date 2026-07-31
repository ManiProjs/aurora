import { FastAverageColor } from "fast-average-color";

const fac = new FastAverageColor();

export async function getArtworkColor(src: string) {
  try {
    const result = await fac.getColorAsync(src);

    return {
      hex: result.hex,
      rgba: result.rgba,
    };
  } catch (error) {
    console.error("Failed extracting artwork color:", error);

    return {
      hex: "#09090b",
      rgba: "rgba(9,9,11,1)",
    };
  }
}
