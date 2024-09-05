import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductById, statsOfProduct, updateProduct } from '../controllers/productcontroller';
import { isAuthorization } from '../controllers/userController';

const productRouter = express.Router();

productRouter.route('/').get(getAllProducts).post(isAuthorization,createProduct);
productRouter.route('/stats').get(statsOfProduct);
productRouter.route('/:id').get(getProductById).put(isAuthorization,updateProduct).delete(isAuthorization,deleteProduct);


export default productRouter;