import {
  IPaymentGateway,
  IPaymentGatewayService,
  IPaymentSagaSender,
} from "../../interfaces/gateways";
import {Payment} from "../entities/payment";
import {PaymentStatus} from "../value_object/paymentStatus";

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
    paymentGateway: IPaymentGateway,
    paymentSagaSender: IPaymentSagaSender
  ): Promise<Payment> {
    const {identifier, QRCode} = await paymentGatewayGateway.create();

    const payment = new Payment(orderId, identifier, QRCode, total);

    await paymentSagaSender.send("payment_created", payment);

    return await paymentGateway.save(payment);
  }

  static async cancel(
    paymentId: string,
    paymentGatewayGateway: IPaymentGatewayService,
    paymentGateway: IPaymentGateway,
    paymentSagaSender: IPaymentSagaSender
  ): Promise<Payment | undefined> {
    
    const payment = await this._cancel(paymentId, paymentGatewayGateway, paymentGateway);
    if (payment) {
      await paymentSagaSender.send("payment_updated", payment);
    }

    return payment;
  }

  private static async _cancel(
    paymentId: string,
    paymentGatewayGateway: IPaymentGatewayService,
    paymentGateway: IPaymentGateway
  ): Promise<Payment | undefined> {
    const payment = await paymentGateway.get(paymentId);

    if (payment.getStatus().value() === PaymentStatus.CANCELADO) {
      return undefined;
    }

    // If is paid a refund will be made
    if (payment.getStatus().isPaid()) {
      await paymentGateway.updateStatus(payment.getId(), this._processStatus(PaymentStatus.CANCELADO));
      await paymentGatewayGateway.refund(payment.getIntegrationId());
      return await paymentGateway.get(paymentId);
    }

    // If is not paid the charge will be cancelled
    await paymentGateway.updateStatus(payment.getId(), this._processStatus(PaymentStatus.CANCELADO));
    await paymentGatewayGateway.cancel(payment.getIntegrationId());
    return await paymentGateway.get(paymentId);
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
    paymentGateway: IPaymentGateway,
    paymentSagaSender?: IPaymentSagaSender
  ): Promise<Payment> {
    const payment = await paymentGateway.updateStatus(id, status);

    if (paymentSagaSender) {
      await paymentSagaSender.send("payment_updated", payment);
    }

    return payment;
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
