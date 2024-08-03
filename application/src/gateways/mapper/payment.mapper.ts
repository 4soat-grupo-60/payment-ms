import {Payment} from "../../domain/entities/payment";
import {PaymentStatus} from "../../domain/value_object/paymentStatus";
import PaymentModel from "../model/payment.model";
import PaymentMessageModel from "../services/model/payment.message.model";

export default class PaymentMapper {
  static map(input: PaymentModel): Payment {
    return Payment.New(
      input._id.toString(),
      input.order_id,
      input.integration_id,
      input.qr_code,
      input.total,
      new PaymentStatus(input.status),
      input.paid_at,
      input.created_at,
      input.updated_at
    );
  }

  static toMessage(input: Payment): PaymentMessageModel {
    return {
      id: input.getId(),
      integration_id: input.getIntegrationId(),
      order_id: input.getOrderId(),
      qr_code: input.getQrCode(),
      status: input.getStatus().value(),
      total: input.getTotal(),
    };
  }
}
