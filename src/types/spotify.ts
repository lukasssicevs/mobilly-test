import { ContentType } from "./content";

export interface SpotifyItem {
  id: string;
  name: string;
  type: ContentType;
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  artists?: Array<{
    id: string;
    name: string;
  }>;
  album?: {
    id: string;
    name: string;
    images?: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  external_urls?: {
    spotify: string;
  };
}

export interface SearchResults {
  tracks?: {
    items: SpotifyItem[];
    total: number;
  };
  albums?: {
    items: SpotifyItem[];
    total: number;
  };
  artists?: {
    items: SpotifyItem[];
    total: number;
  };
}
