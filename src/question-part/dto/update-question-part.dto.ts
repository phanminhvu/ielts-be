import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateQuestionPartDto {
    @IsString()
    readonly skill?: string;

    @IsString()
    readonly level?: string;

    @IsString()
    readonly partNumber?: number;
    
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

    @IsBoolean()
    readonly deleted?: boolean;
}
