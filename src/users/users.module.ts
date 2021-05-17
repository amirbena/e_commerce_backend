import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { randomBytes } from 'crypto';
import { JwtModule } from '@nestjs/jwt';
import { readFile } from 'fs/promises';
import pathToPrivateKey from '../config/pathToPrivateKey';
import configuration from '../config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const secretOrPrivateKey = (await readFile(pathToPrivateKey)).toString("base64");
        return ({
          secretOrPrivateKey,
          signOptions: {
            expiresIn: configService.get("authentication.expires_in"),
          },
        })
      },
      inject: [ConfigService],

    })
  ],
  providers: [JwtStrategy],
  controllers: [UsersController],

})
export class UsersModule { }
