import { NextRequest, NextResponse } from "next/server";
import { spotifyService } from "@/services/spotify";

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

    const results = await spotifyService.search({
      query,
      types,
      limit,
      autocomplete,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search Spotify" },
      { status: 500 }
    );
  }
}
