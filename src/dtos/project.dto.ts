import {IsNotEmpty, IsString} from "class-validator";

export class ProjectDto{
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class InviteContributorDto{
    @IsString()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    projectId: string;
}
