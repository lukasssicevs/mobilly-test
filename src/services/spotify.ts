import axios from "axios";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  type: "track";
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images?: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  external_urls: {
    spotify: string;
  };
}

interface SpotifyAlbum {
  id: string;
  name: string;
  type: "album";
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  artists: Array<{
    id: string;
    name: string;
  }>;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyArtist {
  id: string;
  name: string;
  type: "artist";
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
}

interface SpotifySearchResponse {
  tracks?: {
    items: SpotifyTrack[];
    total: number;
  };
  albums?: {
    items: SpotifyAlbum[];
    total: number;
  };
  artists?: {
    items: SpotifyArtist[];
    total: number;
  };
}

class SpotifyService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Spotify credentials not configured");
    }

    const response = await axios.post<SpotifyTokenResponse>(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
        },
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

    return this.accessToken;
  }

  async search(
    query: string,
    types: string[] = ["track", "album", "artist"],
    limit: number = 20
  ): Promise<SpotifySearchResponse> {
    const token = await this.getAccessToken();

    const response = await axios.get<SpotifySearchResponse>(
      `https://api.spotify.com/v1/search`,
      {
        params: {
          q: query,
          type: types.join(","),
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  async searchAutocomplete(
    query: string,
    type: string = "track",
    limit: number = 5
  ): Promise<SpotifyTrack[] | SpotifyAlbum[] | SpotifyArtist[]> {
    const token = await this.getAccessToken();

    const response = await axios.get<SpotifySearchResponse>(
      `https://api.spotify.com/v1/search`,
      {
        params: {
          q: query,
          type,
          limit,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const items = response.data[`${type}s` as keyof SpotifySearchResponse] as
      | { items: SpotifyTrack[] | SpotifyAlbum[] | SpotifyArtist[] }
      | undefined;
    return items?.items || [];
  }
}

export const spotifyService = new SpotifyService();
