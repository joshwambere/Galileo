import MessageModel from "@models/message.model";
import {Message, MessageTypes} from "@interfaces/message.interface";
import {messageTypeGuard} from "@/guards/message.type.guard";

class MessageService{

    public message = MessageModel;

    public create = async (messageData: MessageTypes) => {
        console.log(messageData);
        console.log("===================")
        if (messageData.type === 'create'){
            if (!messageTypeGuard(messageData.data)) {
                return { message: 'Invalid message type', status: 'Bad', code:400 };
            }else{
                await this.message.create({...messageData.data});
                return { message:"message sent", status: 'Ok', code: 201 };
            }
        }
    }

    public get = async (chatRoomId: string) => {
        if(!chatRoomId) {
            return { message: 'Invalid chat room id', status: 'Bad', code:400 };
        }else{
            const messages:Message[] = await this.message.find({chatRoom: chatRoomId});
            return { message: messages, status: 'Ok', code: 200 };
        }
    }
}
export default MessageService;
