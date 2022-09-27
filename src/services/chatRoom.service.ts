import groupMessage from "@models/joint/group.message.model";
import {chatRoomDto, chatRoomId} from "@dtos/chatRoom.dto";
import {Project} from "@interfaces/project.interface";
import {HttpException} from "@exceptions/HttpException";
import projectModel from "@models/project.model";
import projectMemberModel from "@models/joint/project.members.model";
import {ChatRoom, chatRoomMemberInfo, chatRoomResponse} from "@interfaces/chatRoom.interface";
import {Message} from "@interfaces/message.interface";
import MessageModel from "@models/message.model";

class ChatRoomService{
    private chatRoom = groupMessage;
    private project = projectModel
    private projectMember = projectMemberModel;
    private messages = MessageModel;

    public async Save(projectId:chatRoomDto){
        const project:Project = await  this.project.findOne({_id: projectId.projectId});
        if (!project) throw new HttpException(400, 'Project not found!');
        const member = await this.projectMember.findOne({project_id: project._id});
        if (!member) throw new HttpException(400, 'Project must have at least on contributor');
        const existing =  await this.chatRoom.findOne({project: project._id});
        if (existing) throw new HttpException(400, 'Chat room already exists');
        const chatRoomData = {
            project: project._id,
            name: project.name
        }
        return await this.chatRoom.create({...chatRoomData});
    }

    public async GetChatRoom(chatRoomId:chatRoomId){

        const room:ChatRoom =  await this.chatRoom.findOne({_id: chatRoomId.chatRoomId});
        if (!room) throw new HttpException(404, 'Chat Room not found');

        const members:chatRoomMemberInfo[] =  await this.projectMember.find({project_id:room.project}).populate({path: 'user_id', select: 'name email _id employeeId'});

        const messages:Message[] = await this.messages.find({project:room.project})

        const response:chatRoomResponse={
            chatRoom:{
                _id: room._id,
                name: room.name
            },
            members,
            messages
        }
        return response;
    }

    public async deleteChatRoom(chatRoomId:chatRoomId){
        if (!chatRoomId) throw new HttpException(400, 'Chat room id is required');
        const rooms:ChatRoom[] = await this.chatRoom.findOne({_id: chatRoomId.chatRoomId});
        if (!rooms) throw new HttpException(404, 'Chat Room not found');

        return await this.chatRoom.deleteOne({_id: chatRoomId.chatRoomId});

    }

    public async getAll(){
        const rooms:ChatRoom[] = await this.chatRoom.find();
        return rooms;
    }

}

export default ChatRoomService;
