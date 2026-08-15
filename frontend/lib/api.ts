import { getToken } from '@/lib/auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://food-delivery-system-m9nm.onrender.com";

export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Set up a custom timeout (default 60s) to handle extreme cold starts on Render free tier
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);
  
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // Response wasn't JSON
      }
      
      // Friendly messages for specific status codes
      if (response.status === 401) {
        errorMessage = "Please log in to continue.";
      } else if (response.status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (response.status === 404) {
        errorMessage = "The requested resource was not found.";
      } else if (response.status >= 500) {
        errorMessage = "Food service is waking up… this may take a moment. Please try again.";
      }
      
      throw new ApiError(errorMessage, response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Catch fetch network errors or our manual timeout abort
    if (error.name === 'AbortError' || error.message?.includes('fetch')) {
      throw new ApiError("Food service is waking up… this may take a moment. Please refresh.", 0);
    }
    
    throw new ApiError("An unexpected error occurred. Please try again later.", 0);
  }
}

// --- Specific API Methods ---
import { Restaurant, Food, Category, Promotion, ApiResponse, PaginatedData } from '@/types';

// Restaurants
export async function getRestaurants(searchParams?: URLSearchParams) {
  const query = searchParams ? `?${searchParams.toString()}` : "";
  const res = await fetchApi<ApiResponse<{ restaurants: Restaurant[], pagination: any }>>(`/api/restaurants${query}`);
  return {
    restaurants: res.data.restaurants || [],
    pagination: res.data.pagination
  };
}

export async function getRestaurant(id: string) {
  const res = await fetchApi<ApiResponse<{ restaurant: Restaurant }>>(`/api/restaurants/${id}`);
  return res.data.restaurant;
}

// Foods
export async function getFoods(searchParams?: URLSearchParams) {
  const query = searchParams ? `?${searchParams.toString()}` : "";
  const res = await fetchApi<ApiResponse<{ foods: Food[], pagination: any }>>(`/api/foods${query}`);
  return {
    foods: res.data.foods || [],
    pagination: res.data.pagination
  };
}

export async function getFood(id: string) {
  const res = await fetchApi<ApiResponse<{ food: Food }>>(`/api/foods/${id}`);
  return res.data.food;
}

// Categories
export async function getCategories() {
  const res = await fetchApi<ApiResponse<{ categories: Category[] }>>('/api/categories');
  return res.data.categories || [];
}

// Promotions
export async function getPromotions() {
  const res = await fetchApi<ApiResponse<{ promotions: Promotion[] }>>('/api/promotions');
  return res.data.promotions || [];
}

// --- Cart ---
import { Cart, Favorite, Order } from '@/types';

export async function getCart() {
  const res = await fetchApi<ApiResponse<{ cart: Cart }>>('/api/cart');
  return res.data.cart;
}

export async function addToCart(foodId: string, quantity: number = 1) {
  const res = await fetchApi<ApiResponse<{ cart: Cart }>>('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({ foodId, quantity }),
  });
  return res.data.cart;
}

export async function updateCartItem(foodId: string, quantity: number) {
  const res = await fetchApi<ApiResponse<{ cart: Cart }>>(`/api/cart/items/${foodId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
  return res.data.cart;
}

export async function removeCartItem(foodId: string) {
  const res = await fetchApi<ApiResponse<{ cart: Cart }>>(`/api/cart/items/${foodId}`, {
    method: 'DELETE',
  });
  return res.data.cart;
}

export async function clearCart() {
  const res = await fetchApi<ApiResponse<{ cart: Cart }>>('/api/cart', {
    method: 'DELETE',
  });
  return res.data.cart;
}

// --- Favorites ---
export async function getFavorites() {
  const res = await fetchApi<ApiResponse<{ favorites: Favorite[] }>>('/api/favorites');
  return res.data.favorites || [];
}

export async function addFavorite(foodId: string) {
  const res = await fetchApi<ApiResponse<{ favorite: Favorite }>>(`/api/favorites/${foodId}`, {
    method: 'POST',
  });
  return res.data.favorite;
}

export async function removeFavorite(foodId: string) {
  await fetchApi(`/api/favorites/${foodId}`, {
    method: 'DELETE',
  });
}

// --- Orders ---
export async function createOrder(payload: { customerName: string; customerPhone: string; deliveryAddress: string }) {
  const res = await fetchApi<ApiResponse<{ order: Order }>>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data.order;
}

export async function getMyOrders(page: number = 1, limit: number = 10) {
  const res = await fetchApi<ApiResponse<{ orders: Order[], pagination: any }>>(`/api/orders?page=${page}&limit=${limit}`);
  return {
    orders: res.data.orders || [],
    pagination: res.data.pagination
  };
}

export async function getMyOrderById(id: string) {
  const res = await fetchApi<ApiResponse<{ order: Order }>>(`/api/orders/${id}`);
  return res.data.order;
}
