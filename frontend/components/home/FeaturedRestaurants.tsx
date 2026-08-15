"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { fetchApi, ApiError } from "@/lib/api";
import { Restaurant, ApiResponse } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Image from "next/image";
import { Star, Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { RestaurantsSkeletonGrid } from "@/components/ui/Skeletons";
import { AlertState } from "@/components/ui/AlertState";

export default function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRestaurants = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchApi<ApiResponse<{ restaurants: Restaurant[] }>>("/api/restaurants");
      // Just show top 4 for the featured section
      setRestaurants(response.data.restaurants?.slice(0, 4) || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load restaurants.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <SectionHeading 
            title="Featured Restaurants" 
            subtitle="Top-rated spots that consistently deliver excellence to your door."
            className="mb-0"
          />
          <Link href="/restaurants" className="flex items-center gap-2 text-primary font-medium hover:underline shrink-0">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <RestaurantsSkeletonGrid />
        ) : error ? (
          <AlertState type="error" message={error} onRetry={loadRestaurants} />
        ) : restaurants.length === 0 ? (
          <AlertState type="empty" message="No restaurants available right now." />
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {restaurants.map((restaurant) => (
              <motion.div key={restaurant.id} variants={item}>
                <Link href={`/restaurants/${restaurant.id}`} className="group flex flex-col bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border h-full">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <Image
                      src={restaurant.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop"}
                      alt={restaurant.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {!restaurant.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <Badge variant="destructive" className="text-sm px-3 py-1">Closed</Badge>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star size={14} className="fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-bold">{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {restaurant.name}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{restaurant.cuisineType}</p>
                    
                    <div className="mt-auto flex items-center gap-4 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1.5 rounded-md">
                        <Clock size={14} className="text-primary" />
                        <span>{restaurant.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1.5 rounded-md">
                        <MapPin size={14} className="text-primary" />
                        <span>Live track</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
