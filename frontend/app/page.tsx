import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedRestaurants from "@/components/home/FeaturedRestaurants";
import FeaturedFoods from "@/components/home/FeaturedFoods";
import Promotions from "@/components/home/Promotions";
import HowItWorks from "@/components/home/HowItWorks";
import FinalCTA from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Categories />
      <FeaturedRestaurants />
      <FeaturedFoods />
      <Promotions />
      <HowItWorks />
      <FinalCTA />
    </div>
  );
}
