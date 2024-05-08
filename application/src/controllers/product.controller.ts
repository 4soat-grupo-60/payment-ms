import { Product } from "../domain/entities/product";
import { Category } from "../domain/value_object/category";
import { ProductGateway } from "../gateways/repositories/products";
import { DbConnection } from "../interfaces/dbconnection";
import { ProductUseCases } from "../domain/usecases/product";
import { ProductPresenter } from "./presenters/product.presenter";

export class ProductController {
  static async getAllProducts(dbConnection: DbConnection) {
    const productGateway = new ProductGateway(dbConnection);
    const allProducts = await ProductUseCases.list(productGateway);

    return ProductPresenter.mapList(allProducts);
  }

  static async getAllProductsByCategory(
    category: Category,
    dbConnection: DbConnection
  ) {
    const productGateway = new ProductGateway(dbConnection);
    const allProductsByCategory = await ProductUseCases.listByCategory(
      category,
      productGateway
    );

    return ProductPresenter.mapList(allProductsByCategory);
  }

  static async createProduct(product: Product, dbConnection: DbConnection) {
    const productGateway = new ProductGateway(dbConnection);
    const newProduct = await ProductUseCases.save(product, productGateway);

    return ProductPresenter.map(newProduct);
  }

  static async updateProduct(product: Product, dbConnection: DbConnection) {
    const productGateway = new ProductGateway(dbConnection);

    const updatedProduct = await ProductUseCases.update(
      product,
      productGateway
    );

    return ProductPresenter.map(updatedProduct);
  }

  static async deleteProduct(productId: string, dbConnection: DbConnection) {
    const productGateway = new ProductGateway(dbConnection);
    return await ProductUseCases.delete(productId, productGateway);
  }
}
