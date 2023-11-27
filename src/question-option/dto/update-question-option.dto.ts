import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateQuestionOptionDto {
    @IsString()
    readonly key?: string;
    
    @IsString()
    readonly text?: string;

    @IsBoolean()
    readonly deleted?: boolean;
}
