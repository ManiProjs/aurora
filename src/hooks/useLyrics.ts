import { useEffect, useState } from "react";

import { getLyrics } from "../api/lyrics";

import { NavidromeClient } from "../api/navidrome";

export function useLyrics(client: NavidromeClient, songId?: string) {
  const [lyrics, setLyrics] = useState([]);

  useEffect(() => {
    if (!songId) {
      setLyrics([]);
      return;
    }

    // cast client to string to satisfy getLyrics parameter type
    getLyrics(client as unknown as string, songId).then(setLyrics);
  }, [songId]);

  return lyrics;
}
