import { Body, Controller, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Put, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Response } from 'express';
import { Patterns } from './enums/patterns.enum';
import { createTokenFromUser } from 'src/helpers/helpers';
import { UserCreate } from './dto/user-create.dto';
import { CreateUserResponse, UserLoginResponse, UserUpdateResponse } from 'src/interfaces/responses.interface';
import { UserLogin } from './dto/user-login.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesPermitted } from 'src/decorators/roles.decorator';
import { Roles } from './enums/roles.enum';
import { UserUpadeBody, UserUpdate } from './dto/user-update.dto';


@Controller('users')
export class UsersController {
    private client: ClientProxy;
    constructor(private jwtService: JwtService) {
        this.client = ClientProxyFactory.create({
            transport: Transport.REDIS,
            options: {
                url: "redis://localhost:6379"
            }
        })
    }

    @Post()
    @UsePipes(ValidationPipe)
    @HttpCode(HttpStatus.CREATED)
    public async createUser(@Res() res: Response, @Body() userToCreate: UserCreate) {
        const userResponse = await this.client.send<CreateUserResponse, UserCreate>(Patterns.CREATE_USER, userToCreate).toPromise();
        if (!userResponse.user) {
            throw new HttpException(userResponse.message, userResponse.status);
        }
        const user = userResponse.user;
        const token = createTokenFromUser(this.jwtService, user);
        return res.set("authorization", `Bearer ${token}`).json(user);
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    @HttpCode(HttpStatus.OK)
    public async loginUser(@Res() res: Response, @Body() userLogin: UserLogin) {
        const userResponse = await this.client.send<UserLoginResponse, UserLogin>(Patterns.LOGIN_USER, userLogin).toPromise();
        if (!userResponse.user) {
            throw new HttpException(userResponse.message, userResponse.status);
        }
        const user = userResponse.user;
        const token = createTokenFromUser(this.jwtService, user);
        return res.set("authorization", `Bearer ${token}`).json(user);
    }

    @Put('/:id')
    @RolesPermitted(Roles.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    public async updateUserDetails(@Param('id') id: string, @Body() userToUpdate: UserUpdate) {
        const userResponse = await this.client.send<UserUpdateResponse, UserUpadeBody>(Patterns.LOGIN_USER, { id, userToUpdate }).toPromise();
        if (!userResponse.user) {
            throw new HttpException(userResponse.message, userResponse.status);
        }
        const user = userResponse.user;
        return user;
    }
}
