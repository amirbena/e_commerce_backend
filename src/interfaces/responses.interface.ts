import { HttpStatus } from "@nestjs/common";
import { User } from "src/users/user.interface";

export interface CreateUserResponse {
    user: User;
    status: HttpStatus;
    message: string;
}

export interface UserLoginResponse {
    user: User;
    status: HttpStatus;
    message: string;
}

export interface UserUpdateResponse{
    user: User;
    status: HttpStatus;
    message: string;
}