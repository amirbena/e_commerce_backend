import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UserLogin {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    password: string;

}