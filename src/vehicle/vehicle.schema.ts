import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema()
export class Location {
  @Prop({ required: true })
  lat: number;

  @Prop({ required: true })
  lng: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true, unique: true })
  plate: string;

  @Prop({ type: LocationSchema, required: true, _id: false })
  location: Location;

  @Prop({ required: true })
  userId: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
