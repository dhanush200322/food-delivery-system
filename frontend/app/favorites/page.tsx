"use client";

import { useFavorites } from "@/contexts/FavoritesContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { FoodCard } from "@/components/discovery/FoodCard";
import { FoodsSkeletonGrid } from "@/components/ui/Skeletons";
import { AlertState } from "@/components/ui/AlertState";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function FavoritesPage() {
  const { favorites, loading, error, refreshFavorites } = useFavorites();

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-32 pb-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 flex items-center gap-4">
            <div className="bg-red-100 text-red-500 p-3 rounded-2xl">
              <Heart size={32} className="fill-red-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">Your Favorites</h1>
              <p className="text-muted-foreground text-lg">
                The dishes you love the most, all in one place.
              </p>
            </div>
          </div>

          {loading ? (
            <FoodsSkeletonGrid />
          ) : error ? (
            <AlertState type="error" message={error} onRetry={refreshFavorites} />
          ) : favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto"
            >
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-300">
                <Heart size={48} />
              </div>
              <h2 className="text-3xl font-black mb-4">No favorites yet</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Start hearting your favorite dishes to quickly access them later.
              </p>
              <Link href="/foods" className="w-full">
                <Button size="lg" className="w-full h-14 rounded-2xl group">
                  Discover Food
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-8">
              <AnimatePresence mode="popLayout">
                {favorites.map((favorite, i) => (
                  <motion.div 
                    key={favorite.id || favorite.foodId || favorite.food?.id || i}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="h-full"
                  >
                    {favorite.food && favorite.food.id ? (
                      <FoodCard food={favorite.food} index={i} />
                    ) : (
                      <div className="bg-card rounded-[2rem] p-4 shadow-sm border border-border h-full flex items-center justify-center text-muted-foreground">
                        Item no longer available
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
