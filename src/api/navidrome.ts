import axios from "axios";
import type { Album, Song, Artist } from "./types";

interface SubsonicResponse<T> {
  status: string;
  version: string;
  type: string;
  error?: {
    code: number;
    message: string;
  };
  [key: string]: unknown;
}

interface SearchResult3 {
  song?: Song[];
  album?: Album[];
  artist?: {
    id: string;
    name: string;
    albumCount?: number;
  }[];
}

export class NavidromeClient {
  constructor(
    private baseUrl: string,
    private username: string,
    private password: string,
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    const url = `${this.baseUrl}/rest/${endpoint}`;

    try {
      const { data } = await axios.get<{
        "subsonic-response": SubsonicResponse<T>;
      }>(url, {
        params: {
          u: this.username,
          p: this.password,
          v: "1.16.1",
          c: "Aurora",
          f: "json",
          ...params,
        },
      });

      const response = data["subsonic-response"];

      if (response.status !== "ok") {
        throw new Error(response.error?.message ?? "Unknown Navidrome error");
      }

      return response as T;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Navidrome request failed:", {
          url,
          params,
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error(error);
      }

      throw error;
    }
  }

  async ping() {
    return this.request("ping");
  }

  async getAlbums(): Promise<Album[]> {
    const response = await this.request<{
      albumList2: {
        album: Album[];
      };
    }>("getAlbumList2", {
      type: "newest",
      size: "50",
    });

    return response.albumList2.album;
  }

  async getAlbum(id: string): Promise<Song[]> {
    const response = await this.request<{
      album: {
        song: Song[];
      };
    }>("getAlbum", {
      id,
    });

    return response.album.song ?? [];
  }

  async search(query: string) {
    const response = await this.request<{
      searchResult3: {
        song?: Song[];
        album?: Album[];
        artist?: {
          id: string;
          name: string;
          albumCount?: number;
        }[];
      };
    }>("search3", {
      query,
      songCount: "10",
      albumCount: "10",
      artistCount: "10",
    });

    return response.searchResult3;
  }

  getCoverArtUrl(id: string): string {
    return (
      `${this.baseUrl}/rest/getCoverArt` +
      `?id=${id}` +
      `&u=${this.username}` +
      `&p=${this.password}`
    );
  }

  async getArtists(): Promise<Artist[]> {
    const response = await this.request<{
      artists: {
        index: {
          artist: Artist[];
        }[];
      };
    }>("getArtists");

    return response.artists.index.flatMap((item) => item.artist);
  }

  async getArtist(id: string) {
    const response = await this.request<{
      artist: {
        id: string;
        name: string;
        album?: Album[];
      };
    }>("getArtist", {
      id,
    });

    return response.artist;
  }

  async getArtistSongs(id: string): Promise<Song[]> {
    const response = await this.request<{
      songsByArtist: {
        song: Song[];
      };
    }>("getSongsByArtist", {
      id,
    });

    return response.songsByArtist.song ?? [];
  }

  async getSongsByArtist(artistName: string): Promise<Song[]> {
    const response = await this.request<{
      searchResult3: {
        song?: Song[];
      };
    }>("search3", {
      query: `artist:${artistName}`,
      songCount: "500",
      albumCount: "0",
      artistCount: "0",
    });

    return response.searchResult3.song ?? [];
  }

  async getArtistImage(artistId: string): Promise<string | null> {
    const response = await this.request<{
      artist: {
        id: string;
        coverArt?: string;
      };
    }>("getArtist", {
      id: artistId,
    });

    if (!response.artist.coverArt) {
      return null;
    }

    return this.getCoverArtUrl(response.artist.coverArt);
  }
}
