"use client";

import { useState, useCallback } from "react";
import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import useSWR from "swr";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

interface AutocompleteItem {
  id: string;
  name: string;
  type: string;
  artists?: Array<{ name: string }>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const SearchIcon = () => (
  <svg
    className="w-5 h-5 text-default-400"
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
    className="w-4 h-4 text-primary-500"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [selectedQuery, setSelectedQuery] = useState("");

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

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleSelectionChange = useCallback(
    (key: React.Key | null) => {
      if (key && autocompleteData) {
        const selected = autocompleteData.find(
          (item: AutocompleteItem) => item.id === key
        );
        if (selected) {
          setSelectedQuery(selected.name);
        }
      }
    },
    [autocompleteData]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="flex gap-4 p-2  rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
          <Autocomplete
            allowsCustomValue
            placeholder="Search for tracks, albums, or artists..."
            value={selectedQuery}
            onValueChange={setSelectedQuery}
            onSelectionChange={handleSelectionChange}
            onKeyPress={handleKeyPress}
            isLoading={selectedQuery.length > 2 && !autocompleteData && !error}
            items={autocompleteData || []}
            startContent={<SearchIcon />}
            size="lg"
            variant="flat"
            radius="lg"
            className="max-w-xs"
            classNames={{
              base: "!bg-transparent !shadow-none",
              listboxWrapper:
                "max-h-[400px] overflow-y-auto scrollbar-thin overflow-x-hidden",
              selectorButton:
                "text-default-400 cursor-pointer hover:text-primary-500 transition-colors right-2",
              listbox: "p-2",
            }}
            inputProps={{
              classNames: {
                innerWrapper: "flex gap-2",
              },
            }}
            popoverProps={{
              classNames: {
                base: "before:bg-white dark:before:bg-gray-900",
                content:
                  "p-0 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl rounded-xl backdrop-blur-xl max-h-[400px]",
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
                  "rounded-lg",
                  "px-3 py-3",
                  "transition-all duration-150",
                  "cursor-pointer",
                  "hover:bg-gray-50 dark:hover:bg-gray-800",
                  "data-[hover=true]:bg-gray-50 dark:data-[hover=true]:bg-gray-800",
                  "data-[pressed=true]:scale-95",
                  "data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-primary-500",
                  "group",
                  "mx-1",
                ],
              },
            }}
          >
            {(item: AutocompleteItem) => (
              <AutocompleteItem key={item.id} textValue={item.name}>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                      <MusicIcon />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                      {item.name}
                    </div>
                    {item.artists && (
                      <div className="text-sm text-default-500 truncate">
                        by{" "}
                        {item.artists.map((artist) => artist.name).join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-xs text-default-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                      Track
                    </div>
                  </div>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>

          <Button
            color="primary"
            onClick={handleSearch}
            isLoading={isLoading}
            disabled={!selectedQuery.trim()}
            size="lg"
            radius="lg"
            className="px-8 font-semibold cursor-pointer disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-150 h-14 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl"
            startContent={
              !isLoading && (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )
            }
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Search suggestions hint */}
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <p className="text-xs text-default-400">
            Try searching for artists like &quot;Taylor Swift&quot; or songs
            like &quot;Bohemian Rhapsody&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
