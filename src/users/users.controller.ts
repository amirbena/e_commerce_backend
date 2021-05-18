import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Put, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Response } from 'express';
import { Patterns } from './enums/patterns.enum';
import { createTokenFromUser } from 'src/helpers/helpers';
import { UserCreate } from './dto/user-create.dto';
import { CreateUserResponse, GetAllUsersResponse, GetUserResponse, UpdateRoleResponse, UserDeleteResponse, UserLoginResponse, UserUpdateResponse } from 'src/interfaces/responses.interface';
import { UserLogin } from './dto/user-login.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesPermitted } from 'src/decorators/roles.decorator';
import { Roles } from './enums/roles.enum';
import { UserUpadeBody, UserUpdate } from './dto/user-update.dto';
import { updateRoleDto } from './dto/update-role.dto';


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
        const { user } = userResponse;
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
        const { user } = userResponse;
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
        const { user } = userResponse;
        return user;
    }
    @Delete('/:id')
    @RolesPermitted(Roles.SUPER_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    public async deleteUser(@Param('id') id: string) {
        const response = await this.client.send<UserDeleteResponse, string>(Patterns.DELETE_USER, id).toPromise();
        if (response.status !== HttpStatus.OK) {
            throw new HttpException(response.message, response.status);
        }
        return response.message;
    }

    @Get()
    @RolesPermitted(Roles.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    public async getUsers() {
        const userResponse = await this.client.send<GetAllUsersResponse, string>(Patterns.GET_ALL_USERS, "").toPromise();
        if (!userResponse.allUsers) {
            throw new HttpException(userResponse.message, userResponse.status);
        }
        return userResponse.allUsers;
    }

    @Get("/:id")
    @RolesPermitted(Roles.USER)
    @UseGuards(JwtAuthGuard, RolesGuard)
    public async getUser(@Param('/:id') id: string) {
        const userResponse = await this.client.send<GetUserResponse, string>(Patterns.LOGIN_USER, id).toPromise();
        if (!userResponse.user) {
            throw new HttpException(userResponse.message, userResponse.status);
        }
        const { user } = userResponse;
        return user;

    }

    @Put("/:userId/role")
    @RolesPermitted(Roles.SUPER_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    public async updateRole(@Param("userId") userId: string, @Body("role") role: Roles) {
        const updateDto: updateRoleDto = { userId, role };
        const updateResponse = await this.client.send<UpdateRoleResponse, updateRoleDto>(Patterns.UPDATE_USER, updateDto).toPromise();
        if (updateResponse.status !== HttpStatus.OK) {
            throw new HttpException(updateResponse.message, updateResponse.status);
        }
        return updateResponse.message;

    }
}
