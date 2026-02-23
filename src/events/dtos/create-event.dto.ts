import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  hourStart: string;

  @IsNotEmpty()
  @IsString()
  hourEnd: string;

  @IsNotEmpty()
  @IsString()
  vehicleId: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
