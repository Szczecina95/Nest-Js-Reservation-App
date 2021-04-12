import { ReservationStatus } from './../reservation-status.enum';

import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ReservationStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    ReservationStatus.Available,
    ReservationStatus.Confirmed,
    ReservationStatus.Disabled,
    ReservationStatus.Ordered,
  ];

  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);
    return index !== -1;
  }
}
