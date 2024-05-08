import { Product } from "../../domain/entities/product";
import { ProductResponse } from "../model/product.response.model";

export class ProductPresenter {
  static mapList(data: Product[]): ProductResponse[] {
    return data.map(ProductPresenter.map);
  }

  static map(data: Product): ProductResponse {
    if (data === null) return null;

    return {
      id: data.getId(),
      name: data.getName(),
      description: data.getDescription(),
      category: data.getCategory(),
      price: data.getValueProduct(),
      active: data.getActive(),
      created_at: data.getCreatedAt(),
      updated_at: data.getUpdatedAt(),
    };
  }
}
