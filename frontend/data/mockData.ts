import { Category, Food, Promotion, Restaurant } from "@/types";

export const mockCategories: Category[] = [
  { id: "1", name: "Pizza", description: "", imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop", createdAt: "", updatedAt: "" },
  { id: "2", name: "Burgers", description: "", imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop", createdAt: "", updatedAt: "" },
  { id: "3", name: "Healthy", description: "", imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop", createdAt: "", updatedAt: "" },
  { id: "4", name: "Desserts", description: "", imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop", createdAt: "", updatedAt: "" },
  { id: "5", name: "Asian", description: "", imageUrl: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&h=400&fit=crop", createdAt: "", updatedAt: "" },
  { id: "6", name: "Beverages", description: "", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop", createdAt: "", updatedAt: "" },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: "r1",
    name: "Urban Crust",
    description: "The best Italian / Pizza in town.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    cuisineType: "Italian / Pizza",
    rating: 4.8,
    deliveryTime: "25-35 mins",
    isAvailable: true,
    address: "",
    phoneNumber: null,
    minimumOrder: 10,
    deliveryFee: 2.99,
    ownerId: "owner1",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "r2",
    name: "Burger District",
    description: "The best American / Burgers in town.",
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
    cuisineType: "American / Burgers",
    rating: 4.5,
    deliveryTime: "20-30 mins",
    isAvailable: true,
    address: "",
    phoneNumber: null,
    minimumOrder: 10,
    deliveryFee: 2.99,
    ownerId: "owner2",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "r3",
    name: "Spice Route",
    description: "The best Indian in town.",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
    cuisineType: "Indian",
    rating: 4.7,
    deliveryTime: "30-40 mins",
    isAvailable: true,
    address: "",
    phoneNumber: null,
    minimumOrder: 10,
    deliveryFee: 2.99,
    ownerId: "owner3",
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "r4",
    name: "Green Bowl",
    description: "The best Healthy in town.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    cuisineType: "Healthy",
    rating: 4.9,
    deliveryTime: "25-35 mins",
    isAvailable: true,
    address: "",
    phoneNumber: null,
    minimumOrder: 10,
    deliveryFee: 2.99,
    ownerId: "owner4",
    createdAt: "",
    updatedAt: ""
  },
];

export const mockFoods: Food[] = [
  {
    id: "f1",
    name: "Truffle Mushroom Pizza",
    description: "Earthy truffles with mixed mushrooms on a crispy crust.",
    price: 18.99,
    imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    restaurantId: "r1",
    categoryId: "1",
    isAvailable: true,
    createdAt: "",
    updatedAt: "",
    restaurant: mockRestaurants[0]
  },
  {
    id: "f2",
    name: "Classic Smash Burger",
    description: "Double patty smashed to perfection with American cheese.",
    price: 12.50,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    restaurantId: "r2",
    categoryId: "2",
    isAvailable: true,
    createdAt: "",
    updatedAt: "",
    restaurant: mockRestaurants[1]
  },
  {
    id: "f3",
    name: "Loaded Cheesy Fries",
    description: "Crispy fries smothered in a blend of cheeses and bacon bits.",
    price: 8.99,
    imageUrl: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=600&h=400&fit=crop",
    restaurantId: "r2",
    categoryId: "3",
    isAvailable: true,
    createdAt: "",
    updatedAt: "",
    restaurant: mockRestaurants[1]
  },
  {
    id: "f4",
    name: "Quinoa Power Bowl",
    description: "Healthy quinoa topped with avocado, roasted chickpeas, and tahini.",
    price: 14.50,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    restaurantId: "r4",
    categoryId: "3",
    isAvailable: true,
    createdAt: "",
    updatedAt: "",
    restaurant: mockRestaurants[3]
  }
];

export const mockPromotions: Promotion[] = [
  {
    id: "p1",
    title: "Flat 20% Off First Order",
    description: "Use code WELCOME20 at checkout for a flat 20% off on your first order with us.",
    discountPercentage: 20,
    bannerImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop",
    validUntil: "2026-12-31T23:59:59.000Z",
    isActive: true,
    restaurantId: null,
    createdAt: "",
    updatedAt: ""
  },
  {
    id: "p2",
    title: "Free Delivery Friday",
    description: "Enjoy zero delivery fees on all orders placed this Friday.",
    discountPercentage: 100,
    bannerImageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=400&fit=crop",
    validUntil: "2026-12-31T23:59:59.000Z",
    isActive: true,
    restaurantId: null,
    createdAt: "",
    updatedAt: ""
  }
];
