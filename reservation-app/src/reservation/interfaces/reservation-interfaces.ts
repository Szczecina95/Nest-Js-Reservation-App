import { User } from 'src/auth/user.entity';
import { ReservationStatus } from '../reservation-status.enum';

export type GetStatsResponse = Record<
  string,
  {
    reservedHours: number;
    freeHours: number;
    blockedHours: number;
  }
>;

export interface ReservationItem {
  id: string;
  status: ReservationStatus;
  startDate: Date;
  user: User;
  createdAt: Date;
}
