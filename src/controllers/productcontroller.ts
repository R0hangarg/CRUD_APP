import { Request, Response } from "express";
import Product from "../models/productModel";
import { productValidation, updateProductValidation } from "../validations/productValidation";
import { ProductType } from "../Interfaces/productInterface";
import client from "../redis/redisClient";


//Get All Products
export const getAllProducts = async(req:Request,res:Response)=>{
    try {

        const page = parseInt(req.query.page as string) || 1 ;
        const limit = parseInt(req.query.limit as string) || 2 ;

        const skip = (page-1)*limit;

        const {category,maxPrice,minPrice,name} = (req.query);

        const filter :{[key:string]: any} ={};

        if(category){
            filter.category=category;
        }
        if(maxPrice){
            filter.price={...filter.price , $lte:Number(maxPrice)};
        }
        if(minPrice){
            filter.price={...filter.price,$gte:Number(minPrice)};
        }
        if(name){
            filter.name= { $regex: name, $options: 'i' };
        }

        // Otherwise, fetch from the database
        const products:ProductType[]= await Product.find(filter).skip(skip).limit(limit);

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            status:true,
            message:"Products fetched successfully",
            data: products,
            error:null,
            metadata:{
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
            },
            currentPage: page
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            message: "An error occurred while fetching products.",
            data:null,
            error:error,
        });
    }
}

//Create New Product
export const createProduct = async(req:Request,res:Response)=>{
    try {
        const products:ProductType = await productValidation.validateAsync(req.body);

        const productCheck = await Product.findOne({
            name:products.name
        })

        if(productCheck){
            return res.json({
                status:false,
                message:"Product already exists",
                data:null,
                error:null
            });
        }

        const newProduct = new Product({
            name: products.name,
            stock:products.stock,
            description:products.description,
            category:products.category,
            price:products.price
        })
        
        const savedProduct = await newProduct.save()

        const cacheKey = `product:${savedProduct._id}`;;

        // Cache the updated product list
        await client.set(cacheKey, JSON.stringify(savedProduct), {
            EX: 3600, // Cache expiration time in seconds
        });

        res.status(200).json({
            success: true,
            message:"Product Created Successfullly",
            data: savedProduct,
            error:null
        })
    } catch (error) {
        console.error("Error creating products:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while creating products.",
            data:null,
            error:error
        });
    }
}

//Get Product by its id
export const getProductById = async(req:Request,res:Response)=>{
    try {
        const productId =  req.params.id;
        const cacheKey = `product:${productId}`;

        const cachedData = await client.get(cacheKey);

        if (cachedData) {
            // If cached, return cached data
            return res.status(200).json({
                status:true,
                message:"Product Id Found",
                data: JSON.parse(cachedData),
                error:null
            });
        }

        const product:ProductType|null = await Product.findById(productId)

        if(!product){
            return res.status(404).json({
                status:false,
                message:`Product ${product} not found`,
                data:null,
                error:`Product ${product} not found`
            });
        }
        
        res.status(200).json({
            success: true,
            message:"Product Id Found",
            data: product,
            error:null
        })
    } catch (error) {
        console.error("Error fetching product Id:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching product Id.",
            data:null,
            error:error
        });
    }
}


//Update Product by its id
export const updateProduct = async(req:Request,res:Response)=>{
    try {
        const productId = await req.params.id;

        const product:ProductType|null = await Product.findById(productId)

        if(!product){
            return res.status(404).json({
                status:false,
                message:`Product ${product} not found`,
                data:null,
                error:`Product ${product} not found`
            });
        }

        const cacheKey = `product:${productId}`;
        

        const updatedProductData = updateProductValidation.validateAsync(req.body);
        
        await client.set(cacheKey, JSON.stringify(updatedProductData), {
            EX: 3600, // Cache expiration time in seconds
        });

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updatedProductData }, // Update only specified fields
            {
                new: true, // Return the updated document
                runValidators: true // Run validation on the update
            }
        );
        
        res.status(200).json({
            status:true,
            message:"Product updated successfully",
            data: updatedProduct,
            error:null
        })
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while updating product.",
            data:null,
            error:error
        });
    }
}

//Delete Product by its id
export const deleteProduct = async(req:Request,res:Response)=>{
    try {
        const productId = await req.params.id;

        const product:ProductType|null = await Product.findById(productId)

        if(!product){
            return res.status(404).json({
                status:false,
                message:`Product ${product} not found`,
                data:null,
                error:`Product ${product} not found`
            });
        }
        
        const cacheKey = `product:${productId}`;
        await client.del(cacheKey);

        await Product.findByIdAndDelete(productId);
        
        res.status(200).json({
            status: true,
            message:"Product Deleted",
            data:null,
            error:null
        })
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while deleting product.",
            data:null,
            error:error
        });
    }
}


//Controller to show aggreagted data 

export const statsOfProduct =async(req:Request,res:Response)=>{
    try {
        const stats = await Product.aggregate([
            {
              $group: {
                _id: "$category",
                totalProducts: {  $sum: 1 },
                averagePrice: { $avg: "$price" },
                totalStock: { $sum: "$stock" }
              }
            }
          ]);
      
          res.status(200).json({
            status: true,
            message:"Successfully fetched the data",
            data: stats,
            error:null
          });
        
    } catch (error) {
        console.log("Error Showing Stats",error);
        res.status(500).json({
            status: false,
            message:"An error occurred while getting stats of products",
            data:null,
            error:error
        });
    }
}