import { Request } from "express";

export interface userType{
    username:string,
    password:string,
    role:string
}

export interface AuthenticatedRequest extends Request {
    user?: {
      role: string;
    };
  }  