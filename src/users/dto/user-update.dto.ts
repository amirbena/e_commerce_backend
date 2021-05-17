import { IsEmail, IsNumber, IsOptional, IsPhoneNumber, MaxLength, Min, MinLength } from "class-validator";

export class UserUpdate {

    @IsOptional()
    @MinLength(2)
    @MaxLength(100)
    firstName?: string;

    @IsOptional()
    @MinLength(2)
    @MaxLength(100)
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @MinLength(8)
    @MaxLength(100)
    password?: string;

    @IsOptional()
    @IsPhoneNumber()
    phone?: string;


    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    street?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    building?: number;

    @IsOptional()
    @MinLength(3)
    @MaxLength(100)
    city?: string;

    @IsOptional()
    @MinLength(2)
    @MaxLength(100)
    country?: string;
}

export class UserUpadeBody {
    id: string;
    userToUpdate: UserUpdate;

}