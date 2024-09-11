import mongoose, { Schema } from "mongoose";
import { userType } from "../Interfaces/userInterface";

const userSchema:Schema = new Schema({
    username:{
        type:String,
        required: true,
        unique: true,
        min: 6
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
        required:true
    },
    email:{
        type:String,
    },
    phone:{
        type:Number,
        min:10
    }
});

const User = mongoose.model<userType>('User',userSchema);

export default User;
