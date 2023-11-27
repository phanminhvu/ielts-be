import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExamListDto {
  @ApiProperty({
    description: 'Minimum value 1',
    example: 1,
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsNumber()
  readonly page?: number;

  @ApiProperty({
    description: 'Minimum value 1 - Maximum value 50',
    example: 10,
    required: false,
    default: 10,
    maximum: 50,
    minimum: 1,
  })
  @IsNumber()
  readonly pageSize?: number;

  @ApiProperty({
    example: 'createdAt:DESC',
    required: false,
  })
  @IsString()
  readonly sort?: string;
}
