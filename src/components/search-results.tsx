"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
  Spinner,
} from "@heroui/react";
import { useFavoritesStore, SpotifyItem } from "@/store/favorites";
import { PlaceholderImage } from "./placeholder-image";

interface SearchResultsProps {
  results: {
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
  };
  isLoading: boolean;
}

const HeartIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const HeartIconFilled = () => (
  <svg
    className="w-4 h-4"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.id === id);
  };

  const handleFavoriteToggle = (item: SpotifyItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "track":
        return "success";
      case "album":
        return "default";
      case "artist":
        return "default";
      default:
        return "default";
    }
  };

  const getImageUrl = (item: SpotifyItem) => {
    if (item.images && item.images.length > 0) {
      return item.images[0].url;
    }
    if (
      item.type === "track" &&
      item.album?.images &&
      item.album.images.length > 0
    ) {
      return item.album.images[0].url;
    }
    return null;
  };

  const getPlaceholderType = (item: SpotifyItem) => {
    if (item.type === "artist") return "artist";
    return "album";
  };

  const getArtistNames = (item: SpotifyItem) => {
    if (item.artists) {
      return item.artists.map((artist) => artist.name).join(", ");
    }
    return "";
  };

  const getAlbumName = (item: SpotifyItem) => {
    if (item.type === "track" && item.album) {
      return item.album.name;
    }
    return "";
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

  const allItems = [
    ...(results.tracks?.items || []),
    ...(results.albums?.items || []),
    ...(results.artists?.items || []),
  ];

  if (allItems.length === 0) {
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
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          Search Results ({allItems.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allItems.map((item) => (
          <Card
            key={item.id}
            className="w-full hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-default border border-gray-700 bg-gray-800 hover:bg-gray-750 rounded-xl overflow-hidden group"
          >
            <CardBody className="p-0">
              {getImageUrl(item) ? (
                <div className="w-full h-48 overflow-hidden bg-gray-900">
                  <Image
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    src={getImageUrl(item)!}
                  />
                </div>
              ) : (
                <PlaceholderImage
                  type={getPlaceholderType(item)}
                  className="h-48 w-full transition-transform duration-300 group-hover:scale-110"
                />
              )}
            </CardBody>
            <CardFooter className="flex flex-col items-start gap-3 p-4">
              <div className="flex justify-between items-start w-full gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base truncate text-white mb-1">
                    {item.name}
                  </h4>
                  {getArtistNames(item) && (
                    <p className="text-sm text-gray-300 truncate mb-1">
                      {getArtistNames(item)}
                    </p>
                  )}
                  {getAlbumName(item) && (
                    <p className="text-xs text-gray-400 truncate">
                      {getAlbumName(item)}
                    </p>
                  )}
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color={isFavorite(item.id) ? "danger" : "default"}
                  onPress={() => handleFavoriteToggle(item)}
                  className="cursor-pointer hover:scale-110 transition-transform flex-shrink-0"
                >
                  {isFavorite(item.id) ? <HeartIconFilled /> : <HeartIcon />}
                </Button>
              </div>
              <Chip
                size="sm"
                variant="flat"
                color={getTypeColor(item.type)}
                className="self-start"
              >
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Chip>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
