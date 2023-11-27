import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateQuestionDto {
    @IsNumber()
    readonly blankNumber?: number;

    @IsNumber()
    readonly questionPartNumber?: number;

    @IsString()
    readonly questionText?: string;

    @IsString()
    readonly title?: string;

    @IsString()
    readonly image?: string;

    @IsString()
    readonly analysisType?: string;

    @IsString()
    readonly questionType?: string;

    @IsString()
    readonly answer?: string;

    @IsString()
    readonly explanationText?: string;

    @IsString()
    readonly groupId?: string;

    @IsString()
    readonly tips?: string;
  
    @IsString()
    readonly usefulGrammarNVocab?: string;
  
    @IsString()
    readonly ideaSuggestion?: string;
  
    @IsString()
    readonly organization?: string;
  
    @IsString()
    readonly modelAnswer?: string;

    @IsString()
    readonly questionAudio?: string;
  
    @IsString()
    readonly modelAnswerAudio?: string;

    @IsBoolean()
    readonly deleted?: boolean;
}
