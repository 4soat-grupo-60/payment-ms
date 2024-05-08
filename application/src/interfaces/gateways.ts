import { Product } from "../domain/entities/product";
import { Category } from "../domain/value_object/category";

export interface IProductGateway {
  getProductsByCategory(category: Category): Promise<Array<Product>>;
  getProductByIDs(ids: number[]): Promise<Array<Product>>;
  getProducts(): Promise<Array<Product>>;
  saveProduct(product: Product): Promise<Product>;
  updateProduct(product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}
