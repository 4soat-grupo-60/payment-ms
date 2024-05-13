import InvalidPaymentStatusError from "../error/InvalidPaymentStatusError";

export class PaymentStatus {
  static PENDENTE = "Pendente";
  static PAGO = "Pago";
  static CANCELADO = "Cancelado";
  static RECUSADO = "Recusado";

  private status: string;

  constructor(status: string) {
    if (
      status !== PaymentStatus.PENDENTE &&
      status !== PaymentStatus.PAGO &&
      status !== PaymentStatus.CANCELADO &&
      status !== PaymentStatus.RECUSADO
    ) {
      validate("Status de pagamento inválido");
    }

    this.status = status;
  }

  public value(): string {
    return this.status;
  }

  isPaid() {
    return this.status == PaymentStatus.PAGO;
  }
}

const validate = (message: string) => {
  throw new InvalidPaymentStatusError(message);
};

