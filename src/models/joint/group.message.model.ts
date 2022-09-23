import {model, Schema, Document} from "mongoose";
import {Project} from "@interfaces/project.interface";
import projectModel from "@models/project.model";
import messageModel from "@models/message.model";
import {chatRoomStatus} from "@/enums/chatRoom.status.enum";


const chatRoom = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: projectModel,
    },
    messages: {
        type: Schema.Types.ObjectId,
        ref: messageModel,
    },
    status:{
        type: String,
        enum: Object.values(chatRoomStatus),
        default: chatRoomStatus.ACTIVE,
    }

});

const groupMessage = model<Project & Document>('GroupMessage', chatRoom);

export default groupMessage;
