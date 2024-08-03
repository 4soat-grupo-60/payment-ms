import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as compression from "compression";
import * as AWS from "aws-sdk";
import "dotenv/config";

import IAppRoute from "../interfaces/IAppRoute";
import { DbConnection } from "../interfaces/dbconnection";
import PaymentRoute from "./routes/PaymentRoute";
import { setupConsumers } from "../consumers";

export default class StartUp {
  private dbConnection: DbConnection;

  public app: express.Application;

  constructor(dbConnection: DbConnection) {
    this.dbConnection = dbConnection;
    this.app = express();

    this.initAWS();
    this.middler();
    this.initRoutes();
    setupConsumers(this.dbConnection);
  }

  enableCors() {
    const options: cors.CorsOptions = {
      methods: "GET,OPTIONS,PUT,POST,DELETE",
      origin: "*",
    };

    this.app.use(cors(options));
  }

  middler() {
    this.enableCors();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(compression());
  }

  initAWS() {
    const credentials = new AWS.Credentials({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    AWS.config.update({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: credentials,
    });
  }

  initRoutes() {
    let routes: IAppRoute[] = [new PaymentRoute(this.dbConnection)];

    let port = process.env.PORT || 3000;

    for (let route of routes) {
      route.setup(this.app);
    }

    this.app.route("/ping").get((req, res) => {
      res.send("pong");
    });

    this.app.listen(port, () => {
      console.log(`Serviço de pagamento está executando na porta ${port}`);
    });
  }
}
