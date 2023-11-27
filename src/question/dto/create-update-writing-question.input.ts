import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { QuestionAnalysisType } from '../enums/question-analysis-type.enum';
import { QuestionType } from '../../question-group/enums/question-type.enum';
import { QuestionLevel } from './../../question-part/enums/question-level.enum';

export class UpdateWritingQuestionInput {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    readonly questionPartNumber?: number;

    @ApiProperty({
        example: QuestionAnalysisType.NONE,
    })
    @IsString()
    readonly analysisType?: string;

    @ApiProperty({
        example: QuestionType.LINE_GRAPH,
    })
    @IsString()
    readonly questionType?: string;

    @ApiProperty({
        example: 'uploads/2022/01/01/pepe.png',
    })
    @IsString()
    readonly image?: string;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly questionText?: string;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly title?: string;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly tips?: string;
  
    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly usefulGrammarNVocab?: string;
  
    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly ideaSuggestion?: string;
  
    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly organization?: string;
  
    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly modelAnswer?: string;
}

export class CreateWritingQuestionInput extends UpdateWritingQuestionInput {
}