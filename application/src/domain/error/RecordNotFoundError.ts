export default class RecordNotFoundError extends Error {

  constructor(message: string) {
    super(message);
  }
}