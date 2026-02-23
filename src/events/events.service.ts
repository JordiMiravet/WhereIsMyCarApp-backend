import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async findAll(userId: string): Promise<Event[]> {
    return this.eventModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Event> {
    const event = await this.eventModel.findOne({ _id: id, userId }).exec();

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
