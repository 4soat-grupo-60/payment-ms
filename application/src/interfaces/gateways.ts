import { Payment } from "../domain/entities/payment";
import { PaymentGatewayResponse } from "../domain/value_object/paymentGatewayResponse";
import { PaymentStatus } from "../domain/value_object/paymentStatus";

export interface IPaymentGatewayService {
  create(): Promise<PaymentGatewayResponse>;
}

export interface IPaymentGateway {
  getAll(): Promise<Payment[]>;
  get(id: string): Promise<Payment>;
  save(payment: Payment): Promise<Payment>;
  getByIntegrationID(integrationID: string): Promise<Payment>;
  updateStatus(id: string, paymentStatus: PaymentStatus): Promise<Payment>;
}

