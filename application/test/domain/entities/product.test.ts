import { Product } from "../../../src/domain/entities/product";
import InvalidCategoryError from "../../../src/domain/error/InvalidCategoryError";

describe("Product Domain Entitie", () => {
  it("should create a product", () => {
    //Arrange
    const product: Product = createProduct();

    // Act
    const name = product.getName();
    const price = product.getValueProduct();
    const category = product.getCategory();
    const description = product.getDescription();

    // Assert
    expect(name).toBe("Name product");
    expect(price).toBe(100);
    expect(category).toBe("Sobremesa");
    expect(description).toBe("Description product");
  });

  it("should return error when try to create a product with invalid category", () => {
    expect(() => createProduct("Peixes")).toThrow(
      new InvalidCategoryError("Categória inválida")
    );
  });

  it("should create DTO product", () => {
    const now = new Date();

    const product = Product.New(
      "1",
      "Name product",
      "Description product",
      "Sobremesa",
      100,
      true,
      now,
      now
    );

    const id = product.getId();
    const name = product.getName();
    const price = product.getValueProduct();
    const category = product.getCategory();
    const description = product.getDescription();
    const created_at = product.getCreatedAt();
    const updated_at = product.getUpdatedAt();

    expect(id).toBe("1");
    expect(name).toBe("Name product");
    expect(price).toBe(100);
    expect(category).toBe("Sobremesa");
    expect(description).toBe("Description product");
    expect(created_at).toBe(now);
    expect(updated_at).toBe(now);
  });
});

const createProduct = (category?: string) => {
  const product = new Product(
    "Name product",
    category ? category : "Sobremesa",
    "Description product",
    100,
    true
  );

  return product;
};
