import PaymentMapper from "../../../src/gateways/mapper/payment.mapper";
import { Payment } from "../../../src/domain/entities/payment";
import { PaymentStatus } from "../../../src/domain/value_object/paymentStatus";
import PaymentModel from "../../../src/gateways/model/payment.model";
import { ObjectId } from "mongodb";

describe("PaymentMapper", () => {
  it("should map PaymentModel to Payment entity", () => {
    // Arrange
    const input: PaymentModel = {
      _id: new ObjectId(1125442125425875659),
      order_id: 125,
      integration_id: "12545214",
      qr_code: "qrCode",
      total: 180,
      status: "Pago",
      paid_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Act
    const result: Payment = PaymentMapper.map(input);

    // Assert
    expect(result.getId()).toBe(input._id.toString());
    expect(result.getOrderId()).toBe(input.order_id);
    expect(result.getIntegrationId()).toBe(input.integration_id);
    expect(result.getQrCode()).toBe(input.qr_code);
    expect(result.getTotal()).toBe(input.total);
    expect(result.getStatus().value()).toBe(input.status);
    expect(result.getPaidAt()).toBe(input.paid_at);
    expect(result.getCreatedAt()).toBe(input.created_at);
    expect(result.getUpdatedAt()).toBe(input.updated_at);
  });
});

