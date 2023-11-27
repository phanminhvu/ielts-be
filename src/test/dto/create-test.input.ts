import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { QuestionSkill } from './../../question-part/enums/question-skill.enum';

export class CreateTestInput {
    @ApiProperty({
        example: "627a20c2854826491d0c60af",
    })
    @IsString()
    readonly examination?: string;
}