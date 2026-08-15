"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { fetchApi, ApiError } from "@/lib/api";
import { Promotion, ApiResponse } from "@/types";
import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { PromotionSkeleton } from "@/components/ui/Skeletons";
import { AlertState } from "@/components/ui/AlertState";

export default function Promotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPromotions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchApi<ApiResponse<{ promotions: Promotion[] }>>("/api/promotions");
      // Just show one top promotion or handle active ones
      const activePromotions = (response.data.promotions || []).filter(p => p.isActive);
      setPromotions(activePromotions);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load promotions.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const container: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (isLoading) {
    return (
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <PromotionSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <AlertState type="error" message={error} onRetry={loadPromotions} />
        </div>
      </section>
    );
  }

  // Pick the best promotion to display (or the first active one)
  const promo = promotions.length > 0 ? promotions[0] : null;

  if (!promo) {
    return null; // Don't show the section if no promotions exist
  }

  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative rounded-[2.5rem] overflow-hidden bg-primary text-primary-foreground shadow-xl"
        >
          <div className="absolute inset-0">
            <Image
              src={promo.bannerImageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop"}
              alt={promo.title}
              fill
              className="object-cover opacity-40 mix-blend-overlay"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          </div>
          
          <div className="relative p-8 md:p-16 lg:w-2/3">
            <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold mb-6 border border-white/20 shadow-sm">
              <Tag size={16} />
              <span>Limited Time Offer</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              {promo.title} <br className="hidden md:block" />
              <span className="text-yellow-300">{promo.discountPercentage}% OFF</span>
            </h2>
            
            <p className="text-lg md:text-xl font-medium mb-10 text-primary-foreground/90 max-w-lg">
              {promo.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link href={`/offers/${promo.id}`}>
                <Button size="lg" variant="secondary" className="h-14 px-8 text-lg group">
                  Claim Offer
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
              </Link>
              <div className="text-sm font-semibold opacity-80 bg-black/20 px-4 py-2 rounded-full">
                Valid until: {new Date(promo.validUntil).toLocaleDateString()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
