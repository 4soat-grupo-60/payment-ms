import { PaymentUseCases } from "../../../src/domain/usecases/payment";
import { IPaymentGateway } from "../../../src/interfaces/gateways";
import { Payment } from "../../../src/domain/entities/payment";
import { PaymentStatus } from "../../../src/domain/value_object/paymentStatus";
import { PaymentResponse } from "../../../src/controllers/model/payment.response.model";

describe("PaymentUseCases", () => {
  let paymentGateway: IPaymentGateway;

  beforeEach(() => {
    paymentGateway = {
      getAll: jest.fn(),
      get: jest.fn(),
      save: jest.fn(),
      getByIntegrationID: jest.fn(),
      updateStatus: jest.fn(),
    };
  });
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
  const paymentResponse: PaymentResponse = {
    id: "12545214",
    order_id: 125,
    integration_id: "12545214",
    qr_code: "qrCode",
    total: 100,
    status: "Pago",
    paid_at: now,
    created_at: now,
    updated_at: now,
  };

  const payment_result = {
    id: payment.getId(),
    order_id: payment.getOrderId(),
    integration_id: payment.getIntegrationId(),
    qr_code: payment.getQrCode(),
    total: payment.getTotal(),
    status: payment.getStatus().value(),
    paid_at: payment.getPaidAt(),
    created_at: payment.getCreatedAt(),
    updated_at: payment.getUpdatedAt(),
  };
  describe("getAllPayments", () => {
    it("should return all payments", async () => {
      const expectedPayments: Payment[] = [payment];
      (paymentGateway.getAll as jest.Mock).mockResolvedValue(expectedPayments);

      // Act
      const result = await PaymentUseCases.getAllPayments(paymentGateway);

      // Assert
      expect(result).toEqual(expectedPayments);
      expect(paymentGateway.getAll).toHaveBeenCalled();
    });
  });

  describe("getPayment", () => {
    it("should return a payment by id", async () => {
      // Arrange
      const id = "12545214";
      (paymentGateway.get as jest.Mock).mockResolvedValue(payment_result);

      // Act
      const result = await PaymentUseCases.getPayment(id, paymentGateway);

      // Assert
      expect(result).toEqual(payment_result);
      expect(paymentGateway.get).toHaveBeenCalledWith(id);
    });
  });

  describe("PaymentUseCases", () => {
    describe("save", () => {
      it("should save a payment", async () => {
        // Arrange
        const orderId = 125;
        const total = 180;
        const identifier = "12545214";
        const qrCode = "qrCode";
        const paymentGatewayGateway = {
          create: jest.fn().mockResolvedValue({ identifier, QRCode: qrCode }),
        };
        const paymentGateway = {
          save: jest
            .fn()
            .mockResolvedValue(new Payment(orderId, identifier, qrCode, total)),
          getAll: jest.fn(),
          get: jest.fn(),
          getByIntegrationID: jest.fn(),
          updateStatus: jest.fn(),
        };

        // Act
        const result = await PaymentUseCases.save(
          orderId,
          total,
          paymentGatewayGateway,
          paymentGateway
        );

        // Assert
        expect(paymentGatewayGateway.create).toHaveBeenCalled();
        expect(paymentGateway.save).toHaveBeenCalledWith(
          new Payment(orderId, identifier, qrCode, total)
        );
        expect(result).toEqual(new Payment(orderId, identifier, qrCode, total));
      });
    });
  });

  describe("updateStatus", () => {
    it("should update payment status", async () => {
      // Arrange
      const id = "12545214";
      const status = new PaymentStatus(PaymentStatus.PAGO);
      (paymentGateway.updateStatus as jest.Mock).mockResolvedValue(
        payment_result
      );

      // Act
      const result = await PaymentUseCases.updateStatus(
        id,
        status,
        paymentGateway
      );

      // Assert
      expect(result).toEqual(payment_result);
      expect(paymentGateway.updateStatus).toHaveBeenCalledWith(id, status);
    });
  });
});
