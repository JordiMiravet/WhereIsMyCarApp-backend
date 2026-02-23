import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import admin from '../auth/firebase/firebase-admin';

interface RequestWithUser {
  user?: admin.auth.DecodedIdToken;
}

@Controller('events')
@UseGuards(FirebaseAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(@Request() req: RequestWithUser) {
    const userId = req.user!.uid;
    return this.eventsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId = req.user!.uid;
    return this.eventsService.findOne(id, userId);
  }

  @Post()
  async create(
    @Body() createEventDto: CreateEventDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user!.uid;
    return this.eventsService.create(createEventDto, userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user!.uid;
    return this.eventsService.update(id, updateEventDto, userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: RequestWithUser) {
    const userId = req.user!.uid;
    await this.eventsService.delete(id, userId);
    return { message: 'Event deleted successfully' };
  }
}
