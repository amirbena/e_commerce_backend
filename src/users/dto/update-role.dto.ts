import { Roles } from "../enums/roles.enum";

export interface updateRoleDto {
    userId: string;
    role: Roles;
}