import {NextFunction, Request, Response} from "express";
import ChatRoomService from "@services/chatRoom.service";
import {chatRoomDto, chatRoomId} from "@dtos/chatRoom.dto";
import {ChatRoom, chatRoomResponse} from "@interfaces/chatRoom.interface";
import {deletedType} from "@interfaces/mongooseTypes.interface";
import {SECRET_KEY} from "@config";
import {TokenData} from "@interfaces/users.interface";
import {verify} from 'jsonwebtoken';

class ChatRoomController{
    public chatService = new ChatRoomService();

    /*
    * create a chatroom
    * @return {chatRoom, message}
    * */
    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chatRoom:chatRoomDto = req.body;
            const newChatRoom = await this.chatService.Save(chatRoom);
            const data =  {
                message:"Room created Successfully",
                data: newChatRoom
            }
            res.status(201).json(data)
        } catch (error) {
            next(error)
        }
    };

    /*
    * Get chat room with messages
    * @Param chatRoomId
    * @return chatRoomResponse
    * */

    public getChatRoom = async  (req: Request, res: Response, next: NextFunction) => {
        const chatRoomId:chatRoomId = req.body
            try {
                const room:chatRoomResponse = await this.chatService.GetChatRoom(chatRoomId)
                const data= {
                    message:"Chat Room",
                    data: room
                }
                res.status(200).json(data)
            }catch (e){
                next(e)
            }
    }

    /*
    * get all chatRoom
    * @Return chatRooms
    * */
    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chatRooms:ChatRoom[] = await this.chatService.getAll();
            const data = {
                message:"Chat Rooms",
                data: chatRooms
            }
            res.status(200).json(data)
        }catch (e) {
            next(e)
        }
    }

    /*
    * delete one chatRoom
    * @param chatRoomId
    * @return document
    * */
    public deleteChatRoom = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params
            const chatRoom :chatRoomId = {
                chatRoomId: id
            }
            const deletedChatRoom:deletedType = await this.chatService.deleteChatRoom(chatRoom);

            if (deletedChatRoom.deletedCount >1){
                const data = {
                    message:"Chat Room deleted successfully",
                }
                res.status(200).json(data)
            }

        }catch (e) {
            next(e)
        }
    }

    /*
    * get users chatRoom
    * */
    public getUserChatRooms = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user= req.cookies.access_token;
            const {_id} =  (await verify(user, SECRET_KEY)) as TokenData;
            const rooms:ChatRoom[] = await this.chatService.getUsersChatRoom(_id);
            const data = {
                message:"Chat Rooms",
                data: rooms
            }
            res.status(200).json(data)
        }catch (e) {
            next(e)
        }
    }
}

export default ChatRoomController;
