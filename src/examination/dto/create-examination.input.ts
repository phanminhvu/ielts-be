import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreateExaminationDto {
  @ApiProperty({
    example: 'Examination Name',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  readonly active: boolean;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  readonly canStart: boolean;

  @ApiProperty({
    example: '["627a20c2854826491d0c60af"]',
  })
  @IsArray()
  readonly studentIds: string[];

  @IsArray()
  readonly examIds?: string[];
}
