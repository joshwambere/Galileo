import {User} from "@interfaces/users.interface";
import {hashPassword} from "@utils/hash.function";
import {roleEnum} from "@/enums/role.enum";
import userModel from "../models/user.model";
import {Member, Project} from "@interfaces/project.interface";
import projectModel from "@models/project.model";
import {ChatRoom} from "@interfaces/chatRoom.interface";
import {chatRoomStatus} from "@/enums/chatRoom.status.enum";
import projectMemberModel from "@models/joint/project.members.model";
import groupMessage from "@models/joint/group.message.model";



/*
* seed company
* */
export const projectSeed = async ()=>{
    const project:Project[] = [{
        _id: '5f9f1b9b9b9b9b9b9b9b9b9b',
        name: 'project1',
        description: 'project1',
        createdAt: new Date()
    }]
    return await projectModel.insertMany(project);
}
export const chatRoomSeed = async (project, user)=>{
    const room:ChatRoom= {
        _id: "5f9f1b9b9b9b9b9b9b9b9b9b",
        status: chatRoomStatus.ACTIVE,
        project: project,
        name: project.name,
        createdAt: new Date(),
        creator: user
    }
    return await groupMessage.insertMany(room);
}
export const seedRoomMember = async (room, user)=>{
    const roomMember:Member[] = [{
        project_id: room._id,
        user_id: user._id
    }]
    return await projectMemberModel.insertMany(roomMember);
}

/*
* seed project manager
* */
export const pmSeed = async ()=>{
    const existingUser = await userModel.findOne({userName: "admin"});
    if (!existingUser){
        const user:User[] = [{
            _id: "5f9f1b0b0b1b1b1b1b1b1b1b",
            name: 'admin',
            email: 'admin@gmail.com',
            password: await hashPassword('Okayfine'),
            role: roleEnum.PM,
            userName: 'admin',
            employeeId: 'admin',
            profileImage: 'https://www.w3schools.com/howto/img_avatar.png',
            verified: true,
            otp: '1234',
            createdAt: new Date()

        },
            {
                _id: '5f9f1b9b9b9b9b9b9b9b9b9b',
                name: 'user1',
                email: 'user@testing.com',
                password: await hashPassword('Okayfine'),
                role: roleEnum.EMPLOYEE,
                userName: 'user1',
                employeeId: 'user1',
                profileImage: 'https://www.w3schools.com/howto/img_avatar.png',
                verified: true,
                otp: '1234',
                createdAt: new Date()
            }
        ]
        await userModel.insertMany(user);
        const savedAdmin = await userModel.findOne({userName: "admin"});
        const savedUser = await userModel.findOne({userName: "user1"});
        await projectSeed();
        const savedProject = await projectModel.findOne({name: "project1"});
        await chatRoomSeed(savedProject, savedAdmin);
        const savedRoom = await groupMessage.findOne({name: "project1"});
        await seedRoomMember(savedRoom, savedUser);
        await  seedRoomMember(savedRoom, savedAdmin);
    }
}


export const seeds = async ()=>{
    await pmSeed()
}
