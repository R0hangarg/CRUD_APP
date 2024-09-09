import express from 'express';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of all Products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: A list of all Products
 *       500:
 *         description: Error fetching Products
 */
router.get('/products', (req, res) => {
  res.send('List of all the Products');
});

/**
 * @swagger
 * /products/stats:
 *   get:
 *     summary: Get stats of all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Products stats
 *       404:
 *         description: No Products found
 */
router.get('/products/stats', (req, res) => {
  res.send('Get stats of all products');
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', (req, res) => {
  res.send(`Product with ID ${req.params.id}`);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: [] 
 *     description: |
 *       This endpoint allows creating a new product. Only users with the `admin` role can create products.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               stock:
 *                 type: integer
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 *       500:
 *         description: Error creating product
 */
router.post('/products', (req, res) => {
  res.send('Product created');
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               stock:
 *                 type: integer
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.put('/products/:id', (req, res) => {
  res.send(`Product with ID ${req.params.id} updated successfully`);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/products/:id', (req, res) => {
  res.send(`Product with ID ${req.params.id} deleted`);
});

export default router;
