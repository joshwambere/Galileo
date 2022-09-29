import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import  validateObjectId  from '@middlewares/objectId.middleware';
import {pmGuard, authGuard} from "@/guards/pm.guard";
import ChatRoomController from "@controllers/chatRoom.controller";
import {chatRoomDto, chatRoomId} from "@dtos/chatRoom.dto";

class ChatRoomRoute implements Routes {
    public path = '/chatRoom/';
    public router = Router();
    public chatRoomController = new ChatRoomController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`,pmGuard, validationMiddleware(chatRoomDto, 'body'), this.chatRoomController.create);
        this.router.post(`${this.path}getChatRoom`,pmGuard, validationMiddleware(chatRoomId, 'body'), this.chatRoomController.getChatRoom);

        this.router.get(`${this.path}`, pmGuard,this.chatRoomController.getAll);
        this.router.delete(`${this.path}:id`,validateObjectId('string', 'params'), this.chatRoomController.deleteChatRoom);
        // this.router.post(`${this.path}invite`, validationMiddleware(InviteContributorDto, 'body'), this.chatRoomController.inviteContributor);
        // this.router.get(`${this.path}:id/suspend`, pmGuard, this.chatRoomController.suspendProject);

    }
}

export default ChatRoomRoute;
