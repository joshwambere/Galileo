import {Request} from "express";

export interface User {
    _id?: string;
    email: string;
    password: string;
    verified?: boolean;
    createdAt?: Date;
    profileImage?: string;
    employeeId?: string;
    userName: string;
    name: string;
    otp?: string;
    lastLogin?: Date;
    role?: string;
}
export interface TokenData{
    _id: string;
    role?: string;
    lastLogin?: Date;
}

export interface logoutData{
    token: string
}

export interface loginData{
    token: string;
}

export interface loginWithMail{
    email: string;
    password: string;
}

export interface  loginWithEmpId{
    employeeId: string;
    password: string
}

export interface RequestWithUser extends Request {
    user: User;
    cookies: Request['cookies'];
}

export interface IUserProfile {
    userName: string;
    profileImage: string;
}

