import { Payment } from "../domain/entities/payment";
import { PaymentGatewayResponse } from "../domain/value_object/paymentGatewayResponse";
import { PaymentStatus } from "../domain/value_object/paymentStatus";
import {
  PaymentSaga,
  SagaMessageModel,
} from "../gateways/services/model/saga.message.model";

export interface IPaymentGatewayService {
  create(): Promise<PaymentGatewayResponse>;
  cancel(integrationId: string): Promise<PaymentGatewayResponse>;
  refund(integrationId: string): Promise<PaymentGatewayResponse>;
}

export interface IPaymentGateway {
  getAll(): Promise<Payment[]>;
  get(id: string): Promise<Payment>;
  save(payment: Payment): Promise<Payment>;
  getByIntegrationID(integrationID: string): Promise<Payment>;
  updateStatus(id: string, paymentStatus: PaymentStatus): Promise<Payment>;
}

export interface IPaymentSagaSender {
  send(saga: PaymentSaga, payment: Payment): Promise<String>;
}

export interface ISagaQueue<T> {
  send(payload: SagaMessageModel<T>): Promise<String>;
}

export interface IMessageConsumer<T extends SagaMessageModel<any>> {
  consume(saga: string, payload: T): Promise<boolean>;
}
