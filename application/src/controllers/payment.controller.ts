import { PaymentStatus } from "../domain/value_object/paymentStatus";
import { PaymentGatewayGateway } from "../gateways/services/gateway";
import { PaymentGateway } from "../gateways/repositories/payments";
import { DbConnection } from "../interfaces/dbconnection";
import { PaymentUseCases } from "../domain/usecases/payment";
import { PaymentPresenter } from "./presenters/payment.presenter";

export class PaymentController {
  static async getAllPayments(dbConnection: DbConnection) {
    const paymentGateway = new PaymentGateway(dbConnection);
    const payments = await PaymentUseCases.getAllPayments(paymentGateway);
    return PaymentPresenter.mapList(payments);
  }

  static async getPayment(paymentId: string, dbConnection: DbConnection) {
    const paymentGateway = new PaymentGateway(dbConnection);
    const payment = await PaymentUseCases.getPayment(paymentId, paymentGateway);
    return PaymentPresenter.map(payment);
  }

  static async createPayment(
    orderId: number,
    total: number,
    dbConnection: DbConnection
  ) {
    const paymentGatewayGateway = new PaymentGatewayGateway();
    const paymentGateway = new PaymentGateway(dbConnection);

    const payment = await PaymentUseCases.save(
      orderId,
      total,
      paymentGatewayGateway,
      paymentGateway
    );

    return PaymentPresenter.map(payment);
  }

  static async processPayment(
    integrationID: string,
    status: string,
    dbConnection: DbConnection
  ) {
    const paymentGateway = new PaymentGateway(dbConnection);

    const payment = await PaymentUseCases.processPayment(
      integrationID,
      status,
      paymentGateway
    );

    return PaymentPresenter.map(payment);
  }

  static async updateStatus(
    paymentId: string,
    status: PaymentStatus,
    dbConnection: DbConnection
  ) {
    const paymentGateway = new PaymentGateway(dbConnection);

    const payment = await PaymentUseCases.updateStatus(
      paymentId,
      status,
      paymentGateway
    );

    return PaymentPresenter.map(payment);
  }
}

