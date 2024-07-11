import { ISagaQueue } from "../../interfaces/gateways";
import { SagaMessageModel } from "./model/saga.message.model";

import * as AWS from "aws-sdk";
import { SQS } from "aws-sdk";

export class SagaSQSSender implements ISagaQueue<any> {
  private sqs: SQS;
  private queue: string;

  // @ts-ignore
  constructor() {
    this.sqs = new AWS.SQS({ endpoint: process.env.AWS_ENDPOINT });
    this.queue = process.env.AWS_PAYMENT_QUEUE;
  }

  async send(payload: SagaMessageModel<any>): Promise<String> {
    await this.sqs
      .sendMessage({
        MessageBody: JSON.stringify(payload),
        QueueUrl: this.queue,
      })
      .promise();

    return payload.id;
  }
}
