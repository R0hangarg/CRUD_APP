import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productcontroller';

const router = express.Router();

router.route('/products').get(getAllProducts).post(createProduct)
router.route('/products/:id').get(getProductById).put(updateProduct).delete(deleteProduct)


export default router;