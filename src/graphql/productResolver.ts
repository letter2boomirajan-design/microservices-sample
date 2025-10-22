// src/graphql/productResolver.ts
import { Product } from "../entity/Product";
import { AppDataSource } from "../ormconfig";
import { cacheGet, cacheSet, cacheDel } from "../cache/redisClient";

/**
 * GraphQL resolver functions for Product queries and mutations.
 * We'll directly use TypeORM repositories here.
 */
const productRepo = () => AppDataSource.getRepository(Product);

export const productResolver = {
  Query: {
    // GraphQL: products(): [Product]
    products: async () => {
      // read all products from DB
      return productRepo().find();
    },
    // GraphQL: product(id: ID!): Product
    product: async (_: any, args: { id: string }) => {
      const cacheKey = `product:${args.id}`;
      // try cache first
      const cached = await cacheGet<Product>(cacheKey);
      if (cached) return cached;
      // fetch from DB, then cache
      const p = await productRepo().findOneBy({ id: args.id });
      if (p) await cacheSet(cacheKey, p, 60); // cache 60s
      return p;
    },
  },
  Mutation: {
    // createProduct(input): Product
    createProduct: async (_: any, args: { input: Partial<Product> }) => {
      const repo = productRepo();
      const p = repo.create(args.input as Product);
      const saved = await repo.save(p);
      // ensure cache cleared
      await cacheDel(`product:${saved.id}`);
      return saved;
    },
    updateProduct: async (
      _: any,
      args: { id: string; input: Partial<Product> }
    ) => {
      const repo = productRepo();
      await repo.update({ id: args.id }, args.input as Partial<Product>);
      const updated = await repo.findOneBy({ id: args.id });
      if (updated) await cacheSet(`product:${updated.id}`, updated, 60);
      return updated;
    },
    deleteProduct: async (_: any, args: { id: string }) => {
      const repo = productRepo();
      const toDelete = await repo.findOneBy({ id: args.id });
      if (!toDelete) return null;
      await repo.delete({ id: args.id });
      await cacheDel(`product:${args.id}`);
      return toDelete;
    },
  },
};
