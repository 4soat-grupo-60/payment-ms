import "reflect-metadata";
import { Product } from "../entities/product";
import { Category } from "../value_object/category";
import { IProductGateway } from "../../interfaces/gateways";

export class ProductUseCases {
  static async list(productGateway: IProductGateway): Promise<Array<Product>> {
    return await productGateway.getProducts();
  }

  static async listByCategory(
    category: Category,
    productGateway: IProductGateway
  ): Promise<Array<Product>> {
    return await productGateway.getProductsByCategory(category);
  }

  static async save(
    product: Product,
    productGateway: IProductGateway
  ): Promise<Product> {
    return await productGateway.saveProduct(product);
  }

  static async update(
    product: Product,
    productGateway: IProductGateway
  ): Promise<Product> {
    return await productGateway.updateProduct(product);
  }

  static async delete(
    id: string,
    productGateway: IProductGateway
  ): Promise<void> {
    return await productGateway.deleteProduct(id);
  }
}
