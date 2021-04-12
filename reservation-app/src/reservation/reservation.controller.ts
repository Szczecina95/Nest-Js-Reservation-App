import { GetStatsResponse } from './interfaces/reservation-interfaces';
import { ReservationStatus } from './reservation-status.enum';
import { GetReservationsDto } from './dto/get-reservations.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationService } from './reservation.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Reservation } from './reservation.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservation')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @UseGuards(AuthGuard())
  @Post('/create')
  createReport(
    @Body(ValidationPipe) createReservationDto: CreateReservationDto,
    @GetUser() user: User,
  ): Promise<Reservation> {
    return this.reservationService.createReport(createReservationDto, user);
  }
  @UseGuards(AuthGuard())
  @Get()
  getReservations(
    @Query(ValidationPipe) getReservationsDto: GetReservationsDto,
    @GetUser() user: User,
  ): Promise<Reservation[]> {
    return this.reservationService.getReservations(getReservationsDto, user);
  }

  @Get('/all')
  getAllReservations(): Promise<Reservation[]> {
    return this.reservationService.getAllReservations();
  }

  @Get('/stats')
  getStats(): Promise<GetStatsResponse> {
    return this.reservationService.getStats();
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: string): Promise<Reservation> {
    return this.reservationService.getReservationById(id);
  }

  @UseGuards(AuthGuard())
  @Patch(':id/confirm')
  confirmReservationStatus(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<Reservation> {
    return this.reservationService.updateReservationStatus(
      id,
      ReservationStatus.Confirmed,
    );
  }
  @UseGuards(AuthGuard())
  @Patch(':id/disable')
  disableReservationStatus(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<Reservation> {
    return this.reservationService.updateReservationStatus(
      id,
      ReservationStatus.Disabled,
    );
  }

  // @Patch(':id/status')
  // updateReservationStatus(
  //   @Param('id', ParseIntPipe) id: string,
  //   @Body('status', ReservationStatusValidationPipe) status: ReservationStatus,
  // ): Promise<Reservation> {
  //   return this.reservationService.updateReservationStatus(id, status);
  // }
}
