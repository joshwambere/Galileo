import {Message} from "@interfaces/message.interface";



export interface ChatRoom{
    _id:string
    project: string
    status: string
    name: string,
    creator?: any
    createdAt: Date
    members?: Array<any>

}

export interface ChatRoomMember{
    _id: string
    project_id: string
    user_id: string
}

export interface chatRoomMemberInfo {
    _id: string
    project_id: string
    user_id: {
        _id: string
        name: string
        employeeId: string
        email: string
    }

}
export interface chatRoomResponse{
    chatRoom:{
        _id:string;
        name: string;
    };
    members: chatRoomMemberInfo[];
    messages: Message[]
}
