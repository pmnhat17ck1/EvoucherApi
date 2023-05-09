import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  voucher: string;

  @IsString()
  @IsNotEmpty()
  transactionDate: string;
}
