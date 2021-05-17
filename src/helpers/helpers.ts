import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/interfaces/jwtPayload.interface';
import { Roles } from '../users/enums/roles.enum';
import { User } from '../users/user.interface';
import { readFile,writeFile } from 'fs';
import pathToPrivateKey from '../config/pathToPrivateKey';

export const createTokenFromUser = (jwtService: JwtService, user: User): string => {
    const { firstName, lastName, id } = user;
    const role: Roles = user.role;
    const payload: JwtPayload = { id, role, firstName, lastName };
    const token = jwtService.sign(payload);
    return token;

}

export const readPrivateKey = (): string => {
    let secretOrKey = "";
    readFile(pathToPrivateKey,(err,buffer)=>{
       if(err) console.log("Err",err);
       return buffer;
    })
    return secretOrKey;
}

export const writePrivateKey= (privateKey: string)=>{
    writeFile(pathToPrivateKey,privateKey,()=>{
        
    })
    
}