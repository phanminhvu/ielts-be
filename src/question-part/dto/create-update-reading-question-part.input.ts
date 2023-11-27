import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { QuestionLevel } from './../enums/question-level.enum';

export class CreateUpdateReadingQuestionPartInput {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    readonly partNumber?: number;

    @ApiProperty({
        example: 'Title',
    })
    @IsString()
    readonly passageTitle?: string;
    
    @ApiProperty({
      example: '<p>Text</p>',
    })
    @IsString()
    readonly passageText?: string;
}