import * as express from "express";

import IAppRoute from "../../interfaces/IAppRoute";
import { PaymentStatus } from "../../domain/value_object/paymentStatus";
import { handleAPIError } from "../error/APIErrorHandler";
import { DbConnection } from "../../interfaces/dbconnection";
import { PaymentController } from "../../controllers/payment.controller";

export default class PaymentRoute implements IAppRoute {
  private dbConnection: DbConnection;

  protected ROUTE_BASE_PATH = "/api/payments";

  constructor(dbConnection: DbConnection) {
    this.dbConnection = dbConnection;
  }

  setup(app: express.Application): void {
    app.route(this.ROUTE_BASE_PATH).get(async (req, res) => {
      try {
        const payment = await PaymentController.getAllPayments(
          this.dbConnection
        );

        res.status(200).send(payment);
      } catch (e) {
        handleAPIError(res, e);
      }
    });

    app.route(this.ROUTE_BASE_PATH + "/:payment_id").get(async (req, res) => {
      const payment_id = req.params.payment_id;
      console.log(payment_id);

      try {
        const payment = await PaymentController.getPayment(
          payment_id,
          this.dbConnection
        );

        res.status(200).send(payment);
      } catch (e) {
        handleAPIError(res, e);
      }
    });

    app.route(this.ROUTE_BASE_PATH).post(async (req, res) => {
      const { order_id, order_value } = req.body;

      try {
        const saved = await PaymentController.createPayment(
          order_id,
          order_value,
          this.dbConnection
        );

        res.status(201).send(saved);
      } catch (e) {
        handleAPIError(res, e);
      }
    });

    app
      .route(this.ROUTE_BASE_PATH + "/:id/status/:status")
      .put(async (req, res) => {
        try {
          const paymentId = req.params.id;
          const paymentStatus = new PaymentStatus(req.params.status);

          const payment = await PaymentController.updateStatus(
            paymentId,
            paymentStatus,
            this.dbConnection
          );

          res.status(200).send(payment);
        } catch (e) {
          handleAPIError(res, e);
        }
      });

    app.route(this.ROUTE_BASE_PATH + "/process").post(async (req, res) => {
      try {
        const id = req.body.id;
        const status = req.body.status;

        await PaymentController.processPayment(id, status, this.dbConnection);

        res.status(200).send("OK");
      } catch (e) {
        handleAPIError(res, e);
      }
    });
  }
}

