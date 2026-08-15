export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'CUSTOMER' | 'ADMIN' | 'RESTAURANT_OWNER' | 'DELIVERY_DRIVER';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phoneNumber: string | null;
  imageUrl: string;
  cuisineType: string;
  rating: number;
  deliveryTime: string;
  minimumOrder: number;
  deliveryFee: number;
  isAvailable: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantId: string;
  categoryId: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  restaurant?: Restaurant;
  category?: Category;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  bannerImageUrl: string;
  validUntil: string;
  isActive: boolean;
  restaurantId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedData<T> {
  data: T[];
  pagination: Pagination;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CartItem {
  id: string;
  cartId: string;
  foodId: string;
  quantity: number;
  unitPrice: string | number;
  subtotal: string | number;
  createdAt: string;
  updatedAt: string;
  food: Food;
}

export interface Cart {
  id: string | null;
  userId: string;
  itemCount: number;
  subtotal: string | number;
  items: CartItem[];
}

export interface Favorite {
  id: string;
  userId: string;
  foodId: string;
  createdAt: string;
  food: Food;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  foodId: string;
  quantity: number;
  unitPrice: string | number;
  subtotal: string | number;
  food: Food;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  totalAmount: string | number;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
  restaurant?: Restaurant;
}
