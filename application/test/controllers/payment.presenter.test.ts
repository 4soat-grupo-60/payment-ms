import { Payment } from "../../src/domain/entities/payment";
import { PaymentResponse } from "../../src/controllers/model/payment.response.model";
import { PaymentPresenter } from "../../src/controllers/presenters/payment.presenter";
import { PaymentStatus } from "../../src/domain/value_object/paymentStatus";

describe("PaymentPresenter", () => {
  describe("mapList", () => {
    it("should map a list of payments to payment responses", () => {
      const now = new Date();
      const status = new PaymentStatus("Pago");
      const payment1 = Payment.New(
        "12545214",
        125,
        "12545214",
        "qrCode",
        100,
        status,
        now,
        now,
        now
      );
      const payment2 = Payment.New(
        "12545215",
        126,
        "12545215",
        "qrCode2",
        200,
        status,
        now,
        now,
        now
      );
      const payments = [payment1, payment2];

      const expectedResponse1: PaymentResponse = {
        id: "12545214",
        order_id: 125,
        integration_id: "12545214",
        qr_code: "qrCode",
        total: 100,
        status: "Pago",
        paid_at: payment1.getPaidAt(),
        created_at: payment1.getCreatedAt(),
        updated_at: payment1.getUpdatedAt(),
      };
      const expectedResponse2: PaymentResponse = {
        id: "12545215",
        order_id: 126,
        integration_id: "12545215",
        qr_code: "qrCode2",
        total: 200,
        status: "Pago",
        paid_at: payment2.getPaidAt(),
        created_at: payment2.getCreatedAt(),
        updated_at: payment2.getUpdatedAt(),
      };
      const expectedResponses = [expectedResponse1, expectedResponse2];

      // Act
      const result = PaymentPresenter.mapList(payments);

      // Assert
      expect(result).toEqual(expectedResponses);
    });

    it("should return an empty array if the input is empty", () => {
      // Arrange
      const payments: Payment[] = [];
      const expectedResponses: PaymentResponse[] = [];

      // Act
      const result = PaymentPresenter.mapList(payments);

      // Assert
      expect(result).toEqual(expectedResponses);
    });
  });

  describe("map", () => {
    it("should map a payment to a payment response", () => {
      const now = new Date();
      const status = new PaymentStatus("Pago");
      const payment = Payment.New(
        "12545214",
        125,
        "12545214",
        "qrCode",
        100,
        status,
        now,
        now,
        now
      );

      const expectedResponse: PaymentResponse = {
        id: "12545214",
        order_id: 125,
        integration_id: "12545214",
        qr_code: "qrCode",
        total: 100,
        status: "Pago",
        paid_at: payment.getPaidAt(),
        created_at: payment.getCreatedAt(),
        updated_at: payment.getUpdatedAt(),
      };

      // Act
      const result = PaymentPresenter.map(payment);

      // Assert
      expect(result).toEqual(expectedResponse);
    });

    it("should return null if the input is null", () => {
      // Arrange
      const payment: Payment = null;

      // Act
      const result = PaymentPresenter.map(payment);

      // Assert
      expect(result).toBeNull();
    });
  });
});

