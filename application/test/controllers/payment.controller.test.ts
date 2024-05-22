import { PaymentResponse } from "../../src/controllers/model/payment.response.model";
import { PaymentController } from "../../src/controllers/payment.controller";
import { PaymentPresenter } from "../../src/controllers/presenters/payment.presenter";
import { Payment } from "../../src/domain/entities/payment";
import { PaymentUseCases } from "../../src/domain/usecases/payment";
import { PaymentStatus } from "../../src/domain/value_object/paymentStatus";
import { PaymentGateway } from "../../src/gateways/repositories/payments";
import { PaymentGatewayGateway } from "../../src/gateways/services/gateway";
import { DbConnection } from "../../src/interfaces/dbconnection";

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

  describe("getAllPayments", () => {
    it("should return a list of payments", async () => {
      const paymentGateway = new PaymentGateway(dbConnection);
      const getAllPaymentsSpy = jest
        .spyOn(PaymentUseCases, "getAllPayments")
        .mockResolvedValue([payment]);
      const mapListSpy = jest
        .spyOn(PaymentPresenter, "mapList")
        .mockReturnValue([paymentResponse]);

      // Act
      const result = await PaymentController.getAllPayments(dbConnection);

      // Assert
      expect(getAllPaymentsSpy).toHaveBeenCalledWith(paymentGateway);
      expect(mapListSpy).toHaveBeenCalledWith([payment]);
      expect(result).toEqual([payment_result]);
    });
  });

  describe("getPayment", () => {
    it("should return a payment", async () => {
      // Arrange
      const paymentId = "12545214";
      const paymentGateway = new PaymentGateway(dbConnection);
      const getPaymentSpy = jest
        .spyOn(PaymentUseCases, "getPayment")
        .mockResolvedValue(payment);
      const mapSpy = jest
        .spyOn(PaymentPresenter, "map")
        .mockReturnValue(paymentResponse);

      // Act
      const result = await PaymentController.getPayment(
        paymentId,
        dbConnection
      );

      // Assert
      expect(getPaymentSpy).toHaveBeenCalledWith(paymentId, paymentGateway);
      expect(mapSpy).toHaveBeenCalledWith(payment);
      expect(result).toEqual(payment_result);
    });
  });

  describe("createPayment", () => {
    it("should create a payment", async () => {
      // Arrange
      const orderId = 125;
      const total = 100;
      const paymentGatewayGateway = new PaymentGatewayGateway();
      const paymentGateway = new PaymentGateway(dbConnection);
      const saveSpy = jest
        .spyOn(PaymentUseCases, "save")
        .mockResolvedValue(payment);
      const mapSpy = jest
        .spyOn(PaymentPresenter, "map")
        .mockReturnValue(paymentResponse);

      // Act
      const result = await PaymentController.createPayment(
        orderId,
        total,
        dbConnection
      );

      // Assert
      expect(saveSpy).toHaveBeenCalledWith(
        orderId,
        total,
        paymentGatewayGateway,
        paymentGateway
      );
      expect(mapSpy).toHaveBeenCalledWith(payment);
      expect(result).toEqual(payment_result);
    });
  });

  describe("processPayment", () => {
    it("should process a payment", async () => {
      // Arrange
      const integrationID = "12545214";
      const status = "Pago";
      const paymentGateway = new PaymentGateway(dbConnection);
      const processPaymentSpy = jest
        .spyOn(PaymentUseCases, "processPayment")
        .mockResolvedValue(payment);
      const mapSpy = jest
        .spyOn(PaymentPresenter, "map")
        .mockReturnValue(paymentResponse);

      // Act
      const result = await PaymentController.processPayment(
        integrationID,
        status,
        dbConnection
      );

      // Assert
      expect(processPaymentSpy).toHaveBeenCalledWith(
        integrationID,
        status,
        paymentGateway
      );
      expect(mapSpy).toHaveBeenCalledWith(payment);
      expect(result).toEqual(payment_result);
    });
  });

  describe("updateStatus", () => {
    it("should update the status of a payment", async () => {
      // Arrange
      const paymentId = "12545214";
      const status = new PaymentStatus("Pago");
      const paymentGateway = new PaymentGateway(dbConnection);
      const updateStatusSpy = jest
        .spyOn(PaymentUseCases, "updateStatus")
        .mockResolvedValue(payment);
      const mapSpy = jest
        .spyOn(PaymentPresenter, "map")
        .mockReturnValue(paymentResponse);

      // Act
      const result = await PaymentController.updateStatus(
        paymentId,
        status,
        dbConnection
      );

      // Assert
      expect(updateStatusSpy).toHaveBeenCalledWith(
        paymentId,
        status,
        paymentGateway
      );
      expect(mapSpy).toHaveBeenCalledWith(payment);
      expect(result).toEqual(payment_result);
    });
  });
});

