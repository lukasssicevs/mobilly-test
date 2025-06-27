"use client";

import { useState, useCallback } from "react";
import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import useSWR from "swr";
import { SpotifyItem } from "@/types";
import { getArtistNames, capitalize } from "@/utils";
import { useFavoritesStore } from "@/store";
import { SearchIcon } from "../common/icons/SearchIcon";
import { MusicIcon } from "../common/icons/MusicIcon";
import { HeartIcon } from "../common/icons/HeartIcon";
import { HeartIconFilled } from "../common/icons/HeartIconFilled";
import { LoadingSpinner } from "../common/icons/LoadingSpinner";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
          // Use setTimeout to ensure the value is set properly
          setTimeout(() => {
            setSelectedQuery(selected.name);
            onSearch(selected.name);
          }, 10);
        }
      }
    },
    [autocompleteData, onSearch]
  );

  const handleFavoriteClick = useCallback(
    (item: SpotifyItem, e: React.MouseEvent) => {
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
        <div className="flex gap-3 items-center w-full flex-col md:flex-row">
          {/* Autocomplete Container */}
          <div className="w-full md:flex-1 bg-gray-900 rounded-2xl shadow-xl border border-gray-700 hover:border-gray-600 transition-colors duration-200">
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
                <AutocompleteItem
                  key={item.id}
                  textValue={item.name}
                  className="focus:outline-none"
                >
                  <div className="flex items-center gap-3 w-full">
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
                          by {getArtistNames(item)}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                        {capitalize(item.type)}
                      </div>
                      <div
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleFavoriteClick(item, e);
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="text-gray-400 hover:text-red-400 p-1 rounded-md hover:bg-gray-700 cursor-pointer select-none heart-button"
                        role="button"
                        tabIndex={0}
                      >
                        {isFavorite(item.id) ? (
                          <HeartIconFilled />
                        ) : (
                          <HeartIcon />
                        )}
                      </div>
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
            className="px-8 flex w-full md:w-40 font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-200 h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-xl hover:shadow-2xl text-white border-0 disabled:bg-gray-700 disabled:from-gray-700 disabled:to-gray-700 rounded-2xl"
          >
            {isLoading ? <LoadingSpinner /> : "Search"}
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
