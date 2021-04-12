import { ReservationStatus } from './../reservation-status.enum';
export class GetReservationsDto {
  id: string;
  visitType: string;
  status: ReservationStatus;
  createdAt: Date;
  startDate: Date;
}
