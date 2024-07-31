import {IMessageConsumer} from "../interfaces/gateways";
import {DbConnection} from "../interfaces/dbconnection";
import {PaymentController} from "../controllers/payment.controller";

export class OrderConsumer implements IMessageConsumer<any> {
  private dbConnection: DbConnection;

  constructor(dbConnection: DbConnection) {
    this.dbConnection = dbConnection;
  }

  async consume(saga: string, body: any): Promise<boolean> {
    // console.log("processed:", saga, body);

    if (saga === "order_created") {
      const {order_id, total_value} = body.payload;

      if (!order_id || !total_value) {
        return Promise.resolve(false);
      }

      await PaymentController.createPayment(
        order_id,
        total_value,
        this.dbConnection
      );
    } else if (saga === "order_updated") {
      const { status, payment_id} = body.payload;

      if (status === "Cancelado" && payment_id) {
        await PaymentController.cancelPayment(
          payment_id,
          this.dbConnection
        );
      }
    }

    return Promise.resolve(true);
  }
}
