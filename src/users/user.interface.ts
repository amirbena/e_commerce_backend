import { Roles } from "./enums/roles.enum";

export interface User{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    street: string;
    building: number;
    city: string;
    phone: string;
    country: string;
    role: Roles;
}