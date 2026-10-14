import { prisma } from "../database/prisma";
import { OrderEntity, OrderStatus } from "../../domain/order.entity";
import { ProductCategory } from "../../domain/product.entity";

export class OrderRepository {
  async create(data: {
    userId: string;
    totalCop: number;
    items: {
      productId: string;
      quantity: number;
      unitPriceCop: number;
    }[];
  }): Promise<OrderEntity> {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        totalCop: data.totalCop,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPriceCop: item.unitPriceCop,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      id: order.id,
      userId: order.userId,
      status: order.status as OrderStatus,
      totalCop: order.totalCop,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.user,
      items: order.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceCop: item.unitPriceCop,
        product: {
          id: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          description: item.product.description,
          category: item.product.category as ProductCategory,
          priceCop: item.product.priceCop,
          imageUrl: item.product.imageUrl,
          isActive: item.product.isActive,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt,
        },
      })),
    };
  }

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      status: order.status as OrderStatus,
      totalCop: order.totalCop,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceCop: item.unitPriceCop,
        product: {
          id: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          description: item.product.description,
          category: item.product.category as ProductCategory,
          priceCop: item.product.priceCop,
          imageUrl: item.product.imageUrl,
          isActive: item.product.isActive,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt,
        },
      })),
    }));
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      status: order.status as OrderStatus,
      totalCop: order.totalCop,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.user,
      items: order.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceCop: item.unitPriceCop,
        product: {
          id: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          description: item.product.description,
          category: item.product.category as ProductCategory,
          priceCop: item.product.priceCop,
          imageUrl: item.product.imageUrl,
          isActive: item.product.isActive,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt,
        },
      })),
    }));
  }

  async findById(id: string): Promise<OrderEntity | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) return null;

    return {
      id: order.id,
      userId: order.userId,
      status: order.status as OrderStatus,
      totalCop: order.totalCop,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.user,
      items: order.items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceCop: item.unitPriceCop,
        product: {
          id: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          description: item.product.description,
          category: item.product.category as ProductCategory,
          priceCop: item.product.priceCop,
          imageUrl: item.product.imageUrl,
          isActive: item.product.isActive,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt,
        },
      })),
    };
  }
}

export const orderRepository = new OrderRepository();
