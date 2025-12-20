import { IsIn, IsOptional } from 'class-validator';

export class TransactionFilterDto {
  @IsOptional()
  @IsIn(['IN', 'OUT'])
  type?: 'IN' | 'OUT';
}
