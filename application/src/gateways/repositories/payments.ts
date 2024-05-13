import { PaymentStatus } from "../../domain/value_object/paymentStatus";
import { Payment } from "../../domain/entities/payment";
import RecordNotFoundError from "../../domain/error/RecordNotFoundError";
import { IPaymentGateway } from "../../interfaces/gateways";
import { DbConnection } from "../../interfaces/dbconnection";
import PaymentMapper from "../mapper/payment.mapper";
import { ObjectId } from "mongodb";

export class PaymentGateway implements IPaymentGateway {
  private repositoryData: DbConnection;

  constructor(connection: DbConnection) {
    this.repositoryData = connection;
  }

  async getAll(): Promise<Payment[]> {
    try {
      await this.repositoryData.connect();
      const database = this.repositoryData.db("payments-ms");
      const payments = database.collection("payments");

      const cursor = payments.find();

      const result = await cursor.toArray();

      return result.map(PaymentMapper.map);
    } finally {
      await this.repositoryData.close();
    }
  }

  async get(id: string): Promise<Payment> {
    try {
      await this.repositoryData.connect();
      const database = this.repositoryData.db("payments-ms");
      const payments = database.collection("payments");

      const result = await payments.findOne({ _id: new ObjectId(id) });

      const resultPayment = {
        _id: result._id,
        status: result.status,
        paid_at: result.paid_at,
        order_id: result.order_id,
        integration_id: result.integration_id,
        qr_code: result.qr_code,
        total: result.total,
      };

      return PaymentMapper.map({ _id: result._id, ...resultPayment });
    } finally {
      await this.repositoryData.close();
    }
  }

  async save(payment: Payment): Promise<Payment> {
    try {
      await this.repositoryData.connect();
      const database = this.repositoryData.db("payments-ms");
      const payments = database.collection("payments");

      const savedPayment = {
        order_id: payment.getOrderId(),
        integration_id: payment.getintegrationId(),
        status: payment.getStatus().value(),
        qr_code: payment.getQrCode(),
        total: payment.getTotal(),
      };

      const result = await payments.insertOne(savedPayment);

      return PaymentMapper.map({
        _id: result.insertedId,
        ...savedPayment,
      });
    } finally {
      await this.repositoryData.close();
    }
  }

  async updateStatus(
    id: string,
    paymentStatus: PaymentStatus
  ): Promise<Payment> {
    try {
      await this.repositoryData.connect();
      const database = this.repositoryData.db("payments-ms");
      const payments = database.collection("payments");

      const findPayment = await payments.findOne({
        _id: new ObjectId(id),
      });

      if (!findPayment) {
        throw new RecordNotFoundError("No payment found for the given id.");
      }

      const updatedPayment = {
        _id: findPayment._id,
        status: paymentStatus.value(),
        paid_at: paymentStatus.isPaid() ? new Date() : null,
        order_id: findPayment.order_id,
        integration_id: findPayment.integration_id,
        qr_code: findPayment.qr_code,
        total: findPayment.total,
      };

      await payments.updateOne(
        { _id: findPayment._id },
        { $set: updatedPayment }
      );

      return PaymentMapper.map({
        _id: findPayment._id,
        ...updatedPayment,
      });
    } finally {
      await this.repositoryData.close();
    }
  }

  async getByIntegrationID(integrationID: string): Promise<Payment> {
    try {
      await this.repositoryData.connect();
      const database = this.repositoryData.db("payments-ms");
      const payments = database.collection("payments");

      const payment = await payments.findOne({
        integration_id: integrationID,
      });

      if (!payment) {
        throw new RecordNotFoundError(
          "No payment found for the given integration ID"
        );
      }

      const resultPayment = {
        _id: payment._id,
        status: payment.status,
        paid_at: payment.paid_at,
        order_id: payment.order_id,
        integration_id: payment.integration_id,
        qr_code: payment.qr_code,
        total: payment.total,
      };

      return PaymentMapper.map({ _id: resultPayment._id, ...resultPayment });
    } finally {
      await this.repositoryData.close();
    }
  }
}

