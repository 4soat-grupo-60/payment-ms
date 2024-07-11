import { SagaSQSConsumer } from "../gateways/services/saga_sqs_consumer";
import { DbConnection } from "../interfaces/dbconnection";
import { OrderConsumer } from "./order.consumer";

export function setupConsumers(db: DbConnection) {
  new SagaSQSConsumer(
    process.env.AWS_ORDER_QUEUE,
    new OrderConsumer(db)
  ).receiveMessages();
}
