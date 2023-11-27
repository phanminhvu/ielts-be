import { IsNumber, IsString } from 'class-validator';

export class CreateQuestionPartDto {
    @IsString()
    readonly skill: string;

    @IsString()
    readonly level: string;

    @IsString()
    readonly partNumber: number;
    
    @IsString()
    readonly passageTitle?: string;
    
    @IsString()
    readonly passageText?: string;
    
    @IsString()
    readonly directionAudio?: string;

    @IsString()
    readonly partTitle?: string;
    
    @IsString()
    readonly partAudio?: string;
}
