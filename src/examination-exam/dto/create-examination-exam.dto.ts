import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsString } from 'class-validator';

import { ListeningQuestionPart } from '../../dtos/listening-question.dto';
import { ReadingQuestionPart } from '../../dtos/reading-question.dto';

export class CreateExaminationExamDto {
    @IsString()
    readonly examination: string;
  
    @IsArray()
    readonly reading?: ReadingQuestionPart[];
  
    @IsArray()
    readonly listening?: ListeningQuestionPart[];
}
