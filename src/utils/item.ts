import { SpotifyItem, ContentType, TYPE_COLORS } from "../types";

// Spotify item utilities
export const getImageUrl = (item: SpotifyItem): string | null => {
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

export const getArtistNames = (item: SpotifyItem): string => {
  if (item.artists) {
    return item.artists.map((artist) => artist.name).join(", ");
  }
  return "";
};

export const getAlbumName = (item: SpotifyItem): string => {
  if (item.type === "track" && item.album) {
    return item.album.name;
  }
  return "";
};

export const getPlaceholderType = (item: SpotifyItem): ContentType => {
  return item.type;
};

export const getTypeColor = (type: ContentType) => {
  return TYPE_COLORS[type];
};
