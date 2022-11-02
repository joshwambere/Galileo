import { NextFunction, Request, Response } from 'express';
import {CreateUserDto} from "@dtos/user.dto";
import AuthService from '@services/auth.service';
import {loginData, loginWithEmpId, loginWithMail, logoutData, User} from "@interfaces/users.interface";
import {SendgridService} from "@utils/sendgrid.function";
import {EmailFormatter} from "@/shared/email.formatter";
import {emailTemplate} from "@/shared/templates/email.template";
import {verify} from "jsonwebtoken";
import {SECRET_KEY} from "@config";

class AuthController {
    public authService = new AuthService();
    public mailService = new SendgridService()
    public mailFormatter = new EmailFormatter()
    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user:CreateUserDto = req.body

            const otp:string = Math.floor(100000 + Math.random() * 900000).toString();
            const template  = emailTemplate(otp);
            const confirmationEmail = this.mailFormatter.confirmEmail(user.email, template, 'Verify email');
            try {
                const newData = await this.authService.signup(user, otp);
                await this.mailService.sendEmail(confirmationEmail);
                newData.newUser.password=''
                newData.newUser.otp=''
                res.cookie('token',newData.token).status(201).json({data: newData.newUser, message:'Please verify your email'})
            }catch (_error){
                if(_error.code){
                    res.status(500).json({message:'Something went wrong with your request, Contact us'})
                }
                res.status(_error.status).json({message:_error.message})
            }
        } catch (error) {
            next(error)
        }
    };

    public verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {otp} = req.body;
            const {token} = req.cookies;
            const user = await this.authService.verifyAccount(otp, token);
            user.password='';
            user.otp='';
            res.status(200).json({data:user, message:'User verified'})
        } catch (error) {
            next(error)
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const loginDetails:loginWithMail|loginWithEmpId = req.body;
            const user:loginData = await this.authService.login(loginDetails);
            res.cookie('access_token',user.token).status(200).status(200).json({message:'User logged in', token:user.token})
        } catch (error) {
            next(error)
        }
    }

    public logout = async (req: Request, res:Response, next: NextFunction)=>{
        const {access_token}:logoutData = req.cookies;
        if(access_token)
        res.clearCookie('access_token').status(200).json({message:"user logged out."})
    }

    public getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {access_token} = req.cookies;
            const decoded = await verify(access_token,SECRET_KEY);
            const user:User = await this.authService.getUserInfo(decoded._id);
            const newData = {
                _id:user._id,
                userName:user.userName,
                email:user.email,
                employeeId:user.employeeId,
                profileImage:user.profileImage,
            }
            res.status(200).json({data:newData, message:'User retrieved'})
        }catch (e) {
            next(e)
        }
    }












    // utility functions
    public deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id;
            const deleteUserData: User = await this.authService.deleteAccount(userId);
            res.status(200).json({ data: deleteUserData, message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users: User[] = await this.authService.getAllUsers();
            res.status(200).json({ data: users, message: 'users' });
        } catch (error) {
            next(error);
        }
    }
}


export default AuthController;
