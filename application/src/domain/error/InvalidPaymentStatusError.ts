export default class InvalidPaymentStatusError extends Error {
  constructor(message: string) {
    super(message);
  }
}
