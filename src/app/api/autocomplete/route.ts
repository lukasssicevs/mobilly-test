import { NextRequest, NextResponse } from "next/server";
import { spotifyService } from "@/services/spotify";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "track";
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const results = await spotifyService.searchAutocomplete(query, type, limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Autocomplete error:", error);
    return NextResponse.json(
      { error: "Failed to get autocomplete suggestions" },
      { status: 500 }
    );
  }
}
