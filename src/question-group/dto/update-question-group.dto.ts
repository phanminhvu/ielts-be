import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateQuestionGroupDto {
    @IsString()
    readonly skill?: string;

    @IsString()
    readonly level?: string;

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

    @IsBoolean()
    readonly deleted?: boolean;
}
