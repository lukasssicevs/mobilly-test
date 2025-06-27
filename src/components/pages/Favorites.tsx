"use client";

import { Button } from "@heroui/react";
import { SpotifyItem } from "@/types";
import { useFavoritesStore } from "@/store";
import { TrashIcon } from "../common/icons/TrashIcon";
import { ItemCard } from "../common/ItemCard";

export function Favorites() {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();

  const handleFavoriteToggle = (item: SpotifyItem) => {
    // Since this is the favorites page, we only remove items
    removeFavorite(item.id);
  };

  if (favorites.length === 0) {
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-400">
            Search for music and add tracks, albums, or artists to your
            favorites to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          My Favorites ({favorites.length})
        </h2>
        <Button
          color="danger"
          variant="bordered"
          startContent={<TrashIcon />}
          onPress={clearFavorites}
          className="cursor-pointer flex px-4 py-2 rounded-full border-red-500 text-red-400 hover:bg-red-500/40 bg-red-500/20 hover:border-red-400 transition-colors"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            isFavorite={true} // Always true in favorites
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
}
