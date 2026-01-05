import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { TransferDto } from './dto/transfer.dto';
import { TransactionFilterDto } from './dto/transaction-filter.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async getMyTransactions(@Req() req, @Query() filters: TransactionFilterDto) {
    return this.transactionsService.getHistory(req.user.id, filters);
  }

  @Post('transfer')
  transfer(@Req() req, @Body() dto: TransferDto) {
    return this.transactionsService.transfer(
      req.user.id,
      dto.toEmail,
      dto.amount,
    );
  }
}
