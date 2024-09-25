import { EventService } from './event.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PrismaService } from 'src/lib/prisma.service';
import { EventDTO } from './dto/event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  // @UseGuards(AuthGuard)
  public async getAllEvents() {
    return this.eventService.getAllEvent();
  }

  @Get(':eventId')
  public async getEventById(@Param('eventId') eventId: string) {
    const eventByEventID = this.eventService.getEventByEventId(eventId);

    return eventByEventID;
  }

  @Post()
  public async createEvent(@Body() eventDTO: EventDTO) {
    return this.eventService.createEvent(eventDTO);
  }

  @Patch(':eventId')
  public async updateEvent(@Body() eventDTO: EventDTO, eventId: string) {
    return this.eventService.updateEvent(eventDTO, eventId);
  }
}
