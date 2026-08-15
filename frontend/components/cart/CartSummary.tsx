"use client";

import { Cart } from "@/types";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Loader2, Tag, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface CartSummaryProps {
  cart: Cart;
}

const VALID_COUPONS: Record<string, number> = {
  "SUPER50": 0.50,
  "INDEPENDENCE20": 0.20,
  "FESTIVAL30": 0.10, // 10% discount for festival
  "CRICKET40": 0.40,
  "RAINY15": 0.15,
};

export function CartSummary({ cart }: CartSummaryProps) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discountPct: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = Number(cart.subtotal);
  const deliveryFee = 5.00; // Fixed for now, could be dynamic
  
  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.discountPct : 0;
  const total = subtotal - discountAmount + deliveryFee;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, discountPct: VALID_COUPONS[code] });
      setCouponError("");
    } else {
      setCouponError("Invalid or expired coupon code");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handleClearCart = async () => {
    if (isClearing) return;
    setIsClearing(true);
    try {
      await clearCart();
    } catch (error) {
      console.error(error);
      setIsClearing(false);
    }
  };

  const handleCheckout = () => {
    if (appliedCoupon) {
      router.push(`/checkout?coupon=${appliedCoupon.code}`);
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="bg-secondary/30 rounded-[2rem] p-6 sm:p-8 sticky top-32 border border-border/50 shadow-sm">
      <h2 className="text-2xl font-black mb-6">Order Summary</h2>
      
      {/* Coupon Section */}
      <div className="mb-6 pb-6 border-b border-border/50">
        <label className="text-sm font-bold mb-2 flex items-center gap-2">
          <Tag size={16} className="text-primary" /> Have a coupon?
        </label>
        <div className="flex gap-2 relative">
          <input 
            type="text" 
            placeholder="Enter code (e.g. SUPER50)"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            disabled={!!appliedCoupon}
            className="flex-1 rounded-xl bg-background border border-border px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none uppercase font-semibold disabled:opacity-50"
          />
          {appliedCoupon ? (
            <Button 
              variant="outline" 
              onClick={handleRemoveCoupon}
              className="text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground px-4 rounded-xl"
            >
              <X size={18} />
            </Button>
          ) : (
            <Button 
              onClick={handleApplyCoupon}
              className="px-6 rounded-xl font-bold"
            >
              Apply
            </Button>
          )}
        </div>
        {couponError && <p className="text-destructive text-xs mt-2 font-medium">{couponError}</p>}
        {appliedCoupon && (
          <p className="text-green-600 text-xs mt-2 font-bold bg-green-50 p-2 rounded-lg inline-block">
            {appliedCoupon.code} applied! ({(appliedCoupon.discountPct * 100).toFixed(0)}% OFF)
          </p>
        )}
      </div>

      <div className="space-y-4 mb-8 text-sm sm:text-base">
        <div className="flex justify-between font-medium">
          <span className="text-muted-foreground">Subtotal ({cart.itemCount} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {appliedCoupon && (
          <div className="flex justify-between font-bold text-green-600">
            <span>Discount ({(appliedCoupon.discountPct * 100).toFixed(0)}%)</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between font-medium">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-border pt-4 flex justify-between font-black text-xl">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          size="lg" 
          className="w-full h-14 rounded-2xl text-lg group shadow-lg shadow-primary/25"
          onClick={handleCheckout}
        >
          Proceed to Checkout
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </Button>

        <Button 
          variant="ghost" 
          onClick={handleClearCart}
          disabled={isClearing}
          className="w-full text-muted-foreground hover:text-destructive transition-colors"
        >
          {isClearing ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
          Clear Cart
        </Button>
      </div>
    </div>
  );
}
