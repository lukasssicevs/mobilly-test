import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SpotifyItem } from "@/types";

interface FavoritesStore {
  favorites: SpotifyItem[];
  addFavorite: (item: SpotifyItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (item) => {
        const { favorites } = get();
        if (!favorites.find((fav) => fav.id === item.id)) {
          set({ favorites: [...favorites, item] });
        }
      },
      removeFavorite: (id) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((fav) => fav.id !== id) });
      },
      isFavorite: (id) => {
        const { favorites } = get();
        return favorites.some((fav) => fav.id === id);
      },
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: "spotify-favorites",
    }
  )
);
