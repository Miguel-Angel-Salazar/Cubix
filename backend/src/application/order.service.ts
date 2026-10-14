import { CreateOrderDto, OrderEntity } from "../domain/order.entity";
import { BadRequestError, NotFoundError } from "../domain/errors";
import { orderRepository, OrderRepository } from "../infrastructure/repositories/order.repository";
import { productRepository, ProductRepository } from "../infrastructure/repositories/product.repository";

export class OrderService {
  constructor(
    private orderRepo: OrderRepository = orderRepository,
    private productRepo: ProductRepository = productRepository
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<OrderEntity> {
    if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestError("El pedido debe contener al menos un producto");
    }

    const preparedItems: {
      productId: string;
      quantity: number;
      unitPriceCop: number;
    }[] = [];

    let totalCop = 0;

    for (const item of dto.items) {
      if (!item.productId) {
        throw new BadRequestError("Cada ítem debe indicar el ID del producto");
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new BadRequestError("La cantidad debe ser un entero mayor a 0");
      }

      const product = await this.productRepo.findById(item.productId);
      if (!product || !product.isActive) {
        throw new NotFoundError(`Producto con ID ${item.productId} no encontrado o inactivo`);
      }

      preparedItems.push({
        productId: product.id,
        quantity,
        unitPriceCop: product.priceCop,
      });

      totalCop += product.priceCop * quantity;
    }

    return this.orderRepo.create({
      userId,
      items: preparedItems,
      totalCop,
    });
  }

  async getMyOrders(userId: string): Promise<OrderEntity[]> {
    return this.orderRepo.findByUserId(userId);
  }

  async getAllOrders(): Promise<OrderEntity[]> {
    return this.orderRepo.findAll();
  }

  async getOrderById(id: string): Promise<OrderEntity> {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      throw new NotFoundError("Pedido no encontrado");
    }
    return order;
  }
}

export const orderService = new OrderService();
