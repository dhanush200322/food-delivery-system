"use client";

import { Food } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, Star, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { getFoodImage } from "@/lib/imageUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface FoodCardProps {
  food: Food;
  index?: number;
}

export function FoodCard({ food, index = 0 }: FoodCardProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  const { toggleFavorite, isFavorite, loading: favLoading } = useFavorites();
  const { addItem, updateItem, removeItem, cart, loading: cartLoading } = useCart();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);

  const favorited = isFavorite(food.id);
  const cartItem = cart?.items?.find(item => item.food.id === food.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isTogglingFav) return;
    setIsTogglingFav(true);
    try {
      await toggleFavorite(food.id);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    } finally {
      setIsTogglingFav(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addItem(food.id, 1);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateQuantity = async (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      if (newQuantity <= 0) {
        await removeItem(food.id);
      } else {
        await updateItem(food.id, newQuantity);
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-full"
    >
      <Link href={`/foods/${food.id}`} className="block h-full">
        <div className="bg-card text-card-foreground rounded-3xl p-4 sm:p-6 shadow-sm border border-border/50 h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/20 relative overflow-hidden">
          
          {/* Subtle gradient background on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Top meta data (Rating / Availability) */}
          <div className="flex justify-between items-start mb-6 z-10">
            {food.restaurant?.rating ? (
              <div className="flex items-center gap-1 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                <Star className="fill-yellow-400 text-yellow-400" size={14} />
                <span className="text-sm font-bold">{food.restaurant.rating}</span>
              </div>
            ) : (
              <div />
            )}
            
            {!food.isAvailable && (
              <div className="bg-destructive/10 text-destructive text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                Sold Out
              </div>
            )}
            
            {food.isAvailable && (
              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFav || favLoading}
                aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                className="z-20 h-8 w-8 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-background transition-colors text-muted-foreground hover:text-red-500"
              >
                <Heart 
                  size={16} 
                  className={`transition-colors ${favorited ? "fill-red-500 text-red-500" : ""}`} 
                />
              </button>
            )}
          </div>

          {/* Image */}
          <div className="relative h-40 w-full mb-6 drop-shadow-xl flex justify-center z-10">
            <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-background bg-secondary transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
              <Image
                src={getFoodImage(food)}
                alt={food.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 160px, 160px"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col z-10">
            <h3 className="font-bold text-lg md:text-xl mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {food.name}
            </h3>
            
            {food.restaurant && (
              <p className="text-sm text-muted-foreground mb-3 font-medium line-clamp-1">
                by {food.restaurant.name}
              </p>
            )}
            
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
              {food.description}
            </p>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
              <span className="text-xl font-extrabold">${Number(food.price).toFixed(2)}</span>
              
              {/* Add to Cart button or Quantity Selector */}
              {cartItem ? (
                <div 
                  className="flex items-center gap-1 bg-background rounded-full p-1 border border-border/60 shadow-sm z-20"
                  onClick={(e) => e.preventDefault()}
                >
                  <button
                    onClick={(e) => handleUpdateQuantity(e, cartItem.quantity - 1)}
                    disabled={isUpdating}
                    className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary disabled:opacity-50 transition-colors"
                  >
                    {isUpdating ? <Loader2 size={12} className="animate-spin text-primary" /> : <Minus size={14} />}
                  </button>
                  <span className="w-8 text-center font-black text-sm">{cartItem.quantity}</span>
                  <button
                    onClick={(e) => handleUpdateQuantity(e, cartItem.quantity + 1)}
                    disabled={isUpdating}
                    className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary disabled:opacity-50 transition-colors"
                  >
                    {isUpdating ? <Loader2 size={12} className="animate-spin text-primary" /> : <Plus size={14} />}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleAddToCart}
                  disabled={!food.isAvailable || isAdding}
                  className={`z-20 h-10 w-10 rounded-full flex items-center justify-center transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    food.isAvailable 
                      ? "bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:scale-110 active:scale-95" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  aria-label={food.isAvailable ? "Add to cart" : "Sold out"}
                >
                  {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
