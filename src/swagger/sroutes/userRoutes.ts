import express from 'express';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User login successfully
 *       400:
 *         description: Invalid input
 */
router.post('/auth/login', (req, res) => {
  res.send('login new user');
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 * 
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/auth/register', (req, res) => {
  res.send('Register new user');
});

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout the user
 *     tags: [Auth]
 *     description: Clears the authentication cookie to log the user out.
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Error during logout
 */
router.post('/logout', (req, res) => {
  res.send({ message: 'Logged out successfully' });
});

export default router;
