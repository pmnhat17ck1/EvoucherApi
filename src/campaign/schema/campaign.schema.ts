import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Partner } from 'src/partner/schema/partner.schema';

export type CampaignDocument = Campaign & Document;

@Schema()
export class Campaign {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Partner' })
  partner: Partner;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
