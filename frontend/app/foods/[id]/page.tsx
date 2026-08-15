"use client";

import { useState, useEffect, use } from "react";
import { getFood, getFoods } from "@/lib/api";
import { Food } from "@/types";
import { AlertState } from "@/components/ui/AlertState";
import { FoodCard } from "@/components/discovery/FoodCard";
import Image from "next/image";
import { Plus, Minus, Star, Heart, ArrowLeft, Loader2, Clock, CheckCircle2, MapPin, Tag, ShoppingBag } from "lucide-react";
import { getFoodImage } from "@/lib/imageUtils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FoodDetailsPage({ params }: PageProps) {
  // Unwrap params using React.use() to comply with Next.js 15+ async params
  const { id } = use(params);

  const [food, setFood] = useState<Food | null>(null);
  const [relatedFoods, setRelatedFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCart();
  const { toggleFavorite, isFavorite, loading: favLoading } = useFavorites();
  const [isAdding, setIsAdding] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);

  const favorited = food ? isFavorite(food.id) : false;

  const handleAddToCart = async () => {
    if (!food || isAdding) return;
    setIsAdding(true);
    try {
      await addItem(food.id, 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!food || isTogglingFav) return;
    setIsTogglingFav(true);
    try {
      await toggleFavorite(food.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingFav(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const foodData = await getFood(id);
        setFood(foodData);
        
        // Fetch related foods from the same category or restaurant
        if (foodData.categoryId) {
          const related = await getFoods(new URLSearchParams({ 
            categoryId: foodData.categoryId,
            limit: "4" 
          }));
          // Filter out current food
          setRelatedFoods(related.foods.filter(f => f.id !== id).slice(0, 3));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load food details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-32 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-[400px] rounded-3xl bg-secondary animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-10 w-3/4 bg-secondary animate-pulse rounded-lg"></div>
            <div className="h-6 w-1/4 bg-secondary animate-pulse rounded-lg"></div>
            <div className="h-24 w-full bg-secondary animate-pulse rounded-lg mt-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="container mx-auto px-4 pt-32 min-h-screen">
        <AlertState type="error" message={error || "Food not found"} />
        <div className="mt-8 flex justify-center">
          <Link href="/foods">
            <Button variant="outline">Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        <Link href="/foods" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Menu
        </Link>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square w-full max-w-[600px] mx-auto lg:mx-0 rounded-[3rem] overflow-hidden bg-secondary shadow-xl border-8 border-background"
          >
            <Image
              src={getFoodImage(food)}
              alt={food.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {!food.isAvailable && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-destructive text-destructive-foreground font-bold px-6 py-2 rounded-full text-xl shadow-lg">
                  Sold Out
                </span>
              </div>
            )}
          </motion.div>

          {/* Right: Info */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col h-full pt-4"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {food.category && (
                <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full text-sm font-medium">
                  <Tag size={14} className="text-primary" />
                  {food.category.name}
                </div>
              )}
              {food.restaurant && (
                <Link href={`/restaurants/${food.restaurant.id}`} className="flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5 rounded-full text-sm font-medium">
                  <MapPin size={14} />
                  {food.restaurant.name}
                </Link>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              {food.name}
            </h1>

            {food.restaurant && (
              <div className="flex items-center gap-2 mb-8">
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm font-bold">
                  <Star size={14} className="fill-yellow-600" />
                  {food.restaurant.rating}
                </div>
                <span className="text-muted-foreground text-sm">
                  Top rated item from {food.restaurant.name}
                </span>
              </div>
            )}

            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              {food.description}
            </p>

            <div className="mt-auto">
              <div className="flex items-end gap-4 mb-8 border-t border-border pt-8">
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Price</p>
                  <p className="text-4xl font-extrabold text-foreground">
                    ${Number(food.price).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  disabled={!food.isAvailable || isAdding}
                  onClick={handleAddToCart}
                  className="flex-1 h-16 text-lg rounded-2xl gap-3 shadow-lg hover:shadow-primary/25 transition-all"
                >
                  {isAdding ? <Loader2 size={22} className="animate-spin" /> : <ShoppingBag size={22} />}
                  {food.isAvailable ? (isAdding ? "Adding..." : "Add to Cart") : "Currently Unavailable"}
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  disabled={favLoading || isTogglingFav}
                  onClick={handleToggleFavorite}
                  className="h-16 w-16 px-0 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                  title={favorited ? "Remove from favorites" : "Add to favorites"}
                >
                  {isTogglingFav ? <Loader2 size={22} className="animate-spin" /> : <Heart size={22} className={favorited ? "fill-red-500 text-red-500" : ""} />}
                </Button>
                
                {food.restaurant && (
                  <Link href={`/restaurants/${food.restaurant.id}`}>
                    <Button variant="outline" size="lg" className="h-16 px-8 rounded-2xl w-full sm:w-auto">
                      View Restaurant
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Foods */}
        {relatedFoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="border-t border-border pt-16"
          >
            <h2 className="text-3xl font-extrabold mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedFoods.map((relatedFood, i) => (
                <div key={relatedFood.id} className="h-[420px]">
                  <FoodCard food={relatedFood} index={i} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
