"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
  };

  const handleClearAll = () => {
    clearFavorites();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "track":
        return "primary";
      case "album":
        return "secondary";
      case "artist":
        return "success";
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
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <HeartIconFilled />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No favorites yet
          </h3>
          <p className="text-default-500">
            Start searching and add some items to your favorites!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Your Favorites ({favorites.length})
          </h2>
          <Button
            color="danger"
            variant="flat"
            size="sm"
            onPress={onOpen}
            startContent={<TrashIcon />}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((item) => (
            <Card
              key={item.id}
              className="w-full max-w-sm hover:shadow-lg transition-shadow cursor-default"
            >
              <CardBody className="p-0">
                {getImageUrl(item) ? (
                  <Image
                    alt={item.name}
                    className="w-full object-cover h-48"
                    src={getImageUrl(item)!}
                  />
                ) : (
                  <PlaceholderImage
                    type={getPlaceholderType(item)}
                    className="h-48"
                  />
                )}
              </CardBody>
              <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex justify-between items-start w-full">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm truncate">
                      {item.name}
                    </h4>
                    {getArtistNames(item) && (
                      <p className="text-xs text-default-500 truncate">
                        {getArtistNames(item)}
                      </p>
                    )}
                    {getAlbumName(item) && (
                      <p className="text-xs text-default-400 truncate">
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
                    className="cursor-pointer hover:scale-110 transition-transform"
                  >
                    <HeartIconFilled />
                  </Button>
                </div>
                <Chip size="sm" variant="flat" color={getTypeColor(item.type)}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Chip>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        size="md"
        scrollBehavior="inside"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "border border-gray-200 dark:border-gray-700",
          header: "border-b border-gray-200 dark:border-gray-700",
          footer: "border-t border-gray-200 dark:border-gray-700",
          body: "py-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Clear All Favorites</h3>
                <p className="text-sm text-default-500">
                  This action cannot be undone
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-3 p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg border border-danger-200 dark:border-danger-800">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-danger-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-danger-800 dark:text-danger-200">
                      Are you sure you want to remove all {favorites.length}{" "}
                      favorites?
                    </p>
                    <p className="text-xs text-danger-600 dark:text-danger-300 mt-1">
                      This will permanently delete all your saved tracks,
                      albums, and artists.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    handleClearAll();
                    onClose();
                  }}
                  className="cursor-pointer"
                >
                  Clear All Favorites
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
