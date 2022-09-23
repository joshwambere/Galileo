import {NextFunction, Request, Response} from "express";
import ProjectService from "@services/project.service";
import ChatRoomService from "@services/chatRoom.service";
import {chatRoomDto} from "@dtos/chatRoom.dto";

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
        } catch (error) {
            next(error)
        }
    };
}

export default ChatRoomController;
