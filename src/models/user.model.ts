import {model, Schema, Document} from "mongoose";
import {User} from "@interfaces/users.interface";
import {roleEnum} from "@/enums/role.enum";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    employeeId: {
        type: String,
        required: true,
    },
    userName:{
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        optional: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    otp:{
        type: String,
        optional: true,
    },
    role:{
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.EMPLOYEE,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
