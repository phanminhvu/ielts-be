import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateQuestionOptionDto {
    @IsString()
    readonly key?: string;

    @IsString()
    readonly text: string;

    @IsString()
    readonly questionId: string;
}
