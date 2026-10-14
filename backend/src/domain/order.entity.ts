import { ProductEntity } from "./product.entity";

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface OrderItemEntity {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPriceCop: number;
  product?: ProductEntity;
}

export interface OrderEntity {
  id: string;
  userId: string;
  status: OrderStatus;
  totalCop: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItemEntity[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
}
