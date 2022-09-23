import {model, Schema, Document} from "mongoose";
import {Member} from "@interfaces/project.interface";
import projectModel from "@models/project.model";
import userModel from "@models/user.model";


const projectMemberSchema = new Schema({
    project_id: {
        type: Schema.Types.ObjectId,
        ref: projectModel,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: userModel,
    }
});

const projectMemberModel = model<Member & Document>('ProjectMember', projectMemberSchema);

export default projectMemberModel;
