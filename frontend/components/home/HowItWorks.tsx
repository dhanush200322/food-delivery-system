"use client";

import { motion, Variants } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Search, ListChecks, CreditCard, Utensils } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose your food",
    description: "Browse thousands of menus to find the food you like.",
    icon: Search,
  },
  {
    number: "02",
    title: "Customize your order",
    description: "Add extras, choose sides, and make it exactly how you want.",
    icon: ListChecks,
  },
  {
    number: "03",
    title: "Place your order",
    description: "Pay securely online or with cash on delivery.",
    icon: CreditCard,
  },
  {
    number: "04",
    title: "Enjoy your meal",
    description: "Food is prepared & delivered to your door swiftly.",
    icon: Utensils,
  },
];

export default function HowItWorks() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <SectionHeading 
          title="How It Works" 
          subtitle="Your favorite food is just four simple steps away."
          centered
          className="mb-16"
        />

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={item} className="relative flex flex-col items-center text-center group">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-border/80 -z-10" />
              )}
              
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-card shadow-sm border border-border flex items-center justify-center group-hover:shadow-md group-hover:-translate-y-2 transition-all duration-300">
                  <step.icon size={36} className="text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm max-w-[200px]">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
