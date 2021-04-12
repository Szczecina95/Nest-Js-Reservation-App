import { IsDateString, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsDateString({ strict: true })
  startDate: string;

  @IsString()
  visitType: string;
}
