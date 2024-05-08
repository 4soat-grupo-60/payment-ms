import InvalidCategoryError from "../error/InvalidCategoryError";

export class Category {
  static LANCHE = "Lanche";
  static ACOMPANHAMENTO = "Acompanhamento";
  static BEBIBA = "Bebida";
  static SOBREMESA = "Sobremesa";

  private category: string;

  constructor(category: string) {
    if (
      category !== Category.LANCHE &&
      category !== Category.ACOMPANHAMENTO &&
      category !== Category.BEBIBA &&
      category !== Category.SOBREMESA
    ) {
      validate("Categória inválida");
    }

    this.category = category;
  }

  getCategory(): string {
    return this.category;
  }
}

const validate = (message: string) => {
  throw new InvalidCategoryError(message);
};
