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

    getLyrics(client, songId).then(setLyrics);
  }, [songId]);

  return lyrics;
}
