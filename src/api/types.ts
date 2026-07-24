export interface Artist {
  id: string;
  name: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  coverArt?: string;
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
