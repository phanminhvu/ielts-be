import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUpdateListeningQuestionPartInput {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    readonly partNumber?: number;

    @ApiProperty({
        example: 'Title',
    })
    @IsString()
    readonly partTitle?: string;

    @ApiProperty({
        example: 'uploads/2022/01/01/pepe.mp3',
    })
    @IsString()
    readonly partAudio?: string;
}