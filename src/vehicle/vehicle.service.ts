import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './vehicle.schema';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { Event } from '../events/schemas/event.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
  ) {}

  async findAll(userId: string): Promise<Vehicle[]> {
    return this.vehicleModel
      .find({
        $or: [{ userId: userId }, { 'users.userId': userId }],
      })
      .exec();
  }

  async findOne(_id: string, userId: string): Promise<Vehicle | null> {
    return this.vehicleModel
      .findOne({
        _id,
        $or: [{ userId: userId }, { 'users.userId': userId }],
      })
      .exec();
  }

  async create(vehicleDto: CreateVehicleDto, userId: string): Promise<Vehicle> {
    const newVehicle = new this.vehicleModel({
      ...vehicleDto,
      userId,
    });
    return newVehicle.save();
  }

  async update(
    _id: string,
    updatedVehicle: UpdateVehicleDto,
    userId: string,
  ): Promise<Vehicle | null> {
    const updateData = { ...updatedVehicle } as Partial<Vehicle>;

    if (updatedVehicle.location) {
      updateData.location = {
        lat: updatedVehicle.location.lat!,
        lng: updatedVehicle.location.lng!,
      };
    }

    return this.vehicleModel
      .findOneAndUpdate(
        {
          _id,
          $or: [{ userId: userId }, { 'users.userId': userId }],
        },
        updateData,
        { new: true },
      )
      .exec();
  }

  async delete(_id: string, userId: string): Promise<Vehicle | null> {
    await this.eventModel.deleteMany({ vehicleId: _id, userId }).exec();
    return this.vehicleModel.findOneAndDelete({ _id, userId }).exec();
  }

  async addUserToVehicle(
    vehicleId: string,
    userId: string,
    email: string,
  ): Promise<void> {
    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new HttpException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    const normalizedUsers = vehicle.users.map((user) =>
      typeof user === 'string' ? user : user.userId,
    );

    if (normalizedUsers.includes(userId)) {
      throw new HttpException(
        'User already has access to this vehicle',
        HttpStatus.BAD_REQUEST,
      );
    }

    vehicle.users = vehicle.users.filter((user) => typeof user !== 'string');
    vehicle.users.push({ userId, email });
    await vehicle.save();
  }

  async removeUserFromVehicle(
    vehicleId: string,
    userId: string,
  ): Promise<void> {
    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new HttpException('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    vehicle.users = vehicle.users.filter((user) => {
      if (typeof user === 'string') {
        return user !== userId;
      }
      return user.userId !== userId;
    });

    await vehicle.save();
  }
}
