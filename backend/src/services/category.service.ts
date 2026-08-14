import prisma from '../lib/prisma';

export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
  return categories;
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    const error: any = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const createCategory = async (data: { name: string; description?: string }) => {
  const existing = await prisma.category.findUnique({
    where: { name: data.name }
  });

  if (existing) {
    const error: any = new Error('Category with this name already exists');
    error.statusCode = 409;
    throw error;
  }

  const category = await prisma.category.create({
    data
  });

  return category;
};

export const updateCategory = async (id: string, data: { name?: string; description?: string }) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    const error: any = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.name && data.name !== existing.name) {
    const nameConflict = await prisma.category.findUnique({
      where: { name: data.name }
    });
    if (nameConflict) {
      const error: any = new Error('Category with this name already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data
  });

  return category;
};

export const deleteCategory = async (id: string) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    const error: any = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  const associatedFoodsCount = await prisma.food.count({
    where: { categoryId: id }
  });

  if (associatedFoodsCount > 0) {
    const error: any = new Error('Cannot delete category while food items are associated with it');
    error.statusCode = 409;
    throw error;
  }

  await prisma.category.delete({
    where: { id }
  });

  return { success: true };
};
