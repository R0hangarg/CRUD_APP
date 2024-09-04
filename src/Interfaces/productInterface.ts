import { Document } from "mongoose";

//Product interface 
export interface ProductType extends Document{
    name: string,
    stock:number,
    description:string,
    category:string,
    price:number
}



