import { Module } from '@nestjs/common';
import { AccountsController } from './AccountsController';
import { AccountsService } from './AccountsService';
import { PrismaModule } from '../Prisma/PrismaModule';

@Module({
    imports: [PrismaModule],
    controllers: [AccountsController],
    providers: [AccountsService],
})
export class AccountsModule {}
