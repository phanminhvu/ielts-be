import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { QuestionSkill } from './../../question-part/enums/question-skill.enum';

export class CreateTestInput {
    @ApiProperty({
        example: QuestionSkill.READING,
    })
    @IsString()
    readonly skill?: string;
}