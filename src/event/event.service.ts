import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { EventDTO } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAllEvent() {
    try {
      const events = await this.prismaService.event.findMany({});

      return events;
    } catch (error) {
      throw new UnprocessableEntityException('Event By Id Not Found');
    }
  }

  public async getEventByEventId(eventId: string) {
    try {
      const event = await this.prismaService.event.findUnique({
        where: {
          eventId,
        },
      });
      return event;
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  public async createEvent(eventDTO: EventDTO) {
    const { location, title, date, description } = eventDTO;

    const checkEventByDate = await this.prismaService.event.findFirst({
      where: {
        date,
      },
    });

    if (checkEventByDate) {
      throw new UnprocessableEntityException('bertabrakan dengan event lain');
    }

    const createEvent = await this.prismaService.event.create({
      data: {
        location,
        title,
        date,
        description,
      },
    });

    return createEvent;
  }

  public async updateEvent(eventDTO: EventDTO, eventId: string) {
    const { location, title, date, description } = eventDTO;

    const checkEventById = await this.prismaService.event.findUnique({
      where: {
        eventId,
      },
    });
    if (checkEventById) {
      throw new UnprocessableEntityException('Different Id');
    }
    const checkEventByDate = await this.prismaService.event.findFirst({
      where: {
        date,
      },
    });

    if (checkEventByDate) {
      throw new UnprocessableEntityException('bertabrakan dengan event lain');
    }

    const updateEvent = await this.prismaService.event.update({
      where: {
        eventId,
      },
      data: {
        location,
        title,
        date,
        description,
      },
    });

    return updateEvent;
  }
}
