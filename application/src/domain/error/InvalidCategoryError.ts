export default class InvalidCategoryError extends Error {

  constructor(message: string) {
    super(message);
  }
}