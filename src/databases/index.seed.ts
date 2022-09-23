import {User} from "@interfaces/users.interface";
import {hashPassword} from "@utils/hash.function";
import {roleEnum} from "@/enums/role.enum";
import userModel from "../models/user.model";


/*
* seed project manager
* */
export const pmSeed = async ()=>{
    const existingUser = await userModel.findOne({userName: "admin"});
    if (!existingUser){
        const user:User[] = [{
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

        }]
        await userModel.insertMany(user);
    }
}
export const seeds = async ()=>{
    await pmSeed();
}
