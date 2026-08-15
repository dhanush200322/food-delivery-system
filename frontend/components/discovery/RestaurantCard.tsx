"use client";

import { Restaurant } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

export function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-full"
    >
      <Link href={`/restaurants/${restaurant.id}`} className="block h-full">
        <div className="bg-card text-card-foreground rounded-[2rem] p-4 sm:p-6 shadow-sm border border-border/50 h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/20">
          
          <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden">
            <Image
              src={restaurant.imageUrl || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop"}
              alt={restaurant.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
            
            <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
              {!restaurant.isAvailable && (
                <div className="bg-destructive/90 text-destructive-foreground text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                  Currently Closed
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-xs font-semibold text-foreground">
                  {restaurant.cuisineType}
                </span>
              </div>
              
              <div className="flex items-center gap-1 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                <Star className="fill-yellow-400 text-yellow-400" size={14} />
                <span className="text-sm font-bold">{restaurant.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <h3 className="font-bold text-xl md:text-2xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {restaurant.name}
            </h3>
            
            <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">
              {restaurant.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium pt-4 border-t border-border/50">
              <div className="flex items-center text-muted-foreground">
                <Clock size={16} className="mr-2 opacity-70" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin size={16} className="mr-2 opacity-70" />
                <span>${Number(restaurant.deliveryFee).toFixed(2)} delivery</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
