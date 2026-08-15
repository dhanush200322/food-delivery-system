"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getFoods, getCategories } from "@/lib/api";
import { Food, Category, Pagination as PaginationType } from "@/types";
import { FoodCard } from "@/components/discovery/FoodCard";
import { Pagination } from "@/components/discovery/Pagination";
import { RestaurantsSkeletonGrid } from "@/components/ui/Skeletons";
import { AlertState } from "@/components/ui/AlertState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, SlidersHorizontal, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function FoodsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Local state for debounced search
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  // Fetch Categories once
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch Foods based on searchParams
  const fetchFoodsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFoods(new URLSearchParams(Array.from(searchParams.entries())));
      setFoods(data.foods);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load foods.");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchFoodsData();
  }, [fetchFoodsData]);

  // Debounced input sync (search, minPrice, maxPrice)
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
      const changedMinPrice = updateParam("minPrice", minPrice);
      const changedMaxPrice = updateParam("maxPrice", maxPrice);
      
      if (changedSearch || changedMinPrice || changedMaxPrice) {
        currentUrl.set("page", "1"); // Reset page on filter change
        router.replace(`${pathname}?${currentUrl.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, minPrice, maxPrice, pathname, router, searchParams]);

  // Instant filter updates (clicks)
  const updateFilter = (key: string, value: string | null) => {
    const currentUrl = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      currentUrl.set(key, value);
    } else {
      currentUrl.delete(key);
    }
    currentUrl.set("page", "1");
    router.push(`${pathname}?${currentUrl.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchValue("");
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname);
    setIsMobileFiltersOpen(false);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      updateFilter("sortBy", null);
      updateFilter("sortOrder", null);
      return;
    }
    const [sortBy, sortOrder] = val.split("-");
    const currentUrl = new URLSearchParams(Array.from(searchParams.entries()));
    currentUrl.set("sortBy", sortBy);
    currentUrl.set("sortOrder", sortOrder);
    currentUrl.set("page", "1");
    router.push(`${pathname}?${currentUrl.toString()}`);
  };

  const activeCategoryId = searchParams.get("categoryId");
  const activeRating = searchParams.get("minRating");
  const activeAvailability = searchParams.get("isAvailable");
  const currentSort = searchParams.get("sortBy") ? `${searchParams.get("sortBy")}-${searchParams.get("sortOrder")}` : "";

  const FilterContent = () => (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <SlidersHorizontal size={20} className="text-primary" />
          Filters
        </h3>
        <button onClick={clearAllFilters} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Category</h4>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => updateFilter("categoryId", null)}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!activeCategoryId ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
          >
            All Categories
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => updateFilter("categoryId", c.id)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategoryId === c.id ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Price Range</h4>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input 
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="pl-7 bg-secondary/50"
            />
          </div>
          <span className="text-muted-foreground">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input 
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="pl-7 bg-secondary/50"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Minimum Rating</h4>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => updateFilter("minRating", activeRating === String(rating) ? null : String(rating))}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeRating === String(rating) ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
            >
              <div className="flex">
                {Array.from({length: 5}).map((_, i) => (
                  <Star key={i} size={16} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"} />
                ))}
              </div>
              <span className="ml-1">& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Availability</h4>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => updateFilter("isAvailable", null)}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!activeAvailability ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
          >
            All Items
          </button>
          <button
            onClick={() => updateFilter("isAvailable", "true")}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeAvailability === "true" ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'}`}
          >
            Available Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Good food starts here.
          </h1>
          <p className="text-lg text-muted-foreground">
            Search, filter and discover something worth craving.
          </p>
        </motion.div>

        {/* Top Controls (Search & Sort & Mobile Filter Toggle) */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              type="text"
              placeholder="Search foods or restaurants..."
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
              className="pl-12 h-12 rounded-xl text-base bg-secondary border-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
            />
            {searchValue && (
              <button 
                onClick={() => setSearchValue("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <select 
              value={currentSort}
              onChange={handleSort}
              className="h-12 px-4 rounded-xl bg-secondary border-none text-sm font-medium focus:ring-2 focus:ring-primary shadow-sm outline-none cursor-pointer"
            >
              <option value="">Recommended</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            
            <Button 
              variant="outline" 
              className="h-12 w-12 p-0 lg:hidden rounded-xl bg-secondary border-none"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={20} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {/* Desktop Filters */}
          <div className="hidden lg:block lg:col-span-1 border-r border-border/50 pr-8">
            <div className="sticky top-28">
              <FilterContent />
            </div>
          </div>
          
          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {isMobileFiltersOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
                  onClick={() => setIsMobileFiltersOpen(false)}
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl max-h-[85vh] overflow-y-auto lg:hidden"
                >
                  <div className="sticky top-0 bg-background/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-border z-10">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-secondary rounded-full">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-6">
                    <FilterContent />
                    
                    <Button 
                      className="w-full h-14 text-lg rounded-xl mt-6"
                      onClick={() => setIsMobileFiltersOpen(false)}
                    >
                      Show Results
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <RestaurantsSkeletonGrid count={6} />
            ) : error ? (
              <AlertState type="error" message={error} onRetry={fetchFoodsData} />
            ) : foods.length === 0 ? (
              <AlertState 
                type="empty" 
                message="No foods match these filters."
                onRetry={clearAllFilters}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {foods.map((food, i) => (
                    <div key={food.id} className="h-[420px]">
                      <FoodCard food={food} index={i} />
                    </div>
                  ))}
                </div>
                
                {pagination && (
                  <Pagination 
                    pagination={pagination} 
                    onPageChange={(page) => updateFilter("page", String(page))} 
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FoodsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 pt-32 min-h-screen">
        <RestaurantsSkeletonGrid count={8} />
      </div>
    }>
      <FoodsContent />
    </Suspense>
  );
}
