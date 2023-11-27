import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

import { QuestionSkill } from './../../question-part/enums/question-skill.enum';

export class UpdateTestProgressInput {
    @ApiProperty({
        example: 120,
    })
    @IsNumber()
    readonly timeRemain?: number;
  
    @ApiProperty({
        example: 0,
    })
    @IsNumber()
    readonly currentPart?: number;
  
    @ApiProperty({
        example: 0,
    })
    @IsNumber()
    readonly currentGroup?: number;
  
    @ApiProperty({
        example: 0,
    })
    @IsNumber()
    readonly currentQuestion?: number;
  
    @ApiProperty({
        example: 10,
    })
    @IsNumber()
    readonly audioPlayedTime?: number;
}