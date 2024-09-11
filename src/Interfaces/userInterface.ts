import { Request } from "express";

export interface userType{
    username?:string,
    password:string,
    role:string,
    email:string,
    phone:number
}

export interface AuthenticatedRequest extends Request {
    user?: {
      role: string;
    };
  }  