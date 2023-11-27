import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { QuestionSkill } from './../../question-part/enums/question-skill.enum';

export class QuestionTypeListDto {
  @ApiProperty({
    example: QuestionSkill.LISTENING,
    required: false,
  })
  @IsString()
  readonly skill?: string;
}
