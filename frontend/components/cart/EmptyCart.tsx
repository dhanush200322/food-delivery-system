"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto"
    >
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
        <ShoppingBag size={48} />
      </div>
      <h2 className="text-3xl font-black mb-4">Your cart is hungry</h2>
      <p className="text-muted-foreground mb-8 text-lg">
        Looks like you haven't added any delicious food to your cart yet.
      </p>
      <Link href="/foods" className="w-full">
        <Button size="lg" className="w-full h-14 rounded-2xl group">
          Start Shopping
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
        </Button>
      </Link>
    </motion.div>
  );
}
