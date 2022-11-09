import groupMessage from "@models/joint/group.message.model";
import {chatRoomDto, chatRoomId} from "@dtos/chatRoom.dto";
import {Member, Project} from "@interfaces/project.interface";
import {HttpException} from "@exceptions/HttpException";
import projectModel from "@models/project.model";
import projectMemberModel from "@models/joint/project.members.model";
import {ChatRoom, chatRoomMemberInfo, chatRoomResponse} from "@interfaces/chatRoom.interface";
import {Message} from "@interfaces/message.interface";
import MessageModel from "@models/message.model";
import ProjectService from "@services/project.service";

class ChatRoomService{
    private chatRoom = groupMessage;
    private project = projectModel
    private projectMember = projectMemberModel;
    private messages = MessageModel;
    private ProjectService = new ProjectService();

    public async Save(projectId:chatRoomDto){
        const project:Project = await  this.project.findOne({_id: projectId.projectId});
        if (!project) throw new HttpException(400, 'Project not found!');
        const member = await this.ProjectService.inviteContributor(projectId.email, project._id );
        if (!member) throw new HttpException(400, 'Something went wrong!');
        const existing =  await this.chatRoom.findOne({project: project._id});
        if (existing) throw new HttpException(400, 'Chat room already exists');
        const chatRoomData = {
            project: project._id,
            name: project.name,
            creator: projectId.creator
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
        return await this.getChatRoomsMembers(rooms);
    }

    public async getUsersChatRoom(user_id:string){
        const projects:Member[] = await this.projectMember.find({user_id: user_id});
        const rooms:ChatRoom[] = await this.chatRoom.find({project: {$in: projects.map(project => project.project_id)}})

        return await this.getChatRoomsMembers(rooms);
    }
    private async getChatRoomsMembers(rooms:ChatRoom[]){
        let data:ChatRoom[]=[];
        for (const room of rooms) {
            const des = await this.project.findOne({_id: room.project})
            const creator = await this.projectMember.findOne({project_id: room.project, user_id: room.creator}).populate({path: 'user_id', select: 'userName email _id employeeId'});
            const memberData = await this.projectMember.find({project_id: room.project}).populate({path: 'user_id', select: 'userName email _id employeeId'});
            const roomData = {
                _id: room._id,
                name: room.name,
                description: des.description,
                status: room.status,
                project: room.project,
                createdAt: room.createdAt,
                creator: creator,
                members: memberData,
            }
            data.push(roomData)
        }
        return data;
    }
    public async getRoomMembers(chatRoomId:chatRoomId){
        const room:ChatRoom = await this.chatRoom.findOne({_id: chatRoomId.chatRoomId});
        if (!room) throw new HttpException(404, 'Chat Room not found');
        const members:chatRoomMemberInfo[] =  await this.projectMember.find({project_id:room.project}).populate({path: 'user_id', select: 'userName email _id employeeId, profileImage'});
        return members;
    }

}

export default ChatRoomService;
