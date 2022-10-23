export interface Message{
    _id: string;
    project: string;
    message: string;
    messageType: string;
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

enum MessageType {
    text = 'text',
    image = 'image',
    video = 'video',
    audio = 'audio',
    file = 'file',

}

export interface RoomDto{
    name: string;
}

export interface MessageTypes{
    type: string;
    data: MessageDto;
}
