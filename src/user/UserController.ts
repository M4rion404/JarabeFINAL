import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './UserService';
import { CreateUserDto } from './dto/UserDto';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard';

@Controller('users')
export class UserController 
{
    constructor(private readonly userService: UserService) 
    {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async GetProfile(@Req() request) 
    {
        const userFound = await this.userService.FindById(request.user.id);
        
        return {
            id: request.user.id,
            email: request.user.email,
            name: request.user.name,
        };
    }

    @Post('register')
    async Register(@Body() createUserDto: CreateUserDto) 
    {
        return this.userService.CreateUser(createUserDto);
    }
}