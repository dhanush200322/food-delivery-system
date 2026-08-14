import prisma from '../lib/prisma';

export const getActivePromotions = async () => {
  const now = new Date();
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now }
    },
    orderBy: { startDate: 'desc' }
  });

  return promotions.map((p: any) => ({
    ...p,
    discountPercentage: p.discountPercentage ? p.discountPercentage.toFixed(2) : null,
    discountAmount: p.discountAmount ? p.discountAmount.toFixed(2) : null
  }));
};

export const getPromotionById = async (id: string) => {
  const promotion = await prisma.promotion.findUnique({ where: { id } });
  
  if (!promotion) {
    const error: any = new Error('Promotion not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    ...promotion,
    discountPercentage: promotion.discountPercentage ? promotion.discountPercentage.toFixed(2) : null,
    discountAmount: promotion.discountAmount ? promotion.discountAmount.toFixed(2) : null
  };
};

export const createPromotion = async (data: {
  title: string;
  description?: string;
  imageUrl?: string;
  discountPercentage?: number;
  discountAmount?: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}) => {
  const promotion = await prisma.promotion.create({ data });

  return {
    ...promotion,
    discountPercentage: promotion.discountPercentage ? promotion.discountPercentage.toFixed(2) : null,
    discountAmount: promotion.discountAmount ? promotion.discountAmount.toFixed(2) : null
  };
};

export const updatePromotion = async (id: string, data: {
  title?: string;
  description?: string;
  imageUrl?: string;
  discountPercentage?: number;
  discountAmount?: number;
  isActive?: boolean;
  startDate?: Date;
  endDate?: Date;
}) => {
  const existing = await prisma.promotion.findUnique({ where: { id } });
  if (!existing) {
    const error: any = new Error('Promotion not found');
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.promotion.update({
    where: { id },
    data
  });

  return {
    ...updated,
    discountPercentage: updated.discountPercentage ? updated.discountPercentage.toFixed(2) : null,
    discountAmount: updated.discountAmount ? updated.discountAmount.toFixed(2) : null
  };
};

export const deletePromotion = async (id: string) => {
  const existing = await prisma.promotion.findUnique({ where: { id } });
  if (!existing) {
    const error: any = new Error('Promotion not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.promotion.delete({ where: { id } });
  return { success: true };
};
