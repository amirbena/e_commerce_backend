import { HttpStatus } from "@nestjs/common";
import { User } from "src/users/user.interface";

interface StatusAndMessage {
    status: HttpStatus;
    message: string;
}

export interface CreateUserResponse extends StatusAndMessage {
    user: User;
}

export interface UserLoginResponse extends StatusAndMessage {
    user: User;
}

export interface UserUpdateResponse extends StatusAndMessage {
    user: User;
}

export interface UserDeleteResponse extends StatusAndMessage {
}

export interface GetAllUsersResponse extends StatusAndMessage {
    allUsers: User[]
}

export interface GetUserResponse extends StatusAndMessage {
    user: User
}

export interface UpdateRoleResponse extends StatusAndMessage { }