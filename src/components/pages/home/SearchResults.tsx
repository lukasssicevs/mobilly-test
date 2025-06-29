"use client";

import { Spinner } from "@heroui/react";
import { SpotifyItem } from "@/types";
import { useFavoritesStore } from "@/store";
import { ItemCard } from "../../common/ItemCard";
import { ItemSection } from "../../common/ItemSection";

interface SearchResultsProps {
  results: {
    [key in "tracks" | "albums" | "artists"]?: {
      items: SpotifyItem[];
      total: number;
    };
  };
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const handleFavoriteToggle = (item: SpotifyItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <Spinner size="lg" color="success" />
          <p className="mt-4 text-gray-400">Searching Spotify...</p>
        </div>
      </div>
    );
  }

  const tracks = results.tracks?.items || [];
  const albums = results.albums?.items || [];
  const artists = results.artists?.items || [];
  const totalItems = tracks.length + albums.length + artists.length;

  if (totalItems === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No results found
          </h3>
          <p className="text-gray-400">
            Try adjusting your search terms or check the spelling
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          Search Results ({totalItems})
        </h2>
      </div>

      <div className="space-y-10">
        <ItemSection title="tracks" items={tracks} type="track">
          {(item) => (
            <ItemCard
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
        </ItemSection>

        <ItemSection title="albums" items={albums} type="album">
          {(item) => (
            <ItemCard
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
        </ItemSection>

        <ItemSection title="artists" items={artists} type="artist">
          {(item) => (
            <ItemCard
              key={item.id}
              item={item}
              isFavorite={isFavorite(item.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          )}
        </ItemSection>
      </div>
    </div>
  );
}
