// src/routes/productRest.ts
import express from "express";
import { AppDataSource } from "../ormconfig";
import { Product } from "../entity/Product";
import { cacheGet, cacheSet, cacheDel } from "../cache/redisClient";

const router = express.Router();
const repo = () => AppDataSource.getRepository(Product);

/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: list of products
 */
router.get("/", async (req, res) => {
  const items = await repo().find();
  res.json(items);
});

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: a product
 *       404:
 *         description: not found
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `product:${id}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(cached);
  const p = await repo().findOneBy({ id });
  if (!p) return res.status(404).json({ message: "Not found" });
  await cacheSet(cacheKey, p, 60);
  return res.json(p);
});

/**
 * @openapi
 * /api/products:
 *   post:
 *     summary: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: created
 */
router.post("/", async (req, res) => {
  const { name, description, price } = req.body;
  const product = repo().create({ name, description, price });
  const saved = await repo().save(product);
  // ensure cache for this id is cleared
  await cacheDel(`product:${saved.id}`);
  res.status(201).json(saved);
});

/**
 * @openapi
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: updated
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  await repo().update({ id }, updates);
  const updated = await repo().findOneBy({ id });
  if (!updated) return res.status(404).json({ message: "Not found" });
  await cacheSet(`product:${id}`, updated, 60);
  res.json(updated);
});

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: deleted
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const productToDelete = await repo().findOneBy({ id });
  if (!productToDelete) return res.status(404).json({ message: "Not found" });
  await repo().delete({ id });
  await cacheDel(`product:${id}`);
  res.json(productToDelete);
});

export default router;
