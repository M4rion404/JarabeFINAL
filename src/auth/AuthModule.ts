import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './AuthService';
import { AuthController } from './AuthController';
import { JwtStrategy } from './strategies/JwtStrategy';
import { UserModule } from '../user/UserModule';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '10m' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule 
{
    // Clase de definición de módulo
}
