import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold tracking-tight text-primary">
                FOODORA
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              Discover great food. Delivered to your door. We partner with the best restaurants to bring you the finest meals, fast and fresh.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-foreground hover:text-primary hover:shadow-md transition-all font-bold text-xs">
                FB
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-foreground hover:text-primary hover:shadow-md transition-all font-bold text-xs">
                TW
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-foreground hover:text-primary hover:shadow-md transition-all font-bold text-xs">
                IG
              </Link>
              <Link href="#" className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-foreground hover:text-primary hover:shadow-md transition-all font-bold text-xs">
                YT
              </Link>
            </div>
          </div>

          {/* Navigation Col */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-muted-foreground hover:text-primary transition-colors text-sm">Restaurants</Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors text-sm">Menu</Link>
              </li>
              <li>
                <Link href="/offers" className="text-muted-foreground hover:text-primary transition-colors text-sm">Special Offers</Link>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors text-sm">Help Center</Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Contact</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>123 Food Street, Culinary City, FC 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>support@foodora.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Foodora Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="cursor-pointer hover:text-foreground">Made with ❤️ for Food Lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
