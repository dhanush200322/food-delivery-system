"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Cart } from "@/types";
import { getCart, addToCart as apiAddToCart, updateCartItem as apiUpdateCartItem, removeCartItem as apiRemoveCartItem, clearCart as apiClearCart } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  loading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addItem: (foodId: string, quantity?: number) => Promise<void>;
  updateItem: (foodId: string, quantity: number) => Promise<void>;
  removeItem: (foodId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data);
    } catch (err: any) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (foodId: string, quantity: number = 1) => {
    if (!isAuthenticated) throw new Error("Must be logged in to add to cart");
    setLoading(true);
    try {
      const updatedCart = await apiAddToCart(foodId, quantity);
      setCart(updatedCart);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to add item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (foodId: string, quantity: number) => {
    if (!isAuthenticated) throw new Error("Must be logged in to update cart");
    setLoading(true);
    try {
      const updatedCart = await apiUpdateCartItem(foodId, quantity);
      setCart(updatedCart);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to update item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (foodId: string) => {
    if (!isAuthenticated) throw new Error("Must be logged in to remove item");
    setLoading(true);
    try {
      const updatedCart = await apiRemoveCartItem(foodId);
      setCart(updatedCart);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to remove item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const updatedCart = await apiClearCart();
      setCart(updatedCart);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to clear cart");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.itemCount || 0;

  return (
    <CartContext.Provider value={{
      cart,
      itemCount,
      loading,
      error,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
