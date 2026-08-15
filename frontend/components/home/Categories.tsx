"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { fetchApi, ApiError } from "@/lib/api";
import { Category, ApiResponse } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CategoriesSkeletonGrid } from "@/components/ui/Skeletons";
import { AlertState } from "@/components/ui/AlertState";

const getCategoryImage = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop';
  if (normalized.includes('burger')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop';
  if (normalized.includes('beverage')) return 'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=600&h=400&fit=crop';
  if (normalized.includes('dessert')) return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop';
  if (normalized.includes('healthy')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop';
  if (normalized.includes('fast food')) return 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=400&fit=crop';
  return 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop';
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchApi<ApiResponse<{ categories: Category[] }>>("/api/categories");
      setCategories(response.data.categories || []);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load categories.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <SectionHeading 
            title="Explore by Category" 
            subtitle="Craving something specific? We've got you covered with our wide variety of cuisines."
            className="mb-0"
          />
          <Link href="/foods" className="flex items-center gap-2 text-primary font-medium hover:underline shrink-0">
            View All Categories <ArrowRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <CategoriesSkeletonGrid />
        ) : error ? (
          <AlertState type="error" message={error} onRetry={loadCategories} />
        ) : categories.length === 0 ? (
          <AlertState type="empty" message="No categories available right now." />
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={item}>
                <Link href={`/foods?categoryId=${category.id}`} className="group block">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-secondary">
                    <Image
                      src={getCategoryImage(category.name)}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <ArrowRight size={16} className="text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
