import {IsNotEmpty, IsString} from "class-validator";

export class chatRoomDto{
    @IsString()
    @IsNotEmpty()
    projectId: string;
}
