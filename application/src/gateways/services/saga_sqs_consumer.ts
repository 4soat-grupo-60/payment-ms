import { SQS } from "aws-sdk";
import * as AWS from "aws-sdk";
import { SagaMessageModel } from "./model/saga.message.model";
import { IMessageConsumer } from "../../interfaces/gateways";

export class SagaSQSConsumer {
  private sqs: SQS;
  private readonly queue: string;

  // @ts-ignore
  constructor(
    queue: string,
    private processor: IMessageConsumer<SagaMessageModel<any>>
  ) {
    this.sqs = new AWS.SQS({ endpoint: process.env.AWS_ENDPOINT });
    this.queue = queue;
  }

  receiveMessages() {
    setInterval(() => {
      this._receiveMessages();
    }, 3000);
  }

  _receiveMessages() {
    const params = {
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ["All"],
      QueueUrl: this.queue,
      WaitTimeSeconds: 0,
    };

    this.sqs.receiveMessage(params, async (err, data) => {
      if (err) {
        console.log("Receive Error", err);
      } else if (data.Messages.length > 0) {
        console.log("Received Message: ", data.Messages);

        let ack = false;

        for (let message of data.Messages) {
          let currMsg = {};

          try {
            const msg = JSON.parse(message.Body) as SagaMessageModel<any>;

            ack = await this.processor.consume(msg.saga, msg);
          } catch (e) {
            console.error(`failed to send message: `, currMsg, e);
          }
        }

        if (ack) {
          const deleteParams = {
            QueueUrl: this.queue,
            ReceiptHandle: data.Messages[0].ReceiptHandle,
          };

          await this.sqs.deleteMessage(deleteParams).promise();
        }
      }
    });
  }
}
