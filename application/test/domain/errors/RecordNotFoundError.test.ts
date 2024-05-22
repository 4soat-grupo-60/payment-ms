import { PaymentResponse } from "../../../src/controllers/model/payment.response.model";
import { PaymentController } from "../../../src/controllers/payment.controller";
import { PaymentPresenter } from "../../../src/controllers/presenters/payment.presenter";
import { Payment } from "../../../src/domain/entities/payment";
import RecordNotFoundError from "../../../src/domain/error/RecordNotFoundError";
import { PaymentUseCases } from "../../../src/domain/usecases/payment";
import { PaymentStatus } from "../../../src/domain/value_object/paymentStatus";
import { PaymentGateway } from "../../../src/gateways/repositories/payments";
import { DbConnection } from "../../../src/interfaces/dbconnection";

describe("PaymentController", () => {
  let dbConnection: DbConnection;

  beforeEach(() => {
    dbConnection = {} as DbConnection;
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

  describe("getPayment", () => {
    it("should return a payment", async () => {
      const paymentId = "12545214";
      const paymentGateway = new PaymentGateway(dbConnection);
      const getPaymentSpy = jest
        .spyOn(PaymentUseCases, "getPayment")
        .mockResolvedValue(payment);
      const mapSpy = jest
        .spyOn(PaymentPresenter, "map")
        .mockReturnValue(paymentResponse);

      const result = await PaymentController.getPayment(
        paymentId,
        dbConnection
      );

      expect(getPaymentSpy).toHaveBeenCalledWith(paymentId, paymentGateway);
      expect(mapSpy).toHaveBeenCalledWith(payment);
      expect(result).toEqual(payment_result);
    });

    it("should throw RecordNotFoundError if payment is not found", async () => {
      const paymentId = "nonexistent";
      const paymentGateway = new PaymentGateway(dbConnection);
      const getPaymentSpy = jest
        .spyOn(PaymentUseCases, "getPayment")
        .mockRejectedValue(new RecordNotFoundError("Payment not found"));

      await expect(
        PaymentController.getPayment(paymentId, dbConnection)
      ).rejects.toThrow(RecordNotFoundError);
      expect(getPaymentSpy).toHaveBeenCalledWith(paymentId, paymentGateway);
    });
  });
});

