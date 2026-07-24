import axios from "axios";
import type { Album, Song } from "./types";

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

  async search(query: string): Promise<SearchResult3> {
    const response = await this.request<{
      searchResult3: SearchResult3;
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
}
