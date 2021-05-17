import { JwtPayload } from '../interfaces/jwtPayload.interface';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Roles } from '../users/enums/roles.enum';
import { GeneralErrors } from 'src/users/enums/messages.enum';


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }


    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>("roles", [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) return true;
        const decode: JwtPayload = request.query["user"];
        if (decode.role < requiredRoles[0]) {
            throw new ForbiddenException(GeneralErrors.FORBIDDEN_ERROR);
        }
        return true;

    }
}