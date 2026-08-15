"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createOrder } from "@/lib/api";
import { ArrowLeft, Loader2, CheckCircle, MapPin, Phone, User, Tag } from "lucide-react";
import Link from "next/link";

const VALID_COUPONS: Record<string, number> = {
  "SUPER50": 0.50,
  "INDEPENDENCE20": 0.20,
  "FESTIVAL30": 0.10,
  "CRICKET40": 0.40,
  "RAINY15": 0.15,
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      if (user.name) setCustomerName(user.name);
      if (user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Redirect if cart is empty, unless we are currently submitting an order
  useEffect(() => {
    if (!isSubmitting && !isSuccess && !cartLoading && (!cart || cart.items.length === 0)) {
      router.replace("/cart");
    }
  }, [cart, cartLoading, router, isSubmitting, isSuccess]);

  if (cartLoading || !cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  const subtotal = Number(cart.subtotal);
  const deliveryFee = 5.00;
  
  // Calculate discount based on passed coupon
  const couponParam = searchParams.get("coupon")?.toUpperCase();
  const discountPct = couponParam && VALID_COUPONS[couponParam] ? VALID_COUPONS[couponParam] : 0;
  const discountAmount = subtotal * discountPct;
  const total = subtotal - discountAmount + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (customerName.trim().length < 2) {
      setError("Please enter a valid name.");
      return;
    }
    
    // Basic phone validation (at least 10 chars, mostly numbers)
    const phoneRegex = /^[0-9+\-\s()]{10,20}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      setError("Please enter a valid phone number (min 10 digits).");
      return;
    }

    if (deliveryAddress.trim().length < 10) {
      setError("Please enter a complete delivery address (min 10 characters).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim()
      });
      
      // On success, backend created the order.
      setIsSuccess(true);
      // Refresh/clear the frontend cart.
      await clearCart();
      
      // Redirect to success page
      router.push(`/orders/success?orderId=${order.id}`);
    } catch (err: any) {
      console.error("Checkout failed:", err);
      setError(err.message || "Failed to process your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <Link href="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-black mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Form Section */}
          <div>
            <div className="bg-card rounded-[2rem] p-6 sm:p-8 border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-primary" /> Delivery Details
              </h2>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" /> Full Name
                  </label>
                  <Input 
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Jane Doe"
                    className="h-12 rounded-xl bg-secondary/50 border-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground" /> Phone Number
                  </label>
                  <Input 
                    required
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="h-12 rounded-xl bg-secondary/50 border-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <MapPin size={16} className="text-muted-foreground" /> Delivery Address
                  </label>
                  <textarea 
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="123 Main St, Apt 4B, City, State, ZIP"
                    className="w-full min-h-[120px] p-4 rounded-xl bg-secondary/50 border-none resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl text-lg group shadow-lg shadow-primary/25 mt-4"
                >
                  {isSubmitting ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      Place Order <CheckCircle className="ml-2" size={20} />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary Section */}
          <div>
            <div className="bg-secondary/30 rounded-[2rem] p-6 sm:p-8 border border-border/50 sticky top-32">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-bold line-clamp-1">{item.food.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${Number(item.subtotal).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm sm:text-base border-t border-border pt-6">
                <div className="flex justify-between font-medium">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discountPct > 0 && (
                  <div className="flex justify-between font-bold text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={14} /> 
                      Discount ({couponParam})
                    </span>
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

              <div className="mt-8 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5 text-blue-600" />
                <p>
                  You will not be charged until the restaurant confirms your order. This is a secure transaction.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-primary" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </ProtectedRoute>
  );
}
