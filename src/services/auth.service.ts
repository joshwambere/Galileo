import userModel from '@models/user.model';
import {CreateUserDto} from "@dtos/user.dto";
import {HttpException} from "@exceptions/HttpException";
import {hashPassword, verifyOtp} from '@utils/hash.function';
import {TokenData, User} from "@interfaces/users.interface";
import {SECRET_KEY, TOKEN_EXPIRES_IN} from "@config";
import {sign, verify} from 'jsonwebtoken';


class AuthService{
    public users = userModel;

    public async signup(userData:CreateUserDto, otp:string){
        if(!userData) throw new HttpException(400, 'User data is required');


        const existing = await this.users.find({$or: [{email: userData.email}, {userName: userData.userName}]});

        if(existing.length > 0) throw new HttpException(409, 'User already exists');
        const hashedPassword:string = await hashPassword(userData.password);
        const hashedOtp:string = await hashPassword(otp);
        const user:User = await this.users.create({...userData, password:hashedPassword,otp:hashedOtp});
        const token = this.signToken(user);
        return {token, newUser:user}
    }

    public async verifyAccount(otp:string, token:string):Promise<User> {
        const userId = await this.verifyToken(token);
        const user: User = await this.users.findOne({_id:userId});
        if (!user) throw new HttpException(400, 'User not found');
        const isAMatch = await verifyOtp(otp, user.otp);
        if (!isAMatch) throw new HttpException(400, 'Invalid OTP');

        //verify user
        return await this.users.findByIdAndUpdate({_id: user._id}, {$set: {verified: true, otp: null}});
    }

    public async login(loginDetails){
        if(!loginDetails) throw new HttpException(400, 'Email and password are required');
        const user:User = await this.users.findOne({$or: [
                {email: loginDetails.email},
                {employeeId: loginDetails.employeeId}
            ]});
        if(!user) throw new HttpException(404, 'User not found');
        const isAMatch = await verifyOtp(loginDetails.password, user.password);
        if (!isAMatch) throw new HttpException(400, 'Invalid password or Email');
        const token = this.signToken(user);
        return {token}
    }





    public signToken(user:User){
        const data:TokenData ={ _id: user._id }
        return sign(data, SECRET_KEY, {expiresIn: TOKEN_EXPIRES_IN});
    }
    public async verifyToken(token:string){
        try {
            return await verify(token, SECRET_KEY) as TokenData;
        }catch (error) {
            throw new HttpException(401, error.message);
        }
    }
    public  async deleteAccount(user:string){
        if(!user) throw new HttpException(400, 'User data is required');
        const deletedUser = await this.users.findByIdAndDelete(user);
        if(!deletedUser) throw new HttpException(404, 'User not found');
        return deletedUser
    }
    public async getAllUsers(){
        return await this.users.find()
    }

    /*
    * get users info
    * */
    public async getUserInfo(userId:string){
        if(!userId) throw new HttpException(400, 'User data is required');
        const user:User = await this.users.findById(userId);
        if(!user) throw new HttpException(404, 'User not found');
        return user
    }
}

export default  AuthService;
