import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateQuestionGroupDto {
    @IsString()
    readonly skill: string;

    @IsString()
    readonly level: string;

    @IsString()
    readonly groupPartNumber?: number;

    @IsString()
    readonly script?: string;

    @IsString()
    readonly title?: string;

    @IsString()
    readonly explanationText?: string;
  
    @IsString()
    readonly usefulGrammarNVocab?: string;
  
    @IsString()
    readonly ideaSuggestion?: string;
    
    @IsString()
    readonly questionType?: string;
    
    @IsString()
    readonly directionText?: string;
    
    @IsString()
    readonly questionTypeTips?: string;
    
    @IsString()
    readonly answerList?: string;

    @IsString()
    readonly image?: string;

    @IsString()
    readonly questionBox?: string;

    @IsString()
    readonly partId?: string;
}
