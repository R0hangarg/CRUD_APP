import express from 'express'
import { connectDB } from './database/db';
import { isAuthenicated } from './controllers/userController';
import userRouter from './routes/userRoutes';
import productRouter from './routes/productsRoutes';
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import {  swaggerSpec,swaggerUi } from './swagger/swagger'; 


const app = express();

//Rate Limiter to protect against attacks 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  
app.use(limiter);

//middlewares
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))


// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api',userRouter)
app.use('/api/products',isAuthenicated, productRouter);


connectDB.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`Server Successfully Started On ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log(`Error occured ${error}`);
    process.exit(1)
})

export default app