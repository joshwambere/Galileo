import {MessageDto} from "@interfaces/message.interface";

export const messageTypeGuard = (message: MessageDto): message is MessageDto => {
    return !!((message as MessageDto).message && (message as MessageDto).messageType && (message as MessageDto).sender && (message as MessageDto).chatRoom && (message as MessageDto).createdAt && (message as MessageDto).status);

}
