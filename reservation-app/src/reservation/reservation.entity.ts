import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservationStatus } from './reservation-status.enum';

@Entity()
export class Reservation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: ReservationStatus.Available,
  })
  status: ReservationStatus;

  @Column()
  startDate: Date;

  @Column()
  visitType: string;

  @ManyToOne((type) => User, (user) => user.reservations, { eager: false })
  user: User;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
