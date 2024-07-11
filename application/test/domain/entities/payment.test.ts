import { Payment } from "../../../src/domain/entities/payment";
import InvalidPaymentStatusError from "../../../src/domain/error/InvalidPaymentStatusError";
import { PaymentStatus } from "../../../src/domain/value_object/paymentStatus";

describe("Payment Domain Entitie", () => {
  it("should create a payment", () => {
    const payment: Payment = createPayment();

    const order_id = payment.getOrderId();
    const total = payment.getTotal();

    expect(order_id).toBe(125);
    expect(total).toBe(180);
  });

  it("should create DTO payment", () => {
    const now = new Date();
    const status = new PaymentStatus("Pago");

    const payment = Payment.New(
      "1125442",
      125,
      "12545214",
      "qrCode",
      180,
      status,
      now,
      now,
      now
    );

    const id = payment.getId();
    const orderId = payment.getOrderId();
    const integrationId = payment.getIntegrationId();
    const qrCode = payment.getQrCode();
    const total = payment.getTotal();
    const new_status = payment.getStatus().value();
    const paidAt = payment.getPaidAt();
    const createdAt = payment.getCreatedAt();
    const updatedAt = payment.getUpdatedAt();

    expect(id).toBe("1125442");
    expect(orderId).toBe(125);
    expect(integrationId).toBe("12545214");
    expect(qrCode).toBe("qrCode");
    expect(total).toBe(180);
    expect(new_status).toBe("Pago");
    expect(paidAt).toBe(now);
    expect(createdAt).toBe(now);
    expect(updatedAt).toBe(now);
  });
});

describe("PaymentStatus Value Object", () => {
  it("should throw InvalidPaymentStatusError for invalid status", () => {
    // Arrange & Act
    const createInvalidStatus = () => {
      new PaymentStatus("PAgo");
    };

    // Assert
    expect(createInvalidStatus).toThrow(
      new InvalidPaymentStatusError("Status de pagamento inválido")
    );
  });
});

const createPayment = () => {
  const payment = new Payment(125, "12545214", "qrCode", 180);

  return payment;
};

describe("Payment Domain Entity", () => {
  it("should create a payment with default status", () => {
    // Arrange
    const orderId = 125;
    const integrationId = "12545214";
    const qrCode = "qrCode";
    const total = 180;

    // Act
    const payment = new Payment(orderId, integrationId, qrCode, total);

    // Assert
    expect(payment.getOrderId()).toBe(orderId);
    expect(payment.getIntegrationId()).toBe(integrationId);
    expect(payment.getQrCode()).toBe(qrCode);
    expect(payment.getTotal()).toBe(total);
    expect(payment.getStatus().value()).toBe(PaymentStatus.PENDENTE);
  });

  it("should create a payment with provided values", () => {
    // Arrange
    const id = "1125442";
    const orderId = 125;
    const integrationId = "12545214";
    const qrCode = "qrCode";
    const total = 180;
    const status = new PaymentStatus("Pago");
    const paidAt = new Date();
    const createdAt = new Date();
    const updatedAt = new Date();

    // Act
    const payment = Payment.New(
      id,
      orderId,
      integrationId,
      qrCode,
      total,
      status,
      paidAt,
      createdAt,
      updatedAt
    );

    // Assert
    expect(payment.getId()).toBe(id);
    expect(payment.getOrderId()).toBe(orderId);
    expect(payment.getIntegrationId()).toBe(integrationId);
    expect(payment.getQrCode()).toBe(qrCode);
    expect(payment.getTotal()).toBe(total);
    expect(payment.getStatus().value()).toBe("Pago");
    expect(payment.getPaidAt()).toBe(paidAt);
    expect(payment.getCreatedAt()).toBe(createdAt);
    expect(payment.getUpdatedAt()).toBe(updatedAt);
    expect(payment.getintegrationId()).toBe(integrationId);
  });
});

