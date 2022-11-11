import {model, Schema, Document} from "mongoose";
import {Project} from "@interfaces/project.interface";
import projectModel from "@models/project.model";
import {chatRoomStatus} from "@/enums/chatRoom.status.enum";
import userModel from "@models/user.model";


const chatRoom = new Schema({
    project: {
        type: Schema.Types.ObjectId,
        ref: projectModel,
    },
    name:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: Object.values(chatRoomStatus),
        default: chatRoomStatus.ACTIVE,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: userModel,
    }

});

const groupMessage = model<Project & Document>('GroupMessage', chatRoom);

export default groupMessage;
