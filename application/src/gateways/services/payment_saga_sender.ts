import * as crypto from "crypto";
import { IPaymentSagaSender, ISagaQueue } from "../../interfaces/gateways";
import { Payment } from "../../domain/entities/payment";
import PaymentMessageModel from "./model/payment.message.model";
import {PaymentSaga, SagaMessageModel} from "./model/saga.message.model";
import PaymentMapper from "../mapper/payment.mapper";

export class PaymentSagaSender implements IPaymentSagaSender {
  constructor(private sender: ISagaQueue<PaymentMessageModel>) {}

  async send(saga: PaymentSaga, payload: Payment): Promise<String> {
    const message: SagaMessageModel<PaymentMessageModel> = {
      id: crypto.randomUUID(),
      payload: PaymentMapper.toMessage(payload),
      saga: saga,
      time: new Date(),
    };

    console.log("Sending message: ", message);

    return await this.sender.send(message);
  }
}
