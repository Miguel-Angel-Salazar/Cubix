import { CreateProductInput, UpdateProductInput } from "../domain";
import { ProductService } from "../services/product.service";

export function useProductMutations() {
  return {
    createProduct: (input: CreateProductInput) => ProductService.create(input),
    updateProduct: (id: string, input: UpdateProductInput) =>
      ProductService.update(id, input),
    deleteProduct: (id: string) => ProductService.delete(id),
  };
}