"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Clock, Star, MapPin, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-b from-secondary/50 to-background">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-orange-400/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Side Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ opacity }}
            className="flex flex-col items-start gap-6 pt-10 lg:pt-0 z-10"
          >
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium rounded-full bg-background border border-border shadow-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Fresh • Fast • Delivered
            </Badge>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Crave it. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                We deliver it.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-[500px] leading-relaxed">
              Discover great food from the best local restaurants, delivered hot and fresh directly to your door in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
              <Link href="/foods">
                <Button size="lg" className="w-full sm:w-auto rounded-full text-base h-14 px-8 group">
                  Explore Food
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              </Link>
              <Link href="/restaurants">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-base h-14 px-8 bg-background">
                  Browse Restaurants
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 mt-8 border-t border-border/50 pt-8 w-full">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 font-bold text-xl">
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                  <span>4.9</span>
                </div>
                <span className="text-sm text-muted-foreground">Top Rated</span>
              </div>
              <div className="w-px h-10 bg-border"></div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 font-bold text-xl">
                  10K<span className="text-primary">+</span>
                </div>
                <span className="text-sm text-muted-foreground">Happy Customers</span>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block"></div>
              <div className="flex-col gap-1 hidden sm:flex">
                <div className="flex items-center gap-1 font-bold text-xl">
                  30<span className="text-primary">m</span>
                </div>
                <span className="text-sm text-muted-foreground">Avg. Delivery</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side Visuals */}
          <div className="relative w-full h-[500px] lg:h-[700px] hidden md:block">
            <motion.div 
              style={{ y: y1 }}
              className="absolute top-[10%] right-0 w-[80%] h-[70%] rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              <Image 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=800&fit=crop"
                alt="Delicious food delivery"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Hot Steam Animation ("Drool" effect) */}
              <div className="absolute inset-0 pointer-events-none flex justify-center overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`steam-${i}`}
                    className="absolute bottom-[30%] w-12 h-12 bg-white/20 rounded-full blur-[10px]"
                    initial={{ 
                      opacity: 0, 
                      y: 0, 
                      x: (i - 2) * 20,
                      scale: 1 
                    }}
                    animate={{ 
                      opacity: [0, 0.4, 0], 
                      y: -150 - (Math.random() * 50),
                      x: (i - 2) * 30 + (Math.random() * 20 - 10),
                      scale: [1, 2, 3] 
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.8,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating Card 1 */}
            <motion.div 
              style={{ y: y2 }}
              className="absolute top-[20%] left-0 z-20 bg-background p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="bg-primary/10 p-3 rounded-full text-primary">
                <Clock size={24} />
              </div>
              <div>
                <p className="font-bold">30 min</p>
                <p className="text-xs text-muted-foreground">Fast delivery</p>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div 
              style={{ y: y1 }}
              className="absolute bottom-[25%] -right-[5%] z-20 bg-background p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                <Star size={24} className="fill-yellow-600" />
              </div>
              <div>
                <p className="font-bold">4.9 Rating</p>
                <p className="text-xs text-muted-foreground">Top rated</p>
              </div>
            </motion.div>

            {/* Floating Card 3 */}
            <motion.div 
              className="absolute bottom-[10%] left-[15%] z-20 bg-background p-4 rounded-2xl shadow-xl border border-border/50 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold">Live Tracking</p>
                <p className="text-xs text-muted-foreground">Know where it is</p>
              </div>
            </motion.div>

          </div>

          {/* Mobile Visual (Simplified) */}
          <div className="md:hidden relative w-full h-[300px] mt-8 rounded-2xl overflow-hidden shadow-xl">
            <Image 
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop"
              alt="Delicious food delivery"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm p-3 rounded-xl flex items-center gap-3">
              <Clock className="text-primary" size={20} />
              <span className="font-bold text-sm">30 min Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
