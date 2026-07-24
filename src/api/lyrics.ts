export interface LyricLine {
  time: number;
  text: string;
}

export async function getLyrics(
  artist: string,
  title: string,
  album?: string,
): Promise<LyricLine[]> {
  try {
    const params = new URLSearchParams({
      artist_name: artist,
      track_name: title,
    });

    if (album) {
      params.set("album_name", album);
    }

    const response = await fetch(
      `https://lrclib.net/api/get?${params.toString()}`,
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    const syncedLyrics = data.syncedLyrics;

    if (!syncedLyrics) {
      return [];
    }

    return parseLRC(syncedLyrics);
  } catch (error) {
    console.error("Lyrics fetch failed:", error);
    return [];
  }
}

function parseLRC(lrc: string): LyricLine[] {
  return lrc
    .split("\n")
    .map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);

      if (!match) {
        return null;
      }

      const minutes = Number(match[1]);
      const seconds = Number(match[2]);

      return {
        time: minutes * 60 + seconds,
        text: match[3].trim(),
      };
    })
    .filter((line): line is LyricLine => Boolean(line && line.text));
}
