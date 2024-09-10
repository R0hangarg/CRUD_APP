import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { AuthenticatedRequest, userType } from "../Interfaces/userInterface";
import { loginValidations, userValidation } from "../validations/userValidations";

export const registerUser = async(req:Request,res:Response)=>{
    try {
        const user:userType = await userValidation.validateAsync(req.body);

    const userCheck = await User.findOne({
        username:user.username
    });

    if(userCheck){
        return res.status(409).json({
            status:false,
            message:"User Already Exits !!!",
            data:null,
            error:null
        });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = new User({
        username:user.username,
        password:hashedPassword,
        role:user.role
    });

    const savedUser = await newUser.save();

    res.status(200).json({
        status: true,
        message:"User registered successfully",
        data: savedUser,
        error:null
    })
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while creating user.",
            data:null,
            error:error
        });
    }
}

export const loginUser = async(req:Request,res:Response)=>{
    try {
        const JWT_SECRET = process.env.JWT_SECRET || "your-JWT-SecretKey";
        const {username, password} = await loginValidations.validateAsync(req.body);

        const userCheck = await User.findOne({
            username:username
        });
        
        if(!userCheck){
            return res.status(404).json({
                status:false,
                message:"No such user found please Register first",
                data:null,
                error:null
            })
        }

        const isMatch = await bcrypt.compare(password,userCheck.password)

        if(!isMatch){
            return res.status(400).json({ 
                status: false,
                message: "Incorrect password", 
                data:null,
                error:null
            });
        }

        const payload = {
            username: username,
            role: userCheck.role, // Include role in token payload
          };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
          httpOnly: true, // JavaScript can't access the cookie
          maxAge: 3600000, // Cookie expiration time (1 hour in milliseconds)
          sameSite: 'strict' // Prevent CSRF attacks
        }).status(200).json({
            status:true,
            message:"Loggin user successfully",
            data:token,
            error:null,
            role:userCheck.role
        });
        
    } catch (error) {
        console.error("Error Logging user:", error);
        res.status(500).json({
            status: false,
            message: "An error occurred while logging user.",
            data:null,
            error:error
        });
    }
}

// Controller to check authentication of user 
export const isAuthenicated = async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try {
        const JWT_SECRET = process.env.JWT_SECRET || "your-JWT-SecretKey";
        const token = req.cookies['token'] || req.headers['authorization']?.split(' ')[1];
        
        const decoded = jwt.verify(token,JWT_SECRET) as { username: string; role: string };;
        console.log(decoded)
        if(!decoded){
            return res.status(400).json({
                status:false,
                message:"login First",
                data:null,
                error:null
            })
        }

        res.locals.user ={role: decoded.role , username:decoded.username}
        next();
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "An error occurred while logging user.",
            data:null,
            error:error,
        });
    }
}

// Controller to check authorization of user after checking whether it is authenticated or not. 
export const isAuthorization = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userRole = res.locals.user?.role; // Assuming user info is attached to req.user
      
      if (!userRole) {
        return res.status(401).json({
          status: false,
          message: 'User is not authenticated. Please log in.',
          data:null,
          error:null
        });
      }
      
      try {
  
        if (userRole === "admin" ) {
          return next();
        } else {
          return res.status(403).json({
            status: false,
            message: 'Access denied. You do not have the required permissions.',
            data:null,
            error:null
          });
        }
      } catch (error) {
        res.status(500).json({
          status: false,
          message: 'An error occurred while checking user permissions.',
          data:null,
          error:error
        });
      }
    };