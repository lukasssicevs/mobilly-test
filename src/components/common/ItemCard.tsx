"use client";

import { Card, CardBody, CardFooter, Image, Button, Chip } from "@heroui/react";
import { SpotifyItem } from "@/types";
import {
  getImageUrl,
  getArtistNames,
  getAlbumName,
  getPlaceholderType,
  getTypeColor,
  capitalize,
} from "@/utils";
import { HeartIcon, HeartIconFilled } from "./icons";
import { PlaceholderImage } from "./PlaceholderImage";

interface ItemCardProps {
  item: SpotifyItem;
  isFavorite: boolean;
  onFavoriteToggle: (item: SpotifyItem) => void;
}

export const ItemCard = ({
  item,
  isFavorite,
  onFavoriteToggle,
}: ItemCardProps) => {
  return (
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
              className="image-zoom"
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
            color={isFavorite ? "danger" : "default"}
            onPress={() => onFavoriteToggle(item)}
            className="cursor-pointer flex-shrink-0 heart-button flex items-center justify-center rounded-full"
          >
            {isFavorite ? <HeartIconFilled /> : <HeartIcon />}
          </Button>
        </div>
        <Chip
          size="sm"
          variant="flat"
          color={getTypeColor(item.type)}
          className="self-start"
        >
          {capitalize(item.type)}
        </Chip>
      </CardFooter>
    </Card>
  );
};
