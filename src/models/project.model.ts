import {model, Schema, Document} from "mongoose";
import {Member, Project} from "@interfaces/project.interface";
import {projectStatus} from "@/enums/project.status.enum";


const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: Object.values(projectStatus),
        default: projectStatus.ACTIVE,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const projectModel = model<Project & Document>('Project', projectSchema);

export default projectModel;
