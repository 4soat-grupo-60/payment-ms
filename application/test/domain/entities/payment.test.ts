import { Payment } from "../../../src/domain/entities/payment";
import InvalidPaymentStatusError from "../../../src/domain/error/InvalidPaymentStatusError";
import { PaymentStatus } from "../../../src/domain/value_object/paymentStatus";

describe("Payment Domain Entitie", () => {
  it("should create a payment", () => {
    //Arrange
    const payment: Payment = createPayment();

    // Act
    const order_id = payment.getOrderId();
    const total = payment.getTotal();

    // Assert
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

