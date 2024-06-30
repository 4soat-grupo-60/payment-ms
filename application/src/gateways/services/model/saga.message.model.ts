export type OrderSaga = "order_created";

export type PaymentSaga = "payment_created" | "payment_updated";

export interface SagaMessageModel<T> {
  id: string;
  saga: OrderSaga | PaymentSaga;
  time: Date;
  payload: T;
}
