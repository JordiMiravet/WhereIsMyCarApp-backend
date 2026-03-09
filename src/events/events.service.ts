import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { Vehicle } from '../vehicle/vehicle.schema';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
  ) {}

  async findAll(userId: string): Promise<Event[]> {
    const vehicles = await this.vehicleModel
      .find({
        $or: [{ userId: userId }, { 'users.userId': userId }],
      })
      .select('_id')
      .exec();

    const vehicleIds = vehicles.map((v) => v._id.toString());

    return this.eventModel
      .find({
        vehicleId: { $in: vehicleIds },
      })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Event> {
    const vehicles = await this.vehicleModel
      .find({
        $or: [{ userId: userId }, { 'users.userId': userId }],
      })
      .select('_id')
      .exec();

    const vehicleIds = vehicles.map((v) => v._id.toString());

    const event = await this.eventModel
      .findOne({
        _id: id,
        vehicleId: { $in: vehicleIds },
      })
      .exec();

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    const newEvent = new this.eventModel({
      ...createEventDto,
      userId,
    });

    return newEvent.save();
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    const updatedEvent = await this.eventModel
      .findOneAndUpdate({ _id: id, userId }, updateEventDto, { new: true })
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return updatedEvent;
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.eventModel.deleteOne({ _id: id, userId }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
}
