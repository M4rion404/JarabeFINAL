import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/JwtAuthGuard';
import { TransactionsService } from './TransactionsService';
import { TransferDto } from './dto/TransferDto';
import { TransactionFilterDto } from './dto/TransactionFilterDto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController 
{
    constructor(private readonly transactionsService: TransactionsService) 
    {}

    @Get()
    async GetMyTransactions(@Req() request, @Query() filters: TransactionFilterDto) 
    {
        return this.transactionsService.GetHistory(request.user.id, filters);
    }

    @Post('transfer')
    Transfer(@Req() request, @Body() transferDto: TransferDto) 
    {
        return this.transactionsService.Transfer(
            request.user.id,
            transferDto.toEmail,
            transferDto.amount,
        );
    }
}