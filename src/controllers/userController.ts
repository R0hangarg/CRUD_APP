import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer'
import otpGenerator from 'otp-generator'
import twilio from 'twilio'
import client from "../redis/redisClient";
import { AuthenticatedRequest, userType } from "../Interfaces/userInterface";
import { loginValidations, userValidation } from "../validations/userValidations";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Replace with your SMTP server host
    port: 587, // Replace with the port your SMTP server uses
    secure: false, // Use true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // Replace with your email address
        pass: process.env.SMTP_PASS // Replace with your email password
    }
});

const generateOTP = () => otpGenerator.generate(6, { digits: true, upperCaseAlphabets: false, specialChars: false });

const sendmailOTP = async (email:string) => {
    const otp = generateOTP();
    const mailOptions = {
        from: `"JohnDoe" ${ process.env.SMTP_USER} `, // Sender address
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions,(error, info) => {
            if (error) {
                return console.log('Error occurred:', error);
            }
            console.log('Message sent:', info.messageId);
        });
        console.log('OTP sent successfully');
        return otp;
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};


const clientTwilio = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const sendOTP = async (phone:number) => {
    const otp = generateOTP();

    try {
        await clientTwilio.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `${phone}`
        });
        console.log('OTP sent successfully');
        return otp;
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
};

const resendOTP = async (contact:any,contactType:any) => {
    if (contactType === 'phone') {
        const mailOtp = await sendOTP(contact); // contact is the phone number
        return mailOtp

    } else if (contactType === 'email') {
        const mailOtp = await sendmailOTP(contact); // contact is the email
        return mailOtp

    }
    console.log('OTP resend request processed');
};


export const registerUser = async(req:Request,res:Response)=>{
    try {
        const user:userType = await userValidation.validateAsync(req.body);

    const userCheck = await User.findOne({
        username:user.username,
        email:user.email,
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
        role:user.role,
        email:user.email,
        phone:user.phone
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


export const sendOtpToLogin = async (req: Request, res: Response) => {
    try {
        const user = req.body; // contact can be phone or email
        if (user.contactType !== 'phone' && user.contactType !== 'email') {
            return res.status(400).json({
                status: false,
                message: 'Invalid contact type',
                data: null,
                error: 'Invalid contact type'
            });
        }

        let mailotp;
        let db;

        if (user.contactType === 'email') {
            mailotp = await sendmailOTP(user.email);
            if (!mailotp) {
                return res.status(500).json({
                    status: false,
                    message: 'Failed to generate OTP',
                    data: null,
                    error: 'Failed to generate OTP'
                });
            }
            db = await User.findOne({ email: user.contact });
        } else {
            mailotp = await sendOTP(user.contact);
            if (!mailotp) {
                return res.status(500).json({
                    status: false,
                    message: 'Failed to generate OTP',
                    data: null,
                    error: 'Failed to generate OTP'
                });
            }
            db = await User.findOne({ phone: user.contact });
        }

        if (db) {
            const cacheKey = `${user.contact}`;
            await client.set(cacheKey, mailotp, {'EX':120}); // 1 hour expiration
            res.json({
                status: true,
                message: 'OTP sent',
                data: null,
                error: null
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'Register First',
                data: null,
                error: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error sending OTP',
            data: null,
            error: error
        });
    }
};


export const verifyOtpToLogin =async(req:Request,res:Response)=>{
    try {

    const user = req.body; 

    const cacheKey = `${user.contact}`;

    const storedOTP = await client.get(cacheKey);

    if (storedOTP === null) {
        // OTP not found or expired
        console.log('OTP not found or expired');
        return false;
    }

    if (storedOTP === user.inputOtp) {
        // OTP matches
        console.log('OTP verified successfully');
        return res.status(200).json({
            status:true,
            message:"OTP verified",
            data:null,
            error:null
        });
    } else {
        // OTP does not match
        console.log('Invalid OTP');
        return res.status(500).json({
            status:false,
            message:"Invalid OTP",
            data:null,
            error:null
        });
    }
    } catch (error) {
        res.status(500).json({
            status:false,
            message:"Error sending otp",
            data:null,
            error:error
        });
    }
    
}

export const resendOtpToLogin = async (req: Request, res: Response) => {
    try {
        const user = req.body; // contact can be phone or email
        if (user.contactType !== 'phone' && user.contactType !== 'email') {
            return res.status(400).json({
                status: false,
                message: 'Invalid contact type',
                data: null,
                error: 'Invalid contact type'
            });
        }
        let mailotp;
        let db;

        if (user.contactType === 'email') {
            mailotp = await resendOTP(user.email,user.contactType);
            if (!mailotp) {
                return res.status(500).json({
                    status: false,
                    message: 'Failed to generate OTP',
                    data: null,
                    error: 'Failed to generate OTP'
                });
            }
            db = await User.findOne({ email: user.contact });
        } else {
            mailotp = await resendOTP(user.contact,user.contactType);
            if (!mailotp) {
                return res.status(500).json({
                    status: false,
                    message: 'Failed to generate OTP',
                    data: null,
                    error: 'Failed to generate OTP'
                });
            }
            db = await User.findOne({ phone: user.contact });
        }

        if (db) {
            const cacheKey = `${user.contact}`;
            await client.set(cacheKey, mailotp, {'EX':120}); 
            res.json({
                status: true,
                message: 'OTP sent',
                data: null,
                error: null
            });
        } else {
            res.status(404).json({
                status: false,
                message: 'Register First',
                data: null,
                error: 'User not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error sending OTP',
            data: null,
            error: error
        });
    }
};

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