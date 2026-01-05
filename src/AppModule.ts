import { Module } from '@nestjs/common';
import { PrismaModule } from './Prisma/PrismaModule';
import { AuthModule } from './auth/AuthModule';
import { UserModule } from './user/UserModule';
import { AccountsModule } from './accounts/AccountsModule';
import { TransactionsModule } from './transactions/TransactionsModule';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    AccountsModule,
    TransactionsModule,
  ],
})
export class AppModule {}
