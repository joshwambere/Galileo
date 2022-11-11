import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class chatRoomDto{
    @IsString()
    @IsNotEmpty()
    projectId: string;
    @IsOptional()
    email: string;
    @IsOptional()
    creator: string;
}

export class chatRoomId{
    @IsNotEmpty()
    @IsString()
    chatRoomId: string;
}

