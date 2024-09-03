import express,{Request,Response} from 'express'
import { connectDB } from './database/db';
import router from './routes/products';

const app = express();

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api',router)

connectDB.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`Server Successfully Started On ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log(`Error occured ${error}`)
})
