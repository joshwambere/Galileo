export interface Project{
    _id: string;
    name: string;
    description: string;
}

export interface Member{
    user_id: string;
    project_id: string;
}
