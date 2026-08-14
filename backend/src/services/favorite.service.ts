import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

export const getFavorites = async (userId: string) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      food: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          price: true,
          rating: true,
          popularity: true,
          isAvailable: true,
          restaurant: {
            select: { id: true, name: true, imageUrl: true, cuisineType: true, isAvailable: true }
          },
          category: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });

  type FavoritePayload = Prisma.FavoriteGetPayload<{
    include: {
      food: {
        select: {
          id: true;
          name: true;
          description: true;
          imageUrl: true;
          price: true;
          rating: true;
          popularity: true;
          isAvailable: true;
          restaurant: { select: { id: true; name: true; imageUrl: true; cuisineType: true; isAvailable: true } };
          category: { select: { id: true; name: true } };
        }
      }
    }
  }>;

  const formattedFavorites = favorites.map((fav: FavoritePayload) => ({
    id: fav.id,
    createdAt: fav.createdAt,
    food: {
      ...fav.food,
      price: fav.food.price.toFixed(2)
    }
  }));

  return formattedFavorites;
};

export const addFavorite = async (userId: string, foodId: string) => {
  const food = await prisma.food.findUnique({ where: { id: foodId } });
  if (!food) {
    const error: any = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_foodId: { userId, foodId }
    }
  });

  if (existing) {
    const error: any = new Error('Food is already in favorites');
    error.statusCode = 409;
    throw error;
  }

  const favorite = await prisma.favorite.create({
    data: { userId, foodId },
    include: {
      food: {
        select: {
          id: true,
          name: true,
          description: true,
          imageUrl: true,
          price: true,
          rating: true,
          popularity: true,
          isAvailable: true,
          restaurant: {
            select: { id: true, name: true, imageUrl: true, cuisineType: true, isAvailable: true }
          },
          category: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });

  return {
    id: favorite.id,
    createdAt: favorite.createdAt,
    food: {
      ...favorite.food,
      price: favorite.food.price.toFixed(2)
    }
  };
};

export const removeFavorite = async (userId: string, foodId: string) => {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_foodId: { userId, foodId }
    }
  });

  if (!existing) {
    const error: any = new Error('Favorite not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.favorite.delete({
    where: { id: existing.id }
  });

  return { success: true };
};
