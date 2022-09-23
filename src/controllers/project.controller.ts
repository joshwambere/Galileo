import {NextFunction, Request, Response} from "express";
import {ProjectDto} from "@dtos/project.dto";
import ProjectService from "@services/project.service";

class ProjectController{
    public projectService = new ProjectService();

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const project:ProjectDto = req.body;
            const newProject = await this.projectService.save(project);
            res.status(201).json({data: newProject, message:'Project created'})
        } catch (error) {
            next(error)
        }
    };

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const projects = await this.projectService.getAll();
            res.status(200).json({data: projects, message:'Projects retrieved'})
        }catch (e) {
            next(e)
        }
    }


    /*
    * Invite contributor on a project
    * @body {email, projectId}
    * @return {message}
    */
    public inviteContributor = async (req:Request, res: Response, next:NextFunction)=>{
        const {email, projectId} = req.body
        try {
            await this.projectService.inviteContributor(email, projectId)
            res.status(200).json({message:'Invitation sent'})
        }catch (e) {
            next(e)
        }
    }

    /*
    * Invite Project manager on a project
    * @body {email, projectId}
    * @return {message}
    */
    public invitePm = async (req:Request, res: Response, next:NextFunction)=>{
        const {email, projectId} = req.body
        try {
            await this.projectService.invitePM(email, projectId)
            res.status(200).json({message:'PM Added'})
        }catch (e){
            next(e)
        }
    }

    /*
    * suspend a project
    * @params {projectId}
    * @return {message}
    */
    public suspendProject = async (req:Request, res: Response, next:NextFunction)=>{
        try {
            const {projectId} = req.params
            await this.projectService.suspendProject(projectId)
            res.status(200).json({message:'Project suspended'})
        }catch (e) {
            next(e.message)
        }
    }
}

export default ProjectController;
