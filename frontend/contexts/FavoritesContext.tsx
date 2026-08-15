"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Favorite } from "@/types";
import { getFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  refreshFavorites: () => Promise<void>;
  toggleFavorite: (foodId: string) => Promise<void>;
  isFavorite: (foodId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err: any) {
      setError(err.message || "Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const toggleFavorite = async (foodId: string) => {
    if (!isAuthenticated) throw new Error("Must be logged in to favorite items");
    
    const currentlyFavorite = isFavorite(foodId);
    
    // Optimistic update
    if (currentlyFavorite) {
      setFavorites(prev => prev.filter(f => (f.foodId || f.food?.id) !== foodId));
    } else {
      // Add a temporary optimistic favorite. Will be replaced by real data
      setFavorites(prev => [...prev, { id: "temp", foodId, userId: "", createdAt: new Date().toISOString(), food: { id: foodId } as any }]);
    }

    try {
      if (currentlyFavorite) {
        await apiRemoveFavorite(foodId);
      } else {
        await apiAddFavorite(foodId);
      }
      // Re-fetch to ensure sync with backend
      await refreshFavorites();
    } catch (err: any) {
      // Revert on error
      await refreshFavorites();
      setError(err.message || "Failed to update favorite");
      throw err;
    }
  };

  const isFavorite = (foodId: string) => {
    return favorites.some(f => f.foodId === foodId || f.food?.id === foodId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      loading,
      error,
      refreshFavorites,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
