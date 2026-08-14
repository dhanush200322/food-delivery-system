import prisma from '../lib/prisma';

export const checkout = async (userId: string, data: { customerName: string; customerPhone: string; deliveryAddress: string }) => {
  return await prisma.$transaction(async (tx: any) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            food: {
              include: { restaurant: true }
            }
          }
        }
      }
    });

    if (!cart || cart.cartItems.length === 0) {
      const error: any = new Error('Cannot place order with an empty cart');
      error.statusCode = 400;
      throw error;
    }

    let totalAmount = cart.cartItems.length > 0 ? cart.cartItems[0].food.price.mul(0) : "0.00";
    const orderItemsData: any[] = [];

    for (const item of cart.cartItems) {
      if (!item.food) {
        const error: any = new Error('One or more food items no longer exist');
        error.statusCode = 409;
        throw error;
      }
      if (!item.food.isAvailable) {
        const error: any = new Error('One or more food items are currently unavailable');
        error.statusCode = 409;
        throw error;
      }
      if (!item.food.restaurant.isAvailable) {
        const error: any = new Error('One or more restaurants are currently unavailable');
        error.statusCode = 409;
        throw error;
      }

      const unitPrice = item.food.price;
      const quantity = item.quantity;
      const subtotal = unitPrice.mul(quantity);

      totalAmount = (totalAmount as any).add(subtotal);

      orderItemsData.push({
        foodId: item.foodId,
        quantity,
        unitPrice,
        subtotal
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        deliveryAddress: data.deliveryAddress,
        totalAmount,
        status: 'PENDING',
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        orderItems: {
          include: {
            food: { select: { id: true, name: true, imageUrl: true } }
          }
        }
      }
    });

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    return order;
  });
};

export const getMyOrders = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [total, orders] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            food: { select: { id: true, name: true, imageUrl: true } }
          }
        }
      }
    })
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getMyOrderById = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          food: { select: { id: true, name: true, imageUrl: true } }
        }
      }
    }
  });

  if (!order) {
    const error: any = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  if (order.userId !== userId) {
    const error: any = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  return order;
};

export const getAllOrders = async (page: number, limit: number, status?: string) => {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            food: { select: { id: true, name: true, imageUrl: true } }
          }
        }
      }
    })
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: []
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    const error: any = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  const currentStatus = order.status;

  if (!VALID_TRANSITIONS[currentStatus].includes(newStatus)) {
    const error: any = new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    error.statusCode = 409;
    throw error;
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus as any },
    include: {
      orderItems: {
        include: {
          food: { select: { id: true, name: true, imageUrl: true } }
        }
      }
    }
  });

  return updatedOrder;
};
