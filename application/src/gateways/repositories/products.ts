import { ObjectId } from "mongodb";

import { Product } from "../../domain/entities/product";
import { Category } from "../../domain/value_object/category";
import { IProductGateway } from "../../interfaces/gateways";
import { DbConnection } from "../../interfaces/dbconnection";
import ProductMapper from "../mapper/product.mapper";
import RecordNotFoundError from "../../domain/error/RecordNotFoundError";

export class ProductGateway implements IProductGateway {
  private repositoryData: DbConnection;

  constructor(connection: DbConnection) {
    this.repositoryData = connection;
  }

  async getProductsByCategory(category: Category): Promise<Product[]> {
    try {
      await this.repositoryData.connect();

      const database = this.repositoryData.db("products-ms");
      const products = database.collection("products");

      const query = { category: category.getCategory() };

      const cursor = products.find(query);

      const result = await cursor.toArray();

      return result.map(ProductMapper.map);
    } finally {
      await this.repositoryData.close();
    }
  }

  async getProductByIDs(ids: number[]): Promise<Product[]> {
    try {
      await this.repositoryData.connect();

      const dababase = this.repositoryData.db("products-ms");
      const products = dababase.collection("products");

      const query = { id: { $in: ids } };

      const cursor = products.find(query);

      const result = await cursor.toArray();

      return result.map(ProductMapper.map);
    } finally {
      await this.repositoryData.close();
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      await this.repositoryData.connect();

      const database = this.repositoryData.db("products-ms");
      const products = database.collection("products");

      const cursor = products.find();

      const result = await cursor.toArray();

      return result.map(ProductMapper.map);
    } finally {
      await this.repositoryData.close();
    }
  }

  async saveProduct(product: Product): Promise<Product> {
    try {
      await this.repositoryData.connect();

      const database = this.repositoryData.db("products-ms");
      const products = database.collection("products");

      const doc = {
        name: product.getName(),
        price: product.getValueProduct(),
        description: product.getDescription(),
        category: product.getCategory(),
        active: product.getActive() ?? true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = await products.insertOne(doc);

      return ProductMapper.map({
        _id: result.insertedId,
        ...doc,
      });
    } finally {
      await this.repositoryData.close();
    }
  }

  async updateProduct(product: Product): Promise<Product> {
    try {
      await this.repositoryData.connect();

      const database = this.repositoryData.db("products-ms");
      const products = database.collection("products");

      const findProduct = await products.findOne({
        _id: new ObjectId(product.getId()),
      });

      if (!findProduct) {
        throw new RecordNotFoundError(
          "O produto com esse ID não foi encontrado"
        );
      }

      const doc = {
        name: product.getName() ?? findProduct.name,
        price: product.getValueProduct() ?? findProduct.price,
        description: product.getDescription() ?? findProduct.description,
        category: product.getCategory() ?? findProduct.category,
        active: product.getActive() ?? findProduct.active,
        updated_at: new Date() ?? findProduct.updated_at,
      };

      await products.updateOne({ _id: findProduct._id }, { $set: doc });

      return ProductMapper.map({
        _id: findProduct._id,
        ...doc,
      });
    } finally {
      await this.repositoryData.close();
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await this.repositoryData.connect();

      const database = this.repositoryData.db("products-ms");
      const products = database.collection("products");

      const query = {
        _id: new ObjectId(id),
      };

      const result = await products.deleteOne(query);

      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        throw new RecordNotFoundError(
          "O produto com esse ID não foi encontrado"
        );
      }
    } finally {
      await this.repositoryData.close();
    }
  }
}
