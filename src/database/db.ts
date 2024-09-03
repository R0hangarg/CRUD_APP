import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('MongoDB connection string is not defined in the environment variables.');
    process.exit(1); // Exit the process if the connection string is not defined
}

export const connectDB= mongoose.connect( mongoURI)
.then(res => {
    if(res){
        console.log('Database Connected successfully ')
    }
}).catch(err => {
    console.log(err)
})