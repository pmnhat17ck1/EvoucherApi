import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PartnerDocument = Partner & Document;

@Schema()
export class Partner {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  address: string;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
