import {NextFunction, Response} from "express";
import {HttpException} from "@exceptions/HttpException";
import {verify} from 'jsonwebtoken';
import{SECRET_KEY} from "@config";
import {TokenData, User,RequestWithUser} from "@interfaces/users.interface";
import userModel from "../models/user.model";
import {roleEnum} from "@/enums/role.enum";


const authGuard = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
             new HttpException(401, 'Unauthorized');
        }
        const decoded = (await verify(token, SECRET_KEY)) as TokenData;

        const user = await userModel.findById(decoded._id);
        if(!user) new HttpException(401, 'Unauthorized');
        req.user = user;
        next();
    } catch (error) {
        next(new HttpException(401, error.message));
    }
}

const pmGuard = async (req: RequestWithUser, res: Response, next: NextFunction)=> {
    try {
        const token = req.cookies.access_token;

        if (token){
            const decoded = (await verify(token, SECRET_KEY)) as TokenData;

            const user:User = await userModel.findById(decoded._id);
            if(!user || user.role!=roleEnum.PM  ){
                console.log(user)
                next(new HttpException(403, 'Forbidden resources'));
            }else{
                req.user = user;
                next();
            }

        }else{
            next(new HttpException(401, 'Please login first'));
        }


    } catch (error) {
        next(new HttpException(401, error.message));
    }
}

export  {pmGuard, authGuard};
