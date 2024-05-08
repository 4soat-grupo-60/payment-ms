import { Money } from "../value_object/money";
import { Category } from "../value_object/category";

export class Product {
  private id: string;
  private name: string;
  private description: string;
  private category: Category;
  private price: Money;
  private active: boolean = true;
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(
    name: string,
    category: string,
    description: string,
    price: number,
    active: boolean
  ) {
    this.name = name;
    this.category = new Category(category);
    this.description = description;
    this.price = new Money(price);
    this.active = active;
  }

  static New(
    id: string,
    name: string,
    description: string,
    category: string,
    price: number,
    active: boolean,
    created_at?: Date,
    updated_at?: Date
  ): Product {
    const p = new Product(name, category, description, price, active);
    p.id = id;
    p.active = active;
    p.createdAt = created_at;
    p.updatedAt = updated_at;
    return p;
  }

  public getValueProduct(): number {
    return this.price.getValueMoney();
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getCategory(): string {
    return this.category.getCategory();
  }

  public setId(id: string) {
    this.id = id;
  }

  public getId(): string {
    return this.id;
  }

  getActive(): boolean {
    return this.active;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
