"use client";

import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Button,
  Chip,
  Divider,
} from "@heroui/react";
import { useFavoritesStore, SpotifyItem } from "@/store/favorites";
import { PlaceholderImage } from "./placeholder-image";

interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    images?: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  artists: Array<{
    id: string;
    name: string;
  }>;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  artists: Array<{
    id: string;
    name: string;
  }>;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyArtist {
  id: string;
  name: string;
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  external_urls: {
    spotify: string;
  };
}

interface SearchResultsProps {
  results: {
    tracks?: { items: SpotifyTrack[]; total: number };
    albums?: { items: SpotifyAlbum[]; total: number };
    artists?: { items: SpotifyArtist[]; total: number };
  };
  isLoading?: boolean;
}

const HeartIconComponent = () => (
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
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const handleToggleFavorite = (item: SpotifyItem) => {
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const renderTrack = (track: SpotifyTrack) => {
    const spotifyItem: SpotifyItem = {
      id: track.id,
      name: track.name,
      type: "track",
      images: track.album?.images,
      artists: track.artists,
      album: track.album,
      external_urls: track.external_urls,
    };

    return (
      <Card
        key={track.id}
        className="w-full max-w-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-default"
      >
        <CardBody className="p-0">
          {track.album?.images?.[0]?.url ? (
            <Image
              alt={track.name}
              className="w-full object-cover h-48"
              src={track.album.images[0].url}
            />
          ) : (
            <PlaceholderImage type="album" className="h-48" />
          )}
        </CardBody>
        <CardFooter className="flex flex-col items-start gap-2">
          <div className="flex justify-between items-start w-full">
            <div className="flex-1">
              <h4 className="font-semibold text-sm truncate">{track.name}</h4>
              <p className="text-xs text-default-500 truncate">
                {track.artists?.map((artist) => artist.name).join(", ")}
              </p>
              <p className="text-xs text-default-400 truncate">
                {track.album?.name}
              </p>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => handleToggleFavorite(spotifyItem)}
              className={`cursor-pointer hover:scale-110 transition-transform ${
                isFavorite(track.id)
                  ? "text-red-500 hover:text-red-600"
                  : "text-default-400 hover:text-red-400"
              }`}
            >
              {isFavorite(track.id) ? (
                <HeartIconFilled />
              ) : (
                <HeartIconComponent />
              )}
            </Button>
          </div>
          <Chip size="sm" variant="flat" color="primary">
            Track
          </Chip>
        </CardFooter>
      </Card>
    );
  };

  const renderAlbum = (album: SpotifyAlbum) => {
    const spotifyItem: SpotifyItem = {
      id: album.id,
      name: album.name,
      type: "album",
      images: album.images,
      artists: album.artists,
      external_urls: album.external_urls,
    };

    return (
      <Card
        key={album.id}
        className="w-full max-w-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-default"
      >
        <CardBody className="p-0">
          {album.images?.[0]?.url ? (
            <Image
              alt={album.name}
              className="w-full object-cover h-48"
              src={album.images[0].url}
            />
          ) : (
            <PlaceholderImage type="album" className="h-48" />
          )}
        </CardBody>
        <CardFooter className="flex flex-col items-start gap-2">
          <div className="flex justify-between items-start w-full">
            <div className="flex-1">
              <h4 className="font-semibold text-sm truncate">{album.name}</h4>
              <p className="text-xs text-default-500 truncate">
                {album.artists?.map((artist) => artist.name).join(", ")}
              </p>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => handleToggleFavorite(spotifyItem)}
              className={`cursor-pointer hover:scale-110 transition-transform ${
                isFavorite(album.id)
                  ? "text-red-500 hover:text-red-600"
                  : "text-default-400 hover:text-red-400"
              }`}
            >
              {isFavorite(album.id) ? (
                <HeartIconFilled />
              ) : (
                <HeartIconComponent />
              )}
            </Button>
          </div>
          <Chip size="sm" variant="flat" color="secondary">
            Album
          </Chip>
        </CardFooter>
      </Card>
    );
  };

  const renderArtist = (artist: SpotifyArtist) => {
    const spotifyItem: SpotifyItem = {
      id: artist.id,
      name: artist.name,
      type: "artist",
      images: artist.images,
      external_urls: artist.external_urls,
    };

    return (
      <Card
        key={artist.id}
        className="w-full max-w-sm hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-default"
      >
        <CardBody className="p-0">
          {artist.images?.[0]?.url ? (
            <Image
              alt={artist.name}
              className="w-full object-cover h-48"
              src={artist.images[0].url}
            />
          ) : (
            <PlaceholderImage type="artist" className="h-48" />
          )}
        </CardBody>
        <CardFooter className="flex flex-col items-start gap-2">
          <div className="flex justify-between items-start w-full">
            <div className="flex-1">
              <h4 className="font-semibold text-sm truncate">{artist.name}</h4>
            </div>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => handleToggleFavorite(spotifyItem)}
              className={`cursor-pointer hover:scale-110 transition-transform ${
                isFavorite(artist.id)
                  ? "text-red-500 hover:text-red-600"
                  : "text-default-400 hover:text-red-400"
              }`}
            >
              {isFavorite(artist.id) ? (
                <HeartIconFilled />
              ) : (
                <HeartIconComponent />
              )}
            </Button>
          </div>
          <Chip size="sm" variant="flat" color="success">
            Artist
          </Chip>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-default-500">Searching...</p>
        </div>
      </div>
    );
  }

  const hasResults =
    (results.tracks?.items?.length ?? 0) +
      (results.albums?.items?.length ?? 0) +
      (results.artists?.items?.length ?? 0) >
    0;

  if (!hasResults) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-default-500">
          No results found. Try searching for something else.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {results.tracks?.items && results.tracks.items.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Tracks ({results.tracks.total})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.tracks.items.map(renderTrack)}
          </div>
        </div>
      )}

      {results.albums?.items && results.albums.items.length > 0 && (
        <div>
          <Divider className="my-6" />
          <h3 className="text-lg font-semibold mb-4">
            Albums ({results.albums.total})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.albums.items.map(renderAlbum)}
          </div>
        </div>
      )}

      {results.artists?.items && results.artists.items.length > 0 && (
        <div>
          <Divider className="my-6" />
          <h3 className="text-lg font-semibold mb-4">
            Artists ({results.artists.total})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.artists.items.map(renderArtist)}
          </div>
        </div>
      )}
    </div>
  );
}
