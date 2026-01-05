import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/PrismaService';
import { CreateUserDto } from './dto/UserDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService 
{
    constructor(private readonly prisma: PrismaService) 
    {}

    async CreateUser(userData: CreateUserDto) 
    {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (existingUser) 
        {
            throw new BadRequestException('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        return this.prisma.user.create({
            data: {
                email: userData.email,
                name: userData.name,
                password: hashedPassword,
                account: {
                    create: {
                        balance: 0,
                    },
                },
            },
        });
    }

    async FindById(userId: string) 
    {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });
    }
}