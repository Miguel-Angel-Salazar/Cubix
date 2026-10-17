import { httpClient } from "../../common/http";
import {
  CreateOrderInput,
  Order,
  OrdersResponse,
  SingleOrderResponse,
} from "../domain";

export class OrderService {
  /**
   * Crea un nuevo pedido a nombre del usuario del token
   */
  static async create(input: CreateOrderInput): Promise<Order> {
    const response = await httpClient<SingleOrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return response.data;
  }

  /**
   * Obtiene los pedidos del usuario autenticado (/api/orders/mias)
   */
  static async getMyOrders(): Promise<Order[]> {
    const response = await httpClient<OrdersResponse>("/api/orders/mias");
    return response.data || [];
  }

  /**
   * Obtiene todos los pedidos del sistema (solo rol ADMIN) (/api/orders)
   */
  static async getAllOrders(): Promise<Order[]> {
    const response = await httpClient<OrdersResponse>("/api/orders");
    return response.data || [];
  }

  /**
   * Obtiene el detalle de un pedido por ID
   */
  static async getById(id: string): Promise<Order> {
    const response = await httpClient<SingleOrderResponse>(`/api/orders/${id}`);
    return response.data;
  }
}
