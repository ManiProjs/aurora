const LASTFM_URL = "https://ws.audioscrobbler.com/2.0/";

const API_KEY = "YOUR_LASTFM_API_KEY";

const cache = new Map<string, string | null>();

export async function getArtistImage(
  artistName: string,
): Promise<string | null> {
  const key = artistName.toLowerCase();

  if (cache.has(key)) {
    return cache.get(key) ?? null;
  }

  try {
    const params = new URLSearchParams({
      method: "artist.getinfo",
      artist: artistName,
      api_key: API_KEY,
      format: "json",
    });

    const response = await fetch(`${LASTFM_URL}?${params}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const image =
      data.artist?.image?.find((img: any) => img.size === "large")?.["#text"] ??
      null;

    cache.set(key, image);

    return image;
  } catch (error) {
    console.error("Last.fm error:", error);

    return null;
  }
}
