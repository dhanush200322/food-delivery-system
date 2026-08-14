import prisma from '../lib/prisma';


export interface FoodFilterOptions {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: string;
  maxPrice?: string;
  minRating?: number;
  isAvailable?: boolean;
  sortBy?: 'rating' | 'price' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export const getAllFoods = async (options: FoodFilterOptions) => {
  const {
    page = 1,
    limit = 12,
    search,
    categoryId,
    minPrice,
    maxPrice,
    minRating,
    isAvailable,
    sortBy = 'popularity',
    sortOrder = 'desc'
  } = options;

  const skip = (page - 1) * limit;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { restaurant: { name: { contains: search, mode: 'insensitive' } } }
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (minRating !== undefined) {
    where.rating = { gte: minRating };
  }

  if (isAvailable !== undefined) {
    where.isAvailable = isAvailable;
  }

  const orderBy: any = {};
  orderBy[sortBy] = sortOrder;

  const [total, foods] = await Promise.all([
    prisma.food.count({ where }),
    prisma.food.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        restaurant: {
          select: { id: true, name: true, imageUrl: true, cuisineType: true }
        },
        category: {
          select: { id: true, name: true }
        }
      }
    })
  ]);

  return {
    foods,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    filters: {
      search,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      isAvailable,
      sortBy,
      sortOrder
    }
  };
};

export const getFoodById = async (id: string) => {
  const food = await prisma.food.findUnique({
    where: { id },
    include: {
      restaurant: {
        select: { id: true, name: true, imageUrl: true, cuisineType: true }
      },
      category: {
        select: { id: true, name: true }
      }
    }
  });

  if (!food) {
    const error: any = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }

  return food;
};

export const createFood = async (data: any) => {
  const { restaurantId, categoryId } = data;

  // Validate existence of restaurant and category
  const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
  if (!restaurant) {
    const error: any = new Error('Restaurant not found');
    error.statusCode = 404;
    throw error;
  }

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    const error: any = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  const food = await prisma.food.create({
    data: {
      ...data,
      price: data.price
    },
    include: {
      restaurant: { select: { id: true, name: true, imageUrl: true, cuisineType: true } },
      category: { select: { id: true, name: true } }
    }
  });

  return food;
};

export const updateFood = async (id: string, data: any) => {
  const existing = await prisma.food.findUnique({ where: { id } });
  if (!existing) {
    const error: any = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.restaurantId && data.restaurantId !== existing.restaurantId) {
    const restaurant = await prisma.restaurant.findUnique({ where: { id: data.restaurantId } });
    if (!restaurant) {
      const error: any = new Error('New restaurant not found');
      error.statusCode = 404;
      throw error;
    }
  }

  if (data.categoryId && data.categoryId !== existing.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      const error: any = new Error('New category not found');
      error.statusCode = 404;
      throw error;
    }
  }

  const updateData = { ...data };
  if (updateData.price !== undefined) {
    updateData.price = updateData.price;
  }

  const food = await prisma.food.update({
    where: { id },
    data: updateData,
    include: {
      restaurant: { select: { id: true, name: true, imageUrl: true, cuisineType: true } },
      category: { select: { id: true, name: true } }
    }
  });

  return food;
};

export const deleteFood = async (id: string) => {
  const existing = await prisma.food.findUnique({ where: { id } });
  if (!existing) {
    const error: any = new Error('Food item not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if it is referenced by an OrderItem
  const orderItemsCount = await prisma.orderItem.count({
    where: { foodId: id }
  });

  if (orderItemsCount > 0) {
    const error: any = new Error('Cannot delete food because it is referenced by existing orders');
    error.statusCode = 409;
    throw error;
  }

  // Safe to delete. Prisma handles CartItems/Favorites cascade if set in schema,
  // but OrderItems is restricted.
  await prisma.food.delete({
    where: { id }
  });

  return { success: true };
};
