import { Food } from "@/types";

export function getFoodImage(food: Food | { name: string, imageUrl?: string | null }): string {
  // If no image provided, or if the backend sends a placehold.co image which Next.js Image component blocks,
  // we fallback to a beautiful Unsplash food image based on the food name.
  
  const defaultImage = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop"; // Pizza
  
  if (food.imageUrl && !food.imageUrl.includes("placehold.co")) {
    return food.imageUrl;
  }

  if (!food.name) return defaultImage;

  const normalized = food.name.toLowerCase();
  
  if (normalized.includes("pizza") || normalized.includes("margherita") || normalized.includes("crust")) {
    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop";
  }
  if (normalized.includes("burger") || normalized.includes("whopper") || normalized.includes("beef")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop";
  }
  if (normalized.includes("chicken") || normalized.includes("wings")) {
    return "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop";
  }
  if (normalized.includes("cake") || normalized.includes("chocolate") || normalized.includes("dessert") || normalized.includes("sweet")) {
    return "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop";
  }
  if (normalized.includes("coffee") || normalized.includes("macchiato") || normalized.includes("tea") || normalized.includes("drink")) {
    return "https://images.unsplash.com/photo-1543253687-c931c8e01820?w=600&h=400&fit=crop";
  }
  if (normalized.includes("salad") || normalized.includes("vegan") || normalized.includes("bowl")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop";
  }

  return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop";
}
