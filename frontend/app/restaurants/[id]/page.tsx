"use client";

import { useState, useEffect, use } from "react";
import { getRestaurant, getFoods } from "@/lib/api";
import { Restaurant, Food } from "@/types";
import { FoodCard } from "@/components/discovery/FoodCard";
import { AlertState } from "@/components/ui/AlertState";
import { RestaurantsSkeletonGrid } from "@/components/ui/Skeletons";
import Image from "next/image";
import { Star, Clock, MapPin, Info } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RestaurantDetailsPage({ params }: PageProps) {
  // Unwrap params using React.use() to comply with Next.js 15+ async params
  const { id } = use(params);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [resData, foodsData] = await Promise.all([
          getRestaurant(id),
          getFoods(new URLSearchParams({ restaurantId: id, limit: "50" }))
        ]);
        setRestaurant(resData);
        setFoods(foodsData.foods);
      } catch (err: any) {
        setError(err.message || "Failed to load restaurant details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-32 min-h-screen">
        <div className="h-64 md:h-96 w-full rounded-3xl bg-secondary animate-pulse mb-12"></div>
        <RestaurantsSkeletonGrid count={4} />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="container mx-auto px-4 pt-32 min-h-screen">
        <AlertState type="error" message={error || "Restaurant not found"} />
        <div className="mt-8 flex justify-center">
          <Link href="/restaurants">
            <Button variant="outline">Back to Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[40vh] md:h-[50vh] min-h-[300px] w-full">
        <Image
          src={restaurant.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=600&fit=crop"}
          alt={restaurant.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container mx-auto px-4 md:px-6 pb-8 md:pb-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-primary/20 text-primary font-bold px-4 py-1.5 rounded-full backdrop-blur-md border border-primary/20">
                  {restaurant.cuisineType}
                </span>
                {!restaurant.isAvailable && (
                  <span className="bg-destructive/90 text-destructive-foreground font-bold px-4 py-1.5 rounded-full shadow-sm">
                    Currently Unavailable
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground mb-4 drop-shadow-sm">
                {restaurant.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base font-medium">
                <div className="flex items-center gap-1.5 text-foreground bg-secondary/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
                  <Star className="fill-yellow-400 text-yellow-400" size={18} />
                  <span className="font-bold">{restaurant.rating} Rating</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground bg-secondary/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
                  <Clock className="text-primary" size={18} />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground bg-secondary/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
                  <MapPin className="text-primary" size={18} />
                  <span>${Number(restaurant.deliveryFee).toFixed(2)} Delivery</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column (Menu) */}
          <div className="lg:col-span-8 xl:col-span-9">
            <h2 className="text-3xl font-extrabold mb-8">Menu</h2>
            
            {foods.length === 0 ? (
              <AlertState type="empty" message="No menu items available right now." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {foods.map((food, i) => (
                  <div key={food.id} className="h-[420px]">
                    <FoodCard food={food} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Column (Info Sidebar) */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-28 bg-card rounded-3xl p-6 shadow-sm border border-border/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info size={20} className="text-primary" />
                Restaurant Info
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {restaurant.description}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Address</p>
                  <p className="text-sm font-medium">{restaurant.address}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Minimum Order</p>
                  <p className="text-sm font-medium">${Number(restaurant.minimumOrder).toFixed(2)}</p>
                </div>
                
                {restaurant.phoneNumber && (
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Phone</p>
                    <p className="text-sm font-medium">{restaurant.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
