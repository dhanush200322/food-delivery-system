import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Food Delivery System — Discover. Order. Enjoy.",
  description: "A modern food delivery platform for discovering restaurants, exploring food, and ordering meals online.",
  keywords: ["food delivery", "restaurants", "online food ordering", "meals", "local restaurants", "food ordering platform"],
  openGraph: {
    title: "Food Delivery System — Discover. Order. Enjoy.",
    description: "A modern food delivery platform for discovering restaurants, exploring food, and ordering meals online.",
    url: "https://food-delivery-system-m9nm.onrender.com",
    siteName: "Food Delivery System",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Delivery System — Discover. Order. Enjoy.",
    description: "A modern food delivery platform for discovering restaurants, exploring food, and ordering meals online.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
