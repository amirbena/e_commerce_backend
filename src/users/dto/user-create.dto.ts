import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, MaxLength, Min, MinLength } from "class-validator";

export class UserCreate {

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    firstName: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    password: string;

    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;


    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    street: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    building: number;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    city: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    country: string;
}