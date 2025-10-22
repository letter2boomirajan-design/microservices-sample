// src/index.ts
import "reflect-metadata";                    // required for TypeORM decorators to work
import { AppDataSource } from "./ormconfig";
import { createApp } from "./app";

const PORT = process.env.PORT || 4000;        // port default 4000

async function main() {
  // Initialize DB connection
  await AppDataSource.initialize();
  // create express + apollo app
  const app = await createApp();
  // start server
  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
    console.log(`GraphQL at http://localhost:${PORT}/graphql`);
    console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
