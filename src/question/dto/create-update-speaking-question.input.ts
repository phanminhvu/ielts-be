import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateSpeakingQuestionInput {
    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly modelAnswer?: string;
    
    @ApiProperty({
        example: 'uploads/2022/01/01/pepe.mp3',
    })
    @IsString()
    readonly modelAnswerAudio?: string;

    @ApiProperty({
        example: 'uploads/2022/01/01/pepe.mp3',
    })
    @IsString()
    readonly questionAudio?: string;

    @ApiProperty({
        example: '<p>Text</p>',
    })
    @IsString()
    readonly questionText?: string;
}

export class CreateSpeakingQuestionInput extends UpdateSpeakingQuestionInput {
    @ApiProperty({
        example: '627a20c2854826491d0c60af',
    })
    @IsString()
    readonly groupId?: string;
}