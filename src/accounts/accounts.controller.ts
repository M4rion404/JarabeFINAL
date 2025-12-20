import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AccountsService } from './accounts.service';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('balance')
  getBalance(@Req() req) {
    return this.accountsService.getBalance(req.user.userId);
  }

  @Post('deposit')
  deposit(
    @Req() req,
    @Body('amount') amount: number,
  ) {
    return this.accountsService.deposit(req.user.userId, amount);
  }
}

