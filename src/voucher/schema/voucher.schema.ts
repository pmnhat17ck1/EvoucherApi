import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Game } from 'src/game/schema/game.schema';

export type VoucherDocument = Voucher & Document;

@Schema()
export class Voucher {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  discount: number;

  @Prop({ type: Types.ObjectId, ref: 'Game' })
  game: Game;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  remainingQuantity: number;

  @Prop({ required: true })
  expirationDate: Date;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
