import { Module } from '@nestjs/common';
import { PrismaModule } from './Prisma/PrismaModule';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';

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
