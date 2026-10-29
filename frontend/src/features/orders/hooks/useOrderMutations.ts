import { CreateOrderInput } from "../domain";
import { OrderService } from "../services/order.service";

export function useOrderMutations() {
  return {
    createOrder: (input: CreateOrderInput) => OrderService.create(input),
  };
}