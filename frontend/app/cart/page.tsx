"use client";

import { useCart } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { CartSkeleton } from "@/components/cart/CartSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { AlertState } from "@/components/ui/AlertState";

export default function CartPage() {
  const { cart, loading, error, refreshCart } = useCart();

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-32 pb-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10">
            <h1 className="text-4xl font-black mb-2">Your Cart</h1>
            <p className="text-muted-foreground text-lg">
              Review your items and proceed to checkout.
            </p>
          </div>

          {loading ? (
            <CartSkeleton />
          ) : error ? (
            <AlertState type="error" message={error} onRetry={refreshCart} />
          ) : !cart || cart.items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              <div className="lg:col-span-2">
                <motion.div layout className="flex flex-col gap-6">
                  <AnimatePresence mode="popLayout">
                    {cart.items.map((item) => (
                      <CartItem key={item.id || item.foodId || item.food?.id} item={item} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
              <div className="lg:col-span-1">
                <CartSummary cart={cart} />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
