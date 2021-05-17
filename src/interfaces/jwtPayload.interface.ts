import { Roles } from "src/users/enums/roles.enum";

export interface JwtPayload {
    firstName: string;
    lastName: string;
    id: string;
    role: Roles;
}