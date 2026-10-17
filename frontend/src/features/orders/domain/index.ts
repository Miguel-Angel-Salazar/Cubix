import { Product } from "../../products/domain";
import { User } from "../../auth/domain";

export type OrderStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPriceCop: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalCop: number;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, "id" | "name" | "email">;
  items: OrderItem[];
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: CreateOrderItemInput[];
}

export interface OrdersResponse {
  data: Order[];
}

export interface SingleOrderResponse {
  message?: string;
  data: Order;
}
