export interface Album {
  id: string;
  name: string;
  artist: string;
  coverArt?: string;
  year?: number;
  songCount?: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumId?: string;
  coverArt?: string;
  duration?: number;
}

export interface Artist {
  id: string;
  name: string;
  albumCount?: number;
  coverArt?: string;
  artistImageUrl?: string;
}
