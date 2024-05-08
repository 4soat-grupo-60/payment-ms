export default class ProductInactiveError extends Error {

  constructor(message: string) {
    super(message);
  }
}