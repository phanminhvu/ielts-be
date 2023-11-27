import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateUpdateSpeakingQuestionPartInput {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    readonly partNumber?: number;

    @ApiProperty({
        example: 'uploads/2022/01/01/pepe.mp3',
    })
    @IsString()
    readonly directionAudio?: string;
}