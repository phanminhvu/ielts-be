import { SortOrder } from 'mongoose';
import { IsNumber } from 'class-validator';

export class ExaminationSortDto {
  @IsNumber()
  readonly createdAt?: SortOrder;

  @IsNumber()
  readonly updatedAt?: SortOrder;
}
