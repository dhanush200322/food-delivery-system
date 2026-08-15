"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-card border border-border rounded-3xl p-8 md:p-16 lg:p-20 text-center max-w-4xl mx-auto shadow-sm relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Your next favorite meal is <br className="hidden md:block" />
              <span className="text-primary">one click away.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
              Join thousands of happy customers who trust Foodora for their daily cravings, special dinners, and everything in between.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="lg" className="rounded-full h-14 px-8 text-base group shadow-md hover:shadow-lg">
                Explore Menu
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base shadow-sm">
                Find Restaurants
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
