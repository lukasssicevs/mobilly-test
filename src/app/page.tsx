"use client";

import { useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import { SearchBar, SearchResults, Favorites } from "@/components/pages/home";
import { useFavoritesStore } from "@/store";
import { ApiEndpoints } from "@/types";
import useSWR from "swr";
import axios from "axios";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("search");
  const { favorites } = useFavoritesStore();

  const { data: searchResults, isLoading } = useSWR(
    searchQuery
      ? [
          ApiEndpoints.Search,
          { q: searchQuery, types: "track,album,artist", limit: 20 },
        ]
      : null,
    ([url, params]) =>
      axios
        .get(url, {
          params,
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
      errorRetryCount: 2,
    }
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedTab("search");
  };

  const handleTabChange = (key: React.Key) => {
    setSelectedTab(key.toString());
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-16  w-full">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold  text-green-400 mb-4">
          Spotify Search
        </h1>
        <p className="text-lg text-gray-300">
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
        variant="underlined"
        size="lg"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-gray-700",
          cursor: "w-full bg-green-500",
          tab: "max-w-fit px-0 h-12 cursor-pointer data-[selected=true]:text-green-400 text-gray-400 hover:text-gray-300",
          tabContent:
            "group-data-[selected=true]:text-green-400 font-semibold text-gray-400 hover:text-gray-300 transition-colors",
        }}
      >
        <Tab
          key="search"
          title={
            <div className="flex items-center space-x-2">
              <span className="text-nowrap">Search Results</span>
              {searchQuery && searchResults && (
                <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full">
                  {(searchResults.tracks?.total || 0) +
                    (searchResults.albums?.total || 0) +
                    (searchResults.artists?.total || 0)}
                </span>
              )}
            </div>
          }
        >
          <Card className="mt-6 shadow-xl">
            <CardBody className="p-6">
              {searchQuery ? (
                <SearchResults
                  results={searchResults || {}}
                  isLoading={isLoading}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-900 to-green-800 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-green-400"
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
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Start Your Music Discovery
                    </h3>
                    <p className="text-gray-400">
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
                <span className="text-xs bg-red-900/50 text-red-300 px-2 py-1 rounded-full">
                  {favorites.length}
                </span>
              )}
            </div>
          }
        >
          <Card className="mt-6 shadow-xl">
            <CardBody className="p-6">
              <Favorites />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
