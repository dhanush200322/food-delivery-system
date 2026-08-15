"use client";

import { CartItem as CartItemType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { getFoodImage } from "@/lib/imageUtils";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 20 || isUpdating || isRemoving) return;
    setIsUpdating(true);
    try {
      const targetId = item.foodId || item.food?.id || item.id;
      if (!targetId) throw new Error("Missing item ID");
      await updateItem(targetId, newQuantity);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;
    setIsRemoving(true);
    try {
      const targetId = item.foodId || item.food?.id || item.id;
      if (!targetId) throw new Error("Missing item ID");
      await removeItem(targetId);
    } catch (err) {
      console.error(err);
      setIsRemoving(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className={`flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-card rounded-[2rem] border border-border shadow-sm transition-opacity ${isRemoving ? 'opacity-50' : 'opacity-100'}`}
    >
      <Link href={`/foods/${item.food.id}`} className="shrink-0 relative h-28 w-28 sm:h-32 sm:w-32 rounded-2xl overflow-hidden bg-secondary border-4 border-background hover:scale-105 transition-transform duration-300">
        <Image
          src={getFoodImage(item.food)}
          alt={item.food.name}
          fill
          className="object-cover"
        />
      </Link>
      
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <Link href={`/foods/${item.food.id}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">
              {item.food.name}
            </Link>
            {item.food.restaurant && (
              <p className="text-sm text-muted-foreground font-medium mt-1">
                From {item.food.restaurant.name}
              </p>
            )}
          </div>
          <p className="font-extrabold text-lg shrink-0">
            ${Number(item.subtotal).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 bg-background rounded-full p-1 border border-border/60 shadow-sm">
            <button
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating || isRemoving}
              className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary disabled:opacity-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-black text-sm">
              {isUpdating ? <Loader2 size={14} className="animate-spin mx-auto text-primary" /> : item.quantity}
            </span>
            <button
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={item.quantity >= 20 || isUpdating || isRemoving}
              className="h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center hover:bg-secondary disabled:opacity-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            aria-label="Remove item"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-destructive/10"
          >
            {isRemoving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
