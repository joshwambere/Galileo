import MessageService from '@services/message.service';
import { NextFunction, Request, Response } from 'express';
import {MessageTypes} from "@interfaces/message.interface";
import {messageTypeGuard} from "@/guards/message.type.guard";
import {HttpException} from "@exceptions/HttpException";


class MessageController{
    private messageService = new MessageService();

    /*
    * create a message
    * @body MessageDto
    * @Return */

    public create = async (req: Request, res: Response, next: NextFunction) => {
       const message:MessageTypes = req.body
        if (message.type === 'create'){
            if (!messageTypeGuard(message.data)) throw new HttpException(400, 'Invalid message type');
            try{
                const result = await this.messageService.create(message);
                res.status(201).json({data: result, message: 'message created'});
            }catch (e) {
                next(e)
            }
        }
    }


}


export default MessageController;
