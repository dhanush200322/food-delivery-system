"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getRestaurants } from "@/lib/api";
import { Restaurant, Pagination as PaginationType } from "@/types";
import { RestaurantCard } from "@/components/discovery/RestaurantCard";
import { Pagination } from "@/components/discovery/Pagination";
import { RestaurantsSkeletonGrid } from "@/components/ui/Skeletons";
import { AlertState } from "@/components/ui/AlertState";
import { Input } from "@/components/ui/Input";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

function RestaurantsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search input state
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");

  // Debounced search logic
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentUrl = new URLSearchParams(Array.from(searchParams.entries()));
      
      const updateParam = (key: string, val: string) => {
        if (val && val !== currentUrl.get(key)) {
          currentUrl.set(key, val);
          return true;
        } else if (!val && currentUrl.has(key)) {
          currentUrl.delete(key);
          return true;
        }
        return false;
      };

      const changedSearch = updateParam("search", searchValue);
      
      if (changedSearch) {
        currentUrl.set("page", "1");
        router.replace(`${pathname}?${currentUrl.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, pathname, router, searchParams]);

  // Fetch logic based on searchParams
  const fetchRestaurantsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRestaurants(new URLSearchParams(Array.from(searchParams.entries())));
      setRestaurants(data.restaurants);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load restaurants.");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchRestaurantsData();
  }, [fetchRestaurantsData]);

  const handlePageChange = (page: number) => {
    const currentUrl = new URLSearchParams(Array.from(searchParams.entries()));
    currentUrl.set("page", page.toString());
    router.push(`${pathname}?${currentUrl.toString()}`);
  };

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 pt-24 min-h-screen flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Find your next favorite restaurant
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore local favorites, trending kitchens, and highly rated restaurants.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            type="text"
            placeholder="Search restaurants by name..."
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
            className="pl-12 pr-12 h-14 rounded-full text-base bg-secondary border-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
          />
          {searchValue && (
            <button 
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {isLoading ? (
          <RestaurantsSkeletonGrid count={6} />
        ) : error ? (
          <AlertState type="error" message={error} onRetry={fetchRestaurantsData} />
        ) : restaurants.length === 0 ? (
          <AlertState 
            type="empty" 
            message={searchValue ? "No restaurants match your search." : "No restaurants available."}
            onRetry={searchValue ? clearSearch : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-10">
              {restaurants.map((restaurant, i) => (
                <div key={restaurant.id} className="h-[400px]">
                  <RestaurantCard restaurant={restaurant} index={i} />
                </div>
              ))}
            </div>
            
            {pagination && (
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 pt-32 min-h-screen">
        <RestaurantsSkeletonGrid count={6} />
      </div>
    }>
      <RestaurantsContent />
    </Suspense>
  );
}
