"use client";

import { Card, CardBody, CardFooter, Image, Button, Chip } from "@heroui/react";
import { useFavoritesStore, SpotifyItem } from "@/store/favorites";
import { PlaceholderImage } from "./placeholder-image";

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

const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export function Favorites() {
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore();

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
  };

  const handleClearAll = () => {
    clearFavorites();
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

  if (favorites.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center">
            <HeartIconFilled />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-400">
            Start searching and add some items to your favorites!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">
          Your Favorites ({favorites.length})
        </h2>
        <Button
          color="danger"
          variant="flat"
          size="sm"
          onPress={handleClearAll}
          startContent={<TrashIcon />}
          className="cursor-pointer hover:scale-105 transition-transform flex bg-red-500 rounded-2xl p-4"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((item) => (
          <Card
            key={item.id}
            className="w-full cursor-default border border-gray-700 bg-gray-800 hover:bg-gray-750 rounded-xl overflow-hidden group card-hover"
          >
            <CardBody className="p-0">
              {getImageUrl(item) ? (
                <div className="w-full h-48 bg-gray-900 image-container">
                  <Image
                    alt={item.name}
                    className="w-full h-full object-cover image-zoom"
                    src={getImageUrl(item)!}
                  />
                </div>
              ) : (
                <div className="w-full h-48 image-container">
                  <PlaceholderImage
                    type={getPlaceholderType(item)}
                    className="h-48 w-full image-zoom"
                  />
                </div>
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
                  color="danger"
                  onPress={() => handleRemoveFavorite(item.id)}
                  className="cursor-pointer flex-shrink-0 heart-button flex items-center justify-center rounded-full"
                >
                  <HeartIconFilled />
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
