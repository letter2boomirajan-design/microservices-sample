// src/ormconfig.ts
import { DataSource } from "typeorm";
import { Product } from "./entity/Product";

// Create and export a TypeORM DataSource for app to use.
// Use environment variables in a real app; here we use defaults convenient for docker-compose.
export const AppDataSource = new DataSource({
  type: "postgres",                  // use Postgres driver
  host: process.env.DB_HOST || "localhost", // hostname (docker service name "db")
  port: Number(process.env.DB_PORT || 5432), // Postgres default port
  username: process.env.DB_USER || "postgres", // default DB user
  password: process.env.DB_PASSWORD || "postgres", // default DB password
  database: process.env.DB_NAME || "products_db", // database name
  synchronize: true,                 // auto-sync entities -> dev only!
  logging: false,                    // set true for SQL logs
  entities: [Product]                // register entities here
});
