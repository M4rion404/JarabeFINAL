import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard';
import { AccountsService } from './AccountsService';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController
{
    constructor(private readonly accountsService: AccountsService) {}

    @Get('balance')
    GetBalance(@Req() request) 
      {
        return this.accountsService.GetBalance(request.user.id);
      }

    @Post('deposit')
    Deposit(
      @Req() request,
      @Body('amount') amount: number,
    ) 
      {
        return this.accountsService.Deposit(request.user.userId, amount);
      }
}

