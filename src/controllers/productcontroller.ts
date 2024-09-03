import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { productValidation } from "../validations/productValidation";

//Get All Products
export const getAllProducts = async(req:Request,res:Response)=>{
    try {
        const products = await Product.find();
        
        res.status(200).json({
            data: products
        })
    } catch (error) {
        console.error("Error while fetching products:", error);
        res.status(500).json({
            message: "An error occurred while fetching products."
        });
    }
}

//Create New Product
export const createProduct = async(req:Request,res:Response)=>{
    try {
        const products = await productValidation.validateAsync(req.body);

        if(!products){
            return res.send("Data is not valid")
        }

        const productCheck = await Product.findOne({
            name:products.name
        })

        if(productCheck){
            return res.send("Product already exists");
        }

        const newProduct = new Product({
            name: products.name,
            stock:products.stock,
            description:products.description,
            category:products.category,
            price:products.price
        })
        
        const savedProduct = await newProduct.save()

        res.status(200).json({
            success: true,
            data: savedProduct
        })
    } catch (error) {
        console.error("Error creating products:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating products."
        });
    }
}

//Get Product by its id
export const getProductById = async(req:Request,res:Response)=>{
    try {
        const productId = await req.params.id;

        const product = await Product.findById(productId)

        if(!product){
            return res.status(404).send(`Product ${product} not found`);
        }
        
        res.status(200).json({
            success: true,
            data: product
        })
    } catch (error) {
        console.error("Error fetching product Id:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching product Id."
        });
    }
}


//Update Product by its id
export const updateProduct = async(req:Request,res:Response)=>{
    try {
        const productId = await req.params.id;

        const product = await Product.findById(productId)

        if(!product){
            return res.status(404).send(`Product ${product} not found`);
        }

        const updatedProductData = productValidation.validateAsync(req.body);
        
        if(!updatedProductData){
            return res.send("Data is not valid format");
        }

        const updatedProduct = new Product({
///HOW TO update only that properties that are required to update
        })
        
        res.status(200).json({
            success: true,
            data: updateProduct
        })
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating product."
        });
    }
}

//Delete Product by its id
export const deleteProduct = async(req:Request,res:Response)=>{
    try {
        const productId = await req.params.id;

        const product = await Product.findById(productId)

        if(!product){
            return res.status(404).send(`Product ${product} not found`);
        }

        await Product.findByIdAndDelete(productId);
        
        res.status(200).json({
            success: true,
            message:"Product Deleted"
        })
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting product."
        });
    }
}