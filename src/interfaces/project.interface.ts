export interface Project{
    _id: string;
    name: string;
    description: string;
    createdAt: Date;
    _doc?: any;
}

export interface Member{
    user_id: string;
    project_id: string;
}
