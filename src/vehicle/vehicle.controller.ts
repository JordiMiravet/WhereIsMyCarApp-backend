import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  getAll() {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @Post()
  create(@Body() vehicle: CreateVehicleDto) {
    return this.vehicleService.create(vehicle);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() vehicle: UpdateVehicleDto) {
    return this.vehicleService.update(id, vehicle);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.vehicleService.delete(id);
  }
}
