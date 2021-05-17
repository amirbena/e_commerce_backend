import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { randomBytes } from "crypto";
import { Strategy, ExtractJwt } from "passport-jwt";
import { readPrivateKey, writePrivateKey } from "./helpers/helpers";
import { JwtPayload } from "./interfaces/jwtPayload.interface";
import { GeneralErrors } from "./users/enums/messages.enum";


let secretOrKey = readPrivateKey();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
    ) {
        if(!secretOrKey.length){
            secretOrKey= randomBytes(64).toString("hex");
            writePrivateKey(secretOrKey);
        } 
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey
        })
    }

    async validate(payload: JwtPayload) {
        if (!payload) throw new UnauthorizedException(GeneralErrors.UNAUTORIZED_ERROR)
        return payload;
    }
}