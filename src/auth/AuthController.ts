import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './AuthService';
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
export class AuthController 
{
    constructor(private readonly authService: AuthService) 
    {}

    @Post('login')
    async Login(@Body() loginDto: LoginDto) 
    {
        return this.authService.Login(loginDto.email, loginDto.password);
    }
}