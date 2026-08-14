import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const getCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          food: {
            include: {
              restaurant: { select: { id: true, name: true } },
              category: { select: { id: true, name: true } }
            }
          }
        }
      }
    }
  });

  if (!cart) {
    return {
      id: null,
      items: [],
      itemCount: 0,
      subtotal: "0.00"
    };
  }

  let cartSubtotal = cart.cartItems.length > 0 
    ? cart.cartItems[0].food.price.mul(0) 
    : "0.00";
    
  let itemCount = 0;

  type CartItemPayload = Prisma.CartItemGetPayload<{
    include: {
      food: {
        include: {
          restaurant: { select: { id: true, name: true } },
          category: { select: { id: true, name: true } }
        }
      }
    }
  }>;

  const formattedItems = cart.cartItems.map((item: CartItemPayload) => {
    const subtotal = item.food.price.mul(item.quantity);
    cartSubtotal = (cartSubtotal as any).add(subtotal);
    itemCount += item.quantity;

    return {
      id: item.id,
      quantity: item.quantity,
      food: {
        id: item.food.id,
        name: item.food.name,
        imageUrl: item.food.imageUrl,
        price: item.food.price.toFixed(2),
        isAvailable: item.food.isAvailable,
        restaurant: item.food.restaurant,
        category: item.food.category
      },
      subtotal: subtotal.toFixed(2)
    };
  });

  return {
    id: cart.id,
    items: formattedItems,
    itemCount,
    subtotal: cart.cartItems.length > 0 ? (cartSubtotal as any).toFixed(2) : cartSubtotal
  };
};

export const addToCart = async (userId: string, foodId: string, quantity: number) => {
  // Check food and restaurant availability
  const food = await prisma.food.findUnique({
    where: { id: foodId },
    include: { restaurant: true }
  });

  if (!food) {
    const error: any = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }

  if (!food.isAvailable) {
    const error: any = new Error('Food item is currently unavailable');
    error.statusCode = 409;
    throw error;
  }

  if (!food.restaurant.isAvailable) {
    const error: any = new Error('Restaurant is currently unavailable');
    error.statusCode = 409;
    throw error;
  }

  // Ensure cart exists
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Check if item already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_foodId: {
        cartId: cart.id,
        foodId: foodId
      }
    }
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > 20) {
      const error: any = new Error('Cannot add more than 20 items of the same food to cart');
      error.statusCode = 400;
      throw error;
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  } else {
    if (quantity > 20) {
      const error: any = new Error('Cannot add more than 20 items of the same food to cart');
      error.statusCode = 400;
      throw error;
    }

    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        foodId,
        quantity
      }
    });
  }

  return await getCart(userId);
};

export const updateQuantity = async (userId: string, foodId: string, quantity: number) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    const error: any = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_foodId: { cartId: cart.id, foodId }
    }
  });

  if (!existingItem) {
    const error: any = new Error('Item not found in cart');
    error.statusCode = 404;
    throw error;
  }

  if (quantity > 20) {
    const error: any = new Error('Cannot have more than 20 items of the same food in cart');
    error.statusCode = 400;
    throw error;
  }

  await prisma.cartItem.update({
    where: { id: existingItem.id },
    data: { quantity }
  });

  return await getCart(userId);
};

export const removeCartItem = async (userId: string, foodId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    const error: any = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_foodId: { cartId: cart.id, foodId }
    }
  });

  if (!existingItem) {
    const error: any = new Error('Item not found in cart');
    error.statusCode = 404;
    throw error;
  }

  await prisma.cartItem.delete({
    where: { id: existingItem.id }
  });

  return await getCart(userId);
};

export const clearCart = async (userId: string) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    return { success: true };
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });

  return { success: true };
};
