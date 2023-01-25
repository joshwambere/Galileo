import {IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    public email: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(32)
    public name: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    @MaxLength(32)
    public userName: string;
    @IsNotEmpty()
    @IsString()
    public profileImage: string;
    @IsNotEmpty()
    @IsString()
    public employeeId: string;
    @IsString()
    public password: string;
}

export class verifyUserDto{
    @IsString()
    @IsNotEmpty()
    public otp: string;
}

export class loginDto{
    @IsString()
    @IsEmail()
    @IsOptional()
    public email: string;
    @IsString()
    @IsNotEmpty()
    public password: string;
    @IsString()
    @IsOptional()
    public employeeId: string
}

export class resetPasswordDto{
    @IsString()
    @IsNotEmpty()
    public password: string;

}
