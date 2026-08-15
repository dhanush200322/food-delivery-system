"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, Heart, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-primary">
            FOODORA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/restaurants" className="text-sm font-medium hover:text-primary transition-colors">
            Restaurants
          </Link>
          <Link href="/foods" className="text-sm font-medium hover:text-primary transition-colors">
            Menu
          </Link>
          <Link href="/offers" className="text-sm font-medium hover:text-primary transition-colors">
            Offers
          </Link>
          {isAuthenticated && (
            <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors">
              Orders
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-bold text-destructive hover:text-destructive/80 transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-5">
          <button className="text-foreground hover:text-primary transition-colors">
            <Search size={20} />
            <span className="sr-only">Search</span>
          </button>
          
          {isAuthenticated && (
            <Link href="/favorites" className="text-foreground hover:text-primary transition-colors">
              <Heart size={20} />
              <span className="sr-only">Favorites</span>
            </Link>
          )}
          
          <Link href="/cart" className="text-foreground hover:text-primary transition-colors relative">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
            <span className="sr-only">Cart</span>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-border">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold">{user?.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user?.role.toLowerCase()}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-secondary text-foreground hover:bg-destructive hover:text-destructive-foreground px-3 py-2 rounded-full font-medium transition-all duration-300"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/login" className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-full font-medium transition-all duration-300">
                <User size={16} />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <Link href="/cart" className="relative text-foreground">
            <ShoppingBag size={24} />
            {itemCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-foreground focus:outline-none"
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-background flex flex-col md:hidden"
          >
            <div className="p-4 flex items-center justify-between border-b border-border">
              <span className="text-2xl font-bold text-primary">FOODORA</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-foreground rounded-full bg-secondary"
              >
                <X size={24} />
              </button>
            </div>
            
            {isAuthenticated && (
              <div className="p-6 pb-0 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold">{user?.name}</div>
                  <div className="text-sm text-muted-foreground capitalize">{user?.role.toLowerCase()}</div>
                </div>
              </div>
            )}
            
            <nav className="flex flex-col p-6 gap-6 text-lg font-medium">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/restaurants" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">
                Restaurants
              </Link>
              <Link href="/foods" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">
                Menu
              </Link>
              <Link href="/offers" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">
                Offers
              </Link>
              {isAuthenticated && (
                <>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">
                    Order History
                  </Link>
                  <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors">
                    Favorites
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-destructive transition-colors">
                  Admin Dashboard
                </Link>
              )}
            </nav>
            <div className="mt-auto p-6 border-t border-border flex flex-col gap-4">
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-secondary text-foreground hover:bg-destructive hover:text-destructive-foreground py-3 rounded-xl font-medium w-full transition-colors"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium w-full">
                    <User size={18} />
                    <span>Log In</span>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-secondary text-foreground py-3 rounded-xl font-medium w-full">
                    <span>Create Account</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
