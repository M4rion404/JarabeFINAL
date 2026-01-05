import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  
  @Get('profile')
  async getProfile(@Req() req) {
    const user = await this.userService.findById(req.user.id);
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    };
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
