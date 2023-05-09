import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Campaign } from 'src/campaign/schema/campaign.schema';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Campaign' })
  campaign: Campaign;
}

export const GameSchema = SchemaFactory.createForClass(Game);
