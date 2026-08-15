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
      <Link href={`/foods/${food.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl">
        <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border/50 h-full flex flex-col transition-all duration-300 hover:shadow-md hover:border-primary/30 relative overflow-hidden group/card">
          
          {/* Edge-to-edge Image Section */}
          <div className="relative h-48 w-full bg-secondary overflow-hidden">
            <Image
              src={getFoodImage(food)}
              alt={food.name}
              fill
              className="object-cover transition-transform duration-700 group-hover/card:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient overlay for better text/badge visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
              <div className="flex flex-col gap-2">
                {food.restaurant?.rating ? (
                  <div className="flex items-center gap-1 bg-background/95 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
                    <Star className="fill-yellow-400 text-yellow-400" size={14} />
                    <span className="text-xs font-bold">{food.restaurant.rating}</span>
                  </div>
                ) : (
                  <div />
                )}
                
                {!food.isAvailable && (
                  <div className="bg-destructive text-destructive-foreground text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg shadow-sm">
                    Sold Out
                  </div>
                )}
              </div>
              
              {food.isAvailable && (
                <button
                  onClick={handleToggleFavorite}
                  disabled={isTogglingFav || favLoading}
                  aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
                  className="h-8 w-8 bg-background/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors text-muted-foreground hover:text-red-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Heart 
                    size={16} 
                    className={`transition-colors ${favorited ? "fill-red-500 text-red-500" : ""}`} 
                  />
                </button>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col z-10">
            <div className="flex justify-between items-start gap-2 mb-1">
              <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover/card:text-primary transition-colors">
                {food.name}
              </h3>
            </div>
            
            {food.restaurant && (
              <p className="text-sm text-muted-foreground mb-2 font-medium line-clamp-1">
                {food.restaurant.name}
              </p>
            )}
            
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4 mt-1">
              {food.description}
            </p>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/40">
              <span className="text-lg font-extrabold">${Number(food.price).toFixed(2)}</span>
              
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
                  className={`z-20 h-10 px-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-medium text-sm ${
                    food.isAvailable 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md active:scale-95" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  aria-label={food.isAvailable ? "Add to cart" : "Sold out"}
                >
                  {isAdding ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Plus size={16} /> Add
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
