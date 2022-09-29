import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import {pmGuard, authGuard} from "@/guards/pm.guard";
import ProjectController from "@controllers/project.controller";
import {InviteContributorDto, ProjectDto} from "@dtos/project.dto";

class ProjectRoute implements Routes {
    public path = '/project/';
    public router = Router();
    public projectController = new ProjectController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}create`,pmGuard, validationMiddleware(ProjectDto, 'body'), this.projectController.create);
        this.router.get(`${this.path}`, pmGuard,this.projectController.getAll);
        this.router.post(`${this.path}pm/add`, validationMiddleware(InviteContributorDto, 'body'), this.projectController.invitePm);
        this.router.post(`${this.path}invite`, validationMiddleware(InviteContributorDto, 'body'), this.projectController.inviteContributor);
        this.router.get(`${this.path}:id/suspend`, pmGuard, this.projectController.suspendProject);

    }
}

export default ProjectRoute;
