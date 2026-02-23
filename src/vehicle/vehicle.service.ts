import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './vehicle.schema';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
  ) {}

  async findAll(userId: string): Promise<Vehicle[]> {
    return this.vehicleModel.find({ userId }).exec();
  }

  async findOne(_id: string, userId: string): Promise<Vehicle | null> {
    return this.vehicleModel.findOne({ _id, userId }).exec();
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
      .findOneAndUpdate({ _id, userId }, updateData, { new: true })
      .exec();
  }

  async delete(_id: string, userId: string): Promise<Vehicle | null> {
    return this.vehicleModel.findOneAndDelete({ _id, userId }).exec();
  }
}
