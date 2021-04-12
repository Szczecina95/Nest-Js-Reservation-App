import { NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from 'src/reservation/reservation.entity';
import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { GetReservationsDto } from './dto/get-reservations.dto';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {
  async createReservation(
    createReservationDto: CreateReservationDto,
    user: User,
  ): Promise<Reservation> {
    const { startDate: startDateString, visitType } = createReservationDto;
    const reservation = new Reservation();
    const startDate = new Date(startDateString);
    if (this.isDateAFullHour(startDate)) {
      if (await this.isReservationExist(startDate)) {
        throw new NotFoundException(
          `Reservation in ${startDate} allready exist, choose another data.`,
        );
      }
      reservation.startDate = startDate;
      reservation.visitType = visitType;
      reservation.user = user;
      await reservation.save();
      delete reservation.user;
      return reservation;
    }
  }
  async getReservations(
    getReservationsDto: GetReservationsDto,
    user: User,
  ): Promise<Reservation[]> {
    const query = this.createQueryBuilder('report');

    query.where('report.userId = :userId', { userId: user.id });

    const reservations = await query.getMany();
    return reservations;
  }

  isDateAFullHour(date: Date) {
    const getters = [date.getMinutes, date.getSeconds, date.getMilliseconds];
    return getters.every((getter) => getter.apply(date) === 0);
  }

  async isReservationExist(startDate: Date): Promise<boolean> {
    const reservation = await Reservation.find({ startDate });
    return !!reservation.length;
  }
}
