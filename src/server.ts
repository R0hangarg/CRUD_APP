import express from 'express'
import { connectDB } from './database/db';
import { isAuthenicated } from './controllers/userController';
import userRouter from './routes/userRoutes';
import productRouter from './routes/productsRoutes';
import cookieParser from 'cookie-parser'

const app = express();

//middlewares
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))



app.use('/api',userRouter)
app.use('/api/products',isAuthenicated, productRouter);

connectDB.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`Server Successfully Started On ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log(`Error occured ${error}`)
})
