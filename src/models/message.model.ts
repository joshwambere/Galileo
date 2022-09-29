import {model, Schema, Document} from "mongoose";
import {messageStatus, messageTypes} from "@/enums/message.status.enum";
import UserModel from "@models/user.model";
import {Message} from "@interfaces/message.interface";
import groupMessage from "@models/joint/group.message.model";


const messageSchema = new Schema({
    chatRoom:{
        type: Schema.Types.ObjectId,
        ref: groupMessage,
        required: true
    },
    message: {
        type: String,
        required: true,
    },
    messageType:{
        type: String,
        enum: Object.values(messageTypes),
        default: messageTypes.TEXT,
        required: true,
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref: UserModel,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(messageStatus),
        default: messageStatus.PENDING,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const messageModel = model<Message & Document>('Message', messageSchema);

export default messageModel;
