"use client";

import { useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { SearchBar } from "@/components/search-bar";
import { SearchResults } from "@/components/search-results";
import { Favorites } from "@/components/favorites";
import { useFavoritesStore } from "@/store/favorites";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("search");
  const { favorites } = useFavoritesStore();

  const { data: searchResults, isLoading } = useSWR(
    searchQuery
      ? `/api/search?q=${encodeURIComponent(
          searchQuery
        )}&types=track,album,artist&limit=20`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedTab("search");
  };

  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key.toString());
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Spotify Search
        </h1>
        <p className="text-lg text-default-500">
          Discover and save your favorite music
        </p>
      </div>

      <div className="mb-16">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={handleTabChange}
        className="w-full"
        color="primary"
        variant="underlined"
        size="lg"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary-500",
          tab: "max-w-fit px-0 h-12 cursor-pointer",
          tabContent:
            "group-data-[selected=true]:text-primary-600 font-semibold",
        }}
      >
        <Tab
          key="search"
          title={
            <div className="flex items-center space-x-2">
              <span>Search Results</span>
              {searchQuery && searchResults && (
                <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                  {(searchResults.tracks?.total || 0) +
                    (searchResults.albums?.total || 0) +
                    (searchResults.artists?.total || 0)}
                </span>
              )}
            </div>
          }
        >
          <Card className="mt-6 shadow-lg">
            <CardBody className="p-6">
              {searchQuery ? (
                <SearchResults
                  results={searchResults || {}}
                  isLoading={isLoading}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-primary-600"
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
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Start Your Music Discovery
                    </h3>
                    <p className="text-default-500">
                      Enter a search term above to discover tracks, albums, and
                      artists from Spotify
                    </p>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="favorites"
          title={
            <div className="flex items-center space-x-2">
              <span>Favorites</span>
              {favorites.length > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  {favorites.length}
                </span>
              )}
            </div>
          }
        >
          <Card className="mt-6 shadow-lg">
            <CardBody className="p-6">
              <Favorites />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
