import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI!), VehicleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
