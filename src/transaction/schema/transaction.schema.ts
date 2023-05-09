import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Voucher } from 'src/voucher/schema/voucher.schema';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Voucher' })
  voucher: Voucher;

  @Prop({ required: true })
  transactionDate: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
