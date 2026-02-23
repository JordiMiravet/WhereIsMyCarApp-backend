import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  hourStart: string;

  @Prop({ required: true })
  hourEnd: string;

  @Prop({ required: true })
  vehicleId: string;

  @Prop({ default: '' })
  comment: string;

  @Prop({ required: true })
  userId: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
