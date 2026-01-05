import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../Prisma/PrismaService';
import { Prisma } from '@prisma/client';
import { TransactionFilterDto } from './dto/TransactionFilterDto';

@Injectable()
export class TransactionsService 
{
    constructor(private prisma: PrismaService) 
    {}

    async Transfer(fromUserId: string, toEmail: string, amount: number) 
    {
        if (amount <= 0) 
        {
            throw new BadRequestException('Amount must be greater than zero');
        }

        const fromAccount = await this.prisma.account.findUnique({
            where: { userId: fromUserId },
            include: { user: true },
        });

        if (!fromAccount) 
        {
            throw new BadRequestException('Origin account not found');
        }

        if (fromAccount.user.email === toEmail) 
        {
            throw new BadRequestException('Cannot transfer to yourself');
        }

        const toUser = await this.prisma.user.findUnique({
            where: { email: toEmail },
            include: { account: true },
        });

        if (!toUser || !toUser.account) 
        {
            throw new BadRequestException('Destination account not found');
        }

        const toAccount = toUser.account;

        if (fromAccount.balance.toNumber() < amount) 
        {
            throw new BadRequestException('Insufficient funds');
        }

        return this.prisma.$transaction(async transactionClient => {
            await transactionClient.account.update({
                where: { id: fromAccount.id },
                data: {
                    balance: {
                        decrement: amount,
                    },
                },
            });

            await transactionClient.account.update({
                where: { id: toAccount.id },
                data: {
                    balance: {
                        increment: amount,
                    },
                },
            });

            return transactionClient.transaction.create({
                data: {
                    amount,
                    type: 'TRANSFER',
                    fromAccountId: fromAccount.id,
                    toAccountId: toAccount.id,
                },
            });
        });
    }

    // Transaction history filters

    async GetHistory(userId: string, filters: TransactionFilterDto) 
    {
        const account = await this.prisma.account.findUnique({
            where: { userId },
        });

        if (!account) 
        {
            throw new NotFoundException('Account not found');
        }

        let whereCondition: any = {
            OR: [{ fromAccountId: account.id }, { toAccountId: account.id }],
        };

        if (filters.type === 'IN') 
        {
            whereCondition = {
                toAccountId: account.id,
            };
        }

        if (filters.type === 'OUT') 
        {
            whereCondition = {
                fromAccountId: account.id,
            };
        }

        const transactions = await this.prisma.transaction.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            include: {
                fromAccount: {
                    include: {
                        user: {
                            select: { email: true, name: true },
                        },
                    },
                },
                toAccount: {
                    include: {
                        user: {
                            select: { email: true, name: true },
                        },
                    },
                },
            },
        });

        return transactions.map(transactionRecord => {
            const isOutgoing = transactionRecord.fromAccountId === account.id;
            const counterpartyAccount = isOutgoing ? transactionRecord.toAccount : transactionRecord.fromAccount;
            const counterpartyUser = counterpartyAccount?.user;

            return {
                id: transactionRecord.id,
                amount: transactionRecord.amount,
                type: isOutgoing ? 'OUT' : 'IN',
                counterparty: {
                    name: counterpartyUser?.name ?? (isOutgoing ? 'Unknown Recipient' : 'External Deposit'),
                    email: counterpartyUser?.email ?? 'N/A',
                },
                createdAt: transactionRecord.createdAt,
            };
        });
    }
}