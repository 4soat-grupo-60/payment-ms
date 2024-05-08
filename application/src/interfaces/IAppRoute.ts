import * as express from "express";

export default interface IAppRoute {
  setup(app: express.Application): void;
}
