import { PaymentStatus } from "../value_object/paymentStatus";

export class Payment {
  getintegrationId(): string {
    return this._integrationId;
  }

  _id: string;
  private _orderId: number;
  private _integrationId: string;
  private _qrCode: string;
  private _total: number;
  private _status: PaymentStatus;
  private _paidAt?: Date;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  constructor(
    orderId: number,
    integrationId: string,
    qrCode: string,
    total: number
  ) {
    this._orderId = orderId;
    this._integrationId = integrationId;
    this._qrCode = qrCode;
    this._total = total;
    this._status = new PaymentStatus(PaymentStatus.PENDENTE);
  }

  static New(
    id: string,
    orderId: number,
    integrationId: string,
    qrCode: string,
    total: number,
    status: PaymentStatus,
    paidAt: Date,
    createdAt: Date,
    updatedAt: Date
  ): Payment {
    const py = new Payment(orderId, integrationId, qrCode, total);

    py._id = id;
    py._status = status;
    py._paidAt = paidAt;
    py._createdAt = createdAt;
    py._updatedAt = updatedAt;

    return py;
  }

  getId(): string {
    return this._id;
  }

  getOrderId(): number {
    return this._orderId;
  }

  getIntegrationId(): string {
    return this._integrationId;
  }
  getQrCode(): string {
    return this._qrCode;
  }

  getTotal(): number {
    return this._total;
  }

  getStatus(): PaymentStatus {
    return this._status;
  }

  getPaidAt(): Date {
    return this._paidAt;
  }

  getCreatedAt(): Date {
    return this._createdAt;
  }

  getUpdatedAt(): Date {
    return this._updatedAt;
  }
}

