import prisma from '../lib/prisma';

export const getAllRestaurants = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [total, restaurants] = await Promise.all([
    prisma.restaurant.count(),
    prisma.restaurant.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    restaurants,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getRestaurantById = async (id: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id }
  });

  if (!restaurant) {
    const error: any = new Error('Restaurant not found');
    error.statusCode = 404;
    throw error;
  }

  return restaurant;
};

export const createRestaurant = async (data: any) => {
  const restaurant = await prisma.restaurant.create({
    data
  });

  return restaurant;
};

export const updateRestaurant = async (id: string, data: any) => {
  const existing = await prisma.restaurant.findUnique({ where: { id } });
  if (!existing) {
    const error: any = new Error('Restaurant not found');
    error.statusCode = 404;
    throw error;
  }

  const restaurant = await prisma.restaurant.update({
    where: { id },
    data
  });

  return restaurant;
};

export const deleteRestaurant = async (id: string) => {
  const existing = await prisma.restaurant.findUnique({ where: { id } });
  if (!existing) {
    const error: any = new Error('Restaurant not found');
    error.statusCode = 404;
    throw error;
  }

  // Due to schema setup (onDelete: Cascade), deleting a restaurant will also delete associated foods.
  await prisma.restaurant.delete({
    where: { id }
  });

  return { success: true };
};
