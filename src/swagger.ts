// src/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

export function setupSwagger(app: express.Express) {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Product Service API",
        version: "1.0.0"
      }
    },
    // look for JSDoc comments in routes to build docs
    apis: ["./src/routes/*.ts"]
  };

  const openapiSpec = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
}
