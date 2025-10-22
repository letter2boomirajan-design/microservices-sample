// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./graphql/schema";
import productRouter from "./routes/productRest";
import { setupSwagger } from "./swagger";

/**
 * App factory sets up express, GraphQL and routes.
 * Export a function so tests or multiple env setups can call it.
 */
export async function createApp() {
    const app = express();                     // create express app
    app.use(bodyParser.json());                 // parse JSON bodies

    // REST routes
    app.use("/api/products", productRouter);

    // Swagger UI
    setupSwagger(app);

    // Create Apollo Server with our schema & resolvers
    const apolloServer = new ApolloServer({ typeDefs, resolvers });
    await apolloServer.start();                 // start Apollo server
    apolloServer.applyMiddleware({ app: app as any, path: "/graphql" });

    return app;
}
