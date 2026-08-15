"use client";

import { useState, useEffect } from "react";
import { fetchApi, ApiError } from "@/lib/api";
import { Food, ApiResponse } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FoodsSkeletonGrid } from "@/components/ui/Skeletons";
import { AlertState } from "@/components/ui/AlertState";
import { getFoodImage } from "@/lib/imageUtils";
import { FoodCard } from "@/components/discovery/FoodCard";

export default function FeaturedFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadFoods = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchApi<ApiResponse<{ foods: Food[] }>>("/api/foods");
      // Just show top 4 for the featured section
      setFoods(response.data.foods?.slice(0, 4) || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load foods.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFoods();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          title="Popular Dishes Right Now" 
          subtitle="Our most ordered items today. Grab them while they're hot!"
          centered
          className="mb-14"
        />

        {isLoading ? (
          <FoodsSkeletonGrid />
        ) : error ? (
          <AlertState type="error" message={error} onRetry={loadFoods} />
        ) : foods.length === 0 ? (
          <AlertState type="empty" message="No dishes available right now." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-8">
            {foods.map((food, i) => (
              <FoodCard key={food.id} food={food} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
