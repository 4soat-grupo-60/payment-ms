import * as express from "express";

import IAppRoute from "../../interfaces/IAppRoute";
import { Product } from "../../domain/entities/product";
import { Category } from "../../domain/value_object/category";
import { handleAPIError } from "../error/APIErrorHandler";
import { DbConnection } from "../../interfaces/dbconnection";
import { ProductController } from "../../controllers/product.controller";

export default class ProductRoute implements IAppRoute {
  private dbConnection: DbConnection;

  protected ROUTE_BASE_PATH = "/api/products";

  constructor(dbConnection: DbConnection) {
    this.dbConnection = dbConnection;
  }

  setup(app: express.Application): void {
    app.route(this.ROUTE_BASE_PATH).get(async (req, res) => {
      try {
        const products = await ProductController.getAllProducts(
          this.dbConnection
        );

        res.status(200).send(products);
      } catch (e) {
        handleAPIError(res, e);
      }
    });

    app.route(this.ROUTE_BASE_PATH).post(async (req, res) => {
      try {
        const { name, category, description, price, active } = req.body;
        const newProduct = new Product(
          name,
          category,
          description,
          price,
          active
        );
        const savedProduct = await ProductController.createProduct(
          newProduct,
          this.dbConnection
        );

        res.status(201).send(savedProduct);
      } catch (e) {
        handleAPIError(res, e);
      }
    });

    app.route(this.ROUTE_BASE_PATH + "/:id").put(async (req, res) => {
      try {
        const { name, category, description, price, active } = req.body;
        const productId = String(req.params.id);

        const product = new Product(name, category, description, price, active);
        product.setId(productId);

        const updatedProduct = await ProductController.updateProduct(
          product,
          this.dbConnection
        );

        res.status(200).send(updatedProduct);
      } catch (e) {
        handleAPIError(res, e);
      }
    });

    app.route(this.ROUTE_BASE_PATH + "/:id").delete(async (req, res) => {
      try {
        const productId = String(req.params.id);

        await ProductController.deleteProduct(productId, this.dbConnection);

        res.sendStatus(204);
      } catch (e) {
        handleAPIError(res, e);
      }
    });

    app.route(this.ROUTE_BASE_PATH + "/:category").get(async (req, res) => {
      try {
        const category = new Category(
          req.params.category.charAt(0).toUpperCase() +
            req.params.category.slice(1)
        );

        const products = await ProductController.getAllProductsByCategory(
          category,
          this.dbConnection
        );

        res.status(200).send(products);
      } catch (e) {
        handleAPIError(res, e);
      }
    });
  }
}
