export interface Message{
    _id: string;
    project: string;
    message: string;
    messageType: MessageType;
    sender: string;
    status: string;
    createdAt: Date;

}

export interface MessageDto{
    chatRoom: string;
    message: string;
    messageType: MessageType;
    sender: string;
    status: string;
    createdAt: Date;
}

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    AUDIO = 'AUDIO',
    FILE = 'FILE',

}

export interface RoomDto{
    name: string;
}

export interface MessageTypes{
    type: string;
    data: MessageDto;
}
