// src/graphql/schema.ts
import { gql } from "apollo-server-express";
import { productResolver } from "./productResolver";

/**
 * GraphQL type definitions and resolvers registration.
 * Exports typeDefs and resolvers to be used by Apollo Server.
 */

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    createdAt: String
    updatedAt: String
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Product
  }
`;

export const resolvers = {
  Query: productResolver.Query,
  Mutation: productResolver.Mutation
};
