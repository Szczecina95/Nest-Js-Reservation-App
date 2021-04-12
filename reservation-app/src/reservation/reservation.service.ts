import { GetReservationStatsDto } from './dto/get-reservation-stats.dto';
import { ReservationStatus } from './reservation-status.enum';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Reservation } from './reservation.entity';
import { GetReservationsDto } from './dto/get-reservations.dto';
import { GetStatsResponse } from './interfaces/reservation-interfaces';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationRepository)
    private reservationRepository: ReservationRepository,
  ) {}

  async createReport(
    createReservationDto: CreateReservationDto,
    user: User,
  ): Promise<Reservation> {
    return this.reservationRepository.createReservation(
      createReservationDto,
      user,
    );
  }
  async getReservations(
    getReservationsDto: GetReservationsDto,
    user: User,
  ): Promise<Reservation[]> {
    return this.reservationRepository.getReservations(getReservationsDto, user);
  }
  async getAllReservations(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async getReservationById(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with id: ${id} not found`);
    }
    return reservation;
  }

  async updateReservationStatus(
    id: string,
    status: ReservationStatus,
  ): Promise<Reservation> {
    const reservation = await this.getReservationById(id);
    if (!reservation) {
      throw new NotFoundException(`Reservation with ${id} doesn't exist`);
    }
    reservation.status = status;
    await reservation.save();
    return reservation;
  }

  async getStats(): Promise<GetStatsResponse> {
    const reservations = await this.getAllReservations();

    const stats: GetStatsResponse = {};
    reservations.forEach((reservation) => {
      const { status, startDate } = reservation;
      const dayDate = new Date(startDate).toISOString().split('T')[0];
      if (!stats[dayDate]) {
        stats[dayDate] = {
          reservedHours: 0,
          freeHours: 0,
          blockedHours: 0,
        };
      }
      switch (status) {
        case ReservationStatus.Disabled:
          stats[dayDate].blockedHours++;
          break;
        case ReservationStatus.Available:
          stats[dayDate].freeHours++;
          break;
        case ReservationStatus.Ordered:
          stats[dayDate].reservedHours++;
          break;
        case ReservationStatus.Confirmed:
          stats[dayDate].reservedHours++;
          break;
      }
    });
    return stats;
  }
}
