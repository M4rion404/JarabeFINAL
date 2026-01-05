import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../Prisma/PrismaService';

@Injectable()
export class AccountsService 
{
    constructor(private prisma: PrismaService) 
    {}

    async GetBalance(userId: string) 
    {
        const account = await this.prisma.account.findUnique({
            where: { userId },
        });

        if (!account) 
        {
            throw new BadRequestException('Account not found');
        }

        return { balance: account.balance };
    }

    async Deposit(userId: string, amount: number) 
    {
        if (amount <= 0) 
        {
            throw new BadRequestException('Amount must be greater than zero');
        }

        return this.prisma.account.update({
            where: { userId },
            data: {
                balance: {
                    increment: amount,
                },
            },
        });
    }
}
