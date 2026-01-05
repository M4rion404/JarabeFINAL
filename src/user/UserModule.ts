import { Module } from '@nestjs/common';
import { UserService } from './UserService';
import { UserController } from './UserController';

@Module({
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
