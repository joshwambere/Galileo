import {IsNotEmpty, IsString} from "class-validator";
import { Types } from 'mongoose';

export class chatRoomDto{
    @IsString()
    @IsNotEmpty()
    projectId: string;
}

export class chatRoomId{
    @IsNotEmpty()
    @IsString()
    chatRoomId: string;
}

export class idDto{

}
