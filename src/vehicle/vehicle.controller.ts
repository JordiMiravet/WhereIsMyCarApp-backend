import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import admin from '../auth/firebase/firebase-admin';

interface RequestWithUser {
  user?: admin.auth.DecodedIdToken;
}

@Controller('vehicles')
@UseGuards(FirebaseAuthGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  getAll(@Request() req: RequestWithUser) {
    const userId = req.user!.uid;
    return this.vehicleService.findAll(userId);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId = req.user!.uid;
    return this.vehicleService.findOne(id, userId);
  }

  @Post()
  create(@Body() vehicle: CreateVehicleDto, @Request() req: RequestWithUser) {
    const userId = req.user!.uid;
    return this.vehicleService.create(vehicle, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() vehicle: UpdateVehicleDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user!.uid;
    return this.vehicleService.update(id, vehicle, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId = req.user!.uid;
    return this.vehicleService.delete(id, userId);
  }
}
