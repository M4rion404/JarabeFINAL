import { IsEmail, IsPositive } from 'class-validator';

export class TransferDto 
{
    @IsEmail()
    toEmail: string;

    @IsPositive()
    amount: number;
}