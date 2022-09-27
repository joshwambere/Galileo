import {RequestHandler} from "express";
import {Types} from "mongoose";
import {HttpException} from "@exceptions/HttpException";

const validateObjectId =(
    type: string,
    value: string | 'body' | 'query' | 'params' = 'body',
):RequestHandler=>{
    return (req,res,next)=>{
        const message ="provided id is not valid";

        if (!Types.ObjectId.isValid(req[value].id)) {
            next(new HttpException(400, message));
        }else {
            next();
        }


    }
}

export default validateObjectId
