import { Payment } from "../../domain/entities/payment";
import { PaymentResponse } from "../model/payment.response.model";

export class PaymentPresenter {
  static mapList(data: Payment[]): PaymentResponse[] {
    return data.map(PaymentPresenter.map);
  }

  static map(data: Payment): PaymentResponse {
    if (data === null) return null;

    return {
      id: data._id,
      order_id: data.getOrderId(),
      integration_id: data.getIntegrationId(),
      qr_code: data.getQrCode(),
      total: data.getTotal(),
      status: data.getStatus().value(),
      paid_at: data.getPaidAt(),
      created_at: data.getCreatedAt(),
      updated_at: data.getUpdatedAt(),
    };
  }
}

