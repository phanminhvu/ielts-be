import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';

export class ExaminationGenerateExamDto {
  @ApiProperty({
    example: '["627a20c2854826491d0c60af"]',
  })
  @IsArray()
  readonly examIds: string[];
}
