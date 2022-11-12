import {HttpException} from "@exceptions/HttpException";
import {ProjectDto} from "@dtos/project.dto";
import ProjectModel from "@models/project.model";
import UserModel from "@models/user.model";
import projectMemberModel from "@models/joint/project.members.model";
import {roleEnum} from "@/enums/role.enum";
import {projectStatus} from "@/enums/project.status.enum";
import groupMessage from "@models/joint/group.message.model";


class ProjectService{
    public project=ProjectModel;
    public user= UserModel;
    public projectMember = projectMemberModel
    public chatRoom = groupMessage

    /*
    * inviteContributor
    * @params ProjectDto
    * @return ProjectModel
    * */
    public async save(project:ProjectDto):Promise<ProjectDto>{
        if (!project) throw new HttpException(400, 'Project data is required');
        const existingProject = await this.project.findOne({name: project.name});
        if(existingProject) throw new HttpException(409, 'Project already exists');

        return  await this.project.create({...project});
    };

    /*
    * find all projects
    * @return projectModel[]
    * */
    public async getAll(){
        const projects = await this.project.find();
        let projectList = [];
        for (const project of projects) {
            const rooms = await this.chatRoom.findOne({project: project._id});
            const data = {...project._doc, room: rooms != null};
            projectList.push(data);
        }
        return projectList;
    }

    /*
    * inviteContributor
    * @params (email, projectId)
    * @return projectMemberModel
    * */
    public async inviteContributor(email:string, projectId:string){
        const contributor = await this.user.findOne({email});

        if (!contributor) throw new HttpException(404, 'Contributor not found!');
        const project = await this.project.findById(projectId);
        if (!project) throw new HttpException(404, 'Project not found!');
        const exisiting = await this.projectMember.find({user_id: contributor._id, project_id: project._id});
        if (exisiting.length > 0) throw new HttpException(409, 'Contributor already exists');
        return await this.projectMember.create({project_id: project._id, user_id: contributor._id});
    }


    /*
   * invite project manager to a project
   * @params (email, projectId)
   * @return projectMemberModel
   */
    public async invitePM(email:string, projectId:string){
        const contributor = await this.user.findOne({email});

        if (!contributor) throw new HttpException(404, 'Contributor not found!');
        const project = await this.project.findById(projectId);
        if (!project) throw new HttpException(404, 'Project not found!');

        await this.user.findOneAndUpdate({_id: contributor._id}, {$set: {role:roleEnum.PM}});

        return await this.projectMember.create({project_id: project._id, user_id: contributor._id});
    }

    public async suspendProject(projectId:string){
        const project = await this.project.findById(projectId);
        if (!project) throw new HttpException(404, 'Project not found!');
        return await this.project.findByIdAndUpdate({_id: project._id}, {$set: {status: projectStatus.SUSPENDED}});
    }

}

export default  ProjectService;
