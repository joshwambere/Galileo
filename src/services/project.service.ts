import {HttpException} from "@exceptions/HttpException";
import {ProjectDto} from "@dtos/project.dto";
import ProjectModel from "@models/project.model";
import UserModel from "@models/user.model";
import projectMemberModel from "@models/joint/project.members.model";
import {roleEnum} from "@/enums/role.enum";
import {projectStatus} from "@/enums/project.status.enum";


class ProjectService{
    public project=ProjectModel;
    public user= UserModel;
    public projectMember = projectMemberModel

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
        return await this.project.find();
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
