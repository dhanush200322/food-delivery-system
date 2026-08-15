"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import confetti from "canvas-confetti";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Trigger confetti on successful mount
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9A826", "#9B59B6"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#F9A826", "#9B59B6"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-lg mx-auto">
      <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
        {/* Floating Food Emojis */}
        {[
          { emoji: "🍔", angle: -45, delay: 0.1 },
          { emoji: "🍕", angle: -15, delay: 0.2 },
          { emoji: "🍟", angle: 15, delay: 0.3 },
          { emoji: "🍩", angle: 45, delay: 0.4 },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
            animate={{ 
              scale: 1,
              x: Math.sin(item.angle * (Math.PI / 180)) * 80,
              y: -Math.cos(item.angle * (Math.PI / 180)) * 80,
              opacity: 1
            }}
            transition={{ 
              type: "spring", 
              stiffness: 250, 
              damping: 15, 
              delay: item.delay 
            }}
            className="absolute text-4xl z-10 drop-shadow-lg"
          >
            {item.emoji}
          </motion.div>
        ))}

        {/* Central Success Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
          className="relative z-20 w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 border-4 border-background"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <CheckCircle2 size={64} className="text-primary-foreground" />
          </motion.div>
        </motion.div>
        
        {/* Sparkles */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full" />
          <div className="absolute left-0 top-1/2 w-2 h-2 bg-yellow-400 rounded-full" />
          <div className="absolute right-0 top-1/2 w-3 h-3 bg-yellow-400 rounded-full" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1 className="text-4xl font-black mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground text-lg mb-2">
          Thank you for your order. The restaurant is confirming it right now.
        </p>
        
        {orderId && (
          <div className="bg-secondary/50 p-4 rounded-xl inline-block mt-4 mb-8">
            <span className="text-sm text-muted-foreground">Order ID</span>
            <p className="font-mono font-bold text-lg">{orderId}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
          <Link href={orderId ? `/orders/${orderId}` : "/orders"} className="flex-1">
            <Button size="lg" className="w-full h-14 rounded-2xl group">
              <Package className="mr-2" size={20} />
              Track Order
            </Button>
          </Link>
          <Link href="/foods" className="flex-1">
            <Button variant="outline" size="lg" className="w-full h-14 rounded-2xl group">
              Continue Shopping
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-32 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <OrderSuccessContent />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}
