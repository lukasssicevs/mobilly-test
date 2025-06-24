"use client";

import { useState, useCallback } from "react";
import { Autocomplete, AutocompleteItem, Button, Spinner } from "@heroui/react";
import useSWR from "swr";
import { useFavoritesStore, SpotifyItem } from "@/store/favorites";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SearchIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const MusicIcon = () => (
  <svg
    className="w-4 h-4 text-green-400"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

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
    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
  </svg>
);

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [selectedQuery, setSelectedQuery] = useState("");
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const { data: autocompleteData, error } = useSWR(
    selectedQuery.length > 2
      ? `/api/autocomplete?q=${encodeURIComponent(
          selectedQuery
        )}&type=track&limit=10`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleSearch = useCallback(() => {
    if (selectedQuery.trim()) {
      onSearch(selectedQuery.trim());
    }
  }, [selectedQuery, onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleSelectionChange = useCallback(
    (key: React.Key | null) => {
      if (key && autocompleteData) {
        const selected = autocompleteData.find(
          (item: SpotifyItem) => item.id === key
        );
        if (selected) {
          setSelectedQuery(selected.name);
          // Automatically trigger search when item is selected from popover
          onSearch(selected.name);
        }
      }
    },
    [autocompleteData, onSearch]
  );

  const handlePointerDownFavorite = useCallback(
    (item: SpotifyItem, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isFavorite(item.id)) {
        removeFavorite(item.id);
      } else {
        addFavorite(item);
      }
    },
    [addFavorite, removeFavorite, isFavorite]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex gap-2 flex-col justify-center items-center w-full">
        <div className="flex gap-3 items-center w-full">
          {/* Autocomplete Container */}
          <div className="flex-1 bg-gray-900 rounded-2xl shadow-xl border border-gray-700 hover:border-gray-600 transition-colors duration-200">
            <Autocomplete
              isClearable={true}
              allowsCustomValue
              placeholder="Search for tracks, albums, or artists..."
              value={selectedQuery}
              onValueChange={setSelectedQuery}
              onSelectionChange={handleSelectionChange}
              onKeyDown={handleKeyDown}
              isLoading={
                selectedQuery.length > 2 && !autocompleteData && !error
              }
              items={autocompleteData || []}
              startContent={<SearchIcon />}
              size="lg"
              variant="flat"
              radius="lg"
              classNames={{
                base: "w-full",
                listboxWrapper: "max-h-[400px] overflow-y-auto scrollbar-hide",
                selectorButton:
                  "text-gray-400 cursor-pointer hover:text-green-500 transition-colors relative z-40",
                listbox: "p-2",
                clearButton:
                  "pointer-events-auto cursor-pointer text-gray-400 hover:text-red-400 transition-colors",
              }}
              inputProps={{
                classNames: {
                  input:
                    "text-base placeholder:text-gray-400 cursor-text outline-none text-white",
                  innerWrapper: "flex gap-3 items-center h-full relative",
                  inputWrapper:
                    "!bg-transparent shadow-none border-none h-14 px-4",
                },
              }}
              popoverProps={{
                classNames: {
                  base: "before:bg-gray-900",
                  content:
                    "p-0 border border-gray-700 bg-gray-900 shadow-xl rounded-xl backdrop-blur-xl max-h-[400px]",
                },
                motionProps: {
                  variants: {
                    enter: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        opacity: { duration: 0.15 },
                        y: { duration: 0.15 },
                      },
                    },
                    exit: {
                      y: -4,
                      opacity: 0,
                      transition: {
                        opacity: { duration: 0.1 },
                        y: { duration: 0.1 },
                      },
                    },
                  },
                },
              }}
              listboxProps={{
                itemClasses: {
                  base: [
                    "rounded-lg overflow-hidden",
                    "px-3 py-3",
                    "transition-all duration-150",
                    "cursor-pointer",
                    "hover:bg-gray-800",
                    "data-[hover=true]:bg-gray-800",
                    "data-[pressed=true]:scale-95",
                    "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-green-500",
                    "group",
                  ],
                },
              }}
            >
              {(item: SpotifyItem) => (
                <AutocompleteItem key={item.id} textValue={item.name}>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-800 to-green-700 rounded-lg flex items-center justify-center">
                        <MusicIcon />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">
                        {item.name}
                      </div>
                      {item.artists && (
                        <div className="text-sm text-gray-400 truncate">
                          by{" "}
                          {item.artists.map((artist) => artist.name).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                        Track
                      </div>
                      <button
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePointerDownFavorite(item, e);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-gray-700 relative z-50"
                        type="button"
                      >
                        {isFavorite(item.id) ? (
                          <HeartIconFilled />
                        ) : (
                          <HeartIcon />
                        )}
                      </button>
                    </div>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>

          {/* Search Button */}
          <Button
            onPress={handleSearch}
            disabled={!selectedQuery.trim()}
            size="lg"
            radius="lg"
            className="px-8 flex w-40 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-200 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl text-white border-0 disabled:bg-gray-700 disabled:from-gray-700 disabled:to-gray-700 rounded-2xl"
          >
            {isLoading ? (
              <Spinner variant="simple" color="success" />
            ) : (
              "Search"
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center">
          Try searching for artists like &quot;Taylor Swift&quot; or songs like
          &quot;Bohemian Rhapsody&quot;
        </p>
      </div>
    </div>
  );
}
