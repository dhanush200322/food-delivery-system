"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Copy, CheckCircle2, Ticket, Sparkles, CloudRain, Trophy, Flag, PartyPopper } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const offers = [
  {
    id: "super",
    title: "Super Saver Deals",
    description: "Get a flat 50% off on your favorite meals. Limited time only!",
    code: "SUPER50",
    discount: "50% OFF",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
  },
  {
    id: "independence",
    title: "Independence Day Special",
    description: "Celebrate freedom with 20% off on all patriotic combos.",
    code: "INDEPENDENCE20",
    discount: "20% OFF",
    icon: Flag,
    color: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1533227268428-f9ed0900f953?w=800&q=80"
  },
  {
    id: "festival",
    title: "Festival Bonanza",
    description: "Light up your festivals with free desserts on orders above $30.",
    code: "FESTIVAL30",
    discount: "FREE DESSERT",
    icon: PartyPopper,
    color: "from-amber-400 to-orange-500",
    image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4?w=800&q=80"
  },
  {
    id: "cricket",
    title: "Match Day Mania",
    description: "Cheer for your team with 40% off on snacks and beverages.",
    code: "CRICKET40",
    discount: "40% OFF",
    icon: Trophy,
    color: "from-green-500 to-emerald-600",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80"
  },
  {
    id: "rainy",
    title: "Cozy Rainy Day",
    description: "Enjoy the weather with 15% off hot soups, coffee, and comfort food.",
    code: "RAINY15",
    discount: "15% OFF",
    icon: CloudRain,
    color: "from-cyan-500 to-blue-500",
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80"
  }
];

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6">
            <Ticket size={18} />
            <span>Exclusive Deals</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Unbeatable <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Offers</span> Just For You
          </h1>
          <p className="text-lg text-muted-foreground">
            Whether it's match day, a rainy evening, or a festive celebration, we have the perfect discount to make your meal even sweeter.
          </p>
        </motion.div>

        {/* Offers Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {offers.map((offer) => {
            const Icon = offer.icon;
            
            return (
              <motion.div 
                key={offer.id} 
                variants={itemVariants}
                className="group relative rounded-3xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Image Background */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={offer.image} 
                    alt={offer.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${offer.color} opacity-60 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm text-foreground font-black px-4 py-1.5 rounded-full shadow-lg text-sm">
                    {offer.discount}
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <Icon size={20} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-2">{offer.description}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-secondary/50 border border-border/50 rounded-xl p-3 flex items-center justify-between">
                      <span className="font-mono font-bold tracking-wider text-primary">{offer.code}</span>
                      <button 
                        onClick={() => handleCopy(offer.code)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Copy promo code"
                      >
                        {copiedCode === offer.code ? (
                          <CheckCircle2 size={18} className="text-green-500" />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>
                    <Link href="/foods">
                      <Button className="h-[46px] rounded-xl px-6 font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
                        Use Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mt-16 bg-gradient-to-r from-primary to-orange-500 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Craving Something Special?</h2>
            <p className="text-primary-foreground/90 text-lg max-w-xl">
              Don't wait for an occasion. Treat yourself to our chef's specials and discover your next favorite meal today.
            </p>
          </div>
          <div className="relative z-10 shrink-0">
            <Link href="/foods">
              <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg font-bold shadow-xl hover:scale-105 transition-transform">
                Explore Menu
              </Button>
            </Link>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
