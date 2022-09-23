import groupMessage from "@models/joint/group.message.model";
import {chatRoomDto} from "@dtos/chatRoom.dto";
import {Project} from "@interfaces/project.interface";
import {HttpException} from "@exceptions/HttpException";
import projectModel from "@models/project.model";
import projectMemberModel from "@models/joint/project.members.model";

class ChatRoomService{
    private chatRoom = groupMessage;
    private project = projectModel
    private projectMember = projectMemberModel;

    public async Save(projectId:chatRoomDto){
        const project:Project = await  this.project.findOne({_id: projectId});
        if (!project) throw new HttpException(400, 'Project not found!');
        const member = await this.projectMember.findOne({project_id: project._id});
        if (!member) throw new HttpException(400, 'Project must have at least on contributor');
        const chatRoomData = {
            project: project._id,
            members: member.user_id,

        }
        return await this.chatRoom.create(chatRoomData);
    }

}

export default ChatRoomService;
