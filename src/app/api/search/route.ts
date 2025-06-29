import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { SpotifyItem } from "@/types";

// Token cache (simple module-level caching)
let accessToken: string | null = null;
let tokenExpiry: number = 0;

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function getSpotifyToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
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

  accessToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;

  return accessToken;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const types = searchParams.get("types")?.split(",") || [
      "track",
      "album",
      "artist",
    ];
    const limit = parseInt(searchParams.get("limit") || "20");
    const autocomplete = searchParams.get("autocomplete") === "true";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const token = await getSpotifyToken();

    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      params: {
        q: query,
        type: types.join(","),
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // For autocomplete, return flattened array of items
    if (autocomplete) {
      const items: SpotifyItem[] = [];

      if (response.data.tracks?.items) {
        items.push(...response.data.tracks.items);
      }
      if (response.data.albums?.items) {
        items.push(...response.data.albums.items);
      }
      if (response.data.artists?.items) {
        items.push(...response.data.artists.items);
      }

      return NextResponse.json(items);
    }

    // For regular search, return full response
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search Spotify" },
      { status: 500 }
    );
  }
}
