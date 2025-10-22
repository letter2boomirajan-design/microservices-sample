// src/entity/Product.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

/**
 * Product entity mapped to "product" table.
 * Each decorator on a property tells TypeORM how to map the column.
 */
@Entity({ name: "product" })                    // marks class as DB entity with table name "product"
export class Product {
  @PrimaryGeneratedColumn("uuid")               // primary key generated as UUID
  id!: string;

  @Column({ type: "varchar", length: 255 })    // name column, varchar(255)
  name!: string;

  @Column({ type: "text", nullable: true })    // description column, optional (nullable)
  description?: string | null;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 }) // price with 2 decimals
  price!: number;

  @CreateDateColumn({ type: "timestamptz" })   // automatically set when row created
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })   // automatically set when row updated
  updatedAt!: Date;
}
