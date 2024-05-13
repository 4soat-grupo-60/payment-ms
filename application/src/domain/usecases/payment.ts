import {
  IPaymentGateway,
  IPaymentGatewayService,
} from "../../interfaces/gateways";
import { Payment } from "../entities/payment";
import { PaymentStatus } from "../value_object/paymentStatus";

export class PaymentUseCases {
  static async getAllPayments(
    paymentGateway: IPaymentGateway
  ): Promise<Payment[]> {
    return await paymentGateway.getAll();
  }

  static async getPayment(
    id: string,
    paymentGateway: IPaymentGateway
  ): Promise<Payment> {
    return await paymentGateway.get(id);
  }

  static async save(
    orderId: number,
    total: number,
    paymentGatewayGateway: IPaymentGatewayService,
    paymentGateway: IPaymentGateway
  ): Promise<Payment> {
    const { identifier, QRCode } = await paymentGatewayGateway.create();

    const payment = new Payment(orderId, identifier, QRCode, total);

    return await paymentGateway.save(payment);
  }

  static async processPayment(
    integrationID: string,
    status: string,
    paymentGateway: IPaymentGateway
  ): Promise<Payment> {
    const payment = await paymentGateway.getByIntegrationID(integrationID);

    const newStatus = this._processStatus(status);

    return await this.updateStatus(payment._id, newStatus, paymentGateway);
  }

  static async updateStatus(
    id: string,
    status: PaymentStatus,
    paymentGateway: IPaymentGateway
  ): Promise<Payment> {
    return await paymentGateway.updateStatus(id, status);
  }

  private static _processStatus(status: string): PaymentStatus {
    switch (status) {
      case "paid":
        return new PaymentStatus(PaymentStatus.PAGO);
      case "cancelled":
        return new PaymentStatus(PaymentStatus.CANCELADO);
      case "refused":
        return new PaymentStatus(PaymentStatus.RECUSADO);
      default:
        return new PaymentStatus(PaymentStatus.PENDENTE);
    }
  }
}

