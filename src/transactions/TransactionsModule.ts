import { Module } from '@nestjs/common';
import { TransactionsService } from './TransactionsService';
import { TransactionsController } from './TransactionsController';
import { PrismaModule } from '../Prisma/PrismaModule';

@Module({
    imports: [PrismaModule],
    controllers: [TransactionsController],
    providers: [TransactionsService],
})
export class TransactionsModule {}